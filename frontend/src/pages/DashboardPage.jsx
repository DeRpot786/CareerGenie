import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  MessageSquareCode,
  CheckCircle2,
  ArrowRight,
  User,
  Settings,
  Cpu,
  Target
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const DashboardPage = () => {
  const savedProfile = (() => {
    try {
      const saved = localStorage.getItem('careergenie_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  })();

  // Three Primary Action Pillars requested by the user
  const primaryPillars = [
    {
      step: 'Pillar 01',
      title: 'AI CV Maker',
      subtitle: 'Step-by-Step Builder & Live Sideways Preview',
      desc: 'Craft an ATS-optimized CV with a guided step-by-step workflow on the left (personal info, target job, AI summary, projects) and real-time live preview on the right. Print and export clean PDFs without website UI clutter.',
      icon: FileText,
      link: '/resume-builder',
      color: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      accentColor: '#6366f1',
      badge: 'Step Flow + Live Preview',
      badgeVariant: 'primary',
      features: [
        'Left-side guided steps (Contact → Job → Summary → Projects → Export)',
        'Right-side sticky live paper preview updating on every keystroke',
        '6 ATS-verified design templates with custom color accents',
        'Direct clean PDF printing isolated to CV content only'
      ],
      actionText: 'Open AI CV Maker',
    },
    {
      step: 'Pillar 02',
      title: 'AI Job Interview Studio',
      subtitle: 'Interactive AI-Conducted Practice & Scoring',
      desc: 'Experience real-time AI interview simulations. The AI interviewer asks questions sequentially, you type your answers, and the AI actively scores your consistency, technical accuracy, and provides instant coaching feedback.',
      icon: MessageSquareCode,
      link: '/interview-prep',
      color: 'linear-gradient(135deg, #ec4899, #f43f5e)',
      accentColor: '#ec4899',
      badge: 'Live AI Simulator',
      badgeVariant: 'violet',
      features: [
        'AI interviewer presents targeted role questions one-by-one',
        'Type your response and submit for instant AI evaluation',
        'AI scores consistency, technical depth, and communication clarity',
        'End-of-session comprehensive performance scorecard'
      ],
      actionText: 'Start AI Interview',
    },
    {
      step: 'Pillar 03',
      title: 'Audit CV & Fix ATS Issues',
      subtitle: 'ATS Auditor, Keyword Matcher & One-Click Fixer',
      desc: 'Audit your CV against target job requirements. Career Genie checks ATS compliance across 5 metrics, identifies missing keywords, and automatically updates your CV ready for instant export.',
      icon: Sparkles,
      link: '/career-match',
      color: 'linear-gradient(135deg, #10b981, #06b6d4)',
      accentColor: '#10b981',
      badge: 'ATS Auditor & Optimizer',
      badgeVariant: 'emerald',
      features: [
        'Scan your CV against target job requirements',
        'Deterministic & Cloud AI ATS score analysis across 5 metrics',
        'Identifies missing critical job keywords and skill gaps',
        'One-click AI CV fix and direct transfer to Live CV Maker'
      ],
      actionText: 'Analyze & Fix CV',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem', width: '100%' }}>
      {/* Welcome Banner */}
      <Card
        className="glass-panel"
        glow
        style={{
          padding: '2.5rem',
          border: '1px solid var(--border-color)',
          background: 'var(--banner-bg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
              <Badge variant="primary" icon={Target}>
                Target: {savedProfile?.targetRole || 'Frontend Developer'}
              </Badge>
              <Badge variant="emerald" icon={CheckCircle2}>
                System Ready
              </Badge>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Welcome to <span className="gradient-text">{savedProfile?.fullName ? `${savedProfile.fullName}'s Workspace` : 'Career Genie'}</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '650px', fontSize: '0.98rem', lineHeight: 1.6 }}>
              Your dedicated 3-pillar career accelerator is ready. Build your CV with real-time live preview, simulate AI job interviews with consistency scoring, and audit your CV against job postings to fix ATS issues.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/profile">
              <Button variant="secondary" icon={User} size="md">
                Profile &amp; Role
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="outline" icon={Settings} size="md">
                Settings &amp; Password
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* 3 Core Pillars Section Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-400)', marginBottom: '4px' }}>
              Focused Career Workflow
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Three Core Career Pillars
            </h2>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Choose an action to launch your next career milestone
          </span>
        </div>

        {/* 3 Pillar Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {primaryPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={idx}
                hover
                glow
                style={{
                  padding: '2.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 'var(--radius-xl)',
                  position: 'relative',
                  border: '1px solid var(--border-color)',
                  background: 'var(--card-bg)',
                  transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
                }}
              >
                {/* Pillar Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: pillar.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: `0 8px 20px ${pillar.accentColor}33`,
                    }}
                  >
                    <Icon size={26} />
                  </div>
                  <Badge variant={pillar.badgeVariant} size="sm">
                    {pillar.step}
                  </Badge>
                </div>

                {/* Pillar Title & Description */}
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                  {pillar.title}
                </h3>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: pillar.accentColor, marginBottom: '0.85rem' }}>
                  {pillar.subtitle}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {pillar.desc}
                </p>

                {/* Feature Bullet Points */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '1.1rem',
                    background: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '1.75rem',
                    flex: 1,
                  }}
                >
                  {pillar.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: 'var(--text-main)' }}>
                      <CheckCircle2 size={15} style={{ color: pillar.accentColor, marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ lineHeight: 1.4 }}>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Primary Action Button */}
                <Link to={pillar.link} style={{ width: '100%', textDecoration: 'none' }}>
                  <Button
                    variant="primary"
                    style={{
                      width: '100%',
                      background: pillar.color,
                      border: 'none',
                      boxShadow: `0 4px 14px ${pillar.accentColor}40`,
                      fontWeight: 700,
                      justifyContent: 'center',
                    }}
                    icon={ArrowRight}
                  >
                    {pillar.actionText}
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Status Bar */}
      <Card style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-400)',
              }}
            >
              <Cpu size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Gemini Cloud AI Engine Connected</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Deterministic fallback engine active for 100% continuous uptime and instant response speeds.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/profile">
              <Button variant="outline" size="sm">
                Target Role Studio
              </Button>
            </Link>
            <Link to="/roadmap">
              <Button variant="outline" size="sm">
                Career Roadmap
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
