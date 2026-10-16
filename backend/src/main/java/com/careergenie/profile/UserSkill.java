package com.careergenie.profile;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="user_skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserSkill {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="profile_id",nullable=false) private Long profileId;
    @Column(name="skill_id",nullable=false) private Long skillId;
    @Enumerated(EnumType.STRING) private Proficiency proficiency=Proficiency.BEGINNER;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="skill_id",insertable=false,updatable=false) private Skill skill;
    public enum Proficiency{BEGINNER,INTERMEDIATE,ADVANCED}
}
