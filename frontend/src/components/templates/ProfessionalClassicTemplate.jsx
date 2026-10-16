import React from 'react';
import { normalizeResumeData } from './templateUtils';

export const ProfessionalClassicTemplate = ({ resume, accentColor = '#0f172a' }) => {
  const data = normalizeResumeData(resume);

  return (
    <div
      id="printable-cv"
      className="printable-cv-document template-professional-classic"
      style={{
        width: '100%',
        maxWidth: '100%',
        background: '#ffffff',
        color: '#1e293b',
        padding: '14mm 16mm',
        boxSizing: 'border-box',
        fontFamily: 'Georgia, "Times New Roman", Cambria, serif',
        lineHeight: 1.5,
        fontSize: '12px',
        minHeight: '297mm',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Traditional Centered Header ── */}
      <header
        style={{
          textAlign: 'center',
          borderBottom: `2px solid ${accentColor}`,
          paddingBottom: '14px',
          marginBottom: '18px',
        }}
      >
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 4px',
            color: accentColor,
          }}
        >
          {data.fullName}
        </h1>

        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#475569',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          {data.targetRole}
        </div>

        {data.contactList.length > 0 && (
          <div
            style={{
              fontSize: '11.5px',
              color: '#475569',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '4px 12px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {data.contactList.map((item, idx) => (
              <span key={item.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span>{item.label}</span>
                {idx < data.contactList.length - 1 && <span style={{ color: '#94a3b8' }}>•</span>}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ── 1. Professional Summary ── */}
      {data.hasSummary && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '3px',
              margin: '0 0 8px',
            }}
          >
            Professional Summary
          </h2>
          <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.6, color: '#334155' }}>
            {data.summary}
          </p>
        </section>
      )}

      {/* ── 2. Work Experience ── */}
      {data.hasExperience && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '3px',
              margin: '0 0 10px',
            }}
          >
            Work Experience
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.experience.map((exp) => (
              <div key={exp.id} className="cv-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                    {exp.role}
                    {exp.company && <span style={{ fontWeight: 500, color: '#475569' }}> — {exp.company}</span>}
                  </div>
                  {exp.duration && (
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontStyle: 'italic', fontFamily: 'system-ui, sans-serif' }}>
                      {exp.duration}
                    </div>
                  )}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul style={{ margin: '4px 0 0', paddingLeft: '18px', color: '#334155', fontSize: '12px', lineHeight: 1.55 }}>
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
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '3px',
              margin: '0 0 10px',
            }}
          >
            Education
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.educationList.map((edu) => (
              <div key={edu.id} className="cv-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                    {edu.degree}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>
                    {edu.college}
                    {edu.cgpa && <span style={{ fontStyle: 'normal' }}> • CGPA: {edu.cgpa}</span>}
                  </div>
                </div>
                {edu.graduationYear && (
                  <div style={{ fontSize: '11.5px', color: '#64748b', fontFamily: 'system-ui, sans-serif' }}>
                    {edu.graduationYear}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 4. Technical & Core Skills ── */}
      {data.hasSkills && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '3px',
              margin: '0 0 8px',
            }}
          >
            Skills &amp; Competencies
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', lineHeight: 1.55 }}>
            {data.skillCategories.map((cat) => (
              <div key={cat.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{cat.title}:</span>
                <span style={{ color: '#334155' }}>{cat.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 5. Projects ── */}
      {data.hasProjects && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '3px',
              margin: '0 0 10px',
            }}
          >
            Key Projects
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.projects.map((proj) => (
              <div key={proj.id} className="cv-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                    {proj.name}
                    {proj.tech && (
                      <span style={{ fontWeight: 500, fontSize: '11.5px', color: '#64748b', fontStyle: 'italic' }}>
                        {' '}({proj.tech})
                      </span>
                    )}
                  </div>
                  {proj.github && (
                    <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'system-ui, sans-serif' }}>
                      {proj.github}
                    </div>
                  )}
                </div>
                {proj.desc && (
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#334155', lineHeight: 1.55 }}>
                    {proj.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 6. Certifications (if present) ── */}
      {data.hasCertifications && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '3px',
              margin: '0 0 8px',
            }}
          >
            Certifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
            {data.certifications.map((c) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>
                  {c.name} {c.issuer && <span style={{ fontWeight: 400, color: '#475569' }}>— {c.issuer}</span>}
                </span>
                {c.date && <span style={{ color: '#64748b', fontSize: '11.5px' }}>{c.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 7. Languages (if present) ── */}
      {data.hasLanguages && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '3px',
              margin: '0 0 8px',
            }}
          >
            Languages
          </h2>
          <div style={{ fontSize: '12px', color: '#334155' }}>
            {data.languages.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' • ')}
          </div>
        </section>
      )}

      {/* ── 8. Awards & Honors (if present) ── */}
      {data.hasAwards && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '3px',
              margin: '0 0 8px',
            }}
          >
            Awards &amp; Honors
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
            {data.awards.map((a) => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>
                  {a.title} {a.issuer && <span style={{ fontWeight: 400, color: '#475569' }}>— {a.issuer}</span>}
                </span>
                {a.year && <span style={{ color: '#64748b', fontSize: '11.5px' }}>{a.year}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 9. Publications (if present) ── */}
      {data.hasPublications && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '3px',
              margin: '0 0 8px',
            }}
          >
            Publications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            {data.publications.map((p) => (
              <div key={p.id}>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>{p.title}</span>
                {p.publisher && <span style={{ color: '#475569' }}> — {p.publisher}</span>}
                {p.year && <span style={{ color: '#64748b' }}> ({p.year})</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
