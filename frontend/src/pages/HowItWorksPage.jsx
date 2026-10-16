import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserCircle,
  FileSearch,
  Sparkles,
  GitBranch,
  FileCheck,
  Award,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const HowItWorksPage = () => {
  const roadmapSteps = [
    {
      step: '01',
      title: 'Build Your Student Profile',
      icon: UserCircle,
      desc: 'Input your academic background, programming languages, libraries, tools, and past projects. Our duplicate-prevention skills manager suggests synonyms automatically.',
      tip: 'Takes ~3 minutes. Can be updated anytime as you learn new skills.',
    },
    {
      step: '02',
      title: 'Define Target Role or Paste Job Description',
      icon: FileSearch,
      desc: 'Select from 11 pre-seeded industry benchmarks (e.g., Full Stack Engineer, DevOps Specialist, ML Engineer) or paste any real recruiter job posting.',
      tip: 'The AI tokenizer parses requirements, seniority, and technical keywords instantly.',
    },
    {
      step: '03',
      title: 'Run Career Match Analysis',
      icon: Sparkles,
      desc: 'The scoring engine evaluates your profile across Skills, Keywords, Experience, Projects, and Education, generating a verified score from 0 to 100%.',
      tip: 'Scores >= 80% indicate strong interview readiness; 60-79% means minor gaps.',
    },
    {
      step: '04',
      title: 'Analyze Your Skill Gaps',
      icon: GitBranch,
      desc: 'Review the three-way breakdown: Skills You Have, Partial Matches (syntax/framework aliases), and Missing Skills with high/medium/low priority tags.',
      tip: 'Generates specific project concepts you can build in 1-2 weeks to demonstrate missing skills.',
    },
    {
      step: '05',
      title: 'Generate an ATS-Optimized Resume',
      icon: FileCheck,
      desc: 'Choose from 6 clean, machine-parsable HTML/CSS templates. Reorder sections with drag-and-drop and export a server-side verified PDF.',
      tip: 'Guaranteed 100% truthfulness: highlights your real experience with punchy action verbs without fabricating metrics.',
    },
    {
      step: '06',
      title: 'Prepare for the Technical Interview',
      icon: Award,
      desc: 'Practice with curated technical & behavioral question banks. Test yourself with timer mode and practice defending the actual code in your portfolio.',
      tip: 'Questions dynamically reference the exact project names you listed on your profile.',
    },
  ];

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container-max">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <Badge variant="emerald" size="md">6-Step Methodology</Badge>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginTop: '1rem', letterSpacing: '-0.02em' }}>
            How Career Genie Works
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0.75rem auto 0', fontSize: '1.1rem' }}>
            A structured, repeatable process to take you from a student learner to a job-ready engineering candidate.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '840px', margin: '0 auto' }}>
          {roadmapSteps.map((item) => (
            <Card
              key={item.step}
                className="glass-panel"
                hover
                style={{
                  padding: '2rem',
                  display: 'flex',
                  gap: '1.75rem',
                  alignItems: 'flex-start',
                }}
              >
                {/* Step badge */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'var(--grad-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  {item.step}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {item.title}
                    </h3>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {item.desc}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.6rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(99, 102, 241, 0.08)',
                      border: '1px solid rgba(99, 102, 241, 0.15)',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                    <span><strong style={{ color: 'var(--text-main)' }}>Pro-Tip:</strong> {item.tip}</span>
                  </div>
                </div>
              </Card>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '4.5rem' }}>
          <Link to="/register">
            <Button variant="primary" size="lg" icon={ArrowRight}>
              Start Your Step 1 Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
