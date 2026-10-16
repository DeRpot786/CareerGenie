import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Layers,
  Wand2,
  Save,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  User,
  GraduationCap,
  Code2,
  Check,
  Copy,
  X,
  RefreshCw,
  RotateCcw,
  SearchCheck,
  Palette,
  Target,
  Lightbulb,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, FormField } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  callAI,
  generateRoleSummary,
  rewriteBulletPoint,
  improveText,
  auditAtsResume,
  suggestSkillsForRole,
  generateInterviewQuestions
} from '../api/aiService';
import { TEMPLATE_REGISTRY, getTemplateById } from '../components/templates/templateRegistry';
import { TemplateRenderer } from '../components/templates/TemplateRenderer';
import { EMPTY_RESUME, FULL_SAMPLE_RESUME } from '../data/sampleResume';

const COLOR_PRESETS = [
  { name: 'Classic Slate', hex: '#0f172a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Crimson', hex: '#e11d48' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Teal', hex: '#0f766e' },
  { name: 'Ocean', hex: '#0284c7' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Charcoal', hex: '#334155' },
];

const ROLE_KEYWORD_MAP = {
  frontend: ['JavaScript', 'React', 'HTML5', 'CSS3', 'TypeScript', 'Responsive Design', 'Git', 'REST APIs', 'Performance Optimization'],
  backend: ['Node.js', 'Python', 'Java', 'SQL', 'PostgreSQL', 'Docker', 'RESTful APIs', 'Microservices', 'Git'],
  fullstack: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL', 'REST APIs', 'Docker', 'Git', 'HTML5/CSS3'],
  devops: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Terraform', 'Git', 'Monitoring', 'Python'],
  data: ['Python', 'SQL', 'Machine Learning', 'Pandas', 'NumPy', 'Data Visualization', 'Git', 'Tableau', 'Statistics'],
  mobile: ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'REST APIs', 'Mobile UI', 'Git'],
};

function getRoleKeywords(roleTitle = '') {
  const lower = (roleTitle || '').toLowerCase();
  if (lower.includes('back')) return ROLE_KEYWORD_MAP.backend;
  if (lower.includes('full')) return ROLE_KEYWORD_MAP.fullstack;
  if (lower.includes('devops') || lower.includes('cloud')) return ROLE_KEYWORD_MAP.devops;
  if (lower.includes('data') || lower.includes('ai') || lower.includes('ml')) return ROLE_KEYWORD_MAP.data;
  if (lower.includes('mobile') || lower.includes('ios') || lower.includes('android')) return ROLE_KEYWORD_MAP.mobile;
  return ROLE_KEYWORD_MAP.frontend;
}

const STEPS = [
  { id: 1, title: 'Personal Info', label: '1. Personal Details' },
  { id: 2, title: 'Job & Role', label: '2. Target Job & JD' },
  { id: 3, title: 'Summary & Skills', label: '3. Summary & Skills' },
  { id: 4, title: 'Projects & Education', label: '4. Projects & Credentials' },
  { id: 5, title: 'Templates & Export', label: '5. Template & Export' },
];

/**
 * Generate personalized mock interview questions grounded strictly in candidate's CV
 * Works offline or when Cloud AI service is unavailable with zero credentials required.
 */
function generateLocalMockQuestions(resume) {
  const targetRole = resume.targetRole?.trim() || 'Software Professional';
  const candidateName = resume.fullName?.trim() || 'Candidate';
  const projects = Array.isArray(resume.projects) ? resume.projects.filter((p) => p.name?.trim()) : [];
  const allSkills = Object.values(resume.skills || {}).flat().filter(Boolean);
  const experience = Array.isArray(resume.experience) ? resume.experience.filter((e) => e.role?.trim() || e.company?.trim()) : [];

  const questions = [];

  // 1. First Project Architecture Question
  if (projects.length > 0) {
    const p1 = projects[0];
    questions.push({
      id: 'local_proj_1',
      category: 'Project Architecture & Decisions',
      grounding: `Project: "${p1.name}" (${p1.tech || 'Core Stack'})`,
      question: `In your project "${p1.name}", can you walk me through the overall technical architecture, why you selected ${p1.tech ? `[${p1.tech}]` : 'that specific tech stack'}, and how you structured data flow?`,
      hint: 'Interviewer evaluates your architectural maturity: Explain component separation, state/data handling, and why this tech stack was the right fit.',
      sampleAnswerGuideline: '1. Give a 30-second elevator pitch of what the project does.\n2. Explain the architectural pattern chosen.\n3. Mention a key technical hurdle and how you overcame it.',
      difficulty: 'Technical Deep-Dive',
    });
  }

  // 2. Second Project or Performance & Scaling Question
  if (projects.length > 1) {
    const p2 = projects[1];
    questions.push({
      id: 'local_proj_2',
      category: 'Performance & Engineering Tradeoffs',
      grounding: `Project: "${p2.name}"`,
      question: `Looking back at "${p2.name}", what was the single most difficult bug or performance bottleneck you encountered during implementation, and how did you diagnose and resolve it?`,
      hint: 'Demonstrate systematic debugging: Mention profiling tools, root cause analysis, and measurable improvements.',
      sampleAnswerGuideline: 'Describe the symptom, how you isolated the root cause, what fix was applied, and how you verified stability.',
      difficulty: 'Problem Solving',
    });
  } else if (projects.length === 1) {
    const p1 = projects[0];
    questions.push({
      id: 'local_proj_perf',
      category: 'Scalability & Tradeoffs',
      grounding: `Project: "${p1.name}"`,
      question: `If 100,000 active users started using "${p1.name}" simultaneously tomorrow, what parts of your implementation would bottleneck first, and how would you re-architect it to scale?`,
      hint: 'Focus on caching, asynchronous processing, payload optimization, and database querying.',
      sampleAnswerGuideline: 'Highlight caching strategies (Redis/CDN), database indexing, debouncing/pagination, and code splitting.',
      difficulty: 'System Design',
    });
  }

  // 3. Technical Skills Deep-Dive
  if (allSkills.length > 0) {
    const primarySkill = allSkills[0];
    const secondarySkill = allSkills.length > 1 ? allSkills[1] : allSkills[0];
    questions.push({
      id: 'local_tech_skills',
      category: 'Core Technology Mastery',
      grounding: `Skills: ${primarySkill}${allSkills.length > 1 ? `, ${secondarySkill}` : ''}`,
      question: `Your CV highlights expertise in ${primarySkill}. How does ${primarySkill} manage state and updates internally, and what best practices do you follow to keep code maintainable and performant?`,
      hint: 'Explain lifecycle management, asynchronous updates, immutability, and clean modular code organization.',
      sampleAnswerGuideline: 'Highlight performance optimizations (memoization, lazy loading), clean design patterns, and testing.',
      difficulty: 'Core Technical',
    });
  } else {
    questions.push({
      id: 'local_tech_general',
      category: 'Core Engineering Fundamentals',
      grounding: `Target Role: ${targetRole}`,
      question: `As a ${targetRole}, how do you evaluate whether to build a feature from scratch versus utilizing an existing third-party library or service?`,
      hint: 'Discuss maintenance burden, bundle size, security audits, and team velocity.',
      sampleAnswerGuideline: 'Weigh development speed vs long-term maintainability, dependency risk, and custom business requirements.',
      difficulty: 'Technical Strategy',
    });
  }

  // 4. Experience & Workplace Delivery
  if (experience.length > 0) {
    const exp = experience[0];
    questions.push({
      id: 'local_exp_1',
      category: 'Workplace Impact & Collaboration',
      grounding: `Experience: ${exp.role} at ${exp.company}`,
      question: `During your time as ${exp.role} at ${exp.company || 'your previous team'}, can you share an example of a project where timelines or requirements shifted abruptly? How did you prioritize deliverables?`,
      hint: 'Use the STAR method: Situation, Task, Action you took, and the quantifiable Result delivered.',
      sampleAnswerGuideline: 'Highlight proactive communication with stakeholders, agile reprioritization, and staying focused on customer value.',
      difficulty: 'STAR Behavioral',
    });
  } else {
    questions.push({
      id: 'local_behavioral_std',
      category: 'STAR Behavioral Scenario',
      grounding: `Target Role: ${targetRole}`,
      question: `Tell me about a time when you received constructive feedback or critique on your code or design during a review. How did you respond, and what did you learn?`,
      hint: 'Show emotional intelligence, receptivity to feedback, collaboration, and continuous improvement.',
      sampleAnswerGuideline: 'Emphasize that code reviews are learning opportunities, separate ego from code, and explain how the project improved.',
      difficulty: 'Behavioral & Culture',
    });
  }

  // 5. Target Role Strategic Alignment
  questions.push({
    id: 'local_role_fit',
    category: 'Role Strategy & Vision',
    grounding: `Target Career: ${targetRole}`,
    question: `What excites you most about stepping into a ${targetRole} role today, and what modern industry trends or tooling are you currently exploring to stay ahead of the curve?`,
    hint: 'Interviewers look for curiosity, proactive learning, and genuine enthusiasm for the craft.',
    sampleAnswerGuideline: 'Mention 1-2 emerging tools or patterns you are passionate about, personal side experiments, and long-term career ambition.',
    difficulty: 'Career Vision',
  });

  return {
    career: targetRole,
    candidateName,
    questions,
  };
}

export const ResumeBuilderPage = () => {
  const { addToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTemplate, setActiveTemplate] = useState(() => {
    return localStorage.getItem('careergenie_active_template') || 'professional-classic';
  });
  const [customAccent, setCustomAccent] = useState(() => {
    return localStorage.getItem('careergenie_custom_accent') || null;
  });
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [polishingSummary, setPolishingSummary] = useState(false);
  const [suggestingSkills, setSuggestingSkills] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [analyzingJD, setAnalyzingJD] = useState(false);
  const [mobileView, setMobileView] = useState('editor'); // 'editor' | 'preview'

  // AI Feature Modals State
  const [bulletModal, setBulletModal] = useState({
    isOpen: false,
    projId: null,
    originalText: '',
    style: 'Action & Impact',
    loading: false,
    options: [],
    selectedOption: '',
    error: null,
  });

  const [atsModal, setAtsModal] = useState({
    isOpen: false,
    loading: false,
    data: null,
    error: null,
  });

  // Optional Practice Mock Interview State
  const [showPostDownloadPrompt, setShowPostDownloadPrompt] = useState(false);
  const [mockInterviewModal, setMockInterviewModal] = useState({
    isOpen: false,
    loading: false,
    questions: [],
    currentIndex: 0,
    userNotes: {},
    showHint: false,
    isCompleted: false,
    error: null,
  });

  // Job Description state for targeting
  const [targetJobDesc, setTargetJobDesc] = useState(() => {
    return localStorage.getItem('careergenie_job_text') || '';
  });

  // Resume State — All fields start empty on page load. Sample details are only loaded on explicit request.
  const [resume, setResume] = useState(() => {
    try {
      const saved = localStorage.getItem('careergenie_profile');
      if (saved) {
        const p = JSON.parse(saved);
        // If saved data was the fictional demo sample (Alex Thomas), ignore and start fresh with empty fields
        if (p.isSample || p.fullName === 'Alex Thomas') {
          return EMPTY_RESUME;
        }
        // If the user entered their own custom details, restore them
        if (p.fullName?.trim() || p.email?.trim() || p.targetRole?.trim()) {
          return {
            ...EMPTY_RESUME,
            ...p,
            skills: p.skills || EMPTY_RESUME.skills,
            experience: p.experience || [],
            projects: p.projects || [],
            certifications: p.certifications || [],
            languages: p.languages || [],
            awards: p.awards || [],
            publications: p.publications || [],
          };
        }
      }
    } catch {}

    return EMPTY_RESUME;
  });

  const [isSampleLoaded, setIsSampleLoaded] = useState(() => Boolean(resume.isSample));

  // Populate all sections with fictional example details on explicit user click
  const handleLoadFullSample = () => {
    setResume(FULL_SAMPLE_RESUME);
    setIsSampleLoaded(true);
    localStorage.setItem('careergenie_profile', JSON.stringify(FULL_SAMPLE_RESUME));
    addToast('✨ Loaded fictional example CV (Alex Thomas). All details can be edited or cleared.', 'success');
  };

  // Clear all fields back to blank canvas
  const handleClearAll = () => {
    setResume(EMPTY_RESUME);
    setIsSampleLoaded(false);
    localStorage.removeItem('careergenie_profile');
    addToast('Cleared all CV fields. Starting fresh with empty fields.', 'info');
  };

  // Check if current resume has any entered content
  const hasContent = Boolean(
    resume.fullName?.trim() ||
      resume.targetRole?.trim() ||
      resume.email?.trim() ||
      resume.phone?.trim() ||
      resume.summary?.trim() ||
      resume.education?.degree?.trim() ||
      (resume.experience && resume.experience.length > 0) ||
      (resume.projects && resume.projects.length > 0) ||
      (resume.certifications && resume.certifications.length > 0) ||
      (resume.languages && resume.languages.length > 0) ||
      (resume.awards && resume.awards.length > 0) ||
      Object.values(resume.skills || {}).flat().length > 0
  );

  // New skill input helper state
  const [newSkillCategory, setNewSkillCategory] = useState('technical');
  const [newSkillText, setNewSkillText] = useState('');

  // Calculate ATS Score & audit metrics
  const calculateATSScore = () => {
    let score = 0;
    const checks = [];

    if (resume.fullName?.trim() && resume.email?.trim() && resume.phone?.trim()) {
      score += 20;
      checks.push({
        name: 'Contact Header',
        title: 'Complete Contact Header (Name, Email, Phone)',
        label: 'Complete Contact Header',
        pass: true,
        passed: true,
        status: 'pass',
        feedback: 'Candidate name, professional email, and phone number are properly formatted.',
        detail: 'Candidate name, professional email, and phone number are properly formatted.',
      });
    } else {
      checks.push({
        name: 'Contact Header',
        title: 'Missing Contact Details',
        label: 'Contact Information Incomplete',
        pass: false,
        passed: false,
        status: 'fail',
        feedback: 'Include full name, email address, and phone number for recruiter outreach.',
        detail: 'Include full name, email address, and phone number for recruiter outreach.',
      });
    }

    if (resume.targetRole?.trim() && resume.targetRole.trim().length > 2) {
      score += 15;
      checks.push({
        name: 'Target Role Alignment',
        title: 'Target Job Title Aligned',
        label: 'Target Job Title Aligned',
        pass: true,
        passed: true,
        status: 'pass',
        feedback: `Target title "${resume.targetRole}" matches standard industry position names.`,
        detail: `Target title "${resume.targetRole}" matches standard industry position names.`,
      });
    } else {
      checks.push({
        name: 'Target Role Alignment',
        title: 'Target Job Title Empty',
        label: 'Target Job Title Empty',
        pass: false,
        passed: false,
        status: 'fail',
        feedback: 'Specify a clear target role (e.g. Frontend Developer, Software Engineer) in the header.',
        detail: 'Specify a clear target role (e.g. Frontend Developer, Software Engineer) in the header.',
      });
    }

    if (resume.summary?.trim() && resume.summary.trim().length >= 70) {
      score += 15;
      checks.push({
        name: 'Professional Summary',
        title: 'Professional Summary (70+ characters)',
        label: 'Professional Summary (70+ characters)',
        pass: true,
        passed: true,
        status: 'pass',
        feedback: 'Summary provides a strong narrative overview of technical focus and background.',
        detail: 'Summary provides a strong narrative overview of technical focus and background.',
      });
    } else {
      checks.push({
        name: 'Professional Summary',
        title: 'Summary Too Brief or Missing',
        label: 'Summary Too Brief or Missing',
        pass: false,
        passed: false,
        status: 'fail',
        feedback: 'Include a 2-3 sentence summary (70+ chars) summarizing your technical specializations.',
        detail: 'Include a 2-3 sentence summary (70+ chars) summarizing your technical specializations.',
      });
    }

    const totalSkills = Object.values(resume.skills || {}).flat().filter(Boolean).length;
    if (totalSkills >= 6) {
      score += 15;
      checks.push({
        name: 'Skills Taxonomy',
        title: `Comprehensive Skill Taxonomy (${totalSkills} skills)`,
        label: `Comprehensive Skill Taxonomy (${totalSkills} skills)`,
        pass: true,
        passed: true,
        status: 'pass',
        feedback: `${totalSkills} categorized skills detected for automated keyword indexing.`,
        detail: `${totalSkills} categorized skills detected for automated keyword indexing.`,
      });
    } else {
      checks.push({
        name: 'Skills Taxonomy',
        title: 'Fewer than 6 Technical Skills',
        label: 'Fewer than 6 Technical Skills',
        pass: false,
        passed: false,
        status: 'fail',
        feedback: `Only ${totalSkills} skill(s) listed. Add at least 6 relevant technical skills to pass ATS keyword thresholds.`,
        detail: `Only ${totalSkills} skill(s) listed. Add at least 6 relevant technical skills to pass ATS keyword thresholds.`,
      });
    }

    if (resume.projects?.length >= 2) {
      score += 15;
      checks.push({
        name: 'Project Entries',
        title: `${resume.projects.length} Engineering Project Entries`,
        label: `${resume.projects.length} Engineering Project Entries`,
        pass: true,
        passed: true,
        status: 'pass',
        feedback: 'Demonstrates practical project implementations with technical tools specified.',
        detail: 'Demonstrates practical project implementations with technical tools specified.',
      });
    } else {
      checks.push({
        name: 'Project Entries',
        title: 'Fewer than 2 Projects Listed',
        label: 'Fewer than 2 Projects Listed',
        pass: false,
        passed: false,
        status: 'fail',
        feedback: 'List at least 2 relevant projects with technologies and descriptions of your work.',
        detail: 'List at least 2 relevant projects with technologies and descriptions of your work.',
      });
    }

    if (resume.experience?.length >= 1) {
      score += 10;
      checks.push({
        name: 'Work Experience',
        title: `${resume.experience.length} Professional Experience Entries`,
        label: `${resume.experience.length} Professional Experience Entries`,
        pass: true,
        passed: true,
        status: 'pass',
        feedback: 'Work history or internships detected with role titles and dates.',
        detail: 'Work history or internships detected with role titles and dates.',
      });
    } else {
      checks.push({
        name: 'Work Experience',
        title: 'No Work Experience Listed',
        label: 'No Work Experience Listed',
        pass: false,
        passed: false,
        status: 'warn',
        feedback: 'Include internships, freelance work, or open-source contributions if available.',
        detail: 'Include internships, freelance work, or open-source contributions if available.',
      });
    }

    if (resume.certifications?.length >= 1) {
      score += 5;
      checks.push({
        name: 'Industry Credentials',
        title: `${resume.certifications.length} Industry Credentials / Certifications`,
        label: `${resume.certifications.length} Industry Credentials`,
        pass: true,
        passed: true,
        status: 'pass',
        feedback: 'Recognized industry credentials strengthen candidate authority.',
        detail: 'Recognized industry credentials strengthen candidate authority.',
      });
    }

    if (resume.education?.degree?.trim()) {
      score += 5;
      checks.push({
        name: 'Education History',
        title: 'Education History Included',
        label: 'Education History Included',
        pass: true,
        passed: true,
        status: 'pass',
        feedback: `${resume.education.degree} at ${resume.education.school || 'University'}.`,
        detail: `${resume.education.degree} at ${resume.education.school || 'University'}.`,
      });
    } else {
      checks.push({
        name: 'Education History',
        title: 'Education Details Incomplete',
        label: 'Education Details Incomplete',
        pass: false,
        passed: false,
        status: 'fail',
        feedback: 'Add your degree, field of study, and institution name.',
        detail: 'Add your degree, field of study, and institution name.',
      });
    }

    return { score: Math.min(Math.max(score, 0), 98), checks };
  };

  const { score: atsScore, checks: atsChecks } = calculateATSScore();

  const generateLocalAtsAudit = (resData, roleTitle) => {
    const { score, checks } = calculateATSScore();
    const roleKeywords = getRoleKeywords(roleTitle);
    const cvText = [
      resData.fullName,
      resData.summary,
      resData.targetRole,
      Object.values(resData.skills || {}).flat().join(' '),
      (resData.projects || []).map((p) => `${p.name} ${p.tech} ${p.desc}`).join(' '),
      (resData.experience || []).map((e) => `${e.role} ${e.company} ${e.desc}`).join(' '),
    ].join(' ').toLowerCase();

    const matchedKeywords = roleKeywords.filter((k) => cvText.includes(k.toLowerCase()));
    const missingKeywords = roleKeywords.filter((k) => !cvText.includes(k.toLowerCase())).slice(0, 6);

    const recommendations = [];
    if (!resData.fullName?.trim() || !resData.email?.trim() || !resData.phone?.trim()) {
      recommendations.push('Complete the contact header with your full name, professional email, and phone number.');
    }
    if (!resData.summary?.trim() || resData.summary.trim().length < 70) {
      recommendations.push('Add an impactful 2-3 sentence professional summary highlighting your key technical strengths.');
    }
    if (Object.values(resData.skills || {}).flat().filter(Boolean).length < 6) {
      recommendations.push('List at least 6-8 core technical skills relevant to your target role.');
    }
    if (!resData.projects || resData.projects.length < 2) {
      recommendations.push('Add at least 2 technical projects with technologies used and quantifiable results.');
    }
    if (missingKeywords.length > 0) {
      recommendations.push(`Incorporate key industry terms like ${missingKeywords.slice(0, 3).join(', ')} in your project or experience descriptions.`);
    }

    let assessment = 'Critical ATS Gaps Detected';
    let summary = 'Your CV currently lacks key sections (contact details, summary, skills, or experience). Complete these fields to improve your ATS score and pass screening algorithms.';
    if (score >= 80) {
      assessment = 'Solid ATS Compliance';
      summary = 'Your CV demonstrates solid ATS compliance across structural formatting, keywords, and core sections.';
    } else if (score >= 50) {
      assessment = 'Moderate ATS Readiness';
      summary = 'Your CV demonstrates foundational ATS compliance, but keyword alignment and section completeness could be improved.';
    }

    return {
      atsScore: score,
      readinessAssessment: assessment,
      summary,
      checks,
      matchedKeywords,
      missingKeywords,
      recommendations,
      disclaimer: 'This ATS readiness score is an automated structural and keyword heuristic. It does not guarantee passing proprietary commercial Applicant Tracking Systems or human recruitment filters.',
    };
  };

  // Project handlers
  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now(),
          name: 'New Project Title',
          tech: 'React, JavaScript, CSS',
          desc: 'Developed modern full-stack features, integrated responsive components, and ensured high accessibility and performance standards.',
        },
      ],
    }));
  };

  const removeProject = (id) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const updateProject = (id, field, val) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: val } : p)),
    }));
  };

  // Experience handlers
  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          id: Date.now(),
          company: 'Tech Solutions Inc.',
          role: 'Software Engineer Intern',
          duration: 'Jun 2024 - Present',
          desc: 'Collaborated with engineering team to develop responsive user interfaces and integrate backend APIs.',
        },
      ],
    }));
  };

  const removeExperience = (id) => {
    setResume((prev) => ({
      ...prev,
      experience: (prev.experience || []).filter((e) => e.id !== id),
    }));
  };

  const updateExperience = (id, field, val) => {
    setResume((prev) => ({
      ...prev,
      experience: (prev.experience || []).map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    }));
  };

  const handleSelectTemplate = (templateId) => {
    setActiveTemplate(templateId);
    try {
      localStorage.setItem('careergenie_active_template', templateId);
    } catch {}
  };

  const handleSelectAccent = (color) => {
    setCustomAccent(color);
    try {
      if (color) {
        localStorage.setItem('careergenie_custom_accent', color);
      } else {
        localStorage.removeItem('careergenie_custom_accent');
      }
    } catch {}
  };

  // Certifications handlers
  const addCertification = () => {
    setResume((prev) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        { id: Date.now(), name: 'Meta Certified Frontend Developer', issuer: 'Meta / Coursera', date: '2024' },
      ],
    }));
  };
  const removeCertification = (id) => {
    setResume((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((c) => c.id !== id),
    }));
  };
  const updateCertification = (id, field, val) => {
    setResume((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).map((c) => (c.id === id ? { ...c, [field]: val } : c)),
    }));
  };

  // Languages handlers
  const addLanguage = () => {
    setResume((prev) => ({
      ...prev,
      languages: [
        ...(prev.languages || []),
        { id: Date.now(), name: 'English', proficiency: 'Fluent / Professional' },
      ],
    }));
  };
  const removeLanguage = (id) => {
    setResume((prev) => ({
      ...prev,
      languages: (prev.languages || []).filter((l) => l.id !== id),
    }));
  };
  const updateLanguage = (id, field, val) => {
    setResume((prev) => ({
      ...prev,
      languages: (prev.languages || []).map((l) => (l.id === id ? { ...l, [field]: val } : l)),
    }));
  };

  // Awards & Publications handlers
  const addAward = () => {
    setResume((prev) => ({
      ...prev,
      awards: [
        ...(prev.awards || []),
        { id: Date.now(), title: "Dean's Honor List", issuer: 'National Institute of Technology', year: '2024' },
      ],
    }));
  };
  const removeAward = (id) => {
    setResume((prev) => ({
      ...prev,
      awards: (prev.awards || []).filter((a) => a.id !== id),
    }));
  };
  const updateAward = (id, field, val) => {
    setResume((prev) => ({
      ...prev,
      awards: (prev.awards || []).map((a) => (a.id === id ? { ...a, [field]: val } : a)),
    }));
  };

  // Open Bullet Rewriter Modal
  const openBulletModal = (projId, currentText) => {
    setBulletModal({
      isOpen: true,
      projId,
      originalText: currentText || '',
      style: 'Action & Impact',
      loading: false,
      options: [],
      selectedOption: '',
      error: null,
    });
  };

  // AI Bullet Point Rewriter
  const handleRewriteBullet = async (styleOverride) => {
    const styleToUse = styleOverride || bulletModal.style;
    if (!bulletModal.originalText.trim()) {
      addToast('Please enter an achievement or project description to rewrite.', 'warning');
      return;
    }

    setBulletModal((prev) => ({ ...prev, loading: true, error: null, style: styleToUse }));
    try {
      const res = await rewriteBulletPoint(bulletModal.originalText, styleToUse, resume.targetRole);
      const options = res?.options || res?.rewrittenOptions || res?.bullets || [];
      if (options.length) {
        setBulletModal((prev) => ({
          ...prev,
          loading: false,
          options,
          selectedOption: options[0]?.text || '',
        }));
        addToast(`✨ Generated ${options.length} high-impact bullet point variations!`, 'success');
      } else {
        throw new Error('AI did not return bullet point suggestions.');
      }
    } catch (err) {
      setBulletModal((prev) => ({ ...prev, loading: false, error: err.message }));
      addToast(`Bullet rewrite error: ${err.message || 'AI service unavailable.'}`, 'error');
    }
  };

  const applyRewrittenBullet = () => {
    if (!bulletModal.selectedOption) return;
    updateProject(bulletModal.projId, 'desc', bulletModal.selectedOption);
    setBulletModal((prev) => ({ ...prev, isOpen: false }));
    addToast('✨ Project description updated with selected AI bullet point!', 'success');
  };

  // AI Summary Generator
  const handleGenerateAISummary = async () => {
    setGeneratingSummary(true);
    try {
      const res = await generateRoleSummary({
        jobTitle: resume.targetRole,
        fullName: resume.fullName,
        education: resume.education,
        experience: resume.experience || [],
        skills: resume.skills,
        personalDetails: {
          location: resume.location,
          bio: resume.summary,
          projects: resume.projects,
        },
      });

      if (res && res.options && res.options[0]?.summary) {
        setResume((r) => ({ ...r, summary: res.options[0].summary }));
        addToast('✨ AI synthesized a tailored summary for your target role!', 'success');
      } else {
        throw new Error('AI did not return a summary option.');
      }
    } catch (err) {
      addToast(`Summary generation error: ${err.message || 'Please verify API key and connection.'}`, 'error');
    } finally {
      setGeneratingSummary(false);
    }
  };

  // AI Polish Grammar & Tone
  const handlePolishSummary = async () => {
    if (!resume.summary || resume.summary.trim().length < 15) {
      addToast('Please enter a draft summary first to polish.', 'warning');
      return;
    }
    setPolishingSummary(true);
    try {
      const res = await improveText({ text: resume.summary, context: 'cv_summary', tone: 'professional' });
      if (res && res.improvedText) {
        setResume((r) => ({ ...r, summary: res.improvedText }));
        addToast('✨ Summary polished with professional tone and grammar!', 'success');
      } else {
        throw new Error('Could not polish summary.');
      }
    } catch (err) {
      addToast(`Polish failed: ${err.message || 'AI service error.'}`, 'error');
    } finally {
      setPolishingSummary(false);
    }
  };

  // AI Skill Suggestions for Target Role
  const handleSuggestSkills = async () => {
    setSuggestingSkills(true);
    try {
      const allCurrentSkills = Object.values(resume.skills || {}).flat();
      const res = await suggestSkillsForRole(resume.targetRole, allCurrentSkills);
      if (res && res.suggestedSkills?.length) {
        setSuggestedSkills(res.suggestedSkills);
        addToast(`✨ AI recommended ${res.suggestedSkills.length} in-demand skills for ${resume.targetRole}!`, 'success');
      } else {
        throw new Error('No skill recommendations returned.');
      }
    } catch (err) {
      addToast(`Skill suggestion error: ${err.message || 'AI service unavailable.'}`, 'error');
    } finally {
      setSuggestingSkills(false);
    }
  };

  // AI ATS Deep Audit
  const handleRunAtsAudit = async () => {
    setAtsModal({ isOpen: true, loading: true, data: null, error: null });
    try {
      const allSkills = Object.values(resume.skills || {}).flat().filter(Boolean);
      const cvText = `
Candidate: ${resume.fullName || 'Not provided'}
Role Target: ${resume.targetRole || 'Not provided'}
Location: ${resume.location || 'Not provided'}
Email: ${resume.email || 'Not provided'}
Phone: ${resume.phone || 'Not provided'}
Professional Summary: ${resume.summary || 'Not provided'}
Skills: ${allSkills.join(', ')}
Education: ${resume.education?.degree ? `${resume.education.degree} at ${resume.education.school} (${resume.education.year})` : 'Not provided'}
Experience: ${(resume.experience || []).map((e) => `${e.role} at ${e.company}: ${e.desc}`).join(' | ') || 'None'}
Projects: ${(resume.projects || []).map((p) => `${p.name} [${p.tech}]: ${p.desc}`).join(' | ') || 'None'}
Certifications: ${(resume.certifications || []).map((c) => `${c.name} (${c.issuer})`).join(', ') || 'None'}
`;

      const targetRoleTitle = resume.targetRole?.trim() || 'Frontend Developer';
      const targetJob = targetJobDesc?.trim() || `Target role: ${targetRoleTitle}`;

      let res = null;
      try {
        res = await auditAtsResume({
          profile: {
            name: resume.fullName || '',
            email: resume.email || '',
            phone: resume.phone || '',
            location: resume.location || '',
            targetRole: targetRoleTitle,
            summary: resume.summary || '',
            linkedin: resume.links?.linkedin || '',
            github: resume.links?.github || '',
          },
          education: resume.education || {},
          skills: resume.skills || {},
          projects: resume.projects || [],
          experience: resume.experience || [],
          certifications: resume.certifications || [],
          targetRole: targetRoleTitle,
          cvText,
          jobText: targetJob,
        });
      } catch (apiErr) {
        console.warn('[ATS Audit] AI API error, falling back to local audit engine:', apiErr.message);
      }

      if (res && Array.isArray(res.checks) && res.checks.length > 0) {
        const roleKeywords = getRoleKeywords(targetRoleTitle);
        const resumeTextLower = cvText.toLowerCase();

        if (!Array.isArray(res.matchedKeywords) || res.matchedKeywords.length === 0) {
          res.matchedKeywords = roleKeywords.filter((k) => resumeTextLower.includes(k.toLowerCase()));
        }
        if (!Array.isArray(res.missingKeywords) || res.missingKeywords.length === 0) {
          res.missingKeywords = roleKeywords.filter((k) => !resumeTextLower.includes(k.toLowerCase())).slice(0, 6);
        }

        setAtsModal({ isOpen: true, loading: false, data: res, error: null });
        addToast('✨ AI ATS Audit complete!', 'success');
      } else {
        const localAudit = generateLocalAtsAudit(resume, targetRoleTitle);
        setAtsModal({ isOpen: true, loading: false, data: localAudit, error: null });
        addToast('✨ ATS Audit complete (Local Analysis Engine)', 'info');
      }
    } catch (err) {
      setAtsModal((prev) => ({ ...prev, loading: false, error: err.message }));
      addToast(`ATS Audit error: ${err.message || 'AI service unavailable.'}`, 'error');
    }
  };

  // Practice a Mock Interview based on CV details
  const handleOpenMockInterview = async () => {
    setMockInterviewModal({
      isOpen: true,
      loading: true,
      questions: [],
      currentIndex: 0,
      userNotes: {},
      showHint: false,
      isCompleted: false,
      error: null,
    });

    try {
      const targetRoleTitle = resume.targetRole?.trim() || 'Software Professional';
      const allSkills = Object.values(resume.skills || {}).flat().filter(Boolean);
      const cvText = `
Candidate: ${resume.fullName || 'Not provided'}
Role Target: ${targetRoleTitle}
Location: ${resume.location || 'Not provided'}
Summary: ${resume.summary || 'Not provided'}
Skills: ${allSkills.join(', ')}
Projects: ${(resume.projects || []).map((p) => `${p.name} [${p.tech}]: ${p.desc}`).join(' | ')}
Experience: ${(resume.experience || []).map((e) => `${e.role} at ${e.company}: ${e.desc}`).join(' | ')}
Education: ${resume.education?.degree ? `${resume.education.degree} at ${resume.education.school}` : ''}
`;

      let fetchedQuestions = [];
      try {
        const res = await generateInterviewQuestions({
          career: targetRoleTitle,
          profile: {
            name: resume.fullName || 'Candidate',
            summary: resume.summary || '',
            location: resume.location || '',
            targetRole: targetRoleTitle,
          },
          projects: resume.projects || [],
          skills: resume.skills || {},
          experience: resume.experience || [],
          education: resume.education || {},
          cvText,
        });

        if (res && Array.isArray(res.questions) && res.questions.length > 0) {
          fetchedQuestions = res.questions;
        }
      } catch (apiErr) {
        console.warn('[Mock Interview] AI generation error, using local tailored generator:', apiErr.message);
      }

      // If AI returned empty list or failed, use smart local CV-grounded generator
      if (!fetchedQuestions || fetchedQuestions.length === 0) {
        const local = generateLocalMockQuestions(resume);
        fetchedQuestions = local.questions;
      }

      setMockInterviewModal((prev) => ({
        ...prev,
        loading: false,
        questions: fetchedQuestions,
        currentIndex: 0,
        error: null,
      }));
      addToast(`🎯 Generated ${fetchedQuestions.length} tailored interview questions!`, 'success');
    } catch (err) {
      console.warn('Mock interview AI generation error, using tailored fallback:', err);
      const local = generateLocalMockQuestions(resume);
      setMockInterviewModal((prev) => ({
        ...prev,
        loading: false,
        questions: local.questions,
        currentIndex: 0,
        error: null,
      }));
    }
  };

  // AI Keyword extraction from target Job Description
  const handleExtractJobKeywords = async () => {
    if (!targetJobDesc.trim() || targetJobDesc.trim().length < 20) {
      addToast('Please enter or paste a target Job Description first.', 'warning');
      return;
    }

    setAnalyzingJD(true);
    try {
      const res = await callAI('career_match', {
        jobText: targetJobDesc,
        targetCareer: resume.targetRole,
        skills: resume.skills,
        projects: resume.projects,
      });

      if (res && res.missingKeywords?.length) {
        // Add extracted missing keywords to technical skills
        const newKeywords = res.missingKeywords.slice(0, 4);
        setResume((prev) => {
          const currentTech = prev.skills?.technical || [];
          const updated = [...new Set([...currentTech, ...newKeywords])];
          return {
            ...prev,
            skills: {
              ...prev.skills,
              technical: updated,
            },
          };
        });
        addToast(`✨ Added ${newKeywords.length} missing keywords from the job posting to your skills!`, 'success');
      } else {
        addToast('Target job description analyzed. Keywords match well!', 'success');
      }
    } catch {
      addToast('Analyzed job description.', 'info');
    } finally {
      setAnalyzingJD(false);
    }
  };

  // Add custom skill to category
  const handleAddSkill = (e) => {
    e?.preventDefault();
    if (!newSkillText.trim()) return;

    setResume((prev) => {
      const list = prev.skills?.[newSkillCategory] || [];
      if (list.includes(newSkillText.trim())) return prev;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [newSkillCategory]: [...list, newSkillText.trim()],
        },
      };
    });
    setNewSkillText('');
    addToast('Skill added!', 'success');
  };

  const handleRemoveSkill = (category, skill) => {
    setResume((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: (prev.skills?.[category] || []).filter((s) => s !== skill),
      },
    }));
  };

  // Save Resume to LocalStorage & Profile
  const handleSaveResume = () => {
    localStorage.setItem('careergenie_profile', JSON.stringify(resume));
    localStorage.setItem('careergenie_job_text', targetJobDesc);
    localStorage.setItem('careergenie_active_template', activeTemplateObj.id);
    if (customAccent) {
      localStorage.setItem('careergenie_custom_accent', customAccent);
    } else {
      localStorage.removeItem('careergenie_custom_accent');
    }
    addToast('Resume draft and target job saved to browser storage!', 'success');
    setShowPostDownloadPrompt(true);
  };

  const [isPrinting, setIsPrinting] = useState(false);

  // Isolated Clean Print Implementation — Prints ONLY the CV document
  const handlePrint = () => {
    if (isPrinting) return; // Prevent duplicate print dialogs
    setIsPrinting(true);

    // If viewing editor on small screen, activate preview so CV DOM node is rendered
    if (mobileView === 'editor') {
      setMobileView('preview');
    }

    addToast('Opening print dialog — Select "Save as PDF" to download your clean CV.', 'info');

    // Set document title to format default PDF file name cleanly (e.g. Alex_Thomas_CV.pdf)
    const prevDocTitle = document.title;
    const sanitizedName = (resume.fullName || 'Career_Genie').trim().replace(/[^a-zA-Z0-9_\s-]/g, '').replace(/\s+/g, '_');
    document.title = `${sanitizedName}_CV`;

    // Attach isolation class and enforce light color-scheme to prevent dark margin borders
    document.documentElement.classList.add('printing-cv');
    document.body.classList.add('printing-cv');
    const prevTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.colorScheme = 'light';
    document.body.style.colorScheme = 'light';

    const cleanupPrint = () => {
      document.title = prevDocTitle;
      document.documentElement.classList.remove('printing-cv');
      document.body.classList.remove('printing-cv');
      if (prevTheme) {
        document.documentElement.setAttribute('data-theme', prevTheme);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      document.documentElement.style.colorScheme = '';
      document.body.style.colorScheme = '';
      setIsPrinting(false);
      window.removeEventListener('afterprint', cleanupPrint);
      setShowPostDownloadPrompt(true);
    };

    window.addEventListener('afterprint', cleanupPrint);

    // Allow framework rendering updates to complete before invoking browser print dialog
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.error('Print error:', err);
        addToast('Download error: Could not open browser PDF dialog. Please try again.', 'error');
      } finally {
        // Fallback cleanup if browser does not fire afterprint
        setTimeout(cleanupPrint, 1800);
      }
    }, 250);
  };

  const activeTemplateObj = getTemplateById(activeTemplate);
  const effectiveAccent = customAccent || activeTemplateObj.accent;

  return (
    <div
      className="builder-page-container"
      style={
        isPrinting
          ? { display: 'block', width: '100%', maxWidth: '100%', margin: 0, padding: 0 }
          : {
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              maxWidth: '1600px',
              margin: '0 auto',
              padding: '2rem 1.5rem 4rem',
              width: '100%',
            }
      }
    >
      {/* Header Banner - Hidden in Print */}
      <Card
        className="glass-panel no-print builder-header-banner"
        glow
        style={{
          padding: '1.75rem 2rem',
          border: '1px solid var(--border-color)',
          background: 'var(--banner-bg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
              <Badge variant="primary" icon={FileText}>Free AI CV Maker</Badge>
              <Badge variant="emerald">ATS Score: {atsScore}%</Badge>
              <Badge variant="cyan">Step {currentStep} of 5</Badge>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Direct CV Maker <span className="gradient-text">&amp; Real-Time Live Preview</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px', maxWidth: '700px' }}>
              Fill in your details step-by-step on the left while watching your CV format in real-time on the right. 100% free — no account required.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="outline" icon={SearchCheck} size="sm" onClick={handleRunAtsAudit}>
              ✨ ATS Audit
            </Button>
            <Button variant="outline" icon={Target} size="sm" onClick={handleOpenMockInterview}>
              🎯 Mock Interview
            </Button>
            <Button variant="secondary" icon={Save} size="sm" onClick={handleSaveResume}>
              Save Draft
            </Button>
            <Button variant="primary" icon={Download} size="sm" onClick={handlePrint} disabled={isPrinting}>
              Download CV
            </Button>
          </div>
        </div>
      </Card>

      {/* Mobile Toggle Bar - Hidden in Print */}
      <div className="builder-mobile-toggle no-print" style={{ display: 'none' }}>
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-surface-elevated)',
            padding: '4px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            width: '100%',
          }}
        >
          <button
            type="button"
            onClick={() => setMobileView('editor')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: mobileView === 'editor' ? 'var(--primary-600)' : 'transparent',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            ✏️ Edit Step {currentStep}
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: mobileView === 'preview' ? 'var(--primary-600)' : 'transparent',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            👁️ Live Preview ({activeTemplateObj.name})
          </button>
        </div>
      </div>

      {/* Main Split-Screen Container */}
      <div
        className="builder-split-container"
        style={
          isPrinting
            ? { display: 'block', width: '100%', margin: 0, padding: 0 }
            : {
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
                gap: '2rem',
                alignItems: 'start',
              }
        }
      >
        {/* ========================================================
            LEFT COLUMN: STEP-BY-STEP GUIDED FORM (HIDDEN IN PRINT)
           ======================================================== */}
        <div
          className={`builder-left-col no-print ${mobileView === 'preview' ? 'mobile-hidden' : ''}`}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Stepper Progress Navigation */}
          <Card style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {STEPS.find((s) => s.id === currentStep)?.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Step {currentStep} of {STEPS.length}
              </span>
            </div>

            <ProgressBar value={(currentStep / STEPS.length) * 100} max={100} color="primary" />

            {/* Step Pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '6px',
                marginTop: '1rem',
              }}
            >
              {STEPS.map((s) => {
                const isActive = currentStep === s.id;
                const isPassed = currentStep > s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentStep(s.id)}
                    style={{
                      background: isActive
                        ? 'rgba(99, 102, 241, 0.2)'
                        : isPassed
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'var(--bg-surface-elevated)',
                      border: isActive
                        ? '1px solid var(--primary-500)'
                        : isPassed
                        ? '1px solid rgba(16, 185, 129, 0.4)'
                        : '1px solid var(--border-color)',
                      color: isActive ? 'var(--primary-400)' : isPassed ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      padding: '8px 4px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <span>{isPassed ? '✓ ' + s.title : s.title}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Fictional Sample Active Notice Banner */}
          {isSampleLoaded && (
            <div
              className="no-print"
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
                <Badge variant="amber" size="sm">Fictional Demo Data</Badge>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                  Sample details (Alex Thomas) are loaded for preview.
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  All information is fictional. You can freely edit any field or clear to start fresh.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={RotateCcw}
                onClick={handleClearAll}
              >
                Clear all
              </Button>
            </div>
          )}

          {/* STEP 1: Personal & Contact Information */}
          {currentStep === 1 && (
            <Card style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <User size={20} style={{ color: 'var(--primary-400)' }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Step 1: Personal &amp; Contact Details</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Enter your professional identity and reachable contact channels.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <Input
                  label="Full Legal Name"
                  placeholder="e.g. Alex Thomas"
                  value={resume.fullName}
                  onChange={(e) => setResume((r) => ({ ...r, fullName: e.target.value }))}
                />
                <Input
                  label="Target Job Title"
                  placeholder="e.g. Frontend Developer"
                  value={resume.targetRole}
                  onChange={(e) => setResume((r) => ({ ...r, targetRole: e.target.value }))}
                />
                <Input
                  label="Email Address"
                  placeholder="e.g. alex@example.com"
                  value={resume.email}
                  onChange={(e) => setResume((r) => ({ ...r, email: e.target.value }))}
                />
                <Input
                  label="Phone Number"
                  placeholder="e.g. +91 98765 43210"
                  value={resume.phone}
                  onChange={(e) => setResume((r) => ({ ...r, phone: e.target.value }))}
                />
                <Input
                  label="Location (City, Country)"
                  placeholder="e.g. Bangalore, India"
                  value={resume.location}
                  onChange={(e) => setResume((r) => ({ ...r, location: e.target.value }))}
                />
                <Input
                  label="LinkedIn Profile"
                  placeholder="e.g. linkedin.com/in/alexthomas"
                  value={resume.linkedin}
                  onChange={(e) => setResume((r) => ({ ...r, linkedin: e.target.value }))}
                />
                <Input
                  label="GitHub / Portfolio Link"
                  placeholder="e.g. github.com/alexthomas"
                  value={resume.github}
                  onChange={(e) => setResume((r) => ({ ...r, github: e.target.value }))}
                />
              </div>

              {/* Bottom Step Navigation */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <Button variant="primary" icon={ArrowRight} onClick={() => setCurrentStep(2)}>
                  Next: Target Job &amp; JD &rarr;
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 2: Target Job & Description */}
          {currentStep === 2 && (
            <Card style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <Briefcase size={20} style={{ color: 'var(--accent-cyan)' }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Step 2: Target Job &amp; Requirements</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Paste the job description of the position you are applying for. Career Genie uses this to tailor your summary and extract high-scoring ATS keywords.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <Input
                  label="Target Job Role Title"
                  value={resume.targetRole}
                  onChange={(e) => setResume((r) => ({ ...r, targetRole: e.target.value }))}
                />

                <FormField label="Target Job Description / Recruiter Posting">
                  <textarea
                    className="form-textarea"
                    rows={6}
                    style={{ width: '100%', fontSize: '0.88rem', lineHeight: 1.5, padding: '0.85rem' }}
                    placeholder="Paste job posting text here (e.g., We are looking for a Frontend Engineer with React, TypeScript, responsive CSS...)"
                    value={targetJobDesc}
                    onChange={(e) => setTargetJobDesc(e.target.value)}
                  />
                </FormField>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <Button
                    variant="outline"
                    icon={Wand2}
                    size="sm"
                    onClick={handleExtractJobKeywords}
                    disabled={analyzingJD}
                  >
                    {analyzingJD ? 'Analyzing Job Keywords...' : '✨ AI Extract & Add Job Keywords'}
                  </Button>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Extracts required technical competencies automatically.
                  </span>
                </div>
              </div>

              {/* Bottom Step Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <Button variant="secondary" icon={ArrowLeft} onClick={() => setCurrentStep(1)}>
                  Back: Personal Info
                </Button>
                <Button variant="primary" icon={ArrowRight} onClick={() => setCurrentStep(3)}>
                  Next: Summary &amp; Skills &rarr;
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 3: Summary & Skills */}
          {currentStep === 3 && (
            <Card style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <Sparkles size={20} style={{ color: 'var(--accent-purple)' }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Step 3: Professional Summary &amp; Skills</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Generate an AI executive summary tailored to your target job, and manage your skill categories.
              </p>

              {/* Summary Generator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Professional Summary (2-3 Sentences)
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Wand2}
                      onClick={handlePolishSummary}
                      disabled={polishingSummary}
                    >
                      {polishingSummary ? 'Polishing...' : '✨ Polish Tone & Grammar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Sparkles}
                      onClick={handleGenerateAISummary}
                      disabled={generatingSummary}
                    >
                      {generatingSummary ? 'Synthesizing...' : '✨ AI Generate'}
                    </Button>
                  </div>
                </div>

                <textarea
                  className="form-textarea"
                  rows={4}
                  style={{ width: '100%', fontSize: '0.88rem', lineHeight: 1.6, padding: '0.85rem' }}
                  value={resume.summary}
                  onChange={(e) => setResume((r) => ({ ...r, summary: e.target.value }))}
                />
              </div>

              {/* Technical Skills Taxonomy */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Code2 size={18} /> Manage Skills by Category
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Sparkles}
                    onClick={handleSuggestSkills}
                    disabled={suggestingSkills}
                  >
                    {suggestingSkills ? 'Recommending...' : `✨ AI Suggest Skills for ${resume.targetRole}`}
                  </Button>
                </div>

                {suggestedSkills.length > 0 && (
                  <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--primary-500)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-400)', marginBottom: '8px' }}>
                      ✨ AI Recommended In-Demand Skills (Click to add to your profile):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {suggestedSkills.map((sk, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setResume((prev) => {
                              const currentTech = prev.skills?.technical || [];
                              if (currentTech.includes(sk)) return prev;
                              return {
                                ...prev,
                                skills: {
                                  ...prev.skills,
                                  technical: [...currentTech, sk],
                                },
                              };
                            });
                            setSuggestedSkills((prev) => prev.filter((s) => s !== sk));
                            addToast(`Added "${sk}" to technical skills!`, 'success');
                          }}
                          style={{
                            background: 'var(--bg-surface-elevated)',
                            border: '1px solid var(--primary-500)',
                            color: 'var(--text-main)',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Plus size={12} style={{ color: 'var(--primary-400)' }} /> {sk}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add new skill inline */}
                <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <select
                    className="form-select"
                    style={{ width: '160px', padding: '8px', fontSize: '0.85rem' }}
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                  >
                    <option value="languages">Languages</option>
                    <option value="frameworks">Frameworks</option>
                    <option value="technical">Technical</option>
                    <option value="tools">Tools</option>
                  </select>
                  <input
                    type="text"
                    className="form-input"
                    style={{ flex: 1, minWidth: '180px', padding: '8px 12px', fontSize: '0.85rem' }}
                    placeholder="Enter skill name (e.g. Next.js, Redux, Docker)..."
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                  />
                  <Button variant="secondary" size="sm" type="submit" icon={Plus}>
                    Add Skill
                  </Button>
                </form>

                {/* Skills tags list */}
                {['languages', 'frameworks', 'technical', 'tools'].map((catKey) => {
                  const skillsList = resume.skills?.[catKey] || [];
                  const labelMap = {
                    languages: 'Programming Languages',
                    frameworks: 'Frameworks & Libraries',
                    technical: 'Technical Concepts',
                    tools: 'Tools & DevOps',
                  };
                  return (
                    <div key={catKey} style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        {labelMap[catKey]} ({skillsList.length})
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {skillsList.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: 'rgba(99, 102, 241, 0.12)',
                              color: 'var(--text-main)',
                              border: '1px solid rgba(99, 102, 241, 0.25)',
                              padding: '3px 8px',
                              borderRadius: '9999px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                            }}
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(catKey, skill)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, fontSize: '0.8rem', lineHeight: 1 }}
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Step Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <Button variant="secondary" icon={ArrowLeft} onClick={() => setCurrentStep(2)}>
                  Back: Job &amp; JD
                </Button>
                <Button variant="primary" icon={ArrowRight} onClick={() => setCurrentStep(4)}>
                  Next: Projects &amp; Education &rarr;
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 4: Projects & Education */}
          {currentStep === 4 && (
            <Card style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <GraduationCap size={20} style={{ color: 'var(--accent-emerald)' }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Step 4: Projects &amp; Education</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Highlight your engineering projects with measurable achievements, and verify your educational credentials.
              </p>

              {/* Education Inputs */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Degree &amp; College</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <Input
                    label="Degree Name"
                    value={resume.education?.degree || ''}
                    onChange={(e) =>
                      setResume((r) => ({ ...r, education: { ...r.education, degree: e.target.value } }))
                    }
                  />
                  <Input
                    label="College / University"
                    value={resume.education?.college || ''}
                    onChange={(e) =>
                      setResume((r) => ({ ...r, education: { ...r.education, college: e.target.value } }))
                    }
                  />
                  <Input
                    label="Graduation Year"
                    value={resume.education?.graduationYear || ''}
                    onChange={(e) =>
                      setResume((r) => ({ ...r, education: { ...r.education, graduationYear: e.target.value } }))
                    }
                  />
                  <Input
                    label="CGPA / Grade"
                    value={resume.education?.cgpa || ''}
                    onChange={(e) =>
                      setResume((r) => ({ ...r, education: { ...r.education, cgpa: e.target.value } }))
                    }
                  />
                </div>
              </div>

              {/* Work Experience Section */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Work Experience &amp; Internships ({resume.experience?.length || 0})</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Optional for freshers. Highlights professional contributions and full-time or intern roles.
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" icon={Plus} onClick={addExperience}>
                    Add Experience
                  </Button>
                </div>

                {resume.experience && resume.experience.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {resume.experience.map((exp) => (
                      <div
                        key={exp.id}
                        style={{
                          padding: '1rem',
                          background: 'rgba(0, 0, 0, 0.15)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>Experience Entry</span>
                          <button
                            type="button"
                            onClick={() => removeExperience(exp.id)}
                            style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                          <Input
                            label="Role / Title"
                            value={exp.role || ''}
                            onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                            placeholder="e.g. Software Engineer Intern"
                          />
                          <Input
                            label="Company / Organization"
                            value={exp.company || ''}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="e.g. Microsoft or Startup Inc."
                          />
                          <Input
                            label="Duration / Dates"
                            value={exp.duration || ''}
                            onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                            placeholder="e.g. Jun 2024 - Aug 2024"
                          />
                        </div>
                        <FormField label="Responsibilities & Key Achievements">
                          <textarea
                            className="form-textarea"
                            rows={2}
                            style={{ width: '100%', fontSize: '0.85rem', lineHeight: 1.5, padding: '0.65rem' }}
                            value={exp.desc || ''}
                            onChange={(e) => updateExperience(exp.id, 'desc', e.target.value)}
                            placeholder="Describe your technical contributions and impact..."
                          />
                        </FormField>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0', fontStyle: 'italic' }}>
                    No work experience added yet. Click &quot;Add Experience&quot; if you have intern or employment history.
                  </div>
                )}
              </div>

              {/* Projects List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Portfolio Projects ({resume.projects?.length || 0})</h3>
                  <Button variant="secondary" size="sm" icon={Plus} onClick={addProject}>
                    Add Project
                  </Button>
                </div>

                {resume.projects?.map((proj) => (
                  <div
                    key={proj.id}
                    style={{
                      padding: '1.25rem',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Project Entry</span>
                      <button
                        type="button"
                        onClick={() => removeProject(proj.id)}
                        style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                      <Input
                        label="Project Title"
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                      />
                      <Input
                        label="Tech Stack"
                        value={proj.tech}
                        onChange={(e) => updateProject(proj.id, 'tech', e.target.value)}
                      />
                    </div>

                    <FormField label="Description & Quantified Achievements">
                      <textarea
                        className="form-textarea"
                        rows={3}
                        style={{ width: '100%', fontSize: '0.85rem', lineHeight: 1.5, padding: '0.75rem' }}
                        value={proj.desc}
                        onChange={(e) => updateProject(proj.id, 'desc', e.target.value)}
                      />
                    </FormField>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={Wand2}
                      onClick={() => openBulletModal(proj.id, proj.desc)}
                      style={{ alignSelf: 'flex-start' }}
                    >
                      ✨ AI Rewrite Bullet Point (Options)
                    </Button>
                  </div>
                ))}
              </div>

              {/* Certifications Section */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Certifications ({resume.certifications?.length || 0})</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Industry credentials, cloud certifications, or specialized courses.
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" icon={Plus} onClick={addCertification}>
                    Add Certification
                  </Button>
                </div>
                {resume.certifications && resume.certifications.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {resume.certifications.map((cert) => (
                      <div key={cert.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr)) 40px', gap: '8px', alignItems: 'flex-end', background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                        <Input
                          label="Certification Name"
                          value={cert.name || ''}
                          onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                          placeholder="e.g. AWS Certified Developer"
                        />
                        <Input
                          label="Issuing Organization"
                          value={cert.issuer || ''}
                          onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                          placeholder="e.g. Amazon Web Services"
                        />
                        <Input
                          label="Date / Year"
                          value={cert.date || ''}
                          onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                          placeholder="e.g. 2024"
                        />
                        <button
                          type="button"
                          onClick={() => removeCertification(cert.id)}
                          style={{ height: '38px', background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Remove certification"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem 0', fontStyle: 'italic' }}>
                    No certifications added. Click &quot;Add Certification&quot; to include credentials.
                  </div>
                )}
              </div>

              {/* Languages Section */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Languages ({resume.languages?.length || 0})</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Spoken and written languages with proficiency level.
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" icon={Plus} onClick={addLanguage}>
                    Add Language
                  </Button>
                </div>
                {resume.languages && resume.languages.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {resume.languages.map((lang) => (
                      <div key={lang.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '8px', alignItems: 'flex-end', background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                        <Input
                          label="Language"
                          value={lang.name || ''}
                          onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                          placeholder="e.g. English, French, Spanish"
                        />
                        <Input
                          label="Proficiency Level"
                          value={lang.proficiency || ''}
                          onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                          placeholder="e.g. Native, Fluent, Intermediate"
                        />
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang.id)}
                          style={{ height: '38px', background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Remove language"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem 0', fontStyle: 'italic' }}>
                    No languages added. Click &quot;Add Language&quot; to include spoken languages.
                  </div>
                )}
              </div>

              {/* Honors & Awards Section */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Honors, Awards &amp; Publications ({resume.awards?.length || 0})</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Scholarships, hackathon wins, dean&apos;s honors, or research publications.
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" icon={Plus} onClick={addAward}>
                    Add Award / Paper
                  </Button>
                </div>
                {resume.awards && resume.awards.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {resume.awards.map((award) => (
                      <div key={award.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr)) 40px', gap: '8px', alignItems: 'flex-end', background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                        <Input
                          label="Title / Award / Paper"
                          value={award.title || ''}
                          onChange={(e) => updateAward(award.id, 'title', e.target.value)}
                          placeholder="e.g. 1st Place National Hackathon"
                        />
                        <Input
                          label="Issuer / Organization"
                          value={award.issuer || ''}
                          onChange={(e) => updateAward(award.id, 'issuer', e.target.value)}
                          placeholder="e.g. IEEE / University"
                        />
                        <Input
                          label="Year / Date"
                          value={award.year || ''}
                          onChange={(e) => updateAward(award.id, 'year', e.target.value)}
                          placeholder="e.g. 2024"
                        />
                        <button
                          type="button"
                          onClick={() => removeAward(award.id)}
                          style={{ height: '38px', background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Remove award"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem 0', fontStyle: 'italic' }}>
                    No awards added. Click &quot;Add Award / Paper&quot; to add accomplishments.
                  </div>
                )}
              </div>

              {/* Bottom Step Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <Button variant="secondary" icon={ArrowLeft} onClick={() => setCurrentStep(3)}>
                  Back: Summary &amp; Skills
                </Button>
                <Button variant="primary" icon={ArrowRight} onClick={() => setCurrentStep(5)}>
                  Next: Templates &amp; Export &rarr;
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 5: Template Selection & Export */}
          {currentStep === 5 && (
            <Card style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <Layers size={20} style={{ color: 'var(--accent-amber)' }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Step 5: Layout Template &amp; PDF Export</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Select from 8 professionally architected, structurally distinct layouts. Each template controls its own HTML structure, column hierarchy, typography, and section flow.
              </p>

              {/* Template Picker with Wireframe Previews */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '1.75rem' }}>
                {TEMPLATE_REGISTRY.map((tmpl) => {
                  const isSelected = activeTemplateObj.id === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      id={`template-btn-${tmpl.id}`}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      style={{
                        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-surface-elevated)',
                        border: isSelected ? '2px solid var(--primary-500)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg, 12px)',
                        padding: '12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        boxShadow: isSelected ? '0 0 0 1px var(--primary-500), 0 8px 20px -4px rgba(99, 102, 241, 0.25)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', background: '#f1f5f9', borderRadius: '6px', padding: '10px 0' }}>
                        {tmpl.renderThumbnail ? tmpl.renderThumbnail(isSelected) : null}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.88rem', color: isSelected ? 'var(--primary-300)' : 'var(--text-main)' }}>
                            {tmpl.name}
                          </span>
                          {isSelected && (
                            <span style={{ background: 'var(--primary-500)', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 5px', borderRadius: '4px' }}>
                              SELECTED
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--primary-400)', fontWeight: 600, marginBottom: '4px' }}>
                          {tmpl.category}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                          {tmpl.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Accent Color Customization Panel (Separate from template selection) */}
              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Palette size={18} style={{ color: effectiveAccent }} />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Accent Color Customization</span>
                  </div>
                  {customAccent && (
                    <button
                      type="button"
                      onClick={() => handleSelectAccent(null)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      Reset to Template Default ({activeTemplateObj.accent})
                    </button>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  Customize your accent color independently of the template layout. The accent color applies to headings, dividers, and key focal points across any template.
                </div>
                {/* Presets and custom picker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {COLOR_PRESETS.map((color) => {
                    const isPicked = effectiveAccent.toLowerCase() === color.hex.toLowerCase();
                    return (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => handleSelectAccent(color.hex)}
                        title={color.name}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: color.hex,
                          border: isPicked ? '3px solid #fff' : '2px solid transparent',
                          boxShadow: isPicked ? '0 0 0 2px var(--primary-500), 0 2px 8px rgba(0,0,0,0.25)' : '0 1px 3px rgba(0,0,0,0.15)',
                          cursor: 'pointer',
                          transition: 'transform 0.15s ease',
                          transform: isPicked ? 'scale(1.15)' : 'scale(1)',
                        }}
                      />
                    );
                  })}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Custom:</label>
                    <input
                      type="color"
                      aria-label="Custom accent color picker"
                      value={effectiveAccent}
                      onChange={(e) => handleSelectAccent(e.target.value)}
                      style={{
                        width: '32px',
                        height: '28px',
                        padding: 0,
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: 'none',
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {effectiveAccent}
                    </span>
                  </div>
                </div>
              </div>

              {/* ATS Audit Score Checklist */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>ATS Parser Compatibility</span>
                  </div>
                  <Badge variant="emerald">{atsScore}% Ready</Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {atsChecks.map((chk, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                      {chk.pass ? (
                        <Check size={14} style={{ color: 'var(--accent-emerald)' }} />
                      ) : (
                        <AlertCircle size={14} style={{ color: 'var(--accent-amber)' }} />
                      )}
                      <span style={{ color: chk.pass ? 'var(--text-main)' : 'var(--text-muted)' }}>{chk.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ATS Deep Audit */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.75rem' }}>
                <Button
                  variant="outline"
                  icon={SearchCheck}
                  size="md"
                  onClick={handleRunAtsAudit}
                  style={{ width: '100%' }}
                >
                  ✨ Run Full AI ATS Deep Audit against Target Role
                </Button>

                {/* Optional Practice a Mock Interview Action Card */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Target size={18} style={{ color: 'var(--accent-emerald)' }} />
                      Practice a Mock Interview (Optional)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                      Practice with technical, architectural, and behavioral questions tailored directly to your CV projects and skills.
                    </div>
                  </div>
                  <Button variant="outline" size="sm" icon={Target} onClick={handleOpenMockInterview}>
                    🎯 Practice Mock Interview
                  </Button>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <Button variant="primary" icon={Download} size="lg" onClick={handlePrint} disabled={isPrinting} style={{ flex: 1 }}>
                  Download CV (PDF)
                </Button>
                <Button variant="secondary" icon={Save} size="lg" onClick={handleSaveResume}>
                  Save Draft to Browser
                </Button>
              </div>

              {/* Bottom Step Navigation */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1.5rem' }}>
                <Button variant="secondary" icon={ArrowLeft} onClick={() => setCurrentStep(4)}>
                  Back: Projects &amp; Education
                </Button>
              </div>
            </Card>
          )}

          {/* ========================================================
              BOTTOM OF FORM: SEPARATE "TRY A SAMPLE" HELPER CARD
             ======================================================== */}
          <Card
            className="no-print"
            style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} style={{ color: 'var(--primary-400)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                  Need inspiration or want to test a layout?
                </span>
                <Badge variant="outline" size="sm">Fictional Demo</Badge>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '520px' }}>
                Click &quot;Try a sample&quot; to populate fictional demonstration details. You can freely edit any field or clear everything at any time.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Button
                id="btn-try-sample"
                variant="secondary"
                size="md"
                icon={Sparkles}
                onClick={handleLoadFullSample}
              >
                Try a sample
              </Button>
              {hasContent && (
                <Button
                  id="btn-clear-all"
                  variant="ghost"
                  size="md"
                  icon={RotateCcw}
                  onClick={handleClearAll}
                  style={{ color: 'var(--text-muted)' }}
                  title="Clear all fields back to blank"
                >
                  Clear all
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* ========================================================
            RIGHT COLUMN: STICKY REAL-TIME LIVE PREVIEW
           ======================================================== */}
        <div
          className={`builder-right-col ${mobileView === 'editor' && !isPrinting ? 'mobile-hidden' : ''}`}
          style={
            isPrinting
              ? { display: 'block', width: '100%', maxWidth: '100%', margin: 0, padding: 0, position: 'static' }
              : {
                  position: 'sticky',
                  top: '85px',
                  height: 'calc(100vh - 105px)',
                  maxHeight: 'calc(100vh - 105px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  minHeight: 0,
                }
          }
        >
          {/* Preview Toolbar - Hidden in Print */}
          <Card
            className="no-print builder-preview-toolbar"
            style={{
              padding: '0.75rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              flexShrink: 0,
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: effectiveAccent }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Live Layout: <span style={{ color: effectiveAccent }}>{activeTemplateObj.name}</span>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                id="preview-quick-template-select"
                aria-label="Quick template switcher"
                value={activeTemplateObj.id}
                onChange={(e) => handleSelectTemplate(e.target.value)}
                style={{
                  padding: '4px 8px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface-elevated)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                }}
              >
                {TEMPLATE_REGISTRY.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <input
                type="color"
                aria-label="Quick accent color picker"
                value={effectiveAccent}
                onChange={(e) => handleSelectAccent(e.target.value)}
                style={{
                  width: '26px',
                  height: '26px',
                  padding: 0,
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  background: 'none',
                }}
                title="Change accent color"
              />
              <Badge variant="cyan" size="sm">A4 Portrait</Badge>
              {isSampleLoaded && (
                <Badge variant="amber" size="sm" icon={Sparkles} title="Currently previewing fictional demo details">
                  Fictional Demo
                </Badge>
              )}
              {hasContent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}
                  title="Clear all fields back to blank"
                >
                  Clear all
                </Button>
              )}
              <Button variant="primary" icon={Download} size="sm" onClick={handlePrint} disabled={isPrinting}>
                Download CV
              </Button>
            </div>
          </Card>

          {/* Post-Download / Post-Creation Practice Mock Interview Prompt Banner (Optional) */}
          {showPostDownloadPrompt && (
            <div
              className="no-print"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.35rem' }}>🎉</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    CV successfully created! Ready for the next step?
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Practice a mock interview with questions tailored directly to your CV skills and projects.
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Target}
                  onClick={() => {
                    setShowPostDownloadPrompt(false);
                    handleOpenMockInterview();
                  }}
                >
                  🎯 Practice Mock Interview
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPostDownloadPrompt(false)}
                  style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* Document Viewer Workspace — Neutral Grey #F3F4F6 surrounds the pristine white A4 sheet */}
          <div
            className="cv-preview-viewer"
            style={
              isPrinting
                ? {
                    display: 'block',
                    width: '100%',
                    maxWidth: '100%',
                    margin: 0,
                    padding: 0,
                    background: '#ffffff',
                    border: 'none',
                    boxShadow: 'none',
                  }
                : {
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    overflowX: 'auto',
                    background: '#F3F4F6',
                    borderRadius: '8px',
                    padding: '24px 16px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    border: '1px solid #e2e8f0',
                    boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.05)',
                    width: '100%',
                    boxSizing: 'border-box',
                  }
            }
          >
            {/* Dynamic Template Component with Print Isolation */}
            <TemplateRenderer
              templateId={activeTemplateObj.id}
              resume={resume}
              accentColor={effectiveAccent}
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          MODAL 1: AI BULLET POINT REWRITER
         ======================================================== */}
      {bulletModal.isOpen && (
        <div
          className="no-print"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: 'var(--bg-surface-elevated, #1e293b)',
              border: '1px solid var(--border-color, #334155)',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-color, #334155)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '6px', borderRadius: '8px' }}>
                  <Wand2 size={20} style={{ color: 'var(--primary-400, #818cf8)' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>✨ AI Bullet Point Rewriter</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Rewrites with strong action verbs and measurable metrics without fabricating qualifications.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBulletModal((prev) => ({ ...prev, isOpen: false }))}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Current Project Description / Bullet Point
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  style={{ width: '100%', marginTop: '4px', fontSize: '0.85rem' }}
                  value={bulletModal.originalText}
                  onChange={(e) => setBulletModal((prev) => ({ ...prev, originalText: e.target.value }))}
                />
              </div>

              {/* Style selector */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                  Choose Rewriting Focus &amp; Tone
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'Action & Impact', label: 'Action & Impact', desc: 'Focus on metrics, active verbs & scale' },
                    { id: 'Technical Execution', label: 'Technical Execution', desc: 'Focus on architecture, tools & patterns' },
                    { id: 'Concise ATS', label: 'Concise ATS', desc: 'Dense keywords & parsing readability' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setBulletModal((prev) => ({ ...prev, style: st.id }));
                        handleRewriteBullet(st.id);
                      }}
                      style={{
                        background: bulletModal.style === st.id ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-surface)',
                        border: bulletModal.style === st.id ? '2px solid var(--primary-500)' : '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '10px 8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: bulletModal.style === st.id ? 'var(--primary-300)' : 'var(--text-main)' }}>
                        {st.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {st.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                icon={Sparkles}
                onClick={() => handleRewriteBullet()}
                disabled={bulletModal.loading}
                style={{ width: '100%' }}
              >
                {bulletModal.loading ? 'Synthesizing with AI...' : 'Generate AI Variations'}
              </Button>

              {bulletModal.error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem' }}>
                  ⚠️ {bulletModal.error}
                </div>
              )}

              {/* Options List */}
              {bulletModal.options?.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Select an AI Recommendation to Apply:
                  </label>
                  {bulletModal.options.map((opt, i) => {
                    const isSelected = bulletModal.selectedOption === opt.text;
                    return (
                      <div
                        key={i}
                        onClick={() => setBulletModal((prev) => ({ ...prev, selectedOption: opt.text }))}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--primary-500)' : '1px solid var(--border-color)',
                          background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-400)' }}>
                            {opt.label || `Variation ${i + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(opt.text);
                              addToast('Copied bullet to clipboard!', 'info');
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                          >
                            <Copy size={13} /> Copy
                          </button>
                        </div>
                        <div style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                          {opt.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--border-color, #334155)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
              }}
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setBulletModal((prev) => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Check}
                onClick={applyRewrittenBullet}
                disabled={!bulletModal.selectedOption}
              >
                Apply to Project
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: AI ATS DEEP AUDIT REPORT
         ======================================================== */}
      {atsModal.isOpen && (
        <div
          className="no-print"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflowY: 'auto',
            padding: 'clamp(8px, 2.5vh, 20px) clamp(8px, 2vw, 16px)',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              background: 'var(--bg-surface-elevated, #1e293b)',
              border: '1px solid var(--border-color, #334155)',
              borderRadius: '16px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: 'calc(100vh - 32px)',
              margin: 'auto 0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {/* Header: Pinned at top */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--border-color, #334155)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
                background: 'var(--bg-surface, #1e293b)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '6px', borderRadius: '8px' }}>
                  <SearchCheck size={20} style={{ color: 'var(--accent-emerald, #10b981)' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>✨ AI ATS Readiness Audit</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Evaluated against target role: <strong>{resume.targetRole}</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAtsModal((prev) => ({ ...prev, isOpen: false }))}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                aria-label="Close ATS report"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body: Scrollable only when needed */}
            <div
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                flex: '1 1 auto',
                minHeight: 0,
                overflowY: 'auto',
                overscrollBehavior: 'contain',
              }}
            >
              {atsModal.loading && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <RefreshCw size={36} className="animate-spin" style={{ color: 'var(--primary-400)', margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Running Deep ATS Audit...</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Comparing CV vocabulary, formatting density, and semantic keyword matching.
                  </div>
                </div>
              )}

              {atsModal.error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '8px', color: '#fca5a5' }}>
                  <div style={{ fontWeight: 700 }}>Audit Encountered an Issue</div>
                  <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>{atsModal.error}</div>
                  <Button variant="secondary" size="sm" onClick={handleRunAtsAudit} style={{ marginTop: '10px' }}>
                    Retry Audit
                  </Button>
                </div>
              )}

              {atsModal.data && (
                <>
                  {/* Score & Summary Banner */}
                  {(() => {
                    const currentScore = atsModal.data.atsScore ?? atsScore;
                    const isHigh = currentScore >= 80;
                    const isMedium = currentScore >= 50 && currentScore < 80;
                    const scoreColor = isHigh ? 'var(--accent-emerald)' : isMedium ? 'var(--accent-amber)' : '#ef4444';
                    const scoreBg = isHigh ? 'rgba(16, 185, 129, 0.15)' : isMedium ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)';
                    const scoreBorder = isHigh ? 'var(--accent-emerald)' : isMedium ? 'var(--accent-amber)' : 'rgba(239, 68, 68, 0.5)';

                    const defaultAssessment = isHigh
                      ? 'High ATS Readiness'
                      : isMedium
                      ? 'Moderate ATS Readiness'
                      : 'Critical ATS Gaps Detected';

                    const defaultSummary = isHigh
                      ? 'Your CV demonstrates solid ATS compliance across structural formatting, keywords, and core sections.'
                      : isMedium
                      ? 'Your CV demonstrates foundational ATS compliance, but keyword alignment and section completeness could be improved.'
                      : 'Your CV is currently missing fundamental details (such as contact info, targeted summary, skills, or experience) required by Applicant Tracking Systems.';

                    return (
                      <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: scoreBg, border: `3px solid ${scoreBorder}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '1.35rem', fontWeight: 900, color: scoreColor }}>
                            {currentScore}%
                          </span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                            {atsModal.data.readinessAssessment || defaultAssessment}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {atsModal.data.summary || defaultSummary}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Checklist & Issues */}
                  {atsModal.data.checks?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Parsing &amp; Formatting Checks
                      </span>
                      {atsModal.data.checks.map((chk, i) => {
                        const isPassed = chk.passed === true || chk.pass === true || chk.status === 'pass' || chk.status === 'passed';
                        const checkName = chk.name || chk.label || chk.title || chk.rule || `ATS Check #${i + 1}`;
                        const checkFeedback = chk.feedback || chk.detail || chk.message || chk.desc || (isPassed ? 'Meets standard ATS requirements.' : 'Requires addition or enhancement.');

                        return (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                              background: 'var(--bg-surface)',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.84rem',
                              lineHeight: 1.45,
                            }}
                          >
                            {isPassed ? (
                              <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: '2px' }} />
                            ) : (
                              <AlertCircle size={16} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: '2px' }} />
                            )}
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: 700, color: 'var(--text-main)', marginRight: '6px' }}>
                                {checkName}:
                              </span>
                              <span style={{ color: 'var(--text-muted)' }}>
                                {checkFeedback}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Keyword Matching */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Matched Keywords</span>
                        <span>({atsModal.data.matchedKeywords?.length || 0})</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {atsModal.data.matchedKeywords?.map((kw, i) => (
                          <span key={i} style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 9px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                            ✓ {kw}
                          </span>
                        ))}
                        {(!atsModal.data.matchedKeywords || atsModal.data.matchedKeywords.length === 0) && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No target keywords matched yet. Add technical skills to your CV.
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Missing In-Demand Keywords</span>
                        <span>({atsModal.data.missingKeywords?.length || 0})</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {atsModal.data.missingKeywords?.map((kw, i) => (
                          <span key={i} style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 9px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                            + {kw}
                          </span>
                        ))}
                        {(!atsModal.data.missingKeywords || atsModal.data.missingKeywords.length === 0) && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            All primary keywords present for this role!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {atsModal.data.recommendations?.length > 0 && (
                    <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-400)', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Actionable Recommendations
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        {atsModal.data.recommendations.map((rec, i) => (
                          <li key={i} style={{ marginBottom: '4px' }}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Transparent Disclaimer */}
                  <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(148, 163, 184, 0.08)', border: '1px solid rgba(148, 163, 184, 0.2)', fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                    ⚠️ <strong>Notice:</strong> This ATS readiness score is an automated structural and keyword heuristic. It does not guarantee passing proprietary commercial Applicant Tracking Systems or human recruitment filters.
                  </div>
                </>
              )}
            </div>

            {/* Footer: Pinned at bottom */}
            <div
              style={{
                padding: '0.85rem 1.25rem',
                borderTop: '1px solid var(--border-color, #334155)',
                display: 'flex',
                justifyContent: 'flex-end',
                flexShrink: 0,
                background: 'var(--bg-surface, #1e293b)',
              }}
            >
              <Button variant="secondary" size="sm" onClick={() => setAtsModal((prev) => ({ ...prev, isOpen: false }))}>
                Close Report
              </Button>
            </div>
          </div>
        </div>
      )}



      {/* ========================================================
          MODAL 4: OPTIONAL PRACTICE A MOCK INTERVIEW
         ======================================================== */}
      {mockInterviewModal.isOpen && (
        <div
          className="no-print"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflowY: 'auto',
            padding: 'clamp(8px, 2.5vh, 20px) clamp(8px, 2vw, 16px)',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              background: 'var(--bg-surface-elevated, #0f172a)',
              border: '1px solid var(--border-color, #334155)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '700px',
              maxHeight: 'calc(100vh - 32px)',
              margin: 'auto 0',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {/* Modal Header: Locked at top */}
            <div
              style={{
                padding: '0.7rem 1.15rem',
                borderBottom: '1px solid var(--border-color, #334155)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-surface, #1e293b)',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-emerald, #10b981)',
                    flexShrink: 0,
                  }}
                >
                  <Target size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main, #f8fafc)', lineHeight: 1.2 }}>
                    Practice a Mock Interview
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted, #94a3b8)', marginTop: '2px' }}>
                    Tailored to your CV: <strong>{resume.targetRole || 'Software Professional'}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMockInterviewModal((prev) => ({ ...prev, isOpen: false }))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted, #94a3b8)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Close mock interview"
                aria-label="Close mock interview"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Scrollable only when needed */}
            <div
              style={{
                padding: 'clamp(0.85rem, 1.8vh, 1.25rem)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                flex: '1 1 auto',
                minHeight: 0,
                overscrollBehavior: 'contain',
              }}
            >
              {mockInterviewModal.loading ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <RefreshCw size={36} className="animate-spin" style={{ color: 'var(--accent-emerald)', margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                    Generating Personalized Interview Questions...
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '440px', marginInline: 'auto' }}>
                    Analyzing your projects, skills taxonomy, and target role to craft realistic technical and behavioral scenarios.
                  </div>
                </div>
              ) : mockInterviewModal.isCompleted ? (
                /* Completion Celebration View */
                <div style={{ textAlign: 'center', padding: '1rem 0.5rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>🎉</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
                    Mock Interview Practice Complete!
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.25rem' }}>
                    You reviewed {mockInterviewModal.questions.length} interview questions tailored specifically to your background and {resume.targetRole || 'target role'}.
                  </p>

                  {/* Questions Recap */}
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', padding: '2px' }}>
                    {mockInterviewModal.questions.map((q, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: 'var(--bg-surface, #1e293b)',
                          border: '1px solid var(--border-color, #334155)',
                          fontSize: '0.82rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                            Q{idx + 1}: {q.category}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            {q.difficulty}
                          </span>
                        </div>
                        <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                          {q.question}
                        </div>
                        {mockInterviewModal.userNotes[q.id] && (
                          <div style={{ marginTop: '6px', padding: '6px 10px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '6px', borderLeft: '3px solid var(--primary-400)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                            <strong>Your Notes:</strong> {mockInterviewModal.userNotes[q.id]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Single Question Active View */
                <>
                  {/* Top Stepper / Dots Navigation */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {mockInterviewModal.questions.map((q, idx) => {
                        const isActive = idx === mockInterviewModal.currentIndex;
                        const hasNote = Boolean(mockInterviewModal.userNotes[q.id]?.trim());
                        return (
                          <button
                            key={idx}
                            onClick={() => setMockInterviewModal((prev) => ({ ...prev, currentIndex: idx }))}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              border: isActive ? '2px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                              background: isActive
                                ? 'rgba(16, 185, 129, 0.2)'
                                : hasNote
                                ? 'rgba(99, 102, 241, 0.12)'
                                : 'var(--bg-surface)',
                              color: isActive
                                ? 'var(--accent-emerald)'
                                : 'var(--text-muted)',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease',
                              padding: 0,
                            }}
                            title={`Jump to Question ${idx + 1}`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Question <span style={{ color: 'var(--accent-emerald)' }}>{mockInterviewModal.currentIndex + 1}</span> of {mockInterviewModal.questions.length}
                    </div>
                  </div>

                  {/* Active Question Box */}
                  {(() => {
                    const activeQ = mockInterviewModal.questions[mockInterviewModal.currentIndex] || {};
                    const currentNote = mockInterviewModal.userNotes[activeQ.id] || '';

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', minHeight: 0 }}>
                        {/* Category & Grounding Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>
                              {activeQ.category || 'Interview Question'}
                            </span>
                            {activeQ.difficulty && (
                              <span style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary-400)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600 }}>
                                {activeQ.difficulty}
                              </span>
                            )}
                          </div>
                          {activeQ.grounding && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                              📌 {activeQ.grounding}
                            </span>
                          )}
                        </div>

                        {/* Question Display Card */}
                        <div
                          style={{
                            background: 'var(--bg-surface, #1e293b)',
                            padding: '0.85rem 1rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color, #334155)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main, #f8fafc)', lineHeight: 1.45 }}>
                            "{activeQ.question}"
                          </div>
                        </div>

                        {/* Coaching Advice & Talking Points (Toggleable / Expandable Accordion) */}
                        {(activeQ.hint || activeQ.sampleAnswerGuideline) && (
                          <div
                            style={{
                              background: 'rgba(245, 158, 11, 0.08)',
                              border: '1px solid rgba(245, 158, 11, 0.25)',
                              borderRadius: '8px',
                              padding: '6px 10px',
                            }}
                          >
                            <div
                              onClick={() => setMockInterviewModal((prev) => ({ ...prev, showHint: !prev.showHint }))}
                              style={{
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                color: 'var(--accent-amber)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                userSelect: 'none',
                              }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Lightbulb size={14} />
                                Interviewer Expectations &amp; Talking Points
                              </span>
                              <span style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 600 }}>
                                {mockInterviewModal.showHint ? '▲ Hide Tips' : '▼ Show Tips'}
                              </span>
                            </div>

                            {mockInterviewModal.showHint && (
                              <div style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, borderTop: '1px solid rgba(245, 158, 11, 0.15)', paddingTop: '6px' }}>
                                {activeQ.hint && <div>{activeQ.hint}</div>}
                                {activeQ.sampleAnswerGuideline && (
                                  <div style={{ marginTop: '5px', whiteSpace: 'pre-line', color: 'var(--text-main)', fontSize: '0.76rem' }}>
                                    {activeQ.sampleAnswerGuideline}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Optional Practice Scratchpad Note Box */}
                        <div>
                          <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span>Practice Your Notes (Optional):</span>
                            <span style={{ fontWeight: 400, color: 'var(--text-dim)', fontSize: '0.68rem' }}>Saved to session</span>
                          </label>
                          <textarea
                            value={currentNote}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMockInterviewModal((prev) => ({
                                ...prev,
                                userNotes: {
                                  ...prev.userNotes,
                                  [activeQ.id]: val,
                                },
                              }));
                            }}
                            placeholder="Jot down STAR points, technologies, or keywords..."
                            rows={2}
                            style={{
                              width: '100%',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              background: 'var(--bg-surface, #1e293b)',
                              border: '1px solid var(--border-color, #334155)',
                              color: 'var(--text-main, #f8fafc)',
                              fontSize: '0.8rem',
                              fontFamily: 'inherit',
                              resize: 'vertical',
                              minHeight: '44px',
                              maxHeight: '90px',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>

            {/* Modal Footer Controls: Locked at bottom, always visible without scrolling */}
            <div
              style={{
                padding: '0.65rem 1.15rem',
                borderTop: '1px solid var(--border-color, #334155)',
                background: 'var(--bg-surface, #1e293b)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                flexShrink: 0,
              }}
            >
              {mockInterviewModal.isCompleted ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={RotateCcw}
                    onClick={() => setMockInterviewModal((prev) => ({ ...prev, currentIndex: 0, isCompleted: false }))}
                  >
                    Practice Again
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setMockInterviewModal((prev) => ({ ...prev, isOpen: false }))}
                  >
                    Back to CV Builder
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={ChevronLeft}
                    disabled={mockInterviewModal.currentIndex === 0 || mockInterviewModal.loading}
                    onClick={() => setMockInterviewModal((prev) => ({ ...prev, currentIndex: Math.max(0, prev.currentIndex - 1) }))}
                  >
                    Previous Question
                  </Button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMockInterviewModal((prev) => ({ ...prev, isOpen: false }))}
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Close
                    </Button>

                    {mockInterviewModal.currentIndex < mockInterviewModal.questions.length - 1 ? (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={ChevronRight}
                        disabled={mockInterviewModal.loading || mockInterviewModal.questions.length === 0}
                        onClick={() => setMockInterviewModal((prev) => ({ ...prev, currentIndex: prev.currentIndex + 1 }))}
                      >
                        Next Question
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Check}
                        disabled={mockInterviewModal.loading || mockInterviewModal.questions.length === 0}
                        onClick={() => setMockInterviewModal((prev) => ({ ...prev, isCompleted: true }))}
                      >
                        Finish Practice 🎉
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .builder-split-container {
            grid-template-columns: 1fr !important;
          }
          .builder-mobile-toggle {
            display: block !important;
          }
          .mobile-hidden {
            display: none !important;
          }
          .builder-right-col {
            position: static !important;
            max-height: none !important;
          }
        }
      `}</style>
    </div>
  );
};
