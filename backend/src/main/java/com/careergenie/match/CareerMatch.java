package com.careergenie.match;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name="career_matches")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CareerMatch {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="user_id",nullable=false) private Long userId;
    @Column(name="job_id",nullable=false) private Long jobId;
    @Column(name="overall_score") private Double overallScore;
    @Column(name="skill_score") private Double skillScore;
    @Column(name="keyword_score") private Double keywordScore;
    @Column(name="project_score") private Double projectScore;
    @Column(name="education_score") private Double educationScore;
    @Column(name="experience_score") private Double experienceScore;
    @Column(name="match_data",columnDefinition="JSON") private String matchData;
    @Column(name="created_at") private LocalDateTime createdAt;
    @PrePersist protected void onCreate(){this.createdAt=LocalDateTime.now();}
}
