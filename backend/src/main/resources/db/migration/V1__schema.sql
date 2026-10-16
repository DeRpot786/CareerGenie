-- ============================================================
-- V1__schema.sql  —  Career Genie complete database schema
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    full_name VARCHAR(150),
    photo_url VARCHAR(500),
    phone VARCHAR(30),
    location VARCHAR(200),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    target_role VARCHAR(150),
    target_industry VARCHAR(150),
    experience_level ENUM('FRESHER','JUNIOR','MID','SENIOR') DEFAULT 'FRESHER',
    preferred_location VARCHAR(200),
    preferred_work_type ENUM('REMOTE','HYBRID','ONSITE') DEFAULT 'HYBRID',
    completion_pct TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- EDUCATION
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS education (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    profile_id BIGINT UNSIGNED NOT NULL,
    degree VARCHAR(150) NOT NULL,
    field_of_study VARCHAR(150),
    college VARCHAR(255),
    university VARCHAR(255),
    start_year SMALLINT UNSIGNED,
    end_year SMALLINT UNSIGNED,
    cgpa DECIMAL(4,2),
    percentage DECIMAL(5,2),
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_education_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    INDEX idx_education_profile (profile_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- EXPERIENCE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experience (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    profile_id BIGINT UNSIGNED NOT NULL,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    responsibilities TEXT,
    achievements TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_experience_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    INDEX idx_experience_profile (profile_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- SKILLS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category ENUM('TECHNICAL','LANGUAGE','FRAMEWORK','DATABASE','TOOL','CLOUD','SOFT') NOT NULL DEFAULT 'TECHNICAL',
    aliases JSON,
    description VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_skills_category (category),
    INDEX idx_skills_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- USER SKILLS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    profile_id BIGINT UNSIGNED NOT NULL,
    skill_id BIGINT UNSIGNED NOT NULL,
    proficiency ENUM('BEGINNER','INTERMEDIATE','ADVANCED') NOT NULL DEFAULT 'BEGINNER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_skill (profile_id, skill_id),
    CONSTRAINT fk_user_skills_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    profile_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    generated_description TEXT,
    technologies JSON,
    github_url VARCHAR(500),
    demo_url VARCHAR(500),
    role VARCHAR(200),
    achievements TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    INDEX idx_projects_profile (profile_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- CERTIFICATIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    profile_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255),
    issued_date DATE,
    expiry_date DATE,
    credential_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_certifications_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    INDEX idx_certifications_profile (profile_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- CAREER ROLES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS career_roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    typical_responsibilities TEXT,
    recommended_projects TEXT,
    interview_topics TEXT,
    is_custom BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT UNSIGNED,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_career_roles_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- CAREER ROLE SKILLS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS career_role_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL,
    skill_id BIGINT UNSIGNED NOT NULL,
    importance ENUM('REQUIRED','RECOMMENDED') NOT NULL DEFAULT 'REQUIRED',
    UNIQUE KEY uq_role_skill (role_id, skill_id),
    CONSTRAINT fk_crs_role FOREIGN KEY (role_id) REFERENCES career_roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_crs_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- JOB DESCRIPTIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_descriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    raw_text LONGTEXT NOT NULL,
    title VARCHAR(200),
    company VARCHAR(200),
    experience_years_min TINYINT UNSIGNED,
    experience_years_max TINYINT UNSIGNED,
    education_requirement VARCHAR(200),
    location VARCHAR(200),
    employment_type VARCHAR(100),
    analyzed_data JSON,
    notes TEXT,
    is_sample BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_job_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- JOB REQUIREMENTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_requirements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    skill_id BIGINT UNSIGNED,
    keyword VARCHAR(150),
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    is_preferred BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_jr_job FOREIGN KEY (job_id) REFERENCES job_descriptions(id) ON DELETE CASCADE,
    CONSTRAINT fk_jr_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE SET NULL,
    INDEX idx_jr_job (job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- MATCH CONFIG (configurable weights)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS match_config (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    weight_key VARCHAR(50) NOT NULL UNIQUE,
    weight_value DECIMAL(5,4) NOT NULL,
    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- CAREER MATCHES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS career_matches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    job_id BIGINT UNSIGNED NOT NULL,
    overall_score DECIMAL(5,2),
    skill_score DECIMAL(5,2),
    keyword_score DECIMAL(5,2),
    project_score DECIMAL(5,2),
    education_score DECIMAL(5,2),
    experience_score DECIMAL(5,2),
    match_data JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cm_job FOREIGN KEY (job_id) REFERENCES job_descriptions(id) ON DELETE CASCADE,
    INDEX idx_cm_user (user_id),
    INDEX idx_cm_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- SKILL GAPS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skill_gaps (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    match_id BIGINT UNSIGNED NOT NULL,
    skill_id BIGINT UNSIGNED,
    skill_name VARCHAR(150) NOT NULL,
    gap_type ENUM('MISSING','PARTIAL','HAS') NOT NULL,
    priority ENUM('HIGH','MEDIUM','LOW') NOT NULL DEFAULT 'MEDIUM',
    why_it_matters TEXT,
    learning_suggestion TEXT,
    project_suggestion TEXT,
    CONSTRAINT fk_sg_match FOREIGN KEY (match_id) REFERENCES career_matches(id) ON DELETE CASCADE,
    CONSTRAINT fk_sg_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE SET NULL,
    INDEX idx_sg_match (match_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- RESUME TEMPLATES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resume_templates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    thumbnail_url VARCHAR(500),
    html_template LONGTEXT NOT NULL,
    css_styles LONGTEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_ats_friendly BOOLEAN NOT NULL DEFAULT FALSE,
    display_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- RESUMES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resumes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    template_id BIGINT UNSIGNED,
    name VARCHAR(200) NOT NULL DEFAULT 'My Resume',
    content JSON,
    section_order JSON,
    hidden_sections JSON,
    status ENUM('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_resumes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_resumes_template FOREIGN KEY (template_id) REFERENCES resume_templates(id) ON DELETE SET NULL,
    INDEX idx_resumes_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- RESUME VERSIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resume_versions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    resume_id BIGINT UNSIGNED NOT NULL,
    version_num SMALLINT UNSIGNED NOT NULL,
    name VARCHAR(200),
    content_snapshot JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rv_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    INDEX idx_rv_resume (resume_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- CAREER ROADMAPS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS career_roadmaps (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    job_id BIGINT UNSIGNED,
    career_role_id BIGINT UNSIGNED,
    title VARCHAR(200),
    progress_pct TINYINT UNSIGNED NOT NULL DEFAULT 0,
    generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_roadmap_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_roadmap_job FOREIGN KEY (job_id) REFERENCES job_descriptions(id) ON DELETE SET NULL,
    INDEX idx_roadmap_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- ROADMAP ITEMS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roadmap_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    roadmap_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    skill_id BIGINT UNSIGNED,
    status ENUM('NOT_STARTED','LEARNING','COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
    order_index SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    estimated_weeks TINYINT UNSIGNED,
    resources TEXT,
    CONSTRAINT fk_ri_roadmap FOREIGN KEY (roadmap_id) REFERENCES career_roadmaps(id) ON DELETE CASCADE,
    CONSTRAINT fk_ri_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE SET NULL,
    INDEX idx_ri_roadmap (roadmap_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- INTERVIEW QUESTIONS (question bank)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interview_questions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category ENUM('TECHNICAL','HR','PROJECT','BEHAVIORAL') NOT NULL,
    question TEXT NOT NULL,
    sample_answer TEXT,
    skill_id BIGINT UNSIGNED,
    career_role_id BIGINT UNSIGNED,
    difficulty ENUM('EASY','MEDIUM','HARD') NOT NULL DEFAULT 'MEDIUM',
    tags VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_iq_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE SET NULL,
    CONSTRAINT fk_iq_role FOREIGN KEY (career_role_id) REFERENCES career_roles(id) ON DELETE SET NULL,
    INDEX idx_iq_category (category),
    INDEX idx_iq_skill (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- INTERVIEW SESSIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interview_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    job_id BIGINT UNSIGNED,
    title VARCHAR(200),
    questions_data JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_is_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_is_job FOREIGN KEY (job_id) REFERENCES job_descriptions(id) ON DELETE SET NULL,
    INDEX idx_is_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- USER ANSWERS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_answers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT UNSIGNED NOT NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    answer_text TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_answer (session_id, question_id),
    CONSTRAINT fk_ua_session FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_ua_question FOREIGN KEY (question_id) REFERENCES interview_questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
-- SAVED JOBS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    job_id BIGINT UNSIGNED NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_saved_job (user_id, job_id),
    CONSTRAINT fk_sj_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_sj_job FOREIGN KEY (job_id) REFERENCES job_descriptions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
