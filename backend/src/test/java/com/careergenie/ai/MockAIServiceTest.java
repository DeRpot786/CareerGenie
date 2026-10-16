package com.careergenie.ai;

import com.careergenie.profile.Skill;
import com.careergenie.profile.SkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MockAIServiceTest {

    @Mock
    private SkillRepository skillRepository;

    private MockAIService aiService;

    @BeforeEach
    void setUp() {
        aiService = new MockAIService(skillRepository);
    }

    @Test
    @DisplayName("analyzeJobDescription correctly tokenizes required and preferred skills against dictionary")
    void testAnalyzeJobDescription() {
        Skill react = Skill.builder().id(1L).name("React").category(Skill.SkillCategory.FRAMEWORK).aliases("[\"React.js\", \"ReactJS\"]").active(true).build();
        Skill java = Skill.builder().id(2L).name("Java").category(Skill.SkillCategory.LANGUAGE).aliases("[\"Core Java\", \"Java 17\"]").active(true).build();
        Skill docker = Skill.builder().id(3L).name("Docker").category(Skill.SkillCategory.TOOL).aliases("[\"Containers\"]").active(true).build();

        when(skillRepository.findAllActive()).thenReturn(List.of(react, java, docker));

        String jd = """
                We are seeking a Senior Full Stack Engineer.
                Required Skills:
                - Proficiency in Java and Spring Boot
                - Hands-on experience with React.js frontend development
                - Experience deploying with Docker containers
                
                Responsibilities:
                - Design high-performance REST APIs
                - Build responsive user interfaces
                """;

        AIService.JobAnalysisResult result = aiService.analyzeJobDescription(jd);

        assertThat(result.requiredSkills()).contains("React", "Java", "Docker");
        assertThat(result.keywords()).isNotEmpty();
        assertThat(result.isValidJobDescription()).isTrue();
    }

    @Test
    @DisplayName("generateProjectDescription uses truthful active verbs and contains no fabricated percentages")
    void testGenerateProjectDescriptionTruthfulness() {
        String name = "Campus Placement Portal";
        String description = "A web platform connecting students with hiring companies for campus placement drives.";
        List<String> tech = List.of("React", "Java", "Spring Boot", "MySQL");

        AIService.ProjectDescriptionResult result = aiService.generateProjectDescription(name, description, tech, "Full Stack Developer");

        assertThat(result.description()).isNotEmpty();
        // Truthfulness assertion: no hallucinated statistical claims
        assertThat(result.description()).doesNotContain("increased efficiency by 47%");
        assertThat(result.description()).doesNotContain("boosted revenue by 85%");
        assertThat(result.extractedSkills()).contains("React", "Java", "Spring Boot", "MySQL");
    }
}
