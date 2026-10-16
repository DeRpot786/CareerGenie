// ============================================================
// CareerGenie — Comprehensive A4 Sample Resume Data
// Designed to gracefully fill standard A4 (210mm x 297mm)
// ============================================================

export const EMPTY_RESUME = {
  fullName: '',
  targetRole: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  website: '',
  summary: '',
  education: {
    degree: '',
    college: '',
    graduationYear: '',
    cgpa: '',
    honors: '',
  },
  skills: {
    languages: [],
    frameworks: [],
    technical: [],
    tools: [],
    soft: [],
  },
  experience: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  publications: [],
};

export const FULL_SAMPLE_RESUME = {
  isSample: true,
  fullName: 'Alex Thomas',
  targetRole: 'Frontend Developer',
  email: 'alex.thomas@example.com',
  phone: '+91 98765 43210',
  location: 'Bangalore, India',
  linkedin: 'linkedin.com/in/alexthomas-dev',
  github: 'github.com/alexthomas',
  website: 'alexthomas.dev',
  summary:
    'Motivated Frontend Developer with solid expertise in modern JavaScript (ES6+), React.js, TypeScript, and high-performance web architecture. Proven track record of developing accessible single-page applications, integrating complex RESTful APIs, and optimizing Core Web Vitals to 95+. Passionate about building modular, component-driven user interfaces that deliver seamless digital experiences.',
  education: {
    degree: 'B.Tech in Computer Science & Engineering',
    college: 'National Institute of Technology',
    graduationYear: '2021 – 2025',
    cgpa: '8.4 / 10',
    honors: 'First Class with Distinction',
  },
  experience: [
    {
      id: 1,
      role: 'Frontend Developer Intern',
      company: 'TechNova Solutions, Bangalore',
      duration: 'Jan 2024 – Present',
      desc: '• Engineered customer-facing React components with Tailwind CSS, reducing initial page load latency by 28% across high-traffic routes.\n• Built reusable WCAG 2.1 AA accessible UI component library adopted across 3 internal engineering squads.\n• Integrated RESTful microservices and real-time state caching using Axios and React Query, improving client data freshness.',
    },
    {
      id: 2,
      role: 'Junior Web Developer (Part-time)',
      company: 'Digital Creations Studio',
      duration: 'Jun 2023 – Dec 2023',
      desc: '• Developed responsive client web portals using Next.js and CSS Modules, delivering 95+ Google Lighthouse performance scores.\n• Implemented automated unit and integration tests with Vitest, decreasing regression defect turnaround time by 35%.\n• Collaborated with product designers in Figma to architect clean, component-driven user flows.',
    },
  ],
  skills: {
    languages: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3 / Sass', 'SQL'],
    frameworks: ['React.js', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Vite'],
    technical: ['RESTful APIs', 'Responsive Web Design', 'Web Performance & SEO', 'State Management'],
    tools: ['Git & GitHub', 'Postman', 'Docker', 'Jest / Vitest', 'Figma'],
    soft: ['Problem Solving', 'Agile / Scrum', 'Technical Writing', 'Cross-Team Collaboration'],
  },
  projects: [
    {
      id: 1,
      name: 'Career Genie AI Operating System',
      tech: 'React, Vite, Node.js, Tailwind CSS',
      desc: 'Architected an AI-powered student career acceleration platform featuring deterministic ATS scoring, dynamic interview prep, and customized resume generation with sub-100ms response times.',
      github: 'github.com/alexthomas/careergenie',
    },
    {
      id: 2,
      name: 'E-Commerce Responsive Cloud Shop',
      tech: 'React.js, Redux Toolkit, Stripe API, Tailwind',
      desc: 'Developed a high-performance single page web shop with client-side routing, shopping cart state persistence, product search filtering, and secure Stripe payment integration.',
      github: 'github.com/alexthomas/cloud-shop',
    },
    {
      id: 3,
      name: 'Collaborative Real-Time Task Board',
      tech: 'TypeScript, React, Socket.io, Express',
      desc: 'Built an interactive kanban workspace featuring live drag-and-drop task columns, real-time presence indicators, and persistent state synchronization across multiple concurrent users.',
      github: 'github.com/alexthomas/task-board',
    },
  ],
  certifications: [
    { id: 1, name: 'Meta Front-End Developer Professional Certificate', issuer: 'Meta (Coursera)', date: '2024' },
    { id: 2, name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2023' },
  ],
  languages: [
    { id: 1, name: 'English', proficiency: 'Professional Working' },
    { id: 2, name: 'Hindi', proficiency: 'Full Professional' },
    { id: 3, name: 'Malayalam', proficiency: 'Native / Bilingual' },
  ],
  awards: [
    { id: 1, title: '1st Place Winner — Inter-College Web Hackathon', issuer: 'NIT TechFest', year: '2024', desc: 'Built an accessibility-first campus utility portal for 5,000+ students.' },
    { id: 2, title: 'Academic Merit Scholarship', issuer: 'NIT Academic Council', year: '2022 – 2023', desc: 'Awarded for maintaining top 5% GPA in Computer Science department.' },
  ],
  publications: [],
};
