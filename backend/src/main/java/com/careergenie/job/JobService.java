package com.careergenie.job;
import com.careergenie.ai.AIService;
import com.careergenie.profile.SkillRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service @RequiredArgsConstructor
public class JobService {
    private final JobDescriptionRepository jobRepo;
    private final JobRequirementRepository reqRepo;
    private final SkillRepository skillRepo;
    private final AIService aiService;
    private final ObjectMapper objectMapper;

    @Transactional
    public JobDescription analyzeAndSave(Long userId, String rawText, String notes){
        AIService.JobAnalysisResult result = aiService.analyzeJobDescription(rawText);
        if(!result.isValidJobDescription()){
            throw new IllegalArgumentException("The text does not appear to be a job description. Please paste a valid job posting.");
        }
        String json;
        try{ json = objectMapper.writeValueAsString(result); } catch(Exception e){ json="{}"; }
        JobDescription jd = JobDescription.builder()
            .userId(userId).rawText(rawText).title(result.title()).company(result.company())
            .experienceYearsMin(result.experienceMin()).experienceYearsMax(result.experienceMax())
            .educationRequirement(result.educationRequirement())
            .analyzedData(json).notes(notes).build();
        jd = jobRepo.save(jd);
        Long jdId = jd.getId();
        // Save requirements
        for(String s : result.requiredSkills()){
            var skill = skillRepo.findByNameIgnoreCase(s);
            reqRepo.save(JobRequirement.builder().jobId(jdId)
                .skillId(skill.map(sk->sk.getId()).orElse(null)).keyword(s).required(true).build());
        }
        for(String s : result.preferredSkills()){
            var skill = skillRepo.findByNameIgnoreCase(s);
            reqRepo.save(JobRequirement.builder().jobId(jdId)
                .skillId(skill.map(sk->sk.getId()).orElse(null)).keyword(s).preferred(true).required(false).build());
        }
        return jd;
    }

    public List<JobDescription> getSavedJobs(Long userId){ return jobRepo.findByUserIdOrderByCreatedAtDesc(userId); }
    public JobDescription getById(Long id){ return jobRepo.findById(id).orElseThrow(); }
    public void delete(Long id){ jobRepo.deleteById(id); }
    public List<JobDescription> getSampleJobs(){ return jobRepo.findBySampleTrue(); }
}
