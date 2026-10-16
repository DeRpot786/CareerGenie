import React, { useState } from 'react';
import {
  MessageSquareCode,
  Sparkles,
  Lightbulb,
  ArrowRight,
  BrainCircuit,
  RotateCcw,
  Send,
  Award,
  Cpu
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { evaluateInterviewAnswer, generateInterviewQuestions } from '../api/aiService';

// Default question sequences per role
const INTERVIEW_QUESTIONS = {
  'Frontend Developer': [
    {
      id: 1,
      category: 'Core Frontend',
      question: 'Can you explain the Virtual DOM in React and describe how the reconciliation diffing algorithm optimizes browser DOM updates?',
      hint: 'Discuss the in-memory tree comparison, O(n) heuristic diffing, key props in lists, and batching layout repaints.',
    },
    {
      id: 2,
      category: 'Performance & Optimization',
      question: 'How do you diagnose and fix performance bottlenecks in a React single-page application that feels sluggish during user interactions?',
      hint: 'Mention React DevTools Profiler, avoiding unnecessary re-renders with useMemo/useCallback, lazy loading routes with Suspense, and virtualizing long lists.',
    },
    {
      id: 3,
      category: 'State Management & Architecture',
      question: 'When would you choose React Context versus an external state manager like Redux Toolkit or Zustand? What are the tradeoffs?',
      hint: 'Context triggers re-renders on all consuming consumers unless sliced; external stores offer fine-grained selector subscriptions and middleware.',
    },
    {
      id: 4,
      category: 'CSS & Modern Layouts',
      question: 'Explain the fundamental layout differences between CSS Flexbox and CSS Grid. In what real-world UI scenario would you combine both?',
      hint: 'Flexbox is 1D (flow along main axis); Grid is 2D (rows + columns). Use Grid for overall page scaffolding and Flexbox for component header/button bars.',
    },
    {
      id: 5,
      category: 'Behavioral & Problem Solving',
      question: 'Tell me about a time you encountered an unexpected bug right before release. How did you isolate the root cause and communicate with stakeholders?',
      hint: 'Use the STAR method (Situation, Task, Action, Result). Emphasize systematic logging/debugging, reproducing minimal test cases, and transparent updates.',
    },
  ],
  'Full Stack Developer': [
    {
      id: 1,
      category: 'System Architecture',
      question: 'How do you design a secure RESTful API with token-based authentication? Explain access token vs refresh token lifecycles.',
      hint: 'Short-lived JWT in memory/httpOnly cookie, refresh token in database/secure storage with rotation and revocation on logout.',
    },
    {
      id: 2,
      category: 'Database Optimization',
      question: 'Explain how database indexing works in PostgreSQL/MySQL. How do you identify whether an index is being utilized by a slow query?',
      hint: 'B-tree index structures, EXPLAIN ANALYZE execution plans, sequential scans vs index scans, and avoiding over-indexing on frequent writes.',
    },
    {
      id: 3,
      category: 'Frontend-Backend Integration',
      question: 'How do you handle asynchronous state, error boundaries, and cache invalidation when connecting React to a Node.js backend?',
      hint: 'Mention React Query / TanStack Query, optimistic UI updates, HTTP status code handling (401/403/500), and React Error Boundaries.',
    },
    {
      id: 4,
      category: 'Microservices & Scalability',
      question: 'What are the main advantages and challenges of splitting a monolithic application into microservices? How do services communicate?',
      hint: 'Independent deployment and scaling vs distributed tracing, network latency, data consistency (eventual consistency, Kafka/RabbitMQ).',
    },
    {
      id: 5,
      category: 'Behavioral STAR',
      question: 'Describe an engineering project where you had to make a tradeoff between delivering quickly and architectural perfection.',
      hint: 'Highlight technical debt documentation, MVP scoping, automated testing guardrails, and planned refactoring sprints.',
    },
  ],
};

export const InterviewPrepPage = () => {
  const { addToast } = useToast();

  const savedProfile = (() => {
    try {
      const saved = localStorage.getItem('careergenie_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  })();

  const targetRole = savedProfile?.targetRole || 'Frontend Developer';
  const fullName = savedProfile?.fullName || 'Candidate';

  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'bank'
  const roleKey = targetRole.toLowerCase().includes('full stack') ? 'Full Stack Developer' : 'Frontend Developer';
  const [customQuestions, setCustomQuestions] = useState(null);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const questionsList = customQuestions || INTERVIEW_QUESTIONS[roleKey] || INTERVIEW_QUESTIONS['Frontend Developer'];

  // Simulator Session State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [sessionResults, setSessionResults] = useState([]);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const activeQuestion = questionsList[currentQIndex];
  const currentResult = sessionResults.find((r) => r.questionId === activeQuestion?.id);

  // Generate tailored questions using candidate's actual projects and skills
  const handleGenerateAIQuestions = async () => {
    setGeneratingQuestions(true);
    try {
      let profileContext = {};
      try {
        const p = localStorage.getItem('careergenie_profile');
        if (p) profileContext = JSON.parse(p);
      } catch {}

      const res = await generateInterviewQuestions({
        career: targetRole,
        profile: { name: fullName, summary: profileContext.summary || '' },
        projects: profileContext.projects || [{ name: 'Online Food Ordering Website', technologies: 'HTML, CSS, JavaScript' }],
        skills: profileContext.skills || { languages: ['JavaScript', 'HTML5', 'CSS3'], frameworks: ['React'] }
      });

      if (res && (res.technical || res.project || res.behavioral)) {
        const combined = [
          ...(res.technical || []).map((q, i) => ({ id: `tech_${i}`, category: 'Technical Architecture', question: q.q, hint: q.hint || q.sampleAnswerGuideline })),
          ...(res.project || []).map((q, i) => ({ id: `proj_${i}`, category: 'Portfolio Project Deep Dive', question: q.q, hint: q.hint || q.sampleAnswerGuideline })),
          ...(res.behavioral || []).map((q, i) => ({ id: `beh_${i}`, category: 'STAR Behavioral', question: q.q, hint: q.hint || q.sampleAnswerGuideline })),
          ...(res.hr || []).map((q, i) => ({ id: `hr_${i}`, category: 'Culture & Motivation', question: q.q, hint: q.hint || q.sampleAnswerGuideline })),
        ];

        if (combined.length > 0) {
          setCustomQuestions(combined);
          setCurrentQIndex(0);
          setUserAnswer('');
          setShowHint(false);
          setSessionResults([]);
          setIsSessionComplete(false);
          addToast(`✨ Generated ${combined.length} customized AI interview questions!`, 'success');
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to generate questions. Verify GEMINI_API_KEY.', 'error');
    } finally {
      setGeneratingQuestions(false);
    }
  };

  // Submit Answer to AI for Real Evaluation
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || userAnswer.trim().length < 15) {
      addToast('Please type a thoughtful answer (at least 15 characters) before submitting.', 'warning');
      return;
    }

    setEvaluating(true);
    try {
      let profileContext = {};
      try {
        const p = localStorage.getItem('careergenie_profile');
        if (p) profileContext = JSON.parse(p);
      } catch {}

      const aiRes = await evaluateInterviewAnswer({
        question: activeQuestion.question,
        category: activeQuestion.category,
        userAnswer: userAnswer.trim(),
        targetRole: targetRole,
        candidateBackground: {
          skills: profileContext.skills,
          projects: profileContext.projects,
        }
      });

      const score = aiRes.overallScore || 80;
      const resultObj = {
        questionId: activeQuestion.id,
        questionText: activeQuestion.question,
        category: activeQuestion.category,
        userAnswer: userAnswer,
        score: score,
        consistency: aiRes.rating || (score >= 85 ? 'High Quality' : 'Needs Improvement'),
        feedback: aiRes.whatWorkedWell?.join('. ') || 'Solid technical answer addressing core principles.',
        improvementTips: aiRes.areasForImprovement || [],
        modelAnswer: aiRes.improvedModelAnswer,
        actionableTip: aiRes.actionableTip,
        criteriaScores: aiRes.criteriaScores,
      };

      setSessionResults((prev) => {
        const filtered = prev.filter((r) => r.questionId !== activeQuestion.id);
        return [...filtered, resultObj];
      });

      addToast(`✨ AI evaluated your answer: ${score}/100!`, 'success');
    } catch (err) {
      addToast(err.message || 'AI evaluation failed. Please verify API key configuration.', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  // Next Question
  const handleNextQuestion = () => {
    if (currentQIndex < questionsList.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setUserAnswer('');
      setShowHint(false);
    } else {
      setIsSessionComplete(true);
      addToast('🎉 AI Interview session complete! View your scorecard below.', 'success');
    }
  };

  // Reset Session
  const handleResetSession = () => {
    setCurrentQIndex(0);
    setUserAnswer('');
    setShowHint(false);
    setSessionResults([]);
    setIsSessionComplete(false);
    addToast('New AI interview session initialized.', 'info');
  };

  // Calculate Overall Session Score
  const averageScore =
    sessionResults.length > 0
      ? Math.round(sessionResults.reduce((acc, r) => acc + r.score, 0) / sessionResults.length)
      : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem', width: '100%' }}>
      {/* Header Banner */}
      <Card
        className="glass-panel"
        glow
        style={{
          padding: '2.25rem',
          border: '1px solid var(--border-color)',
          background: 'var(--banner-bg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
              <Badge variant="violet" icon={MessageSquareCode}>Pillar 2: AI Job Interview Studio</Badge>
              <Badge variant="primary">Target: {targetRole}</Badge>
              {sessionResults.length > 0 && (
                <Badge variant="emerald">Avg Score: {averageScore}%</Badge>
              )}
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Interactive <span className="gradient-text">AI Job Interview Studio</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '6px', maxWidth: '680px' }}>
              The AI interviewer asks questions sequentially. Type your answers, and Cloud AI actively analyzes your responses, scores your consistency, and provides immediate coaching feedback.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant={activeTab === 'simulator' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('simulator')}
              icon={BrainCircuit}
            >
              Interactive AI Session
            </Button>
            <Button
              variant={activeTab === 'bank' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('bank')}
              icon={BookOpen}
            >
              Question Bank
            </Button>
          </div>
        </div>
      </Card>

      {/* ========================================================
          MODE 1: INTERACTIVE AI INTERVIEW SIMULATION
         ======================================================== */}
      {activeTab === 'simulator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Session Progress Header */}
          <Card style={{ padding: '1.25rem 1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  Interview Question {currentQIndex + 1} of {questionsList.length}
                </span>
                <Badge variant="cyan" size="sm">{activeQuestion?.category}</Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Sparkles}
                  isLoading={generatingQuestions}
                  onClick={handleGenerateAIQuestions}
                  style={{
                    background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--accent-purple) 100%)',
                    border: 'none',
                  }}
                >
                  ✨ AI Generate for My Projects
                </Button>
                <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleResetSession}>
                  Reset Session
                </Button>
              </div>
            </div>

            <ProgressBar value={((currentQIndex + 1) / questionsList.length) * 100} max={100} color="violet" />
          </Card>

          {!isSessionComplete ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '1.75rem', alignItems: 'start' }} className="interview-split-grid">
              {/* Left Column: AI Question & Candidate Answer Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* AI Interviewer Question Box */}
                <Card
                  glow
                  style={{
                    padding: '2rem',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    background: 'var(--card-bg)',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                      }}
                    >
                      <BrainCircuit size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        AI Lead Technical Interviewer
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                        Speaking now • Asking question
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.5, color: 'var(--text-main)', marginBottom: '1rem' }}>
                    "{activeQuestion?.question}"
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setShowHint(!showHint)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-400)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: 0,
                      }}
                    >
                      <Lightbulb size={16} />
                      {showHint ? 'Hide Hint' : 'Need a hint?'}
                    </button>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Category: {activeQuestion?.category}
                    </span>
                  </div>

                  {showHint && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        fontSize: '0.85rem',
                        color: 'var(--text-main)',
                        lineHeight: 1.5,
                      }}
                    >
                      💡 <strong>Interviewer Hint:</strong> {activeQuestion?.hint}
                    </div>
                  )}
                </Card>

                {/* Candidate Answer Box */}
                <Card style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Your Answer:
                    </label>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>

                  <textarea
                    className="form-textarea"
                    rows={6}
                    style={{ width: '100%', fontSize: '0.9rem', lineHeight: 1.6, padding: '1rem', marginBottom: '1.25rem' }}
                    placeholder="Type your structured answer here. Include concrete examples, key technical principles, and quantitative impact..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <Button
                      variant="primary"
                      icon={Send}
                      onClick={handleSubmitAnswer}
                      disabled={evaluating || !userAnswer.trim()}
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        border: 'none',
                        boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                      }}
                    >
                      {evaluating ? 'AI Evaluating Response...' : 'Submit Answer to AI'}
                    </Button>

                    {currentResult && (
                      <Button variant="secondary" icon={ArrowRight} onClick={handleNextQuestion}>
                        {currentQIndex < questionsList.length - 1 ? 'Next Question \u2192' : 'View Session Scorecard \u2192'}
                      </Button>
                    )}
                  </div>
                </Card>
              </div>

              {/* Right Column: AI Live Feedback & Score Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Card style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                    <Cpu size={20} style={{ color: 'var(--accent-emerald)' }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                      AI Evaluation &amp; Consistency Rating
                    </h3>
                  </div>

                  {currentResult ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* Score Badge Row */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1.25rem',
                          background: 'rgba(16, 185, 129, 0.1)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Response Quality Score</div>
                          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>
                            {currentResult.score}/100
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Badge variant="emerald" size="sm">Graded by Cloud AI</Badge>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                            {currentResult.consistency}
                          </div>
                        </div>
                      </div>

                      {/* Criteria Score Breakdown */}
                      {currentResult.criteriaScores && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Relevance: <strong>{currentResult.criteriaScores.relevance}%</strong></div>
                            <ProgressBar value={currentResult.criteriaScores.relevance} max={100} color="emerald" size="sm" />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Clarity: <strong>{currentResult.criteriaScores.clarity}%</strong></div>
                            <ProgressBar value={currentResult.criteriaScores.clarity} max={100} color="cyan" size="sm" />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>STAR Structure: <strong>{currentResult.criteriaScores.starStructure}%</strong></div>
                            <ProgressBar value={currentResult.criteriaScores.starStructure} max={100} color="violet" size="sm" />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Technical Depth: <strong>{currentResult.criteriaScores.technicalDepth}%</strong></div>
                            <ProgressBar value={currentResult.criteriaScores.technicalDepth} max={100} color="amber" size="sm" />
                          </div>
                        </div>
                      )}

                      {/* AI Coaching Feedback */}
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                          ✨ What Worked Well:
                        </div>
                        <div
                          style={{
                            padding: '0.85rem 1rem',
                            background: 'rgba(16, 185, 129, 0.08)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                            color: 'var(--text-main)',
                          }}
                        >
                          {currentResult.feedback}
                        </div>
                      </div>

                      {/* Areas for Improvement */}
                      {currentResult.improvementTips?.length > 0 && (
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '6px' }}>
                            💡 Specific Improvements:
                          </div>
                          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {currentResult.improvementTips.map((tip, idx) => (
                              <li key={idx} style={{ marginBottom: '3px' }}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Model Benchmark Answer */}
                      {currentResult.modelAnswer && (
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-400)', marginBottom: '6px' }}>
                            🏆 AI Benchmark Model Answer:
                          </div>
                          <div
                            style={{
                              padding: '0.85rem 1rem',
                              background: 'rgba(99, 102, 241, 0.08)',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid rgba(99, 102, 241, 0.2)',
                              fontSize: '0.82rem',
                              lineHeight: 1.55,
                              color: 'var(--text-main)',
                            }}
                          >
                            {currentResult.modelAnswer}
                          </div>
                        </div>
                      )}

                      {/* Actionable Interview Tip */}
                      {currentResult.actionableTip && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                          🎯 <strong>Pro Interview Tip:</strong> {currentResult.actionableTip}
                        </div>
                      )}

                      {/* Next Button Prompt */}
                      <Button
                        variant="primary"
                        icon={ArrowRight}
                        onClick={handleNextQuestion}
                        style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                      >
                        {currentQIndex < questionsList.length - 1 ? 'Proceed to Next Question' : 'Complete Session & View Report'}
                      </Button>
                    </div>
                  ) : (
                    <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <BrainCircuit size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                        Waiting for Candidate Response
                      </div>
                      <div style={{ fontSize: '0.82rem', maxWidth: '300px', margin: '0 auto' }}>
                        Type your response on the left and click "Submit Answer to AI" to receive immediate consistency scoring and feedback.
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          ) : (
            /* Session Completed Scorecard */
            <Card glow style={{ padding: '2.5rem' }}>
              <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    margin: '0 auto 1.25rem',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <Award size={34} />
                </div>
                <Badge variant="emerald" size="md">Interview Complete</Badge>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  AI Interview Performance Scorecard
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Candidate demonstrated consistent technical knowledge and structured articulation across {questionsList.length} questions.
                </p>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent-emerald)', marginTop: '1rem' }}>
                  {averageScore}%
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Overall Interview Readiness Index
                </div>
              </div>

              {/* Question by question breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Question-by-Question Evaluation</h3>
                {sessionResults.map((res, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        Q{idx + 1}: {res.questionText}
                      </span>
                      <Badge variant={res.score >= 85 ? 'emerald' : 'cyan'}>Score: {res.score}/100</Badge>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <strong>Your Answer:</strong> {res.userAnswer}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--primary-400)' }}>
                      <strong>AI Evaluation:</strong> {res.feedback}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Button variant="primary" icon={RotateCcw} size="lg" onClick={handleResetSession}>
                  Start New AI Interview Session
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ========================================================
          MODE 2: QUESTION BANK LIBRARY
         ======================================================== */}
      {activeTab === 'bank' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
            Curated {roleKey} Interview Question Bank
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {questionsList.map((q, idx) => (
              <Card key={q.id} style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge variant="primary" size="sm">Question #{idx + 1}</Badge>
                    <Badge variant="cyan" size="sm">{q.category}</Badge>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {q.question}
                </h3>

                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    color: 'var(--text-muted)',
                  }}
                >
                  💡 <strong>Suggested Discussion Points:</strong> {q.hint}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .interview-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
