-- ============================================================
-- V3__demo.sql  —  Demo users, profile, and sample job
--                  for Alex Thomas (Frontend Developer demo)
-- ============================================================
-- Passwords are BCrypt hashed:
--   alex.thomas@example.com -> Password@123
--   demo@careergenie.com    -> Password@123
--   admin@careergenie.dev   -> Admin@123
--   admin@careergenie.com   -> Admin@123
-- ============================================================

-- Repeatable Demo Users (Using INSERT IGNORE to prevent duplicate errors)
INSERT IGNORE INTO users (email, password_hash, role) VALUES
('alex.thomas@example.com', '$2b$10$/Vs.CdeKv3QiEvix94FVbutz0iXG9fzcgfh861hGL95AKmSZxbzXC', 'USER'),
('demo@careergenie.com', '$2b$10$/Vs.CdeKv3QiEvix94FVbutz0iXG9fzcgfh861hGL95AKmSZxbzXC', 'USER'),
('admin@careergenie.dev', '$2b$10$oB.J0ptNeFJZER41AslVL.97BRKXiuycM/GTRmL4WjzTF.z8vrsBS', 'ADMIN'),
('admin@careergenie.com', '$2b$10$oB.J0ptNeFJZER41AslVL.97BRKXiuycM/GTRmL4WjzTF.z8vrsBS', 'ADMIN');

-- Demo Profile for Alex Thomas
INSERT IGNORE INTO profiles (user_id, full_name, phone, location, linkedin_url, github_url,
                      target_role, target_industry, experience_level, preferred_work_type, completion_pct)
SELECT u.id, 'Alex Thomas', '+91-9876543210', 'Bangalore, India',
       'https://linkedin.com/in/alexthomas', 'https://github.com/alexthomas',
       'Frontend Developer', 'Technology', 'FRESHER', 'HYBRID', 70
FROM users u WHERE u.email IN ('alex.thomas@example.com', 'demo@careergenie.com');

-- Demo Education
INSERT INTO education (profile_id, degree, field_of_study, college, university, start_year, end_year, cgpa)
SELECT p.id, 'Bachelor of Technology', 'Computer Science', 'RV College of Engineering', 'Visvesvaraya Technological University', 2021, 2025, 7.80
FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.email = 'demo@careergenie.com';

-- Demo Skills for Alex Thomas
INSERT INTO user_skills (profile_id, skill_id, proficiency)
SELECT p.id, s.id,
    CASE s.name
        WHEN 'HTML'       THEN 'INTERMEDIATE'
        WHEN 'CSS'        THEN 'INTERMEDIATE'
        WHEN 'JavaScript' THEN 'INTERMEDIATE'
        WHEN 'SQL'        THEN 'BEGINNER'
        ELSE 'BEGINNER'
    END
FROM profiles p
JOIN users u ON p.user_id = u.id
JOIN skills s ON s.name IN ('HTML','CSS','JavaScript','SQL')
WHERE u.email = 'demo@careergenie.com';

-- Demo Project for Alex Thomas
INSERT INTO projects (profile_id, name, description, generated_description, technologies, github_url, role)
SELECT p.id,
    'Online Food Ordering Website',
    'A website where users can browse food items, add them to cart, and place orders.',
    'Developed a responsive food ordering web application using HTML, CSS and JavaScript, implementing product browsing, an interactive shopping cart, and client-side order management functionality.',
    '["HTML","CSS","JavaScript"]',
    'https://github.com/alexthomas/food-ordering',
    'Frontend Developer'
FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.email = 'demo@careergenie.com';

-- ─────────────────────────────────────────
-- Sample Job Description (Frontend Developer at TechCorp)
-- ─────────────────────────────────────────
INSERT INTO job_descriptions (user_id, title, company, experience_years_min, experience_years_max,
    education_requirement, location, employment_type, is_sample, raw_text, analyzed_data)
SELECT u.id,
    'Frontend Developer',
    'TechCorp Solutions',
    0, 2,
    'Bachelor''s degree in Computer Science or related field',
    'Bangalore, India',
    'Full-time',
    TRUE,
    'Job Title: Frontend Developer
Company: TechCorp Solutions
Location: Bangalore, India (Hybrid)
Experience: 0-2 years

About the Role:
We are looking for a passionate Frontend Developer to join our growing team. You will work closely with our UI/UX designers and backend engineers to build responsive, high-performance web applications.

Responsibilities:
- Develop and maintain responsive web applications using HTML, CSS, and JavaScript
- Build reusable React components and integrate them with backend REST APIs
- Implement state management using Redux or Context API
- Use Git for version control and collaborate in an Agile team
- Write clean, maintainable code following best practices
- Optimize applications for performance and scalability

Required Skills:
- Proficiency in HTML5, CSS3, and JavaScript (ES6+)
- Experience with React.js and React Hooks
- Knowledge of Git and version control workflows
- Understanding of REST APIs and API integration
- Responsive design and cross-browser compatibility

Preferred Skills:
- Experience with TypeScript
- Familiarity with testing frameworks (Jest, React Testing Library)
- Basic knowledge of Node.js or backend development
- Experience with CSS frameworks like Tailwind CSS or Bootstrap

Qualifications:
- Bachelor''s degree in Computer Science, Engineering, or related field
- Strong problem-solving skills and attention to detail
- Good communication skills and ability to work in a team',

    '{"title":"Frontend Developer","company":"TechCorp Solutions","experience":{"min":0,"max":2},"required_skills":["HTML","CSS","JavaScript","React","Git","REST API"],"preferred_skills":["TypeScript","Testing","Node.js","Tailwind CSS","Bootstrap"],"keywords":["responsive","react hooks","state management","redux","context api","agile","es6","cross-browser","performance","reusable components"],"education":"Bachelor degree in Computer Science"}'

FROM users u WHERE u.email = 'demo@careergenie.com';

-- Seed job requirements for the sample job
INSERT INTO job_requirements (job_id, skill_id, keyword, is_required, is_preferred)
SELECT j.id, s.id, s.name, TRUE, FALSE
FROM job_descriptions j
JOIN skills s ON s.name IN ('HTML','CSS','JavaScript','React','Git','REST API')
WHERE j.is_sample = TRUE AND j.title = 'Frontend Developer';

INSERT INTO job_requirements (job_id, skill_id, keyword, is_required, is_preferred)
SELECT j.id, s.id, s.name, FALSE, TRUE
FROM job_descriptions j
JOIN skills s ON s.name IN ('TypeScript','Testing','Node.js','Tailwind CSS','Bootstrap')
WHERE j.is_sample = TRUE AND j.title = 'Frontend Developer';
