import React from 'react';
import {
  ShieldCheck,
  Code2,
  Database,
  Cpu,
  GraduationCap,
  Server,
  FileCheck
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const AboutPage = () => {
  const stackItems = [
    { name: 'Spring Boot 3', desc: 'Enterprise Java backend with Spring Security & JPA', icon: Server },
    { name: 'MySQL 8 & Flyway', desc: 'Relational schema with versioned database migrations', icon: Database },
    { name: 'React 18 & Vite', desc: 'Fast, modern client with custom design system tokens', icon: Code2 },
    { name: 'OpenHTMLtoPDF', desc: 'High-fidelity, exact server-side PDF document compilation', icon: FileCheck },
    { name: 'Deterministic AI Engine', desc: 'MockAIService tokenization & DB skill synonym dictionary', icon: Cpu },
    { name: 'JWT & BCrypt', desc: 'Stateless token authorization with robust role-based security', icon: ShieldCheck },
  ];

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container-max">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Badge variant="cyan" size="md" icon={GraduationCap}>
            Major Project Architecture
          </Badge>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginTop: '1rem', letterSpacing: '-0.02em' }}>
            About Career Genie
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0.75rem auto 0', fontSize: '1.1rem' }}>
            Designed as an end-to-end career acceleration system for engineering students, bridging academic education with industry expectations.
          </p>
        </div>

        {/* Mission Card */}
        <Card
          className="glass-panel"
          glow
          style={{
            padding: '3rem',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            marginBottom: '3.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>
            Our Mission & The Core Problem
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Most resume builders treat CV creation like a graphic design task — focusing on color palettes while ignoring the actual content match between the candidate and the job requirements. Students repeatedly apply to jobs without understanding why their resumes fail applicant tracking systems (ATS) or technical screenings.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            <strong>Career Genie flips the paradigm:</strong> We start with the job description and your real skills. Our platform answers: <em>"Here is the job you want. Here is what you have. Here is what you are missing. Here is how to acquire it. Here is the CV to build. Here is how to pass the interview."</em>
          </p>
        </Card>

        {/* Truthfulness & Ethics Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-emerald)',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              The Truthfulness & Ethics Pledge
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Unlike generic AI tools that hallucinate fake metrics (e.g. "improved database queries by 47.3%"), Career Genie operates under strict engineering honesty principles:
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <Card style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                1. No Fabricated Metrics
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                AI prompts and deterministic templates will never generate unverified performance statistics or false claims for your projects.
              </p>
            </Card>

            <Card style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                2. Explainable Match Scores
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Every percentage is broken down into 5 verifiable sub-scores with direct references to matched keywords and skill taxonomies.
              </p>
            </Card>

            <Card style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                3. Grounded Career Guidance
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Missing skills link to tangible, full-stack project ideas so students can acquire genuine experience before applying.
              </p>
            </Card>
          </div>
        </div>

        {/* Architecture & Tech Stack */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            System Architecture & Tech Stack
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {stackItems.map((st, i) => {
              const Icon = st.icon;
              return (
                <Card key={i} hover style={{ padding: '1.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-400)',
                      marginBottom: '1rem',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    {st.name}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    {st.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
