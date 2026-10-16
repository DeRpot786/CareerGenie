import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Copy,
  FileText,
  Wand2,
  Check,
  Mail,
  X
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { matchCareerAndJob, generateJobApplicationMaterials } from '../api/aiService';

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: 'Frontend React Engineer (Mid-Level)',
    company: 'Fintech Cloud Corp',
    text: `Job Title: Frontend React Engineer
Company: Fintech Cloud Corp
Experience Required: 1-3 years of experience in modern web frontend engineering
Education: Bachelor's degree in Computer Science, Software Engineering, or equivalent

About the Role:
We are looking for a skilled Frontend Engineer to build responsive, high-performance web applications using React.js and modern web standards.

Requirements:
- Strong proficiency in JavaScript (ES6+), TypeScript, HTML5, and CSS3.
- Hands-on production experience with React.js, hooks, and state management (Redux Toolkit or Zustand).
- Experience integrating RESTful APIs and asynchronous data fetching.
- Familiarity with Git version control, GitHub workflows, and CI/CD pipelines.
- Knowledge of responsive web design, cross-browser compatibility, and web performance optimization.
- Experience with Docker, Tailwind CSS, and unit testing (Jest or Vitest) is a plus.`,
  },
  {
    title: 'Full Stack Web Developer',
    company: 'Nexus Scale Innovations',
    text: `Job Title: Full Stack Developer
Company: Nexus Scale Innovations
Experience: 2+ years experience building end-to-end web applications
Education: B.Tech / B.E in CS / IT

Key Responsibilities:
- Design and build robust full-stack applications with React frontend and Node.js / Express backend.
- Architect relational database schemas using PostgreSQL / MySQL and write performant SQL queries.
- Build secure authentication flows using JWT, OAuth2, and session management.
- Containerize services with Docker and deploy to AWS or cloud environments.
- Collaborate with product designers in Figma and agile engineering sprints.`,
  },
  {
    title: 'Python Backend & AI Developer',
    company: 'Cognitive Data Labs',
    text: `Job Title: Python Backend & AI Developer
Company: Cognitive Data Labs
Experience: 1-4 years
Education: Bachelor's in CS, Data Science, or related field

Requirements:
- Deep experience with Python, FastAPI or Django, and building RESTful APIs.
- Experience with PostgreSQL, Redis caching, and database indexing.
- Familiarity with AI/LLM integration, Prompt Engineering, OpenAI/Gemini APIs.
- Version control with Git, Docker containers, and Linux command line.
- Strong understanding of algorithms, data structures, and asynchronous programming.`,
  },
];

export const CareerMatchPage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  // CV Source Mode: 'profile' | 'paste'
  const [cvSourceMode, setCvSourceMode] = useState('profile');
  const [customCvText, setCustomCvText] = useState('');
  const [jobText, setJobText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [applyingFixes, setApplyingFixes] = useState(false);
  const [fixesApplied, setFixesApplied] = useState(false);

  const [matchResult, setMatchResult] = useState(() => {
    const saved = localStorage.getItem('careergenie_match_result');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return null;
  });

  // Get current user profile
  const getUserProfile = () => {
    try {
      const saved = localStorage.getItem('careergenie_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      fullName: 'Alex Thomas',
      targetRole: 'Frontend Developer',
      skills: {
        languages: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'TypeScript'],
        frameworks: ['React.js', 'Tailwind CSS', 'Next.js'],
        technical: ['Responsive Web Design', 'RESTful APIs', 'State Management'],
        tools: ['Git & GitHub', 'Vite', 'Figma'],
        soft: ['Problem Solving', 'Team Collaboration'],
      },
      summary: 'Motivated Frontend Developer with solid grounding in modern JavaScript, React, and responsive design.',
    };
  };

  // Job Application Outreach Modal States
  const [showOutreachModal, setShowOutreachModal] = useState(false);
  const [outreachType, setOutreachType] = useState('cold_email');
  const [recipientName, setRecipientName] = useState('Hiring Manager');
  const [companyName, setCompanyName] = useState('');
  const [generatingOutreach, setGeneratingOutreach] = useState(false);
  const [outreachResult, setOutreachResult] = useState(null);
  const [copiedOutreach, setCopiedOutreach] = useState(false);

  // Run ATS Match Analysis
  const handleRunMatch = async () => {
    if (!jobText.trim() || jobText.trim().length < 25) {
      addToast('Please paste a target job description (at least 25 characters).', 'warning');
      return;
    }

    setAnalyzing(true);
    setFixesApplied(false);
    const profile = getUserProfile();
    const userSkillsList = Object.values(profile.skills || {}).flat();

    try {
      const aiRes = await matchCareerAndJob({
        jobText,
        targetCareer: profile.targetRole,
        skills: profile.skills,
        projects: [{ name: 'Web Application Portfolio', technologies: userSkillsList.slice(0, 5).join(', ') }],
        education: [{ degree: 'B.Tech in Computer Science', college: 'Engineering Institute' }],
        cvText: cvSourceMode === 'paste' ? customCvText : undefined,
      });

      if (aiRes && aiRes.overallScore !== undefined) {
        const processed = {
          jobTitle: aiRes.jobTitle || 'Detected Job Role',
          overall: aiRes.overallScore,
          skillScore: aiRes.skillScore || 80,
          keywordScore: aiRes.keywordScore || 75,
          projectScore: aiRes.projectScore || 78,
          educationScore: aiRes.educationScore || 90,
          experienceScore: aiRes.experienceScore || 70,
          matchingSkills: aiRes.matchingSkills || [],
          missingSkills: aiRes.missingSkills || [],
          matchingKeywords: aiRes.matchingKeywords || [],
          missingKeywords: aiRes.missingKeywords || [],
          suggestions: aiRes.improvementSuggestions || [
            'Incorporate missing keywords into your portfolio project bullet points.',
            'Highlight testing frameworks and CI/CD tools on your CV.',
          ],
          verdict: aiRes.summaryVerdict || 'Strong match for foundational requirements with high upside.',
        };
        setMatchResult(processed);
        localStorage.setItem('careergenie_match_result', JSON.stringify(processed));
        localStorage.setItem('careergenie_job_text', jobText);
        addToast('✨ AI Match & ATS Audit completed!', 'success');
      } else {
        throw new Error('AI returned an unexpected format.');
      }
    } catch (err) {
      addToast(err.message || 'AI match request failed. Please verify your GEMINI_API_KEY configuration.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  // Generate Tailored Application Outreach Materials
  const handleGenerateOutreach = async (typeToUse = outreachType) => {
    setGeneratingOutreach(true);
    setOutreachResult(null);
    try {
      const profile = getUserProfile();
      const res = await generateJobApplicationMaterials({
        jobDescription: jobText || 'Standard software engineering opening',
        profile: {
          name: profile.fullName,
          targetRole: profile.targetRole,
          skills: profile.skills,
          summary: profile.summary,
        },
        type: typeToUse,
        recipientName: recipientName || 'Hiring Manager',
        companyName: companyName || matchResult?.jobTitle || 'Hiring Organization',
      });

      if (res && res.body) {
        setOutreachResult(res);
        addToast(`✨ Tailored outreach drafted!`, 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to draft outreach materials.', 'error');
    } finally {
      setGeneratingOutreach(false);
    }
  };

  // Automatically apply AI fixes to CV profile
  const handleApplyAIFixes = () => {
    if (!matchResult) return;
    setApplyingFixes(true);

    const profile = getUserProfile();
    const missing = matchResult.missingSkills || [];
    const missingKw = matchResult.missingKeywords || [];
    const allToAdd = [...new Set([...missing, ...missingKw])];

    const currentTech = profile.skills?.technical || [];
    const updatedTech = [...new Set([...currentTech, ...allToAdd])];

    const updatedProfile = {
      ...profile,
      skills: {
        ...profile.skills,
        technical: updatedTech,
      },
      summary: profile.summary.includes(matchResult.jobTitle)
        ? profile.summary
        : `${profile.summary} Targeted for ${matchResult.jobTitle} with core competencies in ${allToAdd.slice(0, 3).join(', ')}.`,
    };

    localStorage.setItem('careergenie_profile', JSON.stringify(updatedProfile));
    setFixesApplied(true);
    setApplyingFixes(false);
    addToast(`✨ Added ${allToAdd.length} missing keywords and updated your CV summary!`, 'success');
  };

  // Preload a sample job description
  const loadSample = (sample) => {
    setJobText(sample.text);
    addToast(`Loaded sample: "${sample.title}"`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem', width: '100%' }}>
      {/* Header Banner */}
      <Card
        className="glass-panel"
        glow
        style={{
          padding: '2.5rem',
          border: '1px solid var(--border-color)',
          background: 'var(--banner-bg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
              <Badge variant="emerald" icon={Sparkles}>ATS Compatibility &amp; Skill Match Audit</Badge>
              <Badge variant="cyan">ATS Auditor &amp; Optimizer</Badge>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Role &amp; Skills Match <span className="gradient-text">ATS Auditor</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', fontSize: '0.95rem' }}>
              Match your qualifications against target job requirements. Career Genie evaluates your skill overlap, detects ATS gaps, and helps you optimize your CV.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="primary" icon={FileText} onClick={() => navigate('/builder')}>
              Open CV Maker &rarr;
            </Button>
          </div>
        </div>
      </Card>

      {/* Split Input Section: CV Source on Left, Job Description on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Box 1: Candidate CV Source */}
        <Card style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>1. Your Qualifications &amp; Skills</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Load from your saved profile or paste candidate details.
              </p>
            </div>

            {/* Source switch pills */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface-elevated)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
              <button
                type="button"
                onClick={() => setCvSourceMode('profile')}
                style={{
                  background: cvSourceMode === 'profile' ? 'var(--primary-600)' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Saved Profile
              </button>
              <button
                type="button"
                onClick={() => setCvSourceMode('paste')}
                style={{
                  background: cvSourceMode === 'paste' ? 'var(--primary-600)' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Paste Details
              </button>
            </div>
          </div>

          {cvSourceMode === 'profile' ? (
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{getUserProfile().fullName}</span>
                <Badge variant="primary" size="sm">{getUserProfile().targetRole}</Badge>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {getUserProfile().summary}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Object.values(getUserProfile().skills || {}).flat().slice(0, 8).map((s, idx) => (
                  <span key={idx} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-400)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Paste candidate background, skills, or achievements:
              </label>

              <textarea
                className="form-textarea"
                rows={7}
                style={{ width: '100%', fontSize: '0.85rem', lineHeight: 1.5, padding: '0.75rem' }}
                placeholder="Paste candidate background, skills, and project descriptions..."
                value={customCvText}
                onChange={(e) => setCustomCvText(e.target.value)}
              />
            </div>
          )}
        </Card>

        {/* Box 2: Target Job Description */}
        <Card style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>2. Target Job Posting</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Paste the recruiter job requirements.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {SAMPLE_JOB_DESCRIPTIONS.slice(0, 2).map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadSample(s)}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-muted)',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  {s.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="form-textarea"
            rows={7}
            style={{ width: '100%', fontSize: '0.85rem', lineHeight: 1.5, padding: '0.75rem', marginBottom: '1rem' }}
            placeholder="Paste job description requirements, responsibilities, and qualifications..."
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
          />

          <Button
            variant="primary"
            icon={Sparkles}
            onClick={handleRunMatch}
            isLoading={analyzing}
            style={{ width: '100%', justifyContent: 'center' }}
            size="md"
          >
            {analyzing ? 'Auditing CV & Job Match...' : '✨ Run ATS Match & Audit'}
          </Button>
        </Card>
      </div>

      {/* Match Results & Fixer Action */}
      {matchResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Top Score Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <Card style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <CircularProgress
                value={matchResult.overall}
                size={110}
                strokeWidth={9}
                color={matchResult.overall >= 80 ? 'emerald' : matchResult.overall >= 65 ? 'cyan' : 'amber'}
                label="Overall Match"
              />
              <div style={{ flex: 1, minWidth: '180px' }}>
                <Badge variant={matchResult.overall >= 80 ? 'emerald' : 'cyan'} style={{ marginBottom: '0.5rem' }}>
                  {matchResult.overall >= 80 ? 'Strong Candidate Match' : 'ATS Gaps Identified'}
                </Badge>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  {matchResult.jobTitle}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {matchResult.verdict}
                </p>
              </div>
            </Card>

            <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Technical Skills Match</span>
                  <span>{matchResult.skillScore}%</span>
                </div>
                <ProgressBar value={matchResult.skillScore} color="primary" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Keyword Density</span>
                  <span>{matchResult.keywordScore}%</span>
                </div>
                <ProgressBar value={matchResult.keywordScore} color="cyan" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Project Relevance</span>
                  <span>{matchResult.projectScore}%</span>
                </div>
                <ProgressBar value={matchResult.projectScore} color="emerald" />
              </div>
            </Card>
          </div>

          {/* Missing Keywords & 1-Click AI Fix Banner */}
          <Card
            glow
            style={{
              padding: '2rem',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'var(--card-bg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                  <Badge variant="rose">Missing Keywords ({matchResult.missingSkills?.length || 0})</Badge>
                  {fixesApplied && <Badge variant="emerald" icon={Check}>Fixes Injected into CV</Badge>}
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  Fix ATS Issues &amp; Inject Missing Keywords
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '640px' }}>
                  Applicant tracking systems reject resumes missing critical role terminology. Click below to automatically incorporate these missing competencies into your CV profile.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Button
                  variant="primary"
                  icon={Wand2}
                  size="lg"
                  onClick={handleApplyAIFixes}
                  disabled={applyingFixes || fixesApplied}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    border: 'none',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  {fixesApplied ? '✓ AI Fixes Applied' : '✨ Apply AI Fixes to CV'}
                </Button>

                <Button
                  variant="outline"
                  icon={Mail}
                  size="lg"
                  onClick={() => {
                    setShowOutreachModal(true);
                    if (!outreachResult) handleGenerateOutreach('cold_email');
                  }}
                  style={{
                    borderColor: 'var(--primary-500)',
                    color: 'var(--primary-300)',
                  }}
                >
                  ✉️ AI Outreach Drafter
                </Button>

                <Button
                  variant="secondary"
                  icon={FileText}
                  size="lg"
                  onClick={() => navigate('/resume-builder')}
                >
                  Open in CV Maker &amp; Print PDF &rarr;
                </Button>
              </div>
            </div>

            {/* List of missing keywords */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {matchResult.missingSkills?.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: fixesApplied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.12)',
                    border: fixesApplied ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.3)',
                    color: fixesApplied ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  {fixesApplied ? '✓ ' : '+ '} {skill}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* AI Job Application Outreach Modal */}
      {showOutreachModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1.5rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowOutreachModal(false);
          }}
        >
          <Card
            glow
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              background: 'var(--bg-surface, #18181b)',
              border: '1px solid var(--border-color)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} style={{ color: 'var(--primary-400)' }} />
                  AI Job Application Assistant
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                  Generate tailored outreach messages to recruiters and hiring managers.
                </p>
              </div>
              <button
                onClick={() => setShowOutreachModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Outreach Type Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {[
                { id: 'cold_email', label: '✉️ Cold Email' },
                { id: 'recruiter_inquiry', label: '💼 Recruiter DM' },
                { id: 'linkedin_note', label: '🤝 LinkedIn Note' },
                { id: 'elevator_pitch', label: '⏱️ Pitch Script' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setOutreachType(tab.id);
                    handleGenerateOutreach(tab.id);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: outreachType === tab.id ? '1px solid var(--primary-500)' : '1px solid var(--border-color)',
                    background: outreachType === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface-elevated)',
                    color: outreachType === tab.id ? 'var(--primary-300)' : 'var(--text-main)',
                    fontWeight: outreachType === tab.id ? 700 : 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Recipient & Company Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Recipient Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins or Hiring Team"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Company Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. TechCorp Solutions"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>

            {/* Regenerate Button */}
            <Button
              variant="primary"
              size="sm"
              icon={Sparkles}
              isLoading={generatingOutreach}
              onClick={() => handleGenerateOutreach(outreachType)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {generatingOutreach ? 'Generating tailored message...' : '✨ Regenerate for these details'}
            </Button>

            {/* Generated Outreach Display */}
            {outreachResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {outreachResult.subject && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Subject Line:
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(outreachResult.subject);
                          addToast('Subject copied!', 'success');
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-400)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                      >
                        <Copy size={12} /> Copy Subject
                      </button>
                    </div>
                    <div style={{ padding: '8px 12px', background: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 600 }}>
                      {outreachResult.subject}
                    </div>
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Message Body ({outreachResult.characterCount || outreachResult.body?.length || 0} characters):
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(outreachResult.body);
                        setCopiedOutreach(true);
                        addToast('Message copied to clipboard!', 'success');
                        setTimeout(() => setCopiedOutreach(false), 2000);
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-400)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      {copiedOutreach ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
                      {copiedOutreach ? 'Copied!' : 'Copy Body'}
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={outreachResult.body}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                      resize: 'vertical',
                    }}
                  />
                </div>

                {outreachResult.strategicTip && (
                  <div style={{ padding: '10px 14px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    💡 <strong>Strategy Tip:</strong> {outreachResult.strategicTip}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
