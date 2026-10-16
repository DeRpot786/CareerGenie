package com.careergenie.job;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name="job_descriptions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobDescription {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="user_id",nullable=false) private Long userId;
    @Column(name="raw_text",columnDefinition="LONGTEXT",nullable=false) private String rawText;
    private String title;
    private String company;
    @Column(name="experience_years_min") private Integer experienceYearsMin;
    @Column(name="experience_years_max") private Integer experienceYearsMax;
    @Column(name="education_requirement") private String educationRequirement;
    private String location;
    @Column(name="employment_type") private String employmentType;
    @Column(name="analyzed_data",columnDefinition="JSON") private String analyzedData;
    private String notes;
    @Column(name="is_sample") private boolean sample=false;
    @Column(name="created_at") private LocalDateTime createdAt;
    @PrePersist protected void onCreate(){this.createdAt=LocalDateTime.now();}
}
