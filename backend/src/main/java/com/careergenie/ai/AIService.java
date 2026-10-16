package com.careergenie.ai;

import java.util.List;
import java.util.Map;

/**
 * Central AI service interface.
 * Default implementation: MockAIService (deterministic, DB-backed).
 * Optional: LlmAIService (selected via AI_PROVIDER=llm env var).
 */
public interface AIService {

    /**
     * Analyze raw job description text and extract structured data.
     */
    JobAnalysisResult analyzeJobDescription(String rawText);

    /**
     * Analyze the gap between user profile skills and job requirements.
     */
    SkillGapResult analyzeSkillGap(
            List<String> userSkills,
            List<String> requiredSkills,
            List<String> preferredSkills,
            String jobText
    );

    /**
     * Generate a professional CV project description bullet.
     * TRUTHFULNESS: Only uses supplied technologies and description — no invented metrics.
     */
    ProjectDescriptionResult generateProjectDescription(
            String projectName,
            String basicDescription,
            List<String> technologies,
            String role
    );

    /**
     * Generate interview questions for a job session.
     */
    List<InterviewQuestionResult> generateInterviewQuestions(
            String jobTitle,
            List<String> requiredSkills,
            List<String> userProjectNames,
            String jobText
    );

    /**
     * Generate a career roadmap ordered list.
     */
    List<RoadmapItemResult> generateCareerRoadmap(
            String targetRole,
            List<String> userSkills,
            List<String> missingSkills
    );

    /**
     * Analyze a resume against a job description for ATS scoring.
     */
    AtsAnalysisResult analyzeResume(
            Map<String, Object> resumeContent,
            String jobText,
            List<String> jobKeywords
    );

    /**
     * Generate a professional summary for the resume.
     * Only uses facts from profile — no invented claims.
     */
    String generateProfessionalSummary(
            String name,
            String targetRole,
            List<String> topSkills,
            String experienceLevel,
            List<String> projectNames
    );

    // ─── Result Records ───────────────────────────────────────────────

    record JobAnalysisResult(
            String title,
            String company,
            Integer experienceMin,
            Integer experienceMax,
            String educationRequirement,
            List<String> requiredSkills,
            List<String> preferredSkills,
            List<String> keywords,
            List<String> responsibilities,
            boolean isValidJobDescription
    ) {}

    record SkillGapResult(
            List<String> hasSkills,
            List<String> missingSkills,
            List<PartialMatch> partialMatches,
            List<String> keywordsToAdd
    ) {
        public record PartialMatch(String userSkill, String jobSkill, String reason) {}
    }

    record ProjectDescriptionResult(
            String description,
            List<String> extractedSkills,
            int variantUsed
    ) {}

    record InterviewQuestionResult(
            String category,
            String question,
            String sampleAnswer,
            String difficulty
    ) {}

    record RoadmapItemResult(
            String title,
            String description,
            int orderIndex,
            int estimatedWeeks
    ) {}

    record AtsAnalysisResult(
            double overallScore,
            double keywordScore,
            double skillsScore,
            double educationScore,
            double experienceScore,
            double projectsScore,
            double formattingScore,
            List<String> issues,
            List<String> passes,
            List<String> suggestions,
            List<ClaimCheckResult> claimChecks,
            String disclaimer
    ) {
        record ClaimCheckResult(String originalText, String suggestion, String severity) {}
    }
}
