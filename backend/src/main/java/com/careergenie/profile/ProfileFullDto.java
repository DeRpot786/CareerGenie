package com.careergenie.profile;
import java.util.List;
public record ProfileFullDto(
    Profile profile,
    List<Education> education,
    List<Experience> experience,
    List<UserSkill> skills,
    List<Project> projects,
    List<Certification> certifications
){}
