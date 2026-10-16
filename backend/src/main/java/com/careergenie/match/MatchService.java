package com.careergenie.match;

import com.careergenie.ai.AIService;
import com.careergenie.job.*;
import com.careergenie.profile.*;
import com.careergenie.skillgap.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {
    private final CareerMatchRepository matchRepo;
    private final MatchConfigRepository configRepo;
    private final ProfileRepository profileRepo;
    private final UserSkillRepository userSkillRepo;
    private final EducationRepository educationRepo;
    private final ExperienceRepository experienceRepo;
    private final ProjectRepository projectRepo;
    private final JobDescriptionRepository jobRepo;
    private final JobRequirementRepository reqRepo;
    private final SkillGapRepository gapRepo;
    private final AIService aiService;
    private final ObjectMapper objectMapper;

    private double weight(String key, double def) {
        return configRepo.findByWeightKey(key).map(MatchConfig::getWeightValue).orElse(def);
    }

    @Transactional
    public CareerMatch runMatch(Long userId, Long jobId) {
        Profile profile = profileRepo.findByUserId(userId).orElseThrow();
        List<UserSkill> userSkills = userSkillRepo.findByProfileId(profile.getId());
        List<Education> eduList = educationRepo.findByProfileIdOrderByEndYearDesc(profile.getId());
        List<Experience> expList = experienceRepo.findByProfileIdOrderByStartDateDesc(profile.getId());
        List<Project> projects = projectRepo.findByProfileId(profile.getId());
        JobDescription job = jobRepo.findById(jobId).orElseThrow();
        List<JobRequirement> requirements = reqRepo.findByJobId(jobId);

        List<String> userSkillNames = userSkills.stream()
                .map(us -> us.getSkill() != null ? us.getSkill().getName() : "")
                .filter(s -> !s.isBlank())
                .collect(Collectors.toList());

        List<String> requiredSkills = requirements.stream()
                .filter(JobRequirement::isRequired)
                .map(JobRequirement::getKeyword)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        List<String> preferredSkills = requirements.stream()
                .filter(JobRequirement::isPreferred)
                .map(JobRequirement::getKeyword)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // Skill Score
        long matchedRequired = requiredSkills.stream()
                .filter(rs -> userSkillNames.stream().anyMatch(us -> us.equalsIgnoreCase(rs)))
                .count();
        double skillScore = requiredSkills.isEmpty() ? 100.0 : ((double) matchedRequired / requiredSkills.size()) * 100.0;

        // Keyword Score
        AIService.SkillGapResult gapResult = aiService.analyzeSkillGap(userSkillNames, requiredSkills, preferredSkills, job.getRawText());
        long matchedKw = gapResult.hasSkills().size();
        long totalKw = requiredSkills.size() + preferredSkills.size();
        double keywordScore = totalKw == 0 ? 70.0 : ((double) matchedKw / totalKw) * 100.0;

        // Experience Score
        double experienceScore = expList.isEmpty() ? 0.0 : 60.0;
        if (!expList.isEmpty() && job.getExperienceYearsMin() != null) {
            long months = expList.stream().mapToLong(e -> {
                var end = e.isCurrent() ? java.time.LocalDate.now() : (e.getEndDate() != null ? e.getEndDate() : java.time.LocalDate.now());
                return java.time.Period.between(e.getStartDate(), end).toTotalMonths();
            }).sum();
            double userYears = months / 12.0;
            double reqYears = job.getExperienceYearsMin();
            experienceScore = reqYears == 0 ? 80.0 : Math.min(100.0, (userYears / reqYears) * 100.0);
        }

        // Project Score
        double projectScore = 0.0;
        if (!projects.isEmpty()) {
            long relevant = projects.stream().filter(p -> {
                String tech = p.getTechnologies() != null ? p.getTechnologies().toLowerCase() : "";
                return requiredSkills.stream().anyMatch(rs -> tech.contains(rs.toLowerCase()));
            }).count();
            projectScore = Math.min(100.0, ((double) relevant / projects.size()) * 100.0 + 40.0);
        }

        // Education Score
        double educationScore = 50.0;
        if (!eduList.isEmpty()) {
            String deg = eduList.get(0).getDegree().toLowerCase();
            if (deg.contains("bachelor") || deg.contains("b.tech") || deg.contains("b.e")) educationScore = 80.0;
            else if (deg.contains("master") || deg.contains("m.tech")) educationScore = 100.0;
            else educationScore = 60.0;
        }

        double sw = weight("SKILL_WEIGHT", 0.35);
        double kw = weight("KEYWORD_WEIGHT", 0.20);
        double ew = weight("EXPERIENCE_WEIGHT", 0.20);
        double pw = weight("PROJECT_WEIGHT", 0.15);
        double dw = weight("EDUCATION_WEIGHT", 0.10);

        double overall = skillScore * sw + keywordScore * kw + experienceScore * ew + projectScore * pw + educationScore * dw;

        Map<String, Object> data = new HashMap<>();
        data.put("hasSkills", gapResult.hasSkills());
        data.put("missingSkills", gapResult.missingSkills());
        data.put("partialMatches", gapResult.partialMatches());
        data.put("keywordsToAdd", gapResult.keywordsToAdd());
        data.put("disclaimer", "Career Genie Match Indicator — This indicator compares the information in your profile with the requirements detected in the selected job description. It is not a hiring prediction.");

        String json;
        try {
            json = objectMapper.writeValueAsString(data);
        } catch (Exception e) {
            json = "{}";
        }

        CareerMatch match = CareerMatch.builder()
                .userId(userId)
                .jobId(jobId)
                .overallScore(Math.round(overall * 10.0) / 10.0)
                .skillScore(Math.round(skillScore * 10.0) / 10.0)
                .keywordScore(Math.round(keywordScore * 10.0) / 10.0)
                .projectScore(Math.round(projectScore * 10.0) / 10.0)
                .educationScore(educationScore)
                .experienceScore(Math.round(experienceScore * 10.0) / 10.0)
                .matchData(json)
                .build();

        match = matchRepo.save(match);

        // Save skill gaps
        saveSkillGaps(match.getId(), gapResult);
        return match;
    }

    private void saveSkillGaps(Long matchId, AIService.SkillGapResult result) {
        for (String s : result.missingSkills()) {
            gapRepo.save(SkillGap.builder()
                    .matchId(matchId)
                    .skillName(s)
                    .gapType(SkillGap.GapType.MISSING)
                    .priority(SkillGap.Priority.HIGH)
                    .learningSuggestion("Learn core " + s + " fundamentals and build a working mini-project.")
                    .build());
        }
        for (AIService.SkillGapResult.PartialMatch pm : result.partialMatches()) {
            gapRepo.save(SkillGap.builder()
                    .matchId(matchId)
                    .skillName(pm.jobSkill())
                    .gapType(SkillGap.GapType.PARTIAL)
                    .whyItMatters(pm.reason())
                    .priority(SkillGap.Priority.MEDIUM)
                    .build());
        }
        for (String s : result.hasSkills()) {
            gapRepo.save(SkillGap.builder()
                    .matchId(matchId)
                    .skillName(s)
                    .gapType(SkillGap.GapType.HAS)
                    .priority(SkillGap.Priority.LOW)
                    .build());
        }
    }

    public CareerMatch getById(Long id) {
        return matchRepo.findById(id).orElseThrow();
    }

    public Optional<CareerMatch> getLatest(Long userId) {
        return matchRepo.findTopByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<CareerMatch> getAllForUser(Long userId) {
        return matchRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
