package com.careergenie.profile;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    private SkillCategory category;

    @Column(columnDefinition = "JSON")
    private String aliases;

    private String description;

    @Column(name = "is_active")
    private boolean active = true;

    public enum SkillCategory {
        TECHNICAL, LANGUAGE, FRAMEWORK, DATABASE, TOOL, CLOUD, SOFT
    }
}
