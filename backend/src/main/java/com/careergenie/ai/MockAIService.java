package com.careergenie.ai;

import com.careergenie.profile.Skill;
import com.careergenie.profile.SkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * MockAIService — Deterministic AI using DB-backed skills dictionary.
 *
 * Algorithms:
 * - analyzeJobDescription: tokenizes text, matches against skills name+aliases
 * - analyzeSkillGap: set operations with alias-based fuzzy matching
 * - generateProjectDescription: 3 template variants selected by hash
 * - generateInterviewQuestions: pulls from in-memory question pool + project-specific
 * - generateCareerRoadmap: role-based ordered templates filtering completed skills
 * - analyzeResume: keyword intersection scoring
 * - generateProfessionalSummary: template with real profile facts only
 */
@Service("mockAIService")
@RequiredArgsConstructor
@Slf4j
public class MockAIService implements AIService {

    private final SkillRepository skillRepository;

    // ─── Job Description Analysis ──────────────────────────────────────────
    @Override
    public JobAnalysisResult analyzeJobDescription(String rawText) {
        if (rawText == null || rawText.trim().length() < 50) {
            return new JobAnalysisResult(null, null, null, null, null,
                    List.of(), List.of(), List.of(), List.of(), false);
        }

        String lower = rawText.toLowerCase();

        // Heuristic: must contain job-related words
        boolean isValidJD = lower.contains("responsibilities") || lower.contains("requirements")
                || lower.contains("skills") || lower.contains("experience")
                || lower.contains("job title") || lower.contains("we are looking")
                || lower.contains("role") || lower.contains("position");

        if (!isValidJD && rawText.length() < 200) {
            return new JobAnalysisResult(null, null, null, null, null,
                    List.of(), List.of(), List.of(), List.of(), false);
        }

        // Extract title
        String title = extractTitle(rawText);
        String company = extractCompany(rawText);

        // Extract experience
        int[] experience = extractExperience(lower);

        // Education
        String education = extractEducation(lower);

        // Match skills against DB
        List<Skill> allSkills = skillRepository.findAllActive();
        List<String> requiredSkills = new ArrayList<>();
        List<String> preferredSkills = new ArrayList<>();
        List<String> keywords = new ArrayList<>();

        // Identify required vs preferred sections
        String[] lines = rawText.split("\n");
        String currentSection = "general";
        for (String line : lines) {
            String lineLower = line.toLowerCase().trim();
            if (lineLower.contains("required") || lineLower.contains("must have") || lineLower.contains("mandatory")) {
                currentSection = "required";
            } else if (lineLower.contains("preferred") || lineLower.contains("nice to have") || lineLower.contains("bonus") || lineLower.contains("plus")) {
                currentSection = "preferred";
            }

            for (Skill skill : allSkills) {
                if (skillMentionedInLine(lineLower, skill)) {
                    if ("preferred".equals(currentSection)) {
                        if (!preferredSkills.contains(skill.getName())) {
                            preferredSkills.add(skill.getName());
                        }
                    } else {
                        if (!requiredSkills.contains(skill.getName())) {
                            requiredSkills.add(skill.getName());
                        }
                    }
                }
            }
        }

        // Extract additional keywords (non-skill job keywords)
        keywords.addAll(extractKeywords(lower));

        // Extract responsibilities
        List<String> responsibilities = extractResponsibilities(rawText);

        return new JobAnalysisResult(
                title, company,
                experience[0], experience[1],
                education,
                requiredSkills,
                preferredSkills,
                keywords,
                responsibilities,
                true
        );
    }

    // ─── Skill Gap Analysis ────────────────────────────────────────────────
    @Override
    public SkillGapResult analyzeSkillGap(
            List<String> userSkills,
            List<String> requiredSkills,
            List<String> preferredSkills,
            String jobText) {

        List<String> hasSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        List<AIService.SkillGapResult.PartialMatch> partialMatches = new ArrayList<>();

        // Build alias map for user skills
        Map<String, String> userSkillAliases = buildAliasMap(userSkills);

        for (String required : requiredSkills) {
            String reqLower = required.toLowerCase();
            if (userSkills.stream().anyMatch(us -> us.equalsIgnoreCase(required))) {
                hasSkills.add(required);
            } else if (userSkillAliases.containsKey(reqLower)) {
                hasSkills.add(required);
            } else {
                // Check partial match (e.g. user has JavaScript, job wants TypeScript)
                AIService.SkillGapResult.PartialMatch partial = findPartialMatch(required, userSkills);
                if (partial != null) {
                    partialMatches.add(partial);
                } else {
                    missingSkills.add(required);
                }
            }
        }

        // Keywords to add from job text
        List<String> keywordsToAdd = extractKeywords(jobText.toLowerCase())
                .stream()
                .filter(k -> userSkills.stream().noneMatch(us -> us.toLowerCase().contains(k.toLowerCase())))
                .limit(10)
                .collect(Collectors.toList());

        return new SkillGapResult(hasSkills, missingSkills, partialMatches, keywordsToAdd);
    }

    // ─── Project Description Generation ───────────────────────────────────
    @Override
    public ProjectDescriptionResult generateProjectDescription(
            String projectName, String basicDescription,
            List<String> technologies, String role) {

        if (technologies == null) technologies = List.of();
        String techString = String.join(", ", technologies);
        String techList = technologies.isEmpty() ? "" : " using " + techString;

        // 3 variants selected deterministically by hash
        int variant = Math.abs((projectName + techString).hashCode()) % 3;

        String description;
        switch (variant) {
            case 0 -> description = String.format(
                    "Developed %s%s, implementing %s and delivering a functional, user-friendly application.",
                    projectName, techList,
                    extractFeaturesFromDescription(basicDescription, technologies)
            );
            case 1 -> description = String.format(
                    "Built %s%s, focusing on %s to create an effective solution for %s.",
                    projectName, techList,
                    extractFeaturesFromDescription(basicDescription, technologies),
                    extractProblemDomain(basicDescription)
            );
            default -> description = String.format(
                    "Designed and implemented %s%s, incorporating %s features with a clean, responsive interface.",
                    projectName, techList,
                    extractFeaturesFromDescription(basicDescription, technologies)
            );
        }

        // Extract skills from provided technologies only — no invention
        List<String> extractedSkills = new ArrayList<>(technologies);
        if (!technologies.isEmpty()) {
            if (technologies.stream().anyMatch(t -> t.equalsIgnoreCase("HTML") || t.equalsIgnoreCase("CSS"))) {
                extractedSkills.add("Responsive Design");
                extractedSkills.add("UI Development");
            }
            if (technologies.stream().anyMatch(t -> t.equalsIgnoreCase("JavaScript") || t.equalsIgnoreCase("TypeScript"))) {
                extractedSkills.add("Frontend Development");
            }
        }
        // Remove duplicates
        extractedSkills = extractedSkills.stream().distinct().collect(Collectors.toList());

        return new ProjectDescriptionResult(description, extractedSkills, variant);
    }

    // ─── Interview Questions ───────────────────────────────────────────────
    @Override
    public List<InterviewQuestionResult> generateInterviewQuestions(
            String jobTitle,
            List<String> requiredSkills,
            List<String> userProjectNames,
            String jobText) {

        List<InterviewQuestionResult> questions = new ArrayList<>();

        // Standard HR questions
        questions.add(new InterviewQuestionResult("HR", "Tell me about yourself.",
                "Start with your educational background, mention key skills and projects, then connect to why you want this role.",
                "EASY"));
        questions.add(new InterviewQuestionResult("HR", "Why do you want to work as a " + jobTitle + "?",
                "Express your passion for the role and how your skills align with the responsibilities.",
                "EASY"));
        questions.add(new InterviewQuestionResult("HR", "Where do you see yourself in 3-5 years?",
                "Describe realistic career growth in the direction of this role, showing ambition and commitment.",
                "EASY"));

        // Technical questions based on required skills
        for (String skill : requiredSkills) {
            InterviewQuestionResult q = getTechnicalQuestion(skill);
            if (q != null) questions.add(q);
        }

        // Behavioral
        questions.add(new InterviewQuestionResult("BEHAVIORAL",
                "Describe a challenging technical problem you solved.",
                "Use STAR method: Situation, Task, Action, Result. Explain your thought process clearly.",
                "MEDIUM"));
        questions.add(new InterviewQuestionResult("BEHAVIORAL",
                "How do you approach learning a new technology quickly?",
                "Describe your learning process — documentation, tutorials, small projects, then applying to real work.",
                "MEDIUM"));

        // Project-specific questions using real project names
        for (String projectName : userProjectNames) {
            questions.add(new InterviewQuestionResult("PROJECT",
                    "Walk me through your project: " + projectName + ". What problem did it solve?",
                    "Describe the problem context, your design decisions, technologies used, and what you learned.",
                    "MEDIUM"));
            questions.add(new InterviewQuestionResult("PROJECT",
                    "What were the key technical challenges in building " + projectName + "?",
                    "Be specific about a real challenge — data management, UI complexity, API integration — and how you overcame it.",
                    "MEDIUM"));
        }

        return questions;
    }

    // ─── Career Roadmap ────────────────────────────────────────────────────
    @Override
    public List<RoadmapItemResult> generateCareerRoadmap(
            String targetRole,
            List<String> userSkills,
            List<String> missingSkills) {

        List<RoadmapItemResult> allItems = getRoleRoadmapTemplate(targetRole);
        List<String> userSkillsLower = userSkills.stream()
                .map(String::toLowerCase).collect(Collectors.toList());

        // Filter out skills user already has, keep missing ones ordered
        List<RoadmapItemResult> filtered = allItems.stream()
                .filter(item -> userSkillsLower.stream()
                        .noneMatch(us -> us.equalsIgnoreCase(item.title()) ||
                                        item.title().toLowerCase().contains(us)))
                .collect(Collectors.toList());

        // Re-index
        List<RoadmapItemResult> result = new ArrayList<>();
        for (int i = 0; i < filtered.size(); i++) {
            RoadmapItemResult old = filtered.get(i);
            result.add(new RoadmapItemResult(old.title(), old.description(), i, old.estimatedWeeks()));
        }
        return result;
    }

    // ─── Resume Analysis ──────────────────────────────────────────────────
    @Override
    public AtsAnalysisResult analyzeResume(
            Map<String, Object> resumeContent,
            String jobText,
            List<String> jobKeywords) {

        String resumeText = resumeContent.toString().toLowerCase();
        String jobLower = jobText.toLowerCase();

        // Keyword coverage
        long matched = jobKeywords.stream()
                .filter(k -> resumeText.contains(k.toLowerCase()))
                .count();
        double keywordScore = jobKeywords.isEmpty() ? 100 : (double) matched / jobKeywords.size() * 100;

        // Skills score
        List<Skill> allSkills = skillRepository.findAllActive();
        long skillsInResume = allSkills.stream()
                .filter(s -> resumeText.contains(s.getName().toLowerCase()))
                .count();
        long skillsInJob = allSkills.stream()
                .filter(s -> jobLower.contains(s.getName().toLowerCase()))
                .count();
        double skillsScore = skillsInJob == 0 ? 70 : Math.min(100, (double) skillsInResume / skillsInJob * 100);

        // Education score
        double educationScore = resumeText.contains("bachelor") || resumeText.contains("b.tech") || resumeText.contains("b.e") ? 90 : 60;

        // Experience score
        double experienceScore = resumeText.contains("experience") || resumeText.contains("work") ? 70 : 40;

        // Projects score
        double projectsScore = resumeText.contains("project") ? 80 : 30;

        // Formatting score (check for common sections)
        double formattingScore = 60;
        if (resumeText.contains("email") || resumeText.contains("phone")) formattingScore += 10;
        if (resumeText.contains("skills")) formattingScore += 10;
        if (resumeText.contains("education")) formattingScore += 10;
        if (resumeText.contains("project")) formattingScore += 10;
        formattingScore = Math.min(100, formattingScore);

        double overallScore = (keywordScore * 0.25 + skillsScore * 0.25 +
                educationScore * 0.15 + experienceScore * 0.15 +
                projectsScore * 0.10 + formattingScore * 0.10);

        List<String> issues = new ArrayList<>();
        List<String> passes = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();

        if (keywordScore < 50) issues.add("Low keyword coverage — add more job-specific keywords");
        else passes.add("Keyword coverage is satisfactory");

        if (!resumeText.contains("summary") && !resumeText.contains("objective")) {
            issues.add("No professional summary detected — add a concise summary targeting this role");
        } else passes.add("Professional summary found");

        if (skillsScore < 60) issues.add("Several required skills are not mentioned in the resume");
        else passes.add("Skills section covers most requirements");

        if (!resumeText.contains("github") && !resumeText.contains("project")) {
            issues.add("No projects or GitHub link found — add relevant projects");
        } else passes.add("Projects section present");

        suggestions.add("Add more keywords from the job description to improve ATS matching");
        suggestions.add("Quantify achievements where possible using specific metrics from your work");
        suggestions.add("Ensure your skills section lists all required technologies");

        // Claim checker
        List<AIService.AtsAnalysisResult.ClaimCheckResult> claimChecks = new ArrayList<>();
        if (resumeText.contains("expert") || resumeText.contains("advanced")) {
            claimChecks.add(new AIService.AtsAnalysisResult.ClaimCheckResult(
                    "Claims of expert-level proficiency",
                    "Consider using 'experienced with' or 'proficient in' rather than 'expert' unless you have extensive evidence",
                    "LOW"
            ));
        }

        String disclaimer = "ATS DISCLAIMER: Different applicant tracking systems use different algorithms, " +
                "parsing techniques, and scoring criteria. This analysis provides an estimate based on " +
                "keyword matching and section detection, but actual ATS compatibility cannot be guaranteed. " +
                "Results will vary by employer system.";

        return new AtsAnalysisResult(
                Math.round(overallScore * 10.0) / 10.0,
                Math.round(keywordScore * 10.0) / 10.0,
                Math.round(skillsScore * 10.0) / 10.0,
                educationScore,
                experienceScore,
                projectsScore,
                formattingScore,
                issues, passes, suggestions, claimChecks, disclaimer
        );
    }

    // ─── Professional Summary ──────────────────────────────────────────────
    @Override
    public String generateProfessionalSummary(
            String name,
            String targetRole,
            List<String> topSkills,
            String experienceLevel,
            List<String> projectNames) {

        String skillsText = topSkills.isEmpty() ? "" : " with hands-on experience in " + String.join(", ", topSkills.subList(0, Math.min(4, topSkills.size())));
        String projectText = projectNames.isEmpty() ? "" : ", including " + projectNames.get(0);
        String levelText = switch (experienceLevel != null ? experienceLevel : "FRESHER") {
            case "JUNIOR" -> "entry-level";
            case "MID" -> "mid-level";
            case "SENIOR" -> "experienced";
            default -> "motivated fresher";
        };

        return String.format(
                "%s %s%s. Passionate about building quality software and eager to contribute to a dynamic team%s.",
                levelText.substring(0, 1).toUpperCase() + levelText.substring(1),
                targetRole != null ? targetRole : "Software Developer",
                skillsText,
                projectText
        );
    }

    // ─── Private Helper Methods ─────────────────────────────────────────────

    private boolean skillMentionedInLine(String lineLower, Skill skill) {
        if (lineLower.contains(skill.getName().toLowerCase())) return true;
        if (skill.getAliases() != null) {
            // aliases stored as JSON array string: ["alias1","alias2"]
            String aliasStr = skill.getAliases().replaceAll("[\\[\\]\"]", "").toLowerCase();
            for (String alias : aliasStr.split(",")) {
                if (lineLower.contains(alias.trim())) return true;
            }
        }
        return false;
    }

    private String extractTitle(String text) {
        String[] lines = text.split("\n");
        for (String line : lines) {
            String t = line.trim();
            if (t.toLowerCase().startsWith("job title:") || t.toLowerCase().startsWith("position:") || t.toLowerCase().startsWith("role:")) {
                return t.replaceAll("(?i)(job title:|position:|role:)", "").trim();
            }
        }
        // Fallback: first non-empty line
        for (String line : lines) {
            if (!line.trim().isEmpty() && line.trim().length() < 80) {
                return line.trim();
            }
        }
        return null;
    }

    private String extractCompany(String text) {
        for (String line : text.split("\n")) {
            String t = line.trim();
            if (t.toLowerCase().startsWith("company:") || t.toLowerCase().startsWith("organization:")) {
                return t.replaceAll("(?i)(company:|organization:)", "").trim();
            }
        }
        return null;
    }

    private int[] extractExperience(String lower) {
        int min = 0, max = 0;
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("(\\d+)\\s*[-–]\\s*(\\d+)\\s*years?").matcher(lower);
        if (m.find()) {
            min = Integer.parseInt(m.group(1));
            max = Integer.parseInt(m.group(2));
        } else {
            m = java.util.regex.Pattern.compile("(\\d+)\\+?\\s*years?").matcher(lower);
            if (m.find()) {
                min = Integer.parseInt(m.group(1));
                max = min + 2;
            }
        }
        return new int[]{min, max};
    }

    private String extractEducation(String lower) {
        if (lower.contains("bachelor") || lower.contains("b.tech") || lower.contains("b.e.")) {
            return "Bachelor's degree";
        } else if (lower.contains("master") || lower.contains("m.tech") || lower.contains("mba")) {
            return "Master's degree";
        } else if (lower.contains("phd") || lower.contains("doctorate")) {
            return "PhD";
        }
        return null;
    }

    private List<String> extractKeywords(String lower) {
        List<String> keywords = new ArrayList<>();
        String[] jobKeywordPatterns = {
                "agile", "scrum", "rest", "api", "microservices", "responsive",
                "cross-browser", "performance", "optimization", "testing",
                "unit test", "ci/cd", "devops", "version control", "code review",
                "object oriented", "design patterns", "solid", "clean code",
                "state management", "redux", "context api", "hooks",
                "git workflow", "pull request", "documentation"
        };
        for (String kw : jobKeywordPatterns) {
            if (lower.contains(kw)) {
                keywords.add(kw);
            }
        }
        return keywords;
    }

    private List<String> extractResponsibilities(String text) {
        List<String> responsibilities = new ArrayList<>();
        boolean inResponsibilities = false;
        for (String line : text.split("\n")) {
            String t = line.trim();
            if (t.toLowerCase().contains("responsibilities") || t.toLowerCase().contains("what you'll do")) {
                inResponsibilities = true;
                continue;
            }
            if (inResponsibilities && (t.startsWith("-") || t.startsWith("•") || t.startsWith("*"))) {
                String resp = t.replaceFirst("^[-•*]\\s*", "").trim();
                if (!resp.isEmpty()) responsibilities.add(resp);
            }
            if (inResponsibilities && t.toLowerCase().contains("requirement") || t.toLowerCase().contains("qualification")) {
                inResponsibilities = false;
            }
        }
        return responsibilities.stream().limit(8).collect(Collectors.toList());
    }

    private Map<String, String> buildAliasMap(List<String> userSkills) {
        Map<String, String> aliases = new HashMap<>();
        for (String skill : userSkills) {
            aliases.put(skill.toLowerCase(), skill);
            // Add common aliases
            if (skill.equalsIgnoreCase("JavaScript")) aliases.put("js", skill);
            if (skill.equalsIgnoreCase("HTML")) aliases.put("html5", skill);
            if (skill.equalsIgnoreCase("CSS")) aliases.put("css3", skill);
            if (skill.equalsIgnoreCase("SQL")) aliases.put("mysql queries", skill);
        }
        return aliases;
    }

    private AIService.SkillGapResult.PartialMatch findPartialMatch(String requiredSkill, List<String> userSkills) {
        // Define known partial relationships
        Map<String, String[]> partialRelations = Map.of(
                "TypeScript", new String[]{"JavaScript"},
                "React Native", new String[]{"React"},
                "Angular", new String[]{"JavaScript", "TypeScript"},
                "Vue.js", new String[]{"JavaScript"},
                "Next.js", new String[]{"React"},
                "PostgreSQL", new String[]{"MySQL", "SQL"},
                "FastAPI", new String[]{"Python"},
                "Django", new String[]{"Python"},
                "Spring Boot", new String[]{"Java"}
        );

        String[] relatedUserSkills = partialRelations.get(requiredSkill);
        if (relatedUserSkills != null) {
            for (String related : relatedUserSkills) {
                if (userSkills.stream().anyMatch(us -> us.equalsIgnoreCase(related))) {
                    return new AIService.SkillGapResult.PartialMatch(related, requiredSkill,
                            "You know " + related + ", which gives you a foundation for " + requiredSkill);
                }
            }
        }
        return null;
    }

    private String extractFeaturesFromDescription(String description, List<String> technologies) {
        List<String> features = new ArrayList<>();
        String lower = description.toLowerCase();
        if (lower.contains("order") || lower.contains("cart")) features.add("order management");
        if (lower.contains("user") || lower.contains("login") || lower.contains("auth")) features.add("user authentication");
        if (lower.contains("search") || lower.contains("browse") || lower.contains("filter")) features.add("search and filtering");
        if (lower.contains("dashboard") || lower.contains("admin")) features.add("admin dashboard");
        if (lower.contains("payment")) features.add("payment processing");
        if (lower.contains("chat") || lower.contains("message")) features.add("messaging functionality");
        if (features.isEmpty()) features.add("core application features");
        return String.join(", ", features);
    }

    private String extractProblemDomain(String description) {
        String lower = description.toLowerCase();
        if (lower.contains("food") || lower.contains("restaurant")) return "food service";
        if (lower.contains("ecommerce") || lower.contains("shop") || lower.contains("store")) return "e-commerce";
        if (lower.contains("student") || lower.contains("school") || lower.contains("college")) return "education";
        if (lower.contains("hospital") || lower.contains("doctor") || lower.contains("health")) return "healthcare";
        if (lower.contains("bank") || lower.contains("finance") || lower.contains("payment")) return "finance";
        return "end users";
    }

    private InterviewQuestionResult getTechnicalQuestion(String skill) {
        return switch (skill.toLowerCase()) {
            case "html", "html5" -> new InterviewQuestionResult("TECHNICAL",
                    "What is the difference between semantic and non-semantic HTML elements? Give examples.",
                    "Semantic elements (header, main, article, section, nav, footer) describe their meaning. Non-semantic (div, span) carry no inherent meaning. Semantic HTML improves accessibility and SEO.",
                    "EASY");
            case "css", "css3" -> new InterviewQuestionResult("TECHNICAL",
                    "Explain the CSS box model and the difference between border-box and content-box.",
                    "The box model consists of content, padding, border, and margin. content-box: width applies to content only. border-box: width includes padding and border, making layout more predictable.",
                    "EASY");
            case "javascript", "js" -> new InterviewQuestionResult("TECHNICAL",
                    "What is the difference between let, const, and var in JavaScript?",
                    "var is function-scoped and hoisted. let and const are block-scoped. const cannot be reassigned. Use const by default, let when reassignment is needed, avoid var.",
                    "EASY");
            case "react", "reactjs" -> new InterviewQuestionResult("TECHNICAL",
                    "Explain useState and useEffect hooks with examples.",
                    "useState manages local component state: const [count, setCount] = useState(0). useEffect handles side effects: runs after render, optional cleanup, dependency array controls when it runs.",
                    "MEDIUM");
            case "git" -> new InterviewQuestionResult("TECHNICAL",
                    "What is the difference between git merge and git rebase?",
                    "Merge creates a merge commit preserving history. Rebase rewrites commits onto a new base creating a linear history. Never rebase shared/public branches.",
                    "MEDIUM");
            case "rest api", "rest", "restful api" -> new InterviewQuestionResult("TECHNICAL",
                    "Explain the HTTP methods used in REST APIs and when to use each.",
                    "GET: retrieve data. POST: create new resource. PUT: replace entire resource. PATCH: partial update. DELETE: remove resource. Use correct method to follow REST conventions.",
                    "EASY");
            case "sql", "mysql" -> new InterviewQuestionResult("TECHNICAL",
                    "What is the difference between INNER JOIN and LEFT JOIN?",
                    "INNER JOIN returns only rows with matches in both tables. LEFT JOIN returns all rows from the left table plus matching rows from the right (NULL for no match).",
                    "EASY");
            case "java" -> new InterviewQuestionResult("TECHNICAL",
                    "What are the four pillars of OOP? Give Java examples.",
                    "Encapsulation (private fields + getters/setters), Inheritance (class extends), Polymorphism (method overriding), Abstraction (abstract classes + interfaces).",
                    "EASY");
            case "spring boot" -> new InterviewQuestionResult("TECHNICAL",
                    "What is auto-configuration in Spring Boot?",
                    "Spring Boot scans classpath dependencies and auto-configures beans. E.g., adding MySQL driver auto-configures DataSource. Uses @EnableAutoConfiguration and META-INF/spring.factories.",
                    "MEDIUM");
            default -> null;
        };
    }

    private List<RoadmapItemResult> getRoleRoadmapTemplate(String targetRole) {
        if (targetRole == null) return getGeneralRoadmap();
        return switch (targetRole.toLowerCase()) {
            case "frontend developer" -> List.of(
                new RoadmapItemResult("HTML & CSS Fundamentals", "Master HTML5 semantic elements, CSS layouts (Flexbox, Grid), responsive design", 0, 3),
                new RoadmapItemResult("JavaScript Essentials", "ES6+ features, DOM manipulation, events, fetch API, async/await", 1, 4),
                new RoadmapItemResult("Git & GitHub", "Version control basics, branching, merging, pull requests, GitHub workflow", 2, 1),
                new RoadmapItemResult("React", "Components, props, state, hooks (useState, useEffect), React Router", 3, 4),
                new RoadmapItemResult("REST API Integration", "Fetch/Axios, HTTP methods, handling responses, error handling", 4, 2),
                new RoadmapItemResult("TypeScript", "Types, interfaces, generics, TypeScript with React", 5, 3),
                new RoadmapItemResult("State Management", "Context API, Redux Toolkit or Zustand", 6, 2),
                new RoadmapItemResult("Testing", "Jest, React Testing Library, unit and integration tests", 7, 2),
                new RoadmapItemResult("Performance Optimization", "Code splitting, lazy loading, memoization, lighthouse audit", 8, 2),
                new RoadmapItemResult("Full Stack Project", "Build a complete project with React frontend and REST API backend", 9, 6)
            );
            case "backend developer" -> List.of(
                new RoadmapItemResult("Programming Fundamentals", "OOP concepts, data structures, algorithms", 0, 4),
                new RoadmapItemResult("SQL & Databases", "SQL queries, joins, normalization, indexes", 1, 3),
                new RoadmapItemResult("Git & GitHub", "Version control, collaboration workflow", 2, 1),
                new RoadmapItemResult("REST API Design", "HTTP methods, status codes, API best practices", 3, 2),
                new RoadmapItemResult("Node.js or Spring Boot", "Backend framework of choice", 4, 5),
                new RoadmapItemResult("Authentication & Security", "JWT, OAuth, bcrypt, OWASP top 10", 5, 2),
                new RoadmapItemResult("Database ORM", "Hibernate/JPA or Sequelize", 6, 2),
                new RoadmapItemResult("Docker & Deployment", "Containerization, cloud deployment basics", 7, 3),
                new RoadmapItemResult("Testing", "Unit tests, integration tests, mocking", 8, 2),
                new RoadmapItemResult("Backend Project", "Build a full REST API with auth, database and tests", 9, 6)
            );
            default -> getGeneralRoadmap();
        };
    }

    private List<RoadmapItemResult> getGeneralRoadmap() {
        return List.of(
            new RoadmapItemResult("Programming Basics", "Core language fundamentals and OOP", 0, 4),
            new RoadmapItemResult("Data Structures & Algorithms", "Arrays, linked lists, sorting, searching", 1, 4),
            new RoadmapItemResult("Database & SQL", "Relational databases, SQL queries", 2, 3),
            new RoadmapItemResult("Git & Version Control", "Git basics, GitHub, branching strategies", 3, 1),
            new RoadmapItemResult("Web Technologies", "HTML, CSS, JavaScript basics", 4, 4),
            new RoadmapItemResult("REST APIs", "Building and consuming REST APIs", 5, 2),
            new RoadmapItemResult("Testing", "Unit testing, TDD basics", 6, 2),
            new RoadmapItemResult("Deployment", "Basic cloud deployment, CI/CD", 7, 2),
            new RoadmapItemResult("Capstone Project", "Build an end-to-end application", 8, 8)
        );
    }
}
