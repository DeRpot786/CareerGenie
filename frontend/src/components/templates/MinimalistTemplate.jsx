import React from 'react';
import { normalizeResumeData } from './templateUtils';

export const MinimalistTemplate = ({ resume, accentColor = '#334155' }) => {
  const data = normalizeResumeData(resume);

  return (
    <div
      id="printable-cv"
      className="printable-cv-document template-minimalist"
      style={{
        width: '100%',
        maxWidth: '100%',
        background: '#ffffff',
        color: '#1e293b',
        padding: '14mm 16mm',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: 1.6,
        fontSize: '12px',
        minHeight: '297mm',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Left-Aligned Pure Typographic Header ── */}
      <header style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            margin: '0 0 2px',
            color: '#0f172a',
          }}
        >
          {data.fullName}
        </h1>
        <div
          style={{
            fontSize: '13px',
            color: accentColor,
            fontWeight: 500,
            marginBottom: '10px',
          }}
        >
          {data.targetRole}
        </div>

        {data.contactList.length > 0 && (
          <div
            style={{
              fontSize: '11px',
              color: '#64748b',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px 14px',
            }}
          >
            {data.contactList.map((item, idx) => (
              <span key={item.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>{item.label}</span>
                {idx < data.contactList.length - 1 && <span style={{ color: '#cbd5e1' }}>/</span>}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ── 1. Summary ── */}
      {data.hasSummary && (
        <section className="cv-section" style={{ marginBottom: '24px' }}>
          <div
            className="cv-section-title"
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#64748b',
              marginBottom: '6px',
              borderBottom: '0.5px solid #e2e8f0',
              paddingBottom: '2px',
            }}
          >
            Summary
          </div>
          <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.7, color: '#334155' }}>
            {data.summary}
          </p>
        </section>
      )}

      {/* ── 2. Experience ── */}
      {data.hasExperience && (
        <section className="cv-section" style={{ marginBottom: '24px' }}>
          <div
            className="cv-section-title"
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#64748b',
              marginBottom: '12px',
              borderBottom: '0.5px solid #e2e8f0',
              paddingBottom: '2px',
            }}
          >
            Experience
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.experience.map((exp) => (
              <div key={exp.id} className="cv-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 600, fontSize: '12.5px', color: '#0f172a' }}>
                    {exp.role} <span style={{ fontWeight: 400, color: '#64748b' }}>— {exp.company}</span>
                  </span>
                  {exp.duration && (
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {exp.duration}
                    </span>
                  )}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '16px', color: '#475569', fontSize: '11.5px', lineHeight: 1.6 }}>
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

      {/* ── 3. Education ── */}
      {data.hasEducation && (
        <section className="cv-section" style={{ marginBottom: '24px' }}>
          <div
            className="cv-section-title"
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#64748b',
              marginBottom: '10px',
              borderBottom: '0.5px solid #e2e8f0',
              paddingBottom: '2px',
            }}
          >
            Education
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.educationList.map((edu) => (
              <div key={edu.id} className="cv-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '12.5px', color: '#0f172a' }}>
                    {edu.degree}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                    {edu.college} {edu.cgpa && `• CGPA: ${edu.cgpa}`}
                  </div>
                </div>
                {edu.graduationYear && (
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {edu.graduationYear}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 4. Projects ── */}
      {data.hasProjects && (
        <section className="cv-section" style={{ marginBottom: '24px' }}>
          <div
            className="cv-section-title"
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#64748b',
              marginBottom: '12px',
              borderBottom: '0.5px solid #e2e8f0',
              paddingBottom: '2px',
            }}
          >
            Projects
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.projects.map((proj) => (
              <div key={proj.id} className="cv-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 600, fontSize: '12.5px', color: '#0f172a' }}>
                    {proj.name}
                    {proj.tech && <span style={{ fontWeight: 400, color: '#64748b', fontSize: '11px' }}> — {proj.tech}</span>}
                  </span>
                  {proj.github && (
                    <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>{proj.github}</span>
                  )}
                </div>
                {proj.desc && (
                  <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#475569', lineHeight: 1.6 }}>
                    {proj.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 5. Skills ── */}
      {data.hasSkills && (
        <section className="cv-section" style={{ marginBottom: '24px' }}>
          <div
            className="cv-section-title"
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#64748b',
              marginBottom: '8px',
              borderBottom: '0.5px solid #e2e8f0',
              paddingBottom: '2px',
            }}
          >
            Skills
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px' }}>
            {data.skillCategories.map((cat) => (
              <div key={cat.id} style={{ display: 'flex', gap: '6px' }}>
                <span style={{ color: '#64748b', minWidth: '130px' }}>{cat.title}</span>
                <span style={{ color: '#0f172a' }}>{cat.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 6. Certifications, Languages, Awards & Publications (if present) ── */}
      {(data.hasCertifications || data.hasLanguages || data.hasAwards || data.hasPublications) && (
        <section className="cv-section" style={{ marginBottom: '24px' }}>
          <div
            className="cv-section-title"
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#64748b',
              marginBottom: '8px',
              borderBottom: '0.5px solid #e2e8f0',
              paddingBottom: '2px',
            }}
          >
            Honors &amp; Additional Credentials
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: '#334155' }}>
            {data.hasAwards && (
              <div>
                <span style={{ color: '#64748b', marginRight: '6px' }}>Honors &amp; Awards:</span>
                {data.awards.map((a) => `${a.title}${a.issuer ? ` (${a.issuer})` : ''}`).join(' • ')}
              </div>
            )}
            {data.hasCertifications && (
              <div>
                <span style={{ color: '#64748b', marginRight: '6px' }}>Certifications:</span>
                {data.certifications.map((c) => `${c.name}${c.issuer ? ` (${c.issuer})` : ''}`).join(' • ')}
              </div>
            )}
            {data.hasLanguages && (
              <div>
                <span style={{ color: '#64748b', marginRight: '6px' }}>Languages:</span>
                {data.languages.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' • ')}
              </div>
            )}
            {data.hasPublications && (
              <div>
                <span style={{ color: '#64748b', marginRight: '6px' }}>Publications:</span>
                {data.publications.map((p) => `${p.title}${p.publisher ? ` — ${p.publisher}` : ''}`).join(' • ')}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
