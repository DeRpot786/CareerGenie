package com.careergenie.job;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="job_requirements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobRequirement {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="job_id",nullable=false) private Long jobId;
    @Column(name="skill_id") private Long skillId;
    private String keyword;
    @Column(name="is_required") private boolean required=true;
    @Column(name="is_preferred") private boolean preferred=false;
}
