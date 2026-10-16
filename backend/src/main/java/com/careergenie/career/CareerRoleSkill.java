package com.careergenie.career;
import jakarta.persistence.*;
import lombok.*;
import com.careergenie.profile.Skill;
@Entity @Table(name="career_role_skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CareerRoleSkill {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="role_id",nullable=false) private Long roleId;
    @Column(name="skill_id",nullable=false) private Long skillId;
    @Enumerated(EnumType.STRING) private Importance importance=Importance.REQUIRED;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="skill_id",insertable=false,updatable=false) private Skill skill;
    public enum Importance{REQUIRED,RECOMMENDED}
}
