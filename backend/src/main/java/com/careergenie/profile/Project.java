package com.careergenie.profile;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Project {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="profile_id",nullable=false) private Long profileId;
    @Column(nullable=false) private String name;
    @Column(columnDefinition="TEXT") private String description;
    @Column(name="generated_description",columnDefinition="TEXT") private String generatedDescription;
    @Column(columnDefinition="JSON") private String technologies;
    @Column(name="github_url") private String githubUrl;
    @Column(name="demo_url") private String demoUrl;
    private String role;
    @Column(columnDefinition="TEXT") private String achievements;
}
