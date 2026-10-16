import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  GitPullRequest,
  ShieldCheck,
  Zap,
  Layout,
  Download
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CircularProgress } from '../components/ui/CircularProgress';

export const LandingPage = () => {
  const steps = [
    { num: '01', title: 'Enter Personal Details', desc: 'Input your contact info, target career role, and education with clear, intuitive form fields.' },
    { num: '02', title: 'Detail Experience & Projects', desc: 'Add work experiences, internships, technical projects, and skills without account barriers.' },
    { num: '03', title: 'AI Enhancement', desc: 'Synthesize impactful summaries and polish bullet points using the Google X-Y-Z formula powered by AI.' },
    { num: '04', title: 'Select Architecture', desc: 'Choose from 8 verified ATS-friendly layouts and customize colors with real-time live preview.' },
    { num: '05', title: 'Download Clean PDF', desc: 'Export your print-optimized, recruiter-ready CV directly — completely free with no account needed.' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Direct CV Builder',
      desc: 'Open the website, enter your information, and watch your CV update in real-time. Zero login or signup walls.',
      badge: 'Free & Open',
      color: 'var(--primary-400)',
    },
    {
      icon: Layout,
      title: '8 Professional Templates',
      desc: 'Choose from 8 genuinely distinct layouts (Classic, Modern, Minimal, Compact, Executive, Developer) tailored for ATS screening.',
      badge: 'ATS-Compliant',
      color: 'var(--accent-cyan)',
    },
    {
      icon: ShieldCheck,
      title: 'Truthful AI Assistance',
      desc: 'Polish bullet points with authoritative action verbs and generate role summaries grounded strictly in your real background.',
      badge: 'No Hallucinations',
      color: 'var(--accent-emerald)',
    },
    {
      icon: Download,
      title: 'Instant PDF Export',
      desc: 'One-click clean PDF export formatted to standard A4/Letter specs with crisp typography and isolated print styling.',
      badge: 'Account-Free',
      color: 'var(--accent-purple)',
    },
    {
      icon: GitPullRequest,
      title: 'Role & Skill Targeting',
      desc: 'Select or enter your target role and get AI-recommended in-demand skills and keywords to pass recruiter filters.',
      badge: 'Keyword Optimized',
      color: 'var(--accent-amber)',
    },
    {
      icon: Zap,
      title: 'Fast & Private in Browser',
      desc: 'Your data lives in your browser local storage. Nothing is locked behind an account, paywall, or subscription.',
      badge: 'Private & Secure',
      color: '#38bdf8',
    },
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Hero Section */}
      <section style={{ padding: '6rem 0 5rem', textAlign: 'center', position: 'relative' }}>
        <div className="container-max">
          <div style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
            <Badge variant="primary" size="md" icon={Zap}>
              Create your professional CV for free — no account required
            </Badge>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
              maxWidth: '920px',
              margin: '0 auto 1.5rem',
            }}
          >
            Create Your Professional CV. <br />
            <span className="gradient-text">Free &amp; No Account Required.</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-muted)',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Create your professional CV for free — no account required. Enter your details, choose from modern ATS-compliant templates, enhance with truthful AI, and download your clean PDF immediately.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '4rem',
            }}
          >
            <Link to="/builder">
              <Button variant="primary" size="lg" icon={Sparkles}>
                Create My CV
              </Button>
            </Link>
            <Link to="/templates">
              <Button variant="secondary" size="lg">
                Browse CV Templates
              </Button>
            </Link>
          </div>

          {/* Interactive Hero Showcase Preview */}
          <div style={{ maxWidth: '1020px', margin: '0 auto', position: 'relative' }}>
            <Card
              className="glass-panel"
              glow
              style={{
                padding: '2.5rem',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '2rem',
                  alignItems: 'center',
                  textAlign: 'left',
                }}
              >
                {/* Left Match Highlight */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                    <Badge variant="cyan">Instant CV Generation</Badge>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target: Full Stack Developer</span>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                    Alex Thomas — Software Engineer
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    Full-featured CV builder with real-time two-column layout. Edit credentials on the left while your verified ATS resume formats cleanly on the right.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/builder">
                      <Button variant="primary" size="sm" icon={Sparkles}>
                        Build This CV Now
                      </Button>
                    </Link>
                    <Link to="/templates">
                      <Button variant="secondary" size="sm">
                        View 8 Templates
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right Progress Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                    <CircularProgress value={94} size={80} strokeWidth={8} color="var(--accent-emerald)" showPercent />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>ATS Optimization Score</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Clean single/two-column hierarchy, zero parsing traps</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Export Format</div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-400)', marginTop: '2px' }}>Recruiter PDF</div>
                    </div>
                    <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Access Tier</div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-emerald)', marginTop: '2px' }}>100% Free</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 5-Step Direct User Journey */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container-max">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="cyan" size="md">Simple 5-Step Flow</Badge>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
              How Direct CV Creation Works
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '620px', margin: '0.5rem auto 0', fontSize: '1.05rem' }}>
              Open website → Enter details → Generate CV → Preview CV → Download CV
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {steps.map((st) => (
              <Card
                key={st.num}
                className="glass-panel"
                hover
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  border: '1px solid var(--border-color)',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary-500)', opacity: 0.85, fontFamily: 'monospace' }}>
                  {st.num}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {st.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {st.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container-max">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Badge variant="primary" size="md">Comprehensive CV Engine</Badge>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
              Built for Engineering Students &amp; Job Seekers
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '620px', margin: '0.5rem auto 0', fontSize: '1.05rem' }}>
              Everything you need to craft an executive-grade resume without signups, paywalls, or privacy trade-offs.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <Card
                  key={idx}
                  className="glass-panel"
                  hover
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp size={24} style={{ color: feat.color }} />
                    </div>
                    <Badge size="sm">{feat.badge}</Badge>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {feat.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                    {feat.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container-max" style={{ textAlign: 'center' }}>
          <div
            className="glass-panel"
            style={{
              padding: '3.5rem 2rem',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, rgba(17, 24, 39, 0.95) 100%)',
            }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Create your professional CV for free — no account required
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
              No signup forms, passwords, or subscriptions. Start entering your details and download your recruiter-ready CV today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/builder">
                <Button variant="primary" size="lg" icon={Sparkles}>
                  Create My CV
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="secondary" size="lg">
                  Browse CV Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;
