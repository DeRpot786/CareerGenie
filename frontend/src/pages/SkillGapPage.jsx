import React, { useState } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  FolderGit2,
  Clock,
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { analyzeSkillGap } from '../api/aiService';

export const SkillGapPage = () => {
  const { addToast } = useToast();

  const savedProfile = (() => {
    try {
      const saved = localStorage.getItem('careergenie_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  })();

  const targetRole = savedProfile?.targetRole || 'Frontend Developer';

  const [loadingAI, setLoadingAI] = useState(false);
  const [strengths, setStrengths] = useState([]);
  const [roadmapSummary, setRoadmapSummary] = useState('');
  const [aiError, setAiError] = useState(null);

  // Missing skills from Career Match or default
  const [missingSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('careergenie_missing_skills');
      if (saved) return JSON.parse(saved);
      const match = localStorage.getItem('careergenie_match_result');
      if (match) {
        const parsed = JSON.parse(match);
        if (parsed.missingSkills?.length) return parsed.missingSkills;
      }
    } catch {}
    return ['TypeScript', 'Docker', 'Redux Toolkit', 'Jest Unit Testing', 'CI/CD Pipelines'];
  });

  // Detailed gap items with resources & projects
  const [gaps, setGaps] = useState(() => {
    const defaultResources = {
      'typescript': {
        priority: 'HIGH',
        duration: '1-2 weeks',
        resource: 'TypeScript Official Handbook & freeCodeCamp Course',
        resourceLink: 'https://www.typescriptlang.org/docs/',
        project: 'Migrate a standard JavaScript React app to TypeScript with strict types and interfaces.',
      },
      'docker': {
        priority: 'HIGH',
        duration: '1 week',
        resource: 'Docker Official Getting Started Guide & Play-with-Docker',
        resourceLink: 'https://docs.docker.com/get-started/',
        project: 'Containerize your frontend React app and backend API with a multi-stage Dockerfile.',
      },
      'redux toolkit': {
        priority: 'MEDIUM',
        duration: '3-5 days',
        resource: 'Redux Essentials Official Tutorial',
        resourceLink: 'https://redux-toolkit.js.org/',
        project: 'Build a shopping cart or dashboard with persistent global state and async thunks.',
      },
      'jest unit testing': {
        priority: 'MEDIUM',
        duration: '1 week',
        resource: 'Jest & React Testing Library Documentation',
        resourceLink: 'https://jestjs.io/docs/getting-started',
        project: 'Write unit tests and snapshot tests for core UI components and API handlers.',
      },
      'ci/cd pipelines': {
        priority: 'LOW',
        duration: '3-4 days',
        resource: 'GitHub Actions Documentation & Quickstart',
        resourceLink: 'https://docs.github.com/en/actions',
        project: 'Set up an automated GitHub Action that lints, tests, and deploys on git push.',
      },
    };

    return missingSkills.map((skill) => {
      const key = skill.toLowerCase();
      const meta = defaultResources[key] || {
        priority: 'MEDIUM',
        duration: '1-2 weeks',
        resource: `${skill} Documentation & Tutorial Guide`,
        resourceLink: 'https://freecodecamp.org',
        project: `Build a small portfolio project demonstrating practical implementation of ${skill}.`,
      };
      return {
        name: skill,
        ...meta,
        status: 'pending', // 'pending' | 'learned'
      };
    });
  });

  // Run AI Gap Analysis
  const handleRunAIGap = async () => {
    setLoadingAI(true);
    setAiError(null);
    try {
      let userSkills = [];
      try {
        const saved = localStorage.getItem('careergenie_profile');
        if (saved) {
          const p = JSON.parse(saved);
          userSkills = Object.values(p.skills || {}).flat();
        }
      } catch {}

      const res = await analyzeSkillGap({
        targetCareer: targetRole,
        missingSkills,
        userSkills,
      });

      if (res && res.gaps?.length) {
        const enriched = res.gaps.map((g) => ({
          name: g.skill,
          priority: g.priority || 'HIGH',
          duration: g.estimatedWeeks || '1-2 weeks',
          resource: g.learningResource || 'Official Documentation',
          resourceLink: 'https://freecodecamp.org',
          project: g.project || 'Hands-on portfolio project implementation',
          status: 'pending',
        }));
        setGaps(enriched);
        if (res.strengths?.length) setStrengths(res.strengths);
        if (res.learningRoadmapSummary) setRoadmapSummary(res.learningRoadmapSummary);
        addToast('✨ AI synthesized personalized learning curriculum and categorized strengths!', 'success');
      } else {
        throw new Error('AI analysis did not return curriculum items.');
      }
    } catch (err) {
      setAiError(err.message || 'AI service unavailable.');
      addToast(`Gap Analysis error: ${err.message || 'Failed to contact AI service.'}`, 'error');
    } finally {
      setLoadingAI(false);
    }
  };

  // Mark skill as learned and add to profile
  const handleMarkAsLearned = (skillName) => {
    setGaps((prev) =>
      prev.map((g) => (g.name === skillName ? { ...g, status: 'learned' } : g))
    );

    // Add to profile in localStorage
    try {
      const saved = localStorage.getItem('careergenie_profile');
      if (saved) {
        const profile = JSON.parse(saved);
        if (!profile.skills) profile.skills = {};
        if (!profile.skills.technical) profile.skills.technical = [];
        if (!profile.skills.technical.includes(skillName)) {
          profile.skills.technical.push(skillName);
          localStorage.setItem('careergenie_profile', JSON.stringify(profile));
        }
      }
    } catch {}

    addToast(`🎉 "${skillName}" marked as acquired and added to profile!`, 'success');
  };

  const completedCount = gaps.filter((g) => g.status === 'learned').length;
  const progressPercent = gaps.length ? Math.round((completedCount / gaps.length) * 100) : 0;

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
              <Badge variant="emerald" icon={GitPullRequest}>Tri-State Skill Matrix</Badge>
              <Badge variant="cyan">Target: {targetRole}</Badge>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Skill Gap &amp; <span className="gradient-text">Learning Curriculum</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', fontSize: '0.95rem' }}>
              Personalized roadmap designed to eliminate competency gaps between your profile and target job descriptions.
            </p>
          </div>

          <Button
            variant="primary"
            icon={Sparkles}
            onClick={handleRunAIGap}
            isLoading={loadingAI}
          >
            {loadingAI ? 'Analyzing Gaps with AI...' : '✨ AI Generate Bridge Plan'}
          </Button>
        </div>
      </Card>

      {/* Progress Overview Card */}
      <Card style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Curriculum Completion Progress</div>
          <Badge variant="emerald">{completedCount} of {gaps.length} Gaps Resolved</Badge>
        </div>
        <ProgressBar value={progressPercent} color="emerald" label="Skill Gap Bridge" />
        <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Completing these {gaps.length - completedCount} skills will bring your ATS match rate to over <strong>95%</strong>.
        </div>
      </Card>

      {/* AI Error Alert if any */}
      {aiError && (
        <Card style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#fca5a5', fontSize: '0.9rem' }}>
              ⚠️ <strong>AI Service Notice:</strong> {aiError}
            </div>
            <Button variant="secondary" size="sm" onClick={handleRunAIGap}>
              Retry AI Analysis
            </Button>
          </div>
        </Card>
      )}

      {/* AI Roadmap Strategic Summary */}
      {roadmapSummary && (
        <Card style={{ padding: '1.5rem', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-400)', textTransform: 'uppercase', marginBottom: '6px' }}>
            ✨ AI Strategic Learning Roadmap
          </div>
          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
            {roadmapSummary}
          </p>
        </Card>
      )}

      {/* Existing Strengths Recognized */}
      {strengths.length > 0 && (
        <Card style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', marginBottom: '8px' }}>
            ✓ Identified Core Strengths &amp; Matches ({strengths.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {strengths.map((st, sIdx) => (
              <span
                key={sIdx}
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: 'var(--accent-emerald)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                ✓ {st}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Gaps List Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Identified Skill Gaps &amp; Action Plans</h2>

        {gaps.map((item, idx) => {
          const isLearned = item.status === 'learned';
          return (
            <Card
              key={idx}
              style={{
                padding: '1.75rem',
                border: isLearned ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                background: isLearned ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-surface)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: isLearned ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.12)',
                      color: isLearned ? 'var(--accent-emerald)' : 'var(--primary-400)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isLearned ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', textDecoration: isLearned ? 'line-through' : 'none' }}>
                      {item.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                      <Badge variant={item.priority === 'HIGH' ? 'rose' : item.priority === 'MEDIUM' ? 'amber' : 'primary'} size="sm">
                        {item.priority} Priority
                      </Badge>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {item.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {isLearned ? (
                    <Badge variant="emerald" icon={CheckCircle2}>Acquired &amp; In Profile</Badge>
                  ) : (
                    <Button variant="secondary" size="sm" icon={Plus} onClick={() => handleMarkAsLearned(item.name)}>
                      Mark as Acquired
                    </Button>
                  )}
                </div>
              </div>

              {/* Resource & Project Box */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                  background: 'var(--bg-surface-elevated)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                    <BookOpen size={14} /> Recommended Free Resource
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                    {item.resource}
                  </div>
                  <a
                    href={item.resourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.78rem', color: 'var(--primary-400)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Open Official Resource <ExternalLink size={12} />
                  </a>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '4px' }}>
                    <FolderGit2 size={14} /> Suggested Portfolio Proof
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {item.project}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
