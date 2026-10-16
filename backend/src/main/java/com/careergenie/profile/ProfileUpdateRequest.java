package com.careergenie.profile;
public record ProfileUpdateRequest(
    String fullName, String phone, String location,
    String linkedinUrl, String githubUrl, String portfolioUrl,
    String targetRole, String targetIndustry,
    Profile.ExperienceLevel experienceLevel,
    String preferredLocation, Profile.WorkType preferredWorkType
){}
