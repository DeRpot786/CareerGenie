import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  GitPullRequest,
  FileText,
  MessageSquareCode,
  Map,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const FeaturesPage = () => {
  const deepFeatures = [
    {
      id: 'career-match',
      title: 'Multidimensional Career Match Engine',
      tag: 'Signature Technology',
      desc: 'Our scoring engine evaluates your background against job specifications across 5 weighted dimensions: Skills Match, Keyword Coverage, Experience Duration, Projects Relevancy, and Education Alignment.',
      benefits: [
        'Deterministic calculation with transparent sub-scores',
        'Configurable weights based on target industry benchmarks',
        'Clear feedback indicating readiness status (Target Ready vs Needs Prep)',
      ],
      icon: Sparkles,
      color: 'var(--primary-400)',
    },
    {
      id: 'skill-gap',
      title: 'Actionable Skill Gap Breakdown',
      tag: 'Zero Guesswork',
      desc: 'Never wonder why you got rejected. Career Genie categorizes every skill in the JD into Matched, Partially Matched (aliases / adjacent tools), and Missing — with priority tags and project recommendations.',
      benefits: [
        'Strict partial-match awareness (e.g. knowing PostgreSQL is related to SQL)',
        'Priority tagging: High, Medium, Low based on role criticality',
        'Direct links to project generator ideas to quickly demonstrate mastery',
      ],
      icon: GitPullRequest,
      color: 'var(--accent-cyan)',
    },
    {
      id: 'resume-builder',
      title: 'ATS-Proof Resume Builder & PDF Generation',
      tag: 'Powered by OpenHTMLtoPDF',
      desc: 'Create beautiful, machine-readable resumes with drag-and-drop sections, template switching, and real-time live preview that matches the server-side PDF pixel for pixel.',
      benefits: [
        '6 professionally vetted templates: Minimal, Tech Clean, Modern, Academic, and more',
        'Deterministic ATS scoring across 6 key evaluation vectors',
        'Built-in AI phrase optimization using verified action verbs without false claims',
      ],
      icon: FileText,
      color: 'var(--accent-emerald)',
    },
    {
      id: 'interview-prep',
      title: 'Context-Aware Technical & Behavioral Interview Prep',
      tag: 'Role & Project Tailored',
      desc: 'Practice with comprehensive question banks curated by industry experts. Questions dynamically incorporate your real projects, testing your ability to defend your architecture decisions.',
      benefits: [
        '50+ curated questions spanning Fundamentals, System Design, and Behavioral STAR',
        'Practice mode with timers and editable sample answers',
        'Direct references to your actual GitHub project titles in prompts',
      ],
      icon: MessageSquareCode,
      color: 'var(--accent-purple)',
    },
    {
      id: 'roadmap',
      title: 'Ordered Career Milestones & Prerequisites',
      tag: 'Prerequisite Graph',
      desc: 'Stop learning topics out of order. Career Genie constructs personalized learning paths that respect prerequisites (e.g., HTML/CSS -> JavaScript -> React -> Next.js) so your foundation is rock solid.',
      benefits: [
        'Clear milestone breakdown: Foundation, Core Skills, Advanced Tools, Portfolio',
        'Status tracking: Not Started, In Progress, Completed',
        'Direct progress ring tracking on your student dashboard',
      ],
      icon: Map,
      color: 'var(--accent-amber)',
    },
  ];

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container-max">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Badge variant="primary" size="md" icon={Layers}>
            Comprehensive Platform Guide
          </Badge>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginTop: '1rem', letterSpacing: '-0.02em' }}>
            Features Designed for Career Success
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0.75rem auto 0', fontSize: '1.1rem' }}>
            Discover how each component of Career Genie empowers students and engineers to bridge the gap to their dream role.
          </p>
        </div>

        {/* Feature Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          {deepFeatures.map((item, idx) => {
            const Icon = item.icon;
            const isEven = idx % 2 === 0;

            return (
              <Card
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '3rem',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2.5rem',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ order: isEven ? 1 : 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: 'rgba(99, 102, 241, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: item.color,
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <Badge variant="cyan">{item.tag}</Badge>
                    </div>

                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '1rem' }}>
                      {item.title}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      {item.desc}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                      {item.benefits.map((b, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)', marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.925rem', color: 'var(--text-main)' }}>{b}</span>
                        </div>
                      ))}
                    </div>

                    <Link to="/register">
                      <Button variant="outline" size="sm">
                        Experience {item.title.split(' ')[0]} <Sparkles size={14} />
                      </Button>
                    </Link>
                  </div>

                  {/* Feature Visual Accent */}
                  <div
                    style={{
                      order: isEven ? 2 : 1,
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-color)',
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      minHeight: '260px',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                      Technology Highlights
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                      Built for Truthfulness & Precision
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      Engineered to provide immediate feedback loops so you know exactly where to invest your coding and study time.
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
