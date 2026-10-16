// ============================================================
// CAREER GENIE — Client-side AI Service for Real Cloud AI
// Communicates with backend /api/ai endpoints securely
// ============================================================

import api from './axios';

/**
 * Call the AI endpoint (/api/ai)
 * Throws structured errors when provider calls fail or key is missing.
 * Never fabricates successful AI results.
 */
export async function callAI(task, payload) {
  try {
    const res = await api.post('/ai', { task, payload });
    if (res.data && res.data.success) {
      return res.data.data;
    }
    const error = new Error(res.data?.error || 'AI generation failed');
    error.code = res.data?.code || 'AI_ERROR';
    throw error;
  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.message ||
      'AI service is temporarily unavailable. Please verify API key configuration.';
    const code = err.response?.data?.code || err.code || 'AI_ERROR';
    const error = new Error(message);
    error.code = code;
    error.status = err.response?.status;
    console.error(`[AI Service Error] Task "${task}":`, message);
    throw error;
  }
}

// ------------------------------------------------------------
// A. AI CV Builder Services
// ------------------------------------------------------------

/**
 * Generate 3 distinct professional summary options grounded in candidate's facts
 */
export async function generateRoleSummary({ jobTitle, fullName, education, experience, skills, personalDetails }) {
  return callAI('generate_summary', {
    targetCareer: jobTitle || 'Software Engineer',
    profile: {
      name: fullName || 'Candidate',
      location: personalDetails?.location || '',
      summary: personalDetails?.bio || '',
    },
    education: education || [],
    skills: skills || {},
    experience: experience || [],
    projects: personalDetails?.projects || [],
  });
}

/**
 * Rewrite a resume bullet point using strong action verbs & quantifiable structure
 * Accepts either positional args (bulletText, context, targetRole) or an object
 */
export async function rewriteBulletPoint(arg1, arg2, arg3) {
  let bulletText = '';
  let targetRole = 'Software Professional';
  let context = 'Technical Execution';

  if (typeof arg1 === 'object' && arg1 !== null) {
    bulletText = arg1.bulletText || arg1.text || arg1.originalText || '';
    targetRole = arg1.targetRole || targetRole;
    context = arg1.context || arg1.style || context;
  } else {
    bulletText = String(arg1 || '');
    context = arg2 || context;
    targetRole = arg3 || targetRole;
  }

  const data = await callAI('rewrite_bullet', {
    bulletText,
    targetRole,
    context,
  });

  const rawList = data?.options || data?.rewrittenOptions || data?.bullets || [];
  const normalizedOptions = rawList.map((item, idx) => ({
    id: item.id || `opt_${idx + 1}`,
    label: item.style || item.label || `Variation ${idx + 1}`,
    style: item.style || item.label || `Variation ${idx + 1}`,
    text: typeof item === 'string' ? item : (item.text || item.bullet || ''),
    actionVerb: item.actionVerb || '',
    metricTip: item.metricTip || '',
  }));

  return {
    ...data,
    options: normalizedOptions,
    rewrittenOptions: normalizedOptions,
  };
}

/**
 * Improve grammar, tone, clarity, and conciseness of any CV section text
 */
export async function improveText({ text, sectionType, targetRole }) {
  return callAI('improve_text', {
    text,
    sectionType: sectionType || 'Profile Summary',
    targetRole: targetRole || 'Software Professional',
  });
}

/**
 * Suggest role-specific skills based on target job title
 */
export async function suggestSkillsForRole(jobTitle, currentSkills = []) {
  const data = await callAI('suggest_skills', {
    jobTitle: jobTitle || 'Frontend Developer',
    currentSkills,
  });

  const flatSkills = [];
  if (Array.isArray(data?.categories)) {
    for (const cat of data.categories) {
      if (Array.isArray(cat.skills)) {
        for (const s of cat.skills) {
          flatSkills.push(typeof s === 'string' ? s : s.name);
        }
      }
    }
  } else if (Array.isArray(data?.suggestedSkills)) {
    flatSkills.push(...data.suggestedSkills);
  }

  return {
    ...data,
    suggestedSkills: flatSkills,
  };
}

/**
 * Parse freeform natural language skills input into standardized categories
 */
export async function parseCustomSkillInput(prompt, jobTitle) {
  return callAI('ai_write_skill', {
    prompt,
    jobTitle: jobTitle || 'Software Engineer',
  });
}

// ------------------------------------------------------------
// B. AI ATS Resume Analyzer Services
// ------------------------------------------------------------

/**
 * Audit CV against ATS standards and target job requirements
 */
export async function auditAtsResume({ profile, education, skills, projects, experience, certifications, jobText, targetRole, cvText }) {
  const data = await callAI('ats_analysis', {
    profile,
    education,
    skills,
    projects,
    experience,
    certifications,
    jobText,
    targetRole,
    cvText,
  });

  if (!data || typeof data !== 'object') return data;

  const score = typeof data.atsScore === 'number'
    ? Math.max(0, Math.min(100, Math.round(data.atsScore)))
    : (typeof data.overallScore === 'number' ? Math.round(data.overallScore) : 40);

  const rawChecks = Array.isArray(data.checks) ? data.checks : [];
  const normalizedChecks = rawChecks.map((chk, i) => {
    const isPassed = chk.passed === true || chk.pass === true || chk.status === 'pass' || chk.status === 'passed' || chk.status === 'ok';
    const name = chk.name || chk.label || chk.title || chk.rule || `ATS Check #${i + 1}`;
    const feedback = chk.feedback || chk.detail || chk.message || chk.description || (isPassed ? 'Meets standard ATS requirements.' : 'Requires addition or enhancement.');
    return {
      name,
      label: name,
      title: name,
      passed: isPassed,
      pass: isPassed,
      status: chk.status || (isPassed ? 'pass' : 'fail'),
      feedback,
      detail: feedback,
    };
  });

  return {
    ...data,
    atsScore: score,
    readinessAssessment: data.readinessAssessment || (data.rating ? `${data.rating} ATS Readiness` : (score >= 80 ? 'High ATS Readiness' : score >= 50 ? 'Moderate ATS Readiness' : 'Needs Optimization')),
    summary: data.summary || (score >= 80
      ? 'Your CV demonstrates solid ATS compliance across structural formatting, keywords, and core sections.'
      : score >= 50
      ? 'Your CV demonstrates foundational ATS compliance, but keyword alignment and section completeness could be improved.'
      : 'Your CV is currently missing fundamental details (such as contact info, targeted summary, skills, or experience) required by Applicant Tracking Systems.'),
    checks: normalizedChecks,
    matchedKeywords: Array.isArray(data.matchedKeywords) ? data.matchedKeywords : (Array.isArray(data.matchingKeywords) ? data.matchingKeywords : []),
    missingKeywords: Array.isArray(data.missingKeywords) ? data.missingKeywords : (Array.isArray(data.unmatchedKeywords) ? data.unmatchedKeywords : []),
    recommendations: Array.isArray(data.recommendations)
      ? data.recommendations
      : (Array.isArray(data.atsOptimizationTips)
        ? data.atsOptimizationTips
        : (Array.isArray(data.warnings) ? data.warnings : (Array.isArray(data.suggestions) ? data.suggestions : []))),
  };
}

// ------------------------------------------------------------
// C. AI Job Description Matcher Services
// ------------------------------------------------------------

/**
 * Deep extraction of skills, requirements, and keywords from job description
 */
export async function analyzeJobDescription(jobText) {
  return callAI('analyze_job', { jobText });
}

/**
 * Compare candidate's profile against target job description with multi-factor scoring
 */
export async function matchCareerAndJob({ jobText, targetCareer, skills, projects, education, cvText }) {
  return callAI('career_match', {
    jobText,
    targetCareer,
    skills,
    projects,
    education,
    cvText,
  });
}

// ------------------------------------------------------------
// D. AI Career Guidance Services
// ------------------------------------------------------------

/**
 * Recommend tailored career paths, next steps, and portfolio projects based on candidate background
 */
export async function getCareerGuidance({ skills, education, experience, interests, currentRole }) {
  return callAI('career_guidance', {
    skills,
    education,
    experience,
    interests,
    currentRole,
  });
}

// ------------------------------------------------------------
// F. AI Interview Preparation Services
// ------------------------------------------------------------

/**
 * Generate role-specific technical, behavioral, and project-based interview questions
 */
export async function generateInterviewQuestions({ career, profile, projects, skills, experience, education, cvText }) {
  const data = await callAI('interview_prep', {
    career: career || profile?.targetRole || 'Software Developer',
    profile,
    projects,
    skills,
    experience,
    education,
    cvText,
  });

  const questions = [];
  if (data && typeof data === 'object') {
    if (Array.isArray(data.project)) {
      data.project.forEach((q, idx) => {
        if (q?.q || q?.question) {
          questions.push({
            id: q.id || `proj_${idx + 1}`,
            category: 'Project Architecture & Decisions',
            grounding: 'Based on your CV projects',
            question: q.q || q.question,
            hint: q.hint || 'Focus on architectural decisions, trade-offs, and technical problem-solving.',
            sampleAnswerGuideline: q.sampleAnswerGuideline || q.guideline || '',
            difficulty: q.difficulty || 'Project Deep-Dive',
          });
        }
      });
    }

    if (Array.isArray(data.technical)) {
      data.technical.forEach((q, idx) => {
        if (q?.q || q?.question) {
          questions.push({
            id: q.id || `tech_${idx + 1}`,
            category: 'Core Technology Mastery',
            grounding: 'Based on your CV technical skills',
            question: q.q || q.question,
            hint: q.hint || 'Explain core mechanisms, design patterns, and real-world application.',
            sampleAnswerGuideline: q.sampleAnswerGuideline || q.guideline || '',
            difficulty: q.difficulty || 'Core Technical',
          });
        }
      });
    }

    if (Array.isArray(data.behavioral)) {
      data.behavioral.forEach((q, idx) => {
        if (q?.q || q?.question) {
          questions.push({
            id: q.id || `beh_${idx + 1}`,
            category: 'STAR Behavioral Scenario',
            grounding: 'Based on your experience & target role',
            question: q.q || q.question,
            hint: q.hint || 'Structure your story: Situation, Task, Action you took, and measurable Result.',
            sampleAnswerGuideline: q.sampleAnswerGuideline || q.guideline || '',
            difficulty: q.difficulty || 'STAR Behavioral',
          });
        }
      });
    }

    if (Array.isArray(data.hr)) {
      data.hr.forEach((q, idx) => {
        if (q?.q || q?.question) {
          questions.push({
            id: q.id || `hr_${idx + 1}`,
            category: 'Role & Cultural Alignment',
            grounding: 'Based on your career trajectory',
            question: q.q || q.question,
            hint: q.hint || 'Highlight your motivation, communication style, and growth mindset.',
            sampleAnswerGuideline: q.sampleAnswerGuideline || q.guideline || '',
            difficulty: q.difficulty || 'Role Fit',
          });
        }
      });
    }

    if (Array.isArray(data.questions)) {
      data.questions.forEach((q, idx) => {
        if (typeof q === 'string') {
          questions.push({
            id: `q_${idx + 1}`,
            category: 'Interview Preparation',
            grounding: 'Based on your background',
            question: q,
            hint: '',
            sampleAnswerGuideline: '',
            difficulty: 'Standard',
          });
        } else if (q?.question || q?.q) {
          questions.push({
            id: q.id || `q_${idx + 1}`,
            category: q.category || 'Interview Preparation',
            grounding: q.grounding || 'Based on your background',
            question: q.question || q.q,
            hint: q.hint || '',
            sampleAnswerGuideline: q.sampleAnswerGuideline || '',
            difficulty: q.difficulty || 'Standard',
          });
        }
      });
    }
  }

  return {
    ...data,
    questions,
  };
}

/**
 * Evaluate candidate's interview answer with objective scoring and feedback
 */
export async function evaluateInterviewAnswer({ question, category, userAnswer, targetRole, candidateBackground }) {
  return callAI('evaluate_interview_answer', {
    question,
    category,
    userAnswer,
    targetRole,
    candidateBackground,
  });
}

// ------------------------------------------------------------
// G. AI Skill-Gap Analyzer Services
// ------------------------------------------------------------

/**
 * Generate prioritized learning roadmap, learning resources, and projects for missing skills
 */
export async function analyzeSkillGap({ missingSkills, targetCareer, currentSkills, jobText }) {
  return callAI('skill_gap', {
    missingSkills,
    targetCareer,
    currentSkills,
    jobText,
  });
}

// ------------------------------------------------------------
// H. AI Job Application Assistant Services
// ------------------------------------------------------------

/**
 * Draft cold emails, recruiter outreach messages, and LinkedIn connection notes
 */
export async function generateJobApplicationMaterials({ jobDescription, profile, type, recipientName, companyName }) {
  return callAI('job_application_assistant', {
    jobDescription,
    profile,
    type: type || 'cold_email',
    recipientName,
    companyName,
  });
}

// ------------------------------------------------------------
// I. AI Chat Career Assistant Services
// ------------------------------------------------------------

/**
 * Conversational career guidance with message history context
 */
export async function sendCareerChatMessage({ messages, profile }) {
  return callAI('career_chat', {
    messages,
    profile,
  });
}
