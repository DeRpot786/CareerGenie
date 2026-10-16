package com.careergenie.profile;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="education")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Education {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="profile_id",nullable=false) private Long profileId;
    @Column(nullable=false) private String degree;
    @Column(name="field_of_study") private String fieldOfStudy;
    private String college;
    private String university;
    @Column(name="start_year") private Integer startYear;
    @Column(name="end_year") private Integer endYear;
    private Double cgpa;
    private Double percentage;
    @Column(name="is_current") private boolean current=false;
}
