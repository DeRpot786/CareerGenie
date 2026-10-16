import React from 'react';
import { normalizeResumeData, hexToRgba } from './templateUtils';

export const ModernSidebarTemplate = ({ resume, accentColor = '#0f766e' }) => {
  const data = normalizeResumeData(resume);

  // Compute initials for visual avatar badge
  const initials = data.fullName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      id="printable-cv"
      className="printable-cv-document template-modern-sidebar"
      style={{
        width: '100%',
        maxWidth: '100%',
        background: '#ffffff',
        color: '#0f172a',
        boxSizing: 'border-box',
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
        lineHeight: 1.5,
        fontSize: '11.5px',
        display: 'flex',
        minHeight: '297mm', // Natural A4 proportion
      }}
    >
      {/* ── VISUALLY DISTINCT VERTICAL SIDEBAR (32% Width) ── */}
      <aside
        style={{
          width: '32%',
          background: '#f8fafc',
          borderRight: '1.5px solid #e2e8f0',
          padding: '16mm 10mm 16mm 12mm',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          alignSelf: 'stretch',
        }}
      >
        {/* Monogram Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: accentColor,
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: '0.04em',
              boxShadow: `0 2px 6px ${hexToRgba(accentColor, 0.3)}`,
              flexShrink: 0,
            }}
          >
            {initials || 'CG'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a', lineHeight: 1.2 }}>
              {data.fullName}
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600 }}>
              {data.targetRole}
            </div>
          </div>
        </div>

        {/* 1. Contact Details */}
        {data.contactList.length > 0 && (
          <div>
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                marginBottom: '8px',
                borderBottom: `1.5px solid ${hexToRgba(accentColor, 0.25)}`,
                paddingBottom: '3px',
              }}
            >
              Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
              {data.contactList.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', wordBreak: 'break-all' }}>
                  <span style={{ color: accentColor, fontSize: '11px', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ color: '#334155' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Skills & Taxonomy */}
        {data.hasSkills && (
          <div>
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                marginBottom: '8px',
                borderBottom: `1.5px solid ${hexToRgba(accentColor, 0.25)}`,
                paddingBottom: '3px',
              }}
            >
              Skills &amp; Stacks
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.skillCategories.map((cat) => (
                <div key={cat.id}>
                  <div style={{ fontWeight: 700, fontSize: '10px', color: '#475569', textTransform: 'uppercase', marginBottom: '3px' }}>
                    {cat.title}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                    {cat.items.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '10px',
                          background: '#ffffff',
                          color: '#0f172a',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          fontWeight: 500,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Education in Sidebar */}
        {data.hasEducation && (
          <div>
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                marginBottom: '8px',
                borderBottom: `1.5px solid ${hexToRgba(accentColor, 0.25)}`,
                paddingBottom: '3px',
              }}
            >
              Education
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.educationList.map((edu) => (
                <div key={edu.id} style={{ fontSize: '11px' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{edu.degree}</div>
                  <div style={{ color: '#64748b', fontSize: '10.5px' }}>{edu.college}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '10px', marginTop: '1px' }}>
                    {edu.graduationYear && <span>{edu.graduationYear}</span>}
                    {edu.cgpa && <span>GPA: {edu.cgpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Languages in Sidebar */}
        {data.hasLanguages && (
          <div>
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                marginBottom: '8px',
                borderBottom: `1.5px solid ${hexToRgba(accentColor, 0.25)}`,
                paddingBottom: '3px',
              }}
            >
              Languages
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
              {data.languages.map((l) => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                  <span style={{ fontWeight: 600 }}>{l.name}</span>
                  {l.proficiency && <span style={{ color: '#64748b', fontSize: '10px' }}>{l.proficiency}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Certifications in Sidebar */}
        {data.hasCertifications && (
          <div>
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                marginBottom: '8px',
                borderBottom: `1.5px solid ${hexToRgba(accentColor, 0.25)}`,
                paddingBottom: '3px',
              }}
            >
              Certifications
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10.5px' }}>
              {data.certifications.map((c) => (
                <div key={c.id}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                  {c.issuer && <div style={{ color: '#64748b' }}>{c.issuer}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Awards & Honors in Sidebar */}
        {data.hasAwards && (
          <div>
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                marginBottom: '8px',
                borderBottom: `1.5px solid ${hexToRgba(accentColor, 0.25)}`,
                paddingBottom: '3px',
              }}
            >
              Awards &amp; Honors
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10.5px' }}>
              {data.awards.map((a) => (
                <div key={a.id}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{a.title}</div>
                  {a.issuer && <div style={{ color: '#64748b' }}>{a.issuer} {a.year && `(${a.year})`}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Publications in Sidebar */}
        {data.hasPublications && (
          <div>
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                marginBottom: '8px',
                borderBottom: `1.5px solid ${hexToRgba(accentColor, 0.25)}`,
                paddingBottom: '3px',
              }}
            >
              Publications
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10.5px' }}>
              {data.publications.map((p) => (
                <div key={p.id}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.title}</div>
                  {p.publisher && <div style={{ color: '#64748b' }}>{p.publisher} {p.year && `(${p.year})`}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ── MAIN CONTENT AREA (68% Width) ── */}
      <main
        style={{
          width: '68%',
          padding: '16mm 16mm 16mm 14mm',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Main Header */}
        <header style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: '12px' }}>
          <h1
            style={{
              fontSize: '30px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '0 0 2px',
              color: '#0f172a',
            }}
          >
            {data.fullName}
          </h1>
          <div
            style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: accentColor,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {data.targetRole}
          </div>
        </header>

        {/* 1. Summary */}
        {data.hasSummary && (
          <section className="cv-section">
            <h2
              className="cv-section-title"
              style={{
                fontSize: '12.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                margin: '0 0 6px',
              }}
            >
              About Me
            </h2>
            <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.6, color: '#334155' }}>
              {data.summary}
            </p>
          </section>
        )}

        {/* 2. Work Experience */}
        {data.hasExperience && (
          <section className="cv-section">
            <h2
              className="cv-section-title"
              style={{
                fontSize: '12.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                margin: '0 0 10px',
              }}
            >
              Work Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data.experience.map((exp) => (
                <div key={exp.id} className="cv-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '12.5px', color: '#0f172a' }}>
                      {exp.role}
                    </span>
                    {exp.duration && (
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                        {exp.duration}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11.5px', color: accentColor, fontWeight: 600, marginBottom: '3px' }}>
                    {exp.company}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: '16px', color: '#334155', fontSize: '11.5px', lineHeight: 1.55 }}>
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Projects */}
        {data.hasProjects && (
          <section className="cv-section">
            <h2
              className="cv-section-title"
              style={{
                fontSize: '12.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                margin: '0 0 10px',
              }}
            >
              Projects &amp; Portfolio
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.projects.map((proj) => (
                <div key={proj.id} className="cv-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '12.5px', color: '#0f172a' }}>
                      {proj.name}
                    </span>
                    {proj.github && (
                      <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                        {proj.github}
                      </span>
                    )}
                  </div>
                  {proj.tech && (
                    <div style={{ fontSize: '11px', color: accentColor, fontWeight: 600, marginBottom: '2px' }}>
                      {proj.tech}
                    </div>
                  )}
                  {proj.desc && (
                    <p style={{ margin: 0, fontSize: '11.5px', color: '#334155', lineHeight: 1.55 }}>
                      {proj.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
