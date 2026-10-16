package com.careergenie.career;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="career_roles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CareerRole {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    @Column(nullable=false,unique=true) private String slug;
    @Column(columnDefinition="TEXT") private String description;
    @Column(name="typical_responsibilities",columnDefinition="TEXT") private String typicalResponsibilities;
    @Column(name="recommended_projects",columnDefinition="TEXT") private String recommendedProjects;
    @Column(name="interview_topics",columnDefinition="TEXT") private String interviewTopics;
    @Column(name="is_custom") private boolean custom=false;
    @Column(name="created_by") private Long createdBy;
}
