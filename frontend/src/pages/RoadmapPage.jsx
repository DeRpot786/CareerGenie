import React, { useState } from 'react';
import {
  Map,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  X,
  Send,
  Compass,
  FolderGit2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { getCareerGuidance, callAI } from '../api/aiService';

const INITIAL_ROADMAPS = {
  'Frontend Developer': [
    { id: 'fe-html', title: 'HTML5 Semantic Architecture', desc: 'Semantic tags, web accessibility (a11y), responsive viewport, form validation.', category: 'Foundation' },
    { id: 'fe-css', title: 'Modern CSS3 & Design Systems', desc: 'CSS Flexbox, Grid layouts, custom CSS properties, media queries, keyframe animations.', category: 'Foundation' },
    { id: 'fe-js', title: 'JavaScript (ES6+) Deep Dive', desc: 'Asynchronous event loop, Promises, async/await, closures, DOM manipulation, fetch API.', category: 'Core Language' },
    { id: 'fe-git', title: 'Git & GitHub Collaboration', desc: 'Branching strategies, pull requests, merge conflict resolution, CI/CD actions.', category: 'Tooling' },
    { id: 'fe-react', title: 'React.js Component Architecture', desc: 'Functional components, useState, useEffect, custom hooks, Context API, React Router.', category: 'Framework' },
    { id: 'fe-tailwind', title: 'Tailwind CSS & Styling', desc: 'Utility-first rapid prototyping, theme customization, responsive breakpoints.', category: 'Styling' },
    { id: 'fe-api', title: 'RESTful API & Asynchronous State', desc: 'Axios, caching, optimistic UI updates, error boundary handling.', category: 'Integration' },
    { id: 'fe-ts', title: 'TypeScript for Scale', desc: 'Interfaces, type unions, generics, strict type checking in React applications.', category: 'Advanced' },
    { id: 'fe-test', title: 'Frontend Testing & Quality', desc: 'Unit testing with Jest/Vitest, React Testing Library, UI component snapshots.', category: 'Quality' },
    { id: 'fe-perf', title: 'Web Vitals & Performance', desc: 'Code splitting, lazy loading, image optimization, Lighthouse 90+ audits.', category: 'Production' },
  ],
  'Backend Developer': [
    { id: 'be-lang', title: 'Backend Programming Mastery', desc: 'Python / Java / Node.js fundamentals, OOP, data structures, and async I/O.', category: 'Foundation' },
    { id: 'be-sql', title: 'Relational Database Architecture', desc: 'PostgreSQL / MySQL, ACID transactions, complex JOINs, indexing, and normalization.', category: 'Data' },
    { id: 'be-api', title: 'REST & GraphQL API Design', desc: 'HTTP verbs, status codes, JSON payload contracts, and error standardization.', category: 'Architecture' },
    { id: 'be-auth', title: 'Authentication & Security', desc: 'JWT tokens, OAuth2, bcrypt hashing, CORS policies, and rate limiting.', category: 'Security' },
    { id: 'be-nosql', title: 'Caching & NoSQL Storage', desc: 'Redis in-memory caching, MongoDB document storage, and query optimization.', category: 'Data' },
    { id: 'be-docker', title: 'Docker Containerization', desc: 'Dockerfiles, Docker Compose, multi-stage builds, and container networking.', category: 'DevOps' },
    { id: 'be-cloud', title: 'Cloud Infrastructure & Deployments', desc: 'AWS/GCP basics, S3 storage, serverless functions, and CI/CD automation.', category: 'Cloud' },
  ],
  'Full Stack Developer': [
    { id: 'fs-frontend', title: 'Modern React Frontend', desc: 'Component hierarchies, state management, and responsive styling.', category: 'Frontend' },
    { id: 'fs-backend', title: 'Node.js / Express or Spring Boot', desc: 'Controller-service architecture, middleware, and request validation.', category: 'Backend' },
    { id: 'fs-db', title: 'Full Stack Database Modeling', desc: 'Relational SQL + Redis caching and ORM/JPA integration.', category: 'Data' },
    { id: 'fs-git', title: 'Collaborative Git & Version Control', desc: 'Git workflows, release tags, and automated test runners.', category: 'DevOps' },
    { id: 'fs-docker', title: 'Containerization & Cloud Deployment', desc: 'Dockerizing full stack applications and deploying on Vercel/AWS.', category: 'DevOps' },
  ],
};

export const RoadmapPage = () => {
  const { addToast } = useToast();

  const savedProfile = (() => {
    try {
      const saved = localStorage.getItem('careergenie_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  })();

  const [roadmaps, setRoadmaps] = useState(INITIAL_ROADMAPS);
  const [selectedRole, setSelectedRole] = useState(
    INITIAL_ROADMAPS[savedProfile?.targetRole] ? savedProfile?.targetRole : 'Frontend Developer'
  );

  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('careergenie_roadmap_progress');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { 'fe-html': true, 'fe-css': true };
  });

  // AI Career Advisor Modal State
  const [advisorModal, setAdvisorModal] = useState({
    isOpen: false,
    loading: false,
    data: null,
    error: null,
    interests: 'Modern web architectures, responsive design, APIs, cloud deployments',
    followUpQuestion: '',
    askingFollowUp: false,
    followUps: [],
  });

  const currentSteps = roadmaps[selectedRole] || roadmaps['Frontend Developer'] || [];

  const toggleStep = (id) => {
    setCompletedSteps((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('careergenie_roadmap_progress', JSON.stringify(updated));
      return updated;
    });
    addToast('Roadmap milestone updated!', 'info');
  };

  const completedCount = currentSteps.filter((s) => completedSteps[s.id]).length;
  const progressPercent = currentSteps.length ? Math.round((completedCount / currentSteps.length) * 100) : 0;

  // Run AI Career Guidance
  const handleOpenAdvisor = async () => {
    setAdvisorModal((prev) => ({ ...prev, isOpen: true, loading: true, error: null }));
    try {
      let profileSkills = [];
      try {
        const saved = localStorage.getItem('careergenie_profile');
        if (saved) {
          const p = JSON.parse(saved);
          profileSkills = Object.values(p.skills || {}).flat();
        }
      } catch {}

      const res = await getCareerGuidance({
        interests: advisorModal.interests,
        currentSkills: profileSkills.length ? profileSkills : ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git'],
        education: savedProfile?.education?.[0]?.degree || 'B.Tech in Computer Science',
        experience: savedProfile?.experience || [],
        targetRole: savedProfile?.targetRole || selectedRole,
      });

      if (res && res.recommendations?.length) {
        setAdvisorModal((prev) => ({
          ...prev,
          loading: false,
          data: res,
          error: null,
        }));
        addToast('✨ AI Career Guidance synthesized!', 'success');
      } else {
        throw new Error('AI Career Advisor did not return recommendations.');
      }
    } catch (err) {
      setAdvisorModal((prev) => ({ ...prev, loading: false, error: err.message }));
      addToast(`Career Guidance error: ${err.message || 'AI service error.'}`, 'error');
    }
  };

  // Adopt AI Roadmap into Interactive Milestones
  const handleAdoptRoadmap = (rec) => {
    if (!rec.learningRoadmap || !rec.learningRoadmap.length) {
      addToast('No sequential roadmap attached to this recommendation.', 'warning');
      return;
    }

    const formattedSteps = rec.learningRoadmap.map((item, idx) => ({
      id: `ai-${rec.role.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idx}`,
      title: item.title,
      category: item.category || 'Specialization',
      desc: item.desc || 'Master this core competency for this career trajectory.',
    }));

    setRoadmaps((prev) => ({
      ...prev,
      [rec.role]: formattedSteps,
    }));
    setSelectedRole(rec.role);
    setAdvisorModal((prev) => ({ ...prev, isOpen: false }));
    addToast(`🚀 Activated "${rec.role}" sequential learning roadmap!`, 'success');
  };

  // Ask Follow-Up Question to Refine Guidance
  const handleAskFollowUp = async (e) => {
    e?.preventDefault();
    if (!advisorModal.followUpQuestion.trim()) return;

    const q = advisorModal.followUpQuestion.trim();
    setAdvisorModal((prev) => ({ ...prev, askingFollowUp: true }));

    try {
      const res = await callAI('career_chat', {
        messages: [
          {
            role: 'system',
            content: `You are an expert career advisor. The user was recommended these roles: ${advisorModal.data?.recommendations?.map((r) => r.role).join(', ')}. Answer their question specifically with realistic next steps, resources, and advice.`,
          },
          { role: 'user', content: q },
        ],
      });

      const reply = res.reply || 'Focus on building one end-to-end portfolio project every month to validate these competencies.';
      setAdvisorModal((prev) => ({
        ...prev,
        askingFollowUp: false,
        followUpQuestion: '',
        followUps: [...prev.followUps, { question: q, answer: reply }],
      }));
      addToast('✨ AI Counselor answered your follow-up!', 'success');
    } catch (err) {
      setAdvisorModal((prev) => ({ ...prev, askingFollowUp: false }));
      addToast(`Follow-up error: ${err.message || 'AI service error.'}`, 'error');
    }
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
              <Badge variant="amber" icon={Map}>Sequential Roadmap</Badge>
              <Badge variant="emerald">{progressPercent}% Completed</Badge>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Prerequisite Graph <span className="gradient-text">Learning Roadmap</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', fontSize: '0.95rem' }}>
              Structured, step-by-step career path with milestones sequenced from foundational essentials to advanced production engineering.
            </p>
          </div>

          {/* Action & Role Switcher */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <Button
              variant="primary"
              icon={Sparkles}
              size="md"
              onClick={handleOpenAdvisor}
            >
              ✨ AI Career Path Advisor
            </Button>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.keys(roadmaps).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  style={{
                    background: selectedRole === role ? 'var(--primary-600)' : 'var(--bg-surface-elevated)',
                    color: selectedRole === role ? '#fff' : 'var(--text-muted)',
                    border: selectedRole === role ? '1px solid var(--primary-500)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '6px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Bar */}
      <Card style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
            {selectedRole} Milestone Mastery
          </div>
          <Badge variant={progressPercent === 100 ? 'emerald' : 'cyan'}>
            {completedCount} of {currentSteps.length} Milestones Achieved
          </Badge>
        </div>
        <ProgressBar value={progressPercent} color={progressPercent >= 70 ? 'emerald' : 'cyan'} />
      </Card>

      {/* Sequenced Milestones Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {currentSteps.map((step, idx) => {
          const isDone = !!completedSteps[step.id];
          return (
            <Card
              key={step.id}
              style={{
                padding: '1.5rem',
                border: isDone ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                background: isDone ? 'rgba(16, 185, 129, 0.03)' : 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Step Number Badge */}
              <button
                type="button"
                onClick={() => toggleStep(step.id)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: isDone ? 'var(--accent-emerald)' : 'var(--bg-surface-elevated)',
                  border: isDone ? 'none' : '2px solid var(--border-color)',
                  color: isDone ? '#fff' : 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
                title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
              >
                {isDone ? <CheckCircle2 size={24} /> : <span style={{ fontWeight: 800 }}>{idx + 1}</span>}
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {step.title}
                  </h3>
                  <Badge variant="primary" size="sm">{step.category}</Badge>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
                  {step.desc}
                </p>
              </div>

              <div>
                <Button
                  variant={isDone ? 'outline' : 'secondary'}
                  size="sm"
                  onClick={() => toggleStep(step.id)}
                >
                  {isDone ? 'Completed ✓' : 'Mark Done'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ========================================================
          AI CAREER GUIDANCE & ADVISOR MODAL
         ======================================================== */}
      {advisorModal.isOpen && (
        <div
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
              maxWidth: '840px',
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
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid var(--border-color, #334155)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '6px', borderRadius: '8px' }}>
                  <Compass size={20} style={{ color: 'var(--primary-400, #818cf8)' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>✨ AI Career Guidance &amp; Path Advisor</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Personalized trajectory recommendations mapped directly from your skills and interests.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdvisorModal((prev) => ({ ...prev, isOpen: false }))}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {advisorModal.loading && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <RefreshCw size={36} className="animate-spin" style={{ color: 'var(--primary-400)', margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Synthesizing Career Trajectories...</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Evaluating tech industry benchmarks, role prerequisites, and skill affinities.
                  </div>
                </div>
              )}

              {advisorModal.error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '8px', color: '#fca5a5' }}>
                  <div style={{ fontWeight: 700 }}>Advisor Error</div>
                  <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>{advisorModal.error}</div>
                  <Button variant="secondary" size="sm" onClick={handleOpenAdvisor} style={{ marginTop: '10px' }}>
                    Retry Guidance
                  </Button>
                </div>
              )}

              {advisorModal.data && (
                <>
                  {/* Executive Summary */}
                  {advisorModal.data.counselorAdvice && (
                    <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-400)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Executive Counselor Assessment
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                        {advisorModal.data.counselorAdvice}
                      </div>
                    </div>
                  )}

                  {/* Recommendations Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Recommended Career Trajectories ({advisorModal.data.recommendations?.length || 0})
                    </div>

                    {advisorModal.data.recommendations?.map((rec, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                {rec.role}
                              </h4>
                              <Badge variant={rec.matchScore >= 80 ? 'emerald' : 'amber'}>
                                {rec.matchScore}% Match
                              </Badge>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                              {rec.fitReason}
                            </div>
                          </div>

                          <Button
                            variant="primary"
                            size="sm"
                            icon={ArrowRight}
                            onClick={() => handleAdoptRoadmap(rec)}
                          >
                            Adopt This Roadmap
                          </Button>
                        </div>

                        {/* Required skills */}
                        {rec.requiredSkills?.length > 0 && (
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                              Key Competencies Needed
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {rec.requiredSkills.map((sk, sIdx) => (
                                <span
                                  key={sIdx}
                                  style={{
                                    background: 'var(--bg-surface-elevated)',
                                    border: '1px solid var(--border-color)',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: 'var(--text-main)',
                                  }}
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommended Projects */}
                        {rec.recommendedProjects?.length > 0 && (
                          <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-400)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FolderGit2 size={13} /> Recommended Portfolio Projects
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                              {rec.recommendedProjects.map((proj, pIdx) => (
                                <li key={pIdx}>{proj}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Follow-Up Section */}
                  <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      💬 Refine Recommendations or Ask Follow-Up Questions
                    </div>

                    {advisorModal.followUps.map((fu, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-400)' }}>
                          Q: {fu.question}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                          {fu.answer}
                        </div>
                      </div>
                    ))}

                    <form onSubmit={handleAskFollowUp} style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. How can I transition if I only have 5 hours a week? Or what certifications matter?"
                        style={{ flex: 1, fontSize: '0.85rem', padding: '8px 12px' }}
                        value={advisorModal.followUpQuestion}
                        onChange={(e) => setAdvisorModal((prev) => ({ ...prev, followUpQuestion: e.target.value }))}
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        type="submit"
                        icon={Send}
                        disabled={advisorModal.askingFollowUp}
                      >
                        {advisorModal.askingFollowUp ? 'Thinking...' : 'Ask AI'}
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid var(--border-color, #334155)', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="secondary" size="sm" onClick={() => setAdvisorModal((prev) => ({ ...prev, isOpen: false }))}>
                Close Advisor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
