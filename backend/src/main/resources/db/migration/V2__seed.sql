-- ============================================================
-- V2__seed.sql  —  Seed data: skills, career roles, templates,
--                  match config, interview question bank
-- ============================================================

-- ─────────────────────────────────────────
-- MATCH CONFIG (default weights)
-- ─────────────────────────────────────────
INSERT INTO match_config (weight_key, weight_value, description) VALUES
('SKILL_WEIGHT', 0.3500, 'Weight for skill match score (35%)'),
('KEYWORD_WEIGHT', 0.2000, 'Weight for keyword match score (20%)'),
('EXPERIENCE_WEIGHT', 0.2000, 'Weight for experience match score (20%)'),
('PROJECT_WEIGHT', 0.1500, 'Weight for project match score (15%)'),
('EDUCATION_WEIGHT', 0.1000, 'Weight for education match score (10%)');

-- ─────────────────────────────────────────
-- SKILLS DICTIONARY (100+ skills)
-- ─────────────────────────────────────────
INSERT INTO skills (name, category, aliases, description) VALUES
-- Programming Languages
('Java', 'LANGUAGE', '["java","Core Java","java8","java11","java17"]', 'Object-oriented programming language'),
('Python', 'LANGUAGE', '["python3","py","python2"]', 'High-level interpreted programming language'),
('JavaScript', 'LANGUAGE', '["js","javascript","ES6","ES2015","ECMAScript","vanilla js","vanilla javascript"]', 'Dynamic scripting language for web'),
('TypeScript', 'LANGUAGE', '["ts","typescript"]', 'Typed superset of JavaScript'),
('C', 'LANGUAGE', '["C programming","ANSI C"]', 'Low-level systems programming language'),
('C++', 'LANGUAGE', '["cpp","c plus plus","c++11","c++14","c++17"]', 'Object-oriented extension of C'),
('C#', 'LANGUAGE', '["csharp","c sharp","dotnet c#"]', 'Microsoft .NET programming language'),
('PHP', 'LANGUAGE', '["php7","php8"]', 'Server-side scripting language'),
('Ruby', 'LANGUAGE', '["ruby on rails"]', 'Dynamic, reflective programming language'),
('Swift', 'LANGUAGE', '["swift5"]', 'Apple iOS/macOS programming language'),
('Kotlin', 'LANGUAGE', '["kotlin lang"]', 'JVM language for Android development'),
('Go', 'LANGUAGE', '["golang","go lang"]', 'Statically typed compiled language by Google'),
('Rust', 'LANGUAGE', '["rust lang"]', 'Systems programming language focused on safety'),
('R', 'LANGUAGE', '["R language","R programming"]', 'Statistical computing language'),
('Dart', 'LANGUAGE', '["dart lang"]', 'Language for Flutter development'),
('Scala', 'LANGUAGE', '["scala lang"]', 'Functional/OOP JVM language'),
('MATLAB', 'LANGUAGE', '["matlab programming"]', 'Numerical computing environment'),
('Bash', 'LANGUAGE', '["shell","shell script","bash script","sh"]', 'Unix shell scripting'),
('PowerShell', 'LANGUAGE', '["powershell scripting"]', 'Windows task automation scripting'),
-- Frontend Frameworks
('React', 'FRAMEWORK', '["reactjs","react.js","react js","React 18","react hooks","react native web"]', 'JavaScript UI library by Facebook'),
('Angular', 'FRAMEWORK', '["angularjs","angular.js","angular 2+","angular 14","angular 15"]', 'TypeScript-based web framework by Google'),
('Vue.js', 'FRAMEWORK', '["vue","vuejs","vue 3","vue.js"]', 'Progressive JavaScript framework'),
('Next.js', 'FRAMEWORK', '["nextjs","next js"]', 'React framework with SSR/SSG'),
('Svelte', 'FRAMEWORK', '["sveltejs","sveltekit"]', 'Compiler-based JavaScript framework'),
('Flutter', 'FRAMEWORK', '["flutter sdk"]', 'Google UI toolkit for mobile/web'),
-- Backend Frameworks
('Spring Boot', 'FRAMEWORK', '["spring","springboot","spring framework","spring mvc","spring web","spring data"]', 'Java backend application framework'),
('Node.js', 'FRAMEWORK', '["nodejs","node js","node"]', 'JavaScript runtime for server-side'),
('Express.js', 'FRAMEWORK', '["express","expressjs","express js"]', 'Minimal Node.js web framework'),
('Django', 'FRAMEWORK', '["django rest","drf","django framework"]', 'Python web framework'),
('FastAPI', 'FRAMEWORK', '["fast api","fastapi python"]', 'Modern Python API framework'),
('Flask', 'FRAMEWORK', '["flask python"]', 'Lightweight Python web framework'),
('Laravel', 'FRAMEWORK', '["laravel php","laravel framework"]', 'PHP web application framework'),
('ASP.NET', 'FRAMEWORK', '["asp.net core","aspnet","dotnet","dot net core"]', 'Microsoft web framework'),
('React Native', 'FRAMEWORK', '["react-native","react native mobile"]', 'Cross-platform mobile development'),
-- Databases
('MySQL', 'DATABASE', '["mysql db","mysql8","mysql 8","mysql database"]', 'Open-source relational database'),
('PostgreSQL', 'DATABASE', '["postgres","postgresql","pg","psql"]', 'Advanced open-source relational database'),
('MongoDB', 'DATABASE', '["mongo","mongodb","mongoose"]', 'Document-oriented NoSQL database'),
('Redis', 'DATABASE', '["redis cache","redis db"]', 'In-memory data structure store'),
('SQLite', 'DATABASE', '["sqlite3","sqlite db"]', 'Lightweight embedded database'),
('Oracle', 'DATABASE', '["oracle db","oracle database"]', 'Enterprise relational database'),
('Microsoft SQL Server', 'DATABASE', '["mssql","sql server","sqlserver"]', 'Microsoft relational database'),
('Cassandra', 'DATABASE', '["apache cassandra"]', 'NoSQL distributed database'),
('Elasticsearch', 'DATABASE', '["elastic search","elk stack"]', 'Full-text search engine'),
('Firebase', 'DATABASE', '["firebase realtime","firestore","firebase db"]', 'Google cloud database platform'),
('DynamoDB', 'DATABASE', '["aws dynamodb","dynamo db"]', 'AWS NoSQL database service'),
-- Tools & Platforms
('Git', 'TOOL', '["github","gitlab","gitflow","version control","git version control"]', 'Distributed version control system'),
('Docker', 'TOOL', '["docker containers","dockerfile","docker-compose"]', 'Container platform'),
('Kubernetes', 'TOOL', '["k8s","kubectl","kubernetes orchestration"]', 'Container orchestration platform'),
('Jenkins', 'TOOL', '["jenkins ci","jenkins pipeline"]', 'CI/CD automation server'),
('GitHub Actions', 'TOOL', '["github ci","gh actions"]', 'GitHub CI/CD platform'),
('Postman', 'TOOL', '["postman api","api testing"]', 'API development tool'),
('VS Code', 'TOOL', '["vscode","visual studio code"]', 'Code editor by Microsoft'),
('IntelliJ IDEA', 'TOOL', '["intellij","idea ide"]', 'JetBrains Java IDE'),
('Maven', 'TOOL', '["apache maven","mvn"]', 'Java build tool'),
('Gradle', 'TOOL', '["gradle build"]', 'Build automation system'),
('npm', 'TOOL', '["npm install","node package manager"]', 'Node.js package manager'),
('Webpack', 'TOOL', '["webpack bundler"]', 'JavaScript module bundler'),
('Vite', 'TOOL', '["vite js","vitejs"]', 'Next-generation frontend build tool'),
('Figma', 'TOOL', '["figma design","figma ui"]', 'Collaborative design tool'),
('Jira', 'TOOL', '["jira project","atlassian jira"]', 'Project management tool'),
('Linux', 'TOOL', '["ubuntu","debian","centos","linux os","unix"]', 'Open-source operating system'),
-- Cloud
('AWS', 'CLOUD', '["amazon web services","aws cloud","amazon aws"]', 'Amazon cloud platform'),
('Azure', 'CLOUD', '["microsoft azure","azure cloud"]', 'Microsoft cloud platform'),
('Google Cloud', 'CLOUD', '["gcp","google cloud platform"]', 'Google cloud platform'),
('Heroku', 'CLOUD', '["heroku deployment"]', 'Cloud PaaS platform'),
('Vercel', 'CLOUD', '["vercel deployment"]', 'Frontend cloud platform'),
('Netlify', 'CLOUD', '["netlify deployment"]', 'Web hosting and CI/CD platform'),
-- Web Technologies
('HTML', 'TECHNICAL', '["html5","html 5","hypertext markup language","html css"]', 'Web markup language'),
('CSS', 'TECHNICAL', '["css3","css 3","cascading style sheets","styling"]', 'Web styling language'),
('REST API', 'TECHNICAL', '["restful api","rest apis","restful","rest","rest service","web api"]', 'Architectural style for APIs'),
('GraphQL', 'TECHNICAL', '["graphql api","graph ql"]', 'Query language for APIs'),
('WebSocket', 'TECHNICAL', '["websockets","ws","socket.io"]', 'Real-time communication protocol'),
('Tailwind CSS', 'FRAMEWORK', '["tailwind","tailwindcss"]', 'Utility-first CSS framework'),
('Bootstrap', 'FRAMEWORK', '["bootstrap css","bootstrap 5","twitter bootstrap"]', 'CSS component framework'),
('SASS/SCSS', 'TECHNICAL', '["sass","scss","css preprocessor"]', 'CSS preprocessor'),
-- Data Science
('Machine Learning', 'TECHNICAL', '["ml","machine learning algorithms","supervised learning","ML models"]', 'AI/ML techniques'),
('Deep Learning', 'TECHNICAL', '["dl","neural networks","deep neural networks"]', 'Neural network techniques'),
('TensorFlow', 'FRAMEWORK', '["tensorflow2","tf","keras"]', 'Google ML framework'),
('PyTorch', 'FRAMEWORK', '["pytorch","torch"]', 'Facebook ML framework'),
('Pandas', 'FRAMEWORK', '["pandas python","data analysis"]', 'Python data analysis library'),
('NumPy', 'FRAMEWORK', '["numpy","numerical python"]', 'Numerical computing library'),
('Scikit-learn', 'FRAMEWORK', '["sklearn","scikit learn"]', 'ML library for Python'),
('Data Analysis', 'TECHNICAL', '["data analytics","data manipulation","EDA"]', 'Analyzing and interpreting data'),
('SQL', 'TECHNICAL', '["sql queries","structured query language","database queries","mysql queries"]', 'Database query language'),
('Power BI', 'TOOL', '["powerbi","power bi desktop"]', 'Business analytics tool'),
('Tableau', 'TOOL', '["tableau desktop"]', 'Data visualization tool'),
-- Concepts
('Agile', 'TECHNICAL', '["agile methodology","scrum","kanban","agile development"]', 'Iterative software development'),
('DevOps', 'TECHNICAL', '["devops practices","cicd","ci/cd","continuous integration"]', 'Development + operations practices'),
('Microservices', 'TECHNICAL', '["microservice","microservices architecture"]', 'Service-oriented architecture'),
('OOP', 'TECHNICAL', '["object oriented","object-oriented programming","oop concepts"]', 'Object-oriented programming'),
('Data Structures', 'TECHNICAL', '["dsa","data structures and algorithms","algorithms"]', 'Fundamental CS concepts'),
('System Design', 'TECHNICAL', '["system design concepts","architecture design","hld lld"]', 'Designing scalable systems'),
('Design Patterns', 'TECHNICAL', '["software design patterns","solid principles","solid","gang of four"]', 'Reusable solution templates'),
('Testing', 'TECHNICAL', '["unit testing","integration testing","tdd","test driven","junit","jest"]', 'Software testing practices'),
('API Integration', 'TECHNICAL', '["third party api","external api","api consumption"]', 'Integrating external APIs'),
('Responsive Design', 'TECHNICAL', '["responsive web","mobile first","responsive layout","responsive ui"]', 'Adapting UI to screen sizes'),
('Authentication', 'TECHNICAL', '["auth","jwt","oauth","oauth2","session management","login system"]', 'User authentication systems'),
('Security', 'TECHNICAL', '["cybersecurity","web security","application security","owasp"]', 'Application security practices'),
-- Soft Skills
('Problem Solving', 'SOFT', '["analytical thinking","logical thinking","debugging"]', 'Ability to solve technical problems'),
('Communication', 'SOFT', '["verbal communication","written communication","presentation skills"]', 'Effective communication'),
('Teamwork', 'SOFT', '["team collaboration","collaborative","team player"]', 'Working effectively in teams'),
('Time Management', 'SOFT', '["deadline management","prioritization"]', 'Managing tasks and deadlines'),
('Leadership', 'SOFT', '["team lead","leadership skills","mentoring"]', 'Leading and guiding others'),
('Adaptability', 'SOFT', '["flexibility","learning agility"]', 'Adapting to new situations'),
('Critical Thinking', 'SOFT', '["analytical","logical reasoning"]', 'Evaluating situations critically');

-- ─────────────────────────────────────────
-- CAREER ROLES (11 standard + seeded)
-- ─────────────────────────────────────────
INSERT INTO career_roles (name, slug, description, typical_responsibilities, recommended_projects, interview_topics) VALUES
('Frontend Developer', 'frontend-developer',
 'Builds user interfaces and web applications using HTML, CSS, and JavaScript frameworks.',
 'Building responsive web interfaces, implementing UI/UX designs, integrating REST APIs, optimizing performance, cross-browser testing',
 'Portfolio website, E-commerce frontend, Weather app, Todo app, Movie/Book search app',
 'JavaScript fundamentals, React concepts, CSS layout, browser APIs, performance optimization, accessibility'),
('Backend Developer', 'backend-developer',
 'Designs and implements server-side logic, databases, and APIs.',
 'Designing RESTful APIs, database modeling, server-side logic, authentication/authorization, performance optimization',
 'REST API with CRUD, Authentication system, Blog backend, File upload service, Task management API',
 'API design, database design, authentication, caching, error handling, testing'),
('Full Stack Developer', 'full-stack-developer',
 'Works on both frontend and backend development.',
 'Full application development, API integration, database design, UI implementation, deployment',
 'Full stack web app, CRUD application with React + Node, Chat application, Blog platform',
 'System design, frontend + backend integration, database, deployment, DevOps basics'),
('Java Developer', 'java-developer',
 'Specializes in Java-based application development.',
 'Java application development, Spring Boot APIs, database integration, design patterns, code reviews',
 'Spring Boot REST API, Banking system simulation, Library management, Inventory system',
 'Java OOP, Spring Boot, JPA/Hibernate, multithreading, design patterns, collections'),
('Python Developer', 'python-developer',
 'Builds applications using Python, from web APIs to automation scripts.',
 'Python scripting, Django/FastAPI APIs, data manipulation, automation, testing',
 'Python automation script, Django blog, FastAPI project, Web scraper',
 'Python fundamentals, OOP in Python, Django, FastAPI, testing, async programming'),
('Data Analyst', 'data-analyst',
 'Analyzes data to extract insights and support business decisions.',
 'Data collection and cleaning, statistical analysis, visualization, reporting, SQL queries',
 'Sales data analysis, Customer segmentation, Excel/Power BI dashboard, SQL analysis project',
 'SQL, data visualization, statistics, Excel, Python for data, storytelling with data'),
('UI/UX Designer', 'ui-ux-designer',
 'Designs intuitive and visually appealing user interfaces and experiences.',
 'User research, wireframing, prototyping, design systems, usability testing',
 'Mobile app redesign, Design system, Wireframe + prototype, Case study',
 'Design principles, Figma, user research, usability, accessibility, prototyping'),
('Cybersecurity Engineer', 'cybersecurity-engineer',
 'Protects systems and networks from security threats.',
 'Vulnerability assessment, penetration testing, security policies, incident response',
 'CTF challenges, Vulnerability scanner, Network monitoring tool, Security audit report',
 'Network security, cryptography, OWASP, penetration testing, incident response'),
('Cloud Engineer', 'cloud-engineer',
 'Designs and manages cloud infrastructure and services.',
 'Cloud architecture, IaC, cost optimization, monitoring, CI/CD pipelines',
 'AWS S3 + Lambda project, Kubernetes deployment, Terraform IaC, CI/CD pipeline setup',
 'AWS/Azure/GCP services, Docker, Kubernetes, networking, security, cost management'),
('Mobile Developer', 'mobile-developer',
 'Builds mobile applications for Android and/or iOS platforms.',
 'Mobile app development, API integration, performance optimization, app store deployment',
 'To-do mobile app, Weather app, Social media clone, E-commerce mobile app',
 'React Native or Flutter, mobile UI, API integration, state management, app lifecycle'),
('Software Engineer', 'software-engineer',
 'Designs, develops, and maintains software systems across domains.',
 'Software design, development, testing, debugging, documentation, collaboration',
 'Any significant software project, open source contribution, CLI tool, library',
 'Data structures, algorithms, OOP, system design, testing, version control');

-- ─────────────────────────────────────────
-- CAREER ROLE SKILLS
-- ─────────────────────────────────────────
-- Helper: We'll use subqueries to get IDs

-- Frontend Developer skills
INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'REQUIRED' FROM career_roles r, skills s
WHERE r.slug = 'frontend-developer' AND s.name IN ('HTML','CSS','JavaScript','Git','REST API','Responsive Design');

INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'RECOMMENDED' FROM career_roles r, skills s
WHERE r.slug = 'frontend-developer' AND s.name IN ('React','TypeScript','Tailwind CSS','Testing','Figma','Webpack','Vite');

-- Backend Developer skills
INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'REQUIRED' FROM career_roles r, skills s
WHERE r.slug = 'backend-developer' AND s.name IN ('REST API','SQL','Git','Authentication','Testing');

INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'RECOMMENDED' FROM career_roles r, skills s
WHERE r.slug = 'backend-developer' AND s.name IN ('Node.js','Express.js','MySQL','PostgreSQL','MongoDB','Docker','Design Patterns','Microservices');

-- Full Stack Developer skills
INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'REQUIRED' FROM career_roles r, skills s
WHERE r.slug = 'full-stack-developer' AND s.name IN ('HTML','CSS','JavaScript','REST API','SQL','Git');

INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'RECOMMENDED' FROM career_roles r, skills s
WHERE r.slug = 'full-stack-developer' AND s.name IN ('React','Node.js','MongoDB','PostgreSQL','Docker','TypeScript','Authentication');

-- Java Developer skills
INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'REQUIRED' FROM career_roles r, skills s
WHERE r.slug = 'java-developer' AND s.name IN ('Java','OOP','SQL','Git','REST API');

INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'RECOMMENDED' FROM career_roles r, skills s
WHERE r.slug = 'java-developer' AND s.name IN ('Spring Boot','MySQL','PostgreSQL','Maven','Design Patterns','Testing','Docker');

-- Python Developer skills
INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'REQUIRED' FROM career_roles r, skills s
WHERE r.slug = 'python-developer' AND s.name IN ('Python','SQL','Git','REST API');

INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'RECOMMENDED' FROM career_roles r, skills s
WHERE r.slug = 'python-developer' AND s.name IN ('Django','FastAPI','Flask','PostgreSQL','Docker','Testing','Data Analysis');

-- Data Analyst skills
INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'REQUIRED' FROM career_roles r, skills s
WHERE r.slug = 'data-analyst' AND s.name IN ('SQL','Data Analysis','Python','Excel');

INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'RECOMMENDED' FROM career_roles r, skills s
WHERE r.slug = 'data-analyst' AND s.name IN ('Pandas','NumPy','Power BI','Tableau','Machine Learning','Data Structures');

-- Mobile Developer skills
INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'REQUIRED' FROM career_roles r, skills s
WHERE r.slug = 'mobile-developer' AND s.name IN ('REST API','Git','JavaScript','Authentication');

INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'RECOMMENDED' FROM career_roles r, skills s
WHERE r.slug = 'mobile-developer' AND s.name IN ('React Native','Flutter','Firebase','TypeScript','Redux');

-- Software Engineer skills (general)
INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'REQUIRED' FROM career_roles r, skills s
WHERE r.slug = 'software-engineer' AND s.name IN ('Data Structures','OOP','Git','Testing','Problem Solving');

INSERT INTO career_role_skills (role_id, skill_id, importance)
SELECT r.id, s.id, 'RECOMMENDED' FROM career_roles r, skills s
WHERE r.slug = 'software-engineer' AND s.name IN ('System Design','Design Patterns','Agile','SQL','REST API');

-- ─────────────────────────────────────────
-- RESUME TEMPLATES (6 templates)
-- ─────────────────────────────────────────
INSERT INTO resume_templates (name, slug, description, is_ats_friendly, display_order, html_template, css_styles) VALUES

('Professional', 'professional', 'Classic two-column professional layout', TRUE, 1,
'<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>{{CSS}}</style></head><body class="resume professional"><div class="header"><h1>{{NAME}}</h1><p class="contact">{{EMAIL}} | {{PHONE}} | {{LOCATION}}</p><p class="links">{{LINKEDIN}} | {{GITHUB}}</p></div>{{SECTIONS}}</body></html>',
'body{font-family:Georgia,serif;font-size:11pt;color:#222;margin:0;padding:20px}.resume.professional{max-width:800px;margin:0 auto}.header{border-bottom:2pt solid #003366;padding-bottom:10px;margin-bottom:16px}.header h1{font-size:22pt;color:#003366;margin:0}.contact{color:#555;font-size:9pt;margin:4px 0}.section-title{font-size:12pt;font-weight:bold;color:#003366;border-bottom:1pt solid #ccc;margin-top:14px;padding-bottom:2px;text-transform:uppercase;letter-spacing:1px}.section-body{margin-top:6px}'),

('Modern', 'modern', 'Contemporary design with accent color sidebar', FALSE, 2,
'<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>{{CSS}}</style></head><body class="resume modern"><div class="sidebar"><div class="name-block"><h1>{{FIRST_NAME}}</h1><h2>{{LAST_NAME}}</h2></div><div class="contact-block">{{CONTACT_ITEMS}}</div></div><div class="main">{{SECTIONS}}</div></body></html>',
'body{font-family:Inter,sans-serif;margin:0;display:flex;min-height:100vh}.sidebar{width:200px;background:#1e3a5f;color:white;padding:24px 16px}.name-block h1{font-size:16pt;margin:0;color:#fff}.name-block h2{font-size:11pt;color:#90cdf4;margin:0}.main{flex:1;padding:24px}.section-title{font-size:11pt;font-weight:700;color:#1e3a5f;border-bottom:2px solid #1e3a5f;padding-bottom:3px;margin-top:16px}'),

('Minimal', 'minimal', 'Clean single-column minimalist design', TRUE, 3,
'<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>{{CSS}}</style></head><body class="resume minimal"><h1 class="name">{{NAME}}</h1><p class="tagline">{{TARGET_ROLE}}</p><p class="contact">{{EMAIL}} · {{PHONE}} · {{LOCATION}}</p><hr/>{{SECTIONS}}</body></html>',
'body{font-family:Helvetica,Arial,sans-serif;font-size:10pt;color:#333;max-width:750px;margin:30px auto;padding:20px}.name{font-size:20pt;font-weight:300;margin:0;letter-spacing:2px}.tagline{color:#666;font-size:10pt;margin:4px 0 8px}.contact{font-size:9pt;color:#888}hr{border:none;border-top:1px solid #ddd;margin:12px 0}.section-title{font-size:9pt;font-weight:bold;color:#666;letter-spacing:2px;text-transform:uppercase;margin-top:16px}'),

('Student', 'student', 'Perfect for fresh graduates and students', TRUE, 4,
'<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>{{CSS}}</style></head><body class="resume student"><div class="header-bar"><h1>{{NAME}}</h1><span class="target">{{TARGET_ROLE}}</span></div><div class="contact-bar">{{EMAIL}} | {{PHONE}} | {{LINKEDIN}} | {{GITHUB}}</div>{{SECTIONS}}</body></html>',
'body{font-family:Calibri,sans-serif;font-size:11pt;color:#222;margin:0}.header-bar{background:#2d6a4f;color:white;padding:18px 24px}.header-bar h1{margin:0;font-size:20pt}.target{font-size:11pt;opacity:0.85}.contact-bar{background:#f8f9fa;padding:8px 24px;font-size:9pt;color:#555;border-bottom:2px solid #2d6a4f}.section-title{font-size:11pt;font-weight:bold;color:#2d6a4f;margin-top:14px;border-left:4px solid #2d6a4f;padding-left:8px}'),

('Developer', 'developer', 'Tech-focused dark header design for developers', FALSE, 5,
'<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>{{CSS}}</style></head><body class="resume developer"><div class="dev-header"><h1>{{NAME}}</h1><p class="title">{{TARGET_ROLE}}</p><div class="links">{{GITHUB_LINK}} | {{LINKEDIN_LINK}} | {{PORTFOLIO_LINK}}</div></div><div class="content">{{SECTIONS}}</div></body></html>',
'body{font-family:monospace,Courier;font-size:10pt;margin:0}.dev-header{background:#0d1117;color:#e6edf3;padding:24px 32px}.dev-header h1{font-size:18pt;margin:0;color:#58a6ff}.title{color:#8b949e;margin:4px 0}.links{font-size:9pt;color:#58a6ff}.content{padding:20px 32px}.section-title{font-family:monospace;font-size:9pt;color:#58a6ff;border-bottom:1px solid #30363d;padding-bottom:4px;text-transform:uppercase;letter-spacing:1px}'),

('ATS Friendly', 'ats-friendly', 'Optimized for applicant tracking systems — plain and scannable', TRUE, 6,
'<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>{{CSS}}</style></head><body class="resume ats"><h1>{{NAME}}</h1><p>{{EMAIL}} | {{PHONE}} | {{LOCATION}}</p><p>{{LINKEDIN}} | {{GITHUB}}</p>{{SECTIONS}}</body></html>',
'body{font-family:Arial,sans-serif;font-size:11pt;color:#000;max-width:800px;margin:20px auto;padding:20px}h1{font-size:16pt;margin-bottom:4px}.section-title{font-size:12pt;font-weight:bold;margin-top:14px;margin-bottom:4px;border-bottom:1px solid #000}p{margin:2px 0}ul{margin:4px 0;padding-left:20px}li{margin:2px 0}');

-- ─────────────────────────────────────────
-- INTERVIEW QUESTION BANK (50+ questions)
-- ─────────────────────────────────────────
INSERT INTO interview_questions (category, question, sample_answer, skill_id, difficulty, tags) VALUES

-- HR Questions
('HR', 'Tell me about yourself.', 'Start with your educational background, highlight key technical skills and projects, mention your career goal, and close with why you are excited about this role. Keep it to 2 minutes.', NULL, 'EASY', 'introduction,common,hr'),
('HR', 'Why do you want to work at this company?', 'Research the company beforehand. Mention their products/culture/mission that align with your values and how your skills can contribute.', NULL, 'EASY', 'motivation,company,hr'),
('HR', 'What are your strengths and weaknesses?', 'For strengths, give a specific example. For weakness, choose a real area of improvement and explain what you are doing to address it.', NULL, 'EASY', 'self-awareness,hr'),
('HR', 'Where do you see yourself in 5 years?', 'Express a realistic growth trajectory aligned with the role. Show ambition but also focus on the immediate job.', NULL, 'EASY', 'career-goals,hr'),
('HR', 'Why should we hire you?', 'Summarize how your skills, projects and attitude make you the right fit. Link your background directly to the job requirements.', NULL, 'MEDIUM', 'pitch,hr'),
('HR', 'What do you know about our product/service?', 'Research the company, try their product if possible, and mention specific features you found interesting.', NULL, 'MEDIUM', 'research,hr'),
('HR', 'How do you handle stress and pressure?', 'Share a specific example of working under a deadline. Explain how you prioritized, managed time, and delivered results.', NULL, 'MEDIUM', 'stress,hr'),

-- Behavioral Questions
('BEHAVIORAL', 'Describe a challenging project you worked on. What was your approach?', 'Use the STAR method: Situation, Task, Action, Result. Focus on how you identified the problem, broke it down, and solved it step by step.', NULL, 'MEDIUM', 'problem-solving,behavioral,star'),
('BEHAVIORAL', 'Tell me about a time you worked effectively in a team.', 'Share a team project, your role in it, how you communicated, resolved conflicts if any, and the outcome.', NULL, 'EASY', 'teamwork,behavioral'),
('BEHAVIORAL', 'How do you handle constructive criticism?', 'Give an example where you received feedback, how you received it professionally, and what you changed as a result.', NULL, 'MEDIUM', 'feedback,behavioral'),
('BEHAVIORAL', 'Describe a situation where you had to learn something new quickly.', 'Pick a technology or concept you had to learn for a project. Walk through how you approached learning and applied it.', NULL, 'MEDIUM', 'learning,adaptability,behavioral'),
('BEHAVIORAL', 'Tell me about a time you failed. What did you learn?', 'Be honest about a specific setback, the impact, and most importantly what you did differently afterward.', NULL, 'MEDIUM', 'failure,learning,behavioral'),

-- Technical: JavaScript
('TECHNICAL', 'Explain the difference between let, const and var in JavaScript.', 'var is function-scoped and hoisted. let and const are block-scoped. const cannot be reassigned. let can. Use const by default, let when you need to reassign, avoid var.', NULL, 'EASY', 'javascript,fundamentals'),
('TECHNICAL', 'What is the difference between == and === in JavaScript?', '== compares values with type coercion (e.g. "5" == 5 is true). === compares value AND type without coercion ("5" === 5 is false). Always prefer ===.', NULL, 'EASY', 'javascript,fundamentals'),
('TECHNICAL', 'What is a closure in JavaScript?', 'A closure is a function that retains access to variables in its outer scope even after the outer function has returned. Example: factory functions and module patterns.', NULL, 'MEDIUM', 'javascript,closures'),
('TECHNICAL', 'What is the event loop in JavaScript?', 'JavaScript is single-threaded. The event loop processes the call stack first, then checks the task queue (macrotasks) and microtask queue. Promises use microtasks which run before macrotasks.', NULL, 'HARD', 'javascript,event-loop,async'),
('TECHNICAL', 'What is the difference between synchronous and asynchronous programming?', 'Synchronous code runs line by line, blocking further execution. Asynchronous code (callbacks, Promises, async/await) allows other code to run while waiting for an operation to complete.', NULL, 'MEDIUM', 'javascript,async'),

-- Technical: React
('TECHNICAL', 'What are React hooks and why were they introduced?', 'Hooks (useState, useEffect, etc.) let you use state and other React features in functional components. They replaced class components as the primary way to write React.', NULL, 'EASY', 'react,hooks'),
('TECHNICAL', 'Explain the difference between useEffect and useLayoutEffect.', 'useEffect runs after the browser paints. useLayoutEffect runs synchronously after DOM mutations but before the browser paints. Use useLayoutEffect when you need to measure DOM before paint.', NULL, 'HARD', 'react,hooks,performance'),
('TECHNICAL', 'What is the virtual DOM and how does React use it?', 'The virtual DOM is a lightweight JavaScript representation of the real DOM. React compares (diffs) the new virtual DOM with the previous one and only updates the real DOM where things changed.', NULL, 'MEDIUM', 'react,virtual-dom'),
('TECHNICAL', 'How do you manage state in React? What tools have you used?', 'For local state: useState. For shared state: Context API or state management libraries like Redux or Zustand. For server state: React Query or SWR.', NULL, 'MEDIUM', 'react,state-management'),

-- Technical: Java / Spring
('TECHNICAL', 'What is the difference between @Component, @Service, @Repository, and @Controller in Spring?', 'All are stereotypes of @Component (auto-detected). @Service marks business logic. @Repository marks data layer and translates DB exceptions. @Controller marks MVC controllers. @RestController = @Controller + @ResponseBody.', NULL, 'MEDIUM', 'java,spring,annotations'),
('TECHNICAL', 'Explain Spring Boot auto-configuration.', 'Spring Boot uses @EnableAutoConfiguration to scan classpath and configure beans automatically based on dependencies. For example, if H2 is on the classpath, it auto-configures an in-memory datasource.', NULL, 'MEDIUM', 'spring-boot,configuration'),
('TECHNICAL', 'What is JPA and what is Hibernate?', 'JPA is a Java specification for ORM. Hibernate is the most popular JPA implementation. It maps Java objects to DB tables and handles SQL generation.', NULL, 'MEDIUM', 'java,jpa,hibernate'),
('TECHNICAL', 'What is JWT and how does it work?', 'JWT is a compact token format: Header.Payload.Signature. The server signs the payload with a secret. The client sends it in the Authorization header. The server verifies the signature without a DB lookup.', NULL, 'MEDIUM', 'auth,jwt,security'),

-- Technical: Database / SQL
('TECHNICAL', 'What is the difference between INNER JOIN and LEFT JOIN?', 'INNER JOIN returns rows that have matching values in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right — NULL for no match on right.', NULL, 'EASY', 'sql,database,joins'),
('TECHNICAL', 'What is database normalization?', 'Normalization reduces data redundancy by organizing data into tables. 1NF: no repeating groups. 2NF: no partial dependency. 3NF: no transitive dependency.', NULL, 'MEDIUM', 'sql,database,normalization'),
('TECHNICAL', 'Explain the difference between WHERE and HAVING.', 'WHERE filters rows before grouping. HAVING filters groups after GROUP BY. You cannot use aggregate functions in WHERE.', NULL, 'MEDIUM', 'sql,database'),
('TECHNICAL', 'What are database indexes and when should you use them?', 'An index speeds up data retrieval by creating a separate lookup structure. Use on frequently queried columns, JOIN columns, WHERE columns. Avoid on small tables or frequently updated columns.', NULL, 'MEDIUM', 'sql,database,performance'),

-- Technical: HTML/CSS
('TECHNICAL', 'What is the difference between display: block, inline, and inline-block?', 'Block: takes full width, starts on new line. Inline: takes only content width, stays in line, cannot set width/height. Inline-block: stays in line but you can set width/height.', NULL, 'EASY', 'css,layout'),
('TECHNICAL', 'Explain CSS specificity.', 'Specificity determines which CSS rule applies. From highest to lowest: !important, inline styles (1,0,0,0), ID selectors (0,1,0,0), class/pseudo-class/attribute (0,0,1,0), element (0,0,0,1).', NULL, 'MEDIUM', 'css,specificity'),
('TECHNICAL', 'What is the difference between semantic and non-semantic HTML elements?', 'Semantic elements (header, main, article, section, footer, nav) describe their meaning to the browser and developer. Non-semantic elements (div, span) carry no meaning about their content.', NULL, 'EASY', 'html,semantics,accessibility'),

-- Technical: Git
('TECHNICAL', 'What is the difference between git merge and git rebase?', 'Merge combines two branches creating a merge commit, preserving history. Rebase moves commits to a new base, resulting in a linear history. Rebase rewrites history — do not rebase shared branches.', NULL, 'MEDIUM', 'git,version-control'),
('TECHNICAL', 'What is git stash?', 'git stash temporarily saves your uncommitted changes so you can switch branches. git stash pop restores the saved changes.', NULL, 'EASY', 'git,version-control'),

-- Technical: APIs / REST
('TECHNICAL', 'What are the HTTP methods used in REST APIs?', 'GET (retrieve), POST (create), PUT (replace), PATCH (partial update), DELETE (remove). REST APIs use these methods to perform CRUD operations.', NULL, 'EASY', 'rest,http,api'),
('TECHNICAL', 'What is the difference between PUT and PATCH?', 'PUT replaces the entire resource. PATCH partially updates a resource, sending only the fields to change.', NULL, 'MEDIUM', 'rest,http,api'),
('TECHNICAL', 'What are HTTP status codes?', '2xx: success (200 OK, 201 Created). 3xx: redirection. 4xx: client error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found). 5xx: server error (500 Internal Server Error).', NULL, 'EASY', 'rest,http,api'),

-- Project Questions (generic — role-specific ones generated dynamically)
('PROJECT', 'Walk me through your most significant project.', 'Describe the problem it solved, technologies used, your specific role, challenges faced, and what you would improve. Have the GitHub link ready.', NULL, 'EASY', 'project,portfolio'),
('PROJECT', 'What challenges did you face in your project and how did you overcome them?', 'Pick a real technical challenge (e.g. API integration issue, database design decision) and explain your problem-solving process step by step.', NULL, 'MEDIUM', 'project,problem-solving'),
('PROJECT', 'What would you add or improve in your project if you had more time?', 'Show forward thinking: mention a feature you planned but could not implement, a performance optimization, or a scalability improvement.', NULL, 'EASY', 'project,improvement'),
('PROJECT', 'How did you test your project?', 'Describe any manual testing, unit tests, or integration tests you wrote. If you did not write tests, mention what you would test and why.', NULL, 'MEDIUM', 'project,testing');

-- ─────────────────────────────────────────
-- Link questions to skills where applicable
-- ─────────────────────────────────────────
UPDATE interview_questions SET skill_id = (SELECT id FROM skills WHERE name = 'JavaScript') WHERE tags LIKE '%javascript%';
UPDATE interview_questions SET skill_id = (SELECT id FROM skills WHERE name = 'React') WHERE tags LIKE '%react%' AND skill_id IS NULL;
UPDATE interview_questions SET skill_id = (SELECT id FROM skills WHERE name = 'Java') WHERE tags LIKE '%java,%' AND skill_id IS NULL;
UPDATE interview_questions SET skill_id = (SELECT id FROM skills WHERE name = 'Spring Boot') WHERE tags LIKE '%spring-boot%';
UPDATE interview_questions SET skill_id = (SELECT id FROM skills WHERE name = 'SQL') WHERE tags LIKE '%sql%' AND skill_id IS NULL;
UPDATE interview_questions SET skill_id = (SELECT id FROM skills WHERE name = 'Git') WHERE tags LIKE '%git%' AND skill_id IS NULL;
UPDATE interview_questions SET skill_id = (SELECT id FROM skills WHERE name = 'REST API') WHERE tags LIKE '%rest%' AND skill_id IS NULL;
UPDATE interview_questions SET skill_id = (SELECT id FROM skills WHERE name = 'HTML') WHERE tags LIKE '%html%' AND skill_id IS NULL;
UPDATE interview_questions SET skill_id = (SELECT id FROM skills WHERE name = 'CSS') WHERE tags LIKE '%css%' AND skill_id IS NULL;
UPDATE interview_questions SET skill_id = (SELECT id FROM skills WHERE name = 'Authentication') WHERE tags LIKE '%jwt%' AND skill_id IS NULL;
