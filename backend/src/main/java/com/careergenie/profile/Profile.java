package com.careergenie.profile;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "photo_url")
    private String photoUrl;

    private String phone;
    private String location;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(name = "target_role")
    private String targetRole;

    @Column(name = "target_industry")
    private String targetIndustry;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level")
    @Builder.Default
    private ExperienceLevel experienceLevel = ExperienceLevel.FRESHER;

    @Column(name = "preferred_location")
    private String preferredLocation;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_work_type")
    @Builder.Default
    private WorkType preferredWorkType = WorkType.HYBRID;

    @Column(name = "completion_pct")
    @Builder.Default
    private Integer completionPct = 0;

    public enum ExperienceLevel { FRESHER, JUNIOR, MID, SENIOR }
    public enum WorkType { REMOTE, HYBRID, ONSITE }
}
