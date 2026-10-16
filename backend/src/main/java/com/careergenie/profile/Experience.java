package com.careergenie.profile;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name="experience")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Experience {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="profile_id",nullable=false) private Long profileId;
    @Column(nullable=false) private String company;
    @Column(nullable=false) private String role;
    @Column(name="start_date",nullable=false) private LocalDate startDate;
    @Column(name="end_date") private LocalDate endDate;
    @Column(name="is_current") private boolean current=false;
    @Column(columnDefinition="TEXT") private String responsibilities;
    @Column(columnDefinition="TEXT") private String achievements;
}
