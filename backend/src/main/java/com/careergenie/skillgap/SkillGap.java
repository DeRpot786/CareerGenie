package com.careergenie.skillgap;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill_gaps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillGap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "match_id", nullable = false)
    private Long matchId;

    @Column(name = "skill_id")
    private Long skillId;

    @Column(name = "skill_name", nullable = false, length = 150)
    private String skillName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gap_type", nullable = false, length = 20)
    private GapType gapType;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 20)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Column(name = "why_it_matters", columnDefinition = "TEXT")
    private String whyItMatters;

    @Column(name = "learning_suggestion", columnDefinition = "TEXT")
    private String learningSuggestion;

    @Column(name = "project_suggestion", columnDefinition = "TEXT")
    private String projectSuggestion;

    public enum GapType {
        MISSING, PARTIAL, HAS
    }

    public enum Priority {
        HIGH, MEDIUM, LOW
    }
}
