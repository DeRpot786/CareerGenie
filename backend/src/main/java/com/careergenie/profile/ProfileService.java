package com.careergenie.profile;
import com.careergenie.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepo;
    private final EducationRepository educationRepo;
    private final ExperienceRepository experienceRepo;
    private final UserSkillRepository userSkillRepo;
    private final ProjectRepository projectRepo;
    private final CertificationRepository certRepo;
    private final SkillRepository skillRepo;
    private final UserRepository userRepo;

    public Profile getByUserId(Long userId) {
        return profileRepo.findByUserId(userId)
            .orElseThrow(() -> new NoSuchElementException("Profile not found"));
    }

    @Transactional
    public Profile updateProfile(Long userId, ProfileUpdateRequest req) {
        Profile p = getByUserId(userId);
        if (req.fullName()!=null) p.setFullName(req.fullName());
        if (req.phone()!=null) p.setPhone(req.phone());
        if (req.location()!=null) p.setLocation(req.location());
        if (req.linkedinUrl()!=null) p.setLinkedinUrl(req.linkedinUrl());
        if (req.githubUrl()!=null) p.setGithubUrl(req.githubUrl());
        if (req.portfolioUrl()!=null) p.setPortfolioUrl(req.portfolioUrl());
        if (req.targetRole()!=null) p.setTargetRole(req.targetRole());
        if (req.targetIndustry()!=null) p.setTargetIndustry(req.targetIndustry());
        if (req.experienceLevel()!=null) p.setExperienceLevel(req.experienceLevel());
        if (req.preferredLocation()!=null) p.setPreferredLocation(req.preferredLocation());
        if (req.preferredWorkType()!=null) p.setPreferredWorkType(req.preferredWorkType());
        p.setCompletionPct(computeCompletion(userId, p));
        return profileRepo.save(p);
    }

    public int computeCompletion(Long userId, Profile p) {
        int score = 0;
        if (p.getFullName()!=null && !p.getFullName().isEmpty()) score += 15;
        if (p.getPhone()!=null) score += 5;
        if (p.getLocation()!=null) score += 5;
        if (p.getTargetRole()!=null) score += 10;
        if (p.getLinkedinUrl()!=null) score += 5;
        if (p.getGithubUrl()!=null) score += 5;
        if (!educationRepo.findByProfileIdOrderByEndYearDesc(p.getId()).isEmpty()) score += 15;
        if (!userSkillRepo.findByProfileId(p.getId()).isEmpty()) score += 15;
        if (!projectRepo.findByProfileId(p.getId()).isEmpty()) score += 15;
        if (!experienceRepo.findByProfileIdOrderByStartDateDesc(p.getId()).isEmpty()) score += 10;
        return Math.min(100, score);
    }

    public ProfileFullDto getFullProfile(Long userId) {
        Profile p = getByUserId(userId);
        var edu = educationRepo.findByProfileIdOrderByEndYearDesc(p.getId());
        var exp = experienceRepo.findByProfileIdOrderByStartDateDesc(p.getId());
        var skills = userSkillRepo.findByProfileId(p.getId());
        var projects = projectRepo.findByProfileId(p.getId());
        var certs = certRepo.findByProfileId(p.getId());
        return new ProfileFullDto(p, edu, exp, skills, projects, certs);
    }

    @Transactional
    public UserSkill addSkill(Long userId, Long skillId, UserSkill.Proficiency proficiency) {
        Profile p = getByUserId(userId);
        if (userSkillRepo.existsByProfileIdAndSkillId(p.getId(), skillId)) {
            throw new IllegalStateException("Skill already added to profile");
        }
        skillRepo.findById(skillId).orElseThrow(() -> new NoSuchElementException("Skill not found"));
        UserSkill us = UserSkill.builder().profileId(p.getId()).skillId(skillId).proficiency(proficiency).build();
        var saved = userSkillRepo.save(us);
        profileRepo.save(p.toBuilder().completionPct(computeCompletion(userId, p)).build());
        return saved;
    }

    @Transactional
    public void removeSkill(Long userId, Long skillId) {
        Profile p = getByUserId(userId);
        userSkillRepo.deleteByProfileIdAndSkillId(p.getId(), skillId);
    }

    @Transactional
    public Education addEducation(Long userId, Education edu) {
        Profile p = getByUserId(userId);
        edu.setProfileId(p.getId());
        return educationRepo.save(edu);
    }

    @Transactional
    public Experience addExperience(Long userId, Experience exp) {
        Profile p = getByUserId(userId);
        exp.setProfileId(p.getId());
        return experienceRepo.save(exp);
    }

    @Transactional
    public Project addProject(Long userId, Project proj) {
        Profile p = getByUserId(userId);
        proj.setProfileId(p.getId());
        return projectRepo.save(proj);
    }

    @Transactional
    public Certification addCertification(Long userId, Certification cert) {
        Profile p = getByUserId(userId);
        cert.setProfileId(p.getId());
        return certRepo.save(cert);
    }

    public void updatePhotoUrl(Long userId, String url) {
        Profile p = getByUserId(userId);
        p.setPhotoUrl(url);
        profileRepo.save(p);
    }
}
