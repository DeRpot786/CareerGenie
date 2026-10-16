import React from 'react';
import { normalizeResumeData } from './templateUtils';

export const AcademicTemplate = ({ resume, accentColor = '#1e3a8a' }) => {
  const data = normalizeResumeData(resume);

  return (
    <div
      id="printable-cv"
      className="printable-cv-document template-academic"
      style={{
        width: '100%',
        maxWidth: '100%',
        background: '#ffffff',
        color: '#111827',
        padding: '14mm 16mm',
        boxSizing: 'border-box',
        fontFamily: '"Times New Roman", Times, Georgia, serif',
        lineHeight: 1.55,
        fontSize: '12px',
        minHeight: '297mm',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Scholarly Centered Academic Header ── */}
      <header
        style={{
          textAlign: 'center',
          borderBottom: `1.5px solid ${accentColor}`,
          paddingBottom: '14px',
          marginBottom: '20px',
        }}
      >
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            margin: '0 0 4px',
            color: '#0f172a',
          }}
        >
          {data.fullName}
        </h1>

        <div
          style={{
            fontSize: '13px',
            fontStyle: 'italic',
            color: accentColor,
            marginBottom: '8px',
          }}
        >
          Curriculum Vitae — {data.targetRole}
        </div>

        {data.contactList.length > 0 && (
          <div
            style={{
              fontSize: '11px',
              color: '#475569',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '4px 14px',
              fontFamily: 'system-ui, sans-serif',
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

      {/* ── 1. Education (FIRST in Academic CVs) ── */}
      {data.hasEducation && (
        <section className="cv-section" style={{ marginBottom: '18px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              margin: '0 0 10px',
            }}
          >
            Education &amp; Academic Credentials
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.educationList.map((edu) => (
              <div key={edu.id} className="cv-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                    {edu.degree}
                  </div>
                  <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#334155' }}>
                    {edu.college}
                    {edu.cgpa && <span style={{ fontStyle: 'normal' }}> — Cumulative GPA: {edu.cgpa}</span>}
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

      {/* ── 2. Research & Academic Summary (if present) ── */}
      {data.hasSummary && (
        <section className="cv-section" style={{ marginBottom: '18px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              margin: '0 0 6px',
            }}
          >
            Research Interests &amp; Summary
          </h2>
          <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.6, color: '#334155' }}>
            {data.summary}
          </p>
        </section>
      )}

      {/* ── 3. Research & Professional Experience ── */}
      {data.hasExperience && (
        <section className="cv-section" style={{ marginBottom: '18px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              margin: '0 0 10px',
            }}
          >
            Research &amp; Professional Experience
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.experience.map((exp) => (
              <div key={exp.id} className="cv-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#0f172a' }}>
                    {exp.role} <span style={{ fontStyle: 'italic', fontWeight: 400 }}>— {exp.company}</span>
                  </div>
                  {exp.duration && (
                    <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'system-ui, sans-serif' }}>
                      {exp.duration}
                    </div>
                  )}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul style={{ margin: '3px 0 0', paddingLeft: '18px', color: '#334155', fontSize: '11.5px', lineHeight: 1.55 }}>
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

      {/* ── 4. Publications & Research Papers (Scholarly citations) ── */}
      {data.hasPublications && (
        <section className="cv-section" style={{ marginBottom: '18px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              margin: '0 0 10px',
            }}
          >
            Publications &amp; Preprints
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.publications.map((pub) => (
              <div key={pub.id} className="cv-item" style={{ fontSize: '12px' }}>
                <span style={{ fontWeight: 700 }}>&ldquo;{pub.title}&rdquo;</span>
                {pub.publisher && <span style={{ fontStyle: 'italic' }}>, {pub.publisher}</span>}
                {pub.year && <span> ({pub.year})</span>}
                {pub.link && (
                  <span style={{ color: accentColor, fontSize: '11px', fontFamily: 'system-ui, sans-serif', marginLeft: '6px' }}>
                    [{pub.link}]
                  </span>
                )}
                {pub.desc && (
                  <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>
                    {pub.desc}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 5. Teaching & Technical Projects ── */}
      {data.hasProjects && (
        <section className="cv-section" style={{ marginBottom: '18px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              margin: '0 0 10px',
            }}
          >
            Projects &amp; Academic Systems
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.projects.map((proj) => (
              <div key={proj.id} className="cv-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#0f172a' }}>
                    {proj.name}
                    {proj.tech && <span style={{ fontStyle: 'italic', fontWeight: 400, fontSize: '11.5px' }}> ({proj.tech})</span>}
                  </div>
                  {proj.github && (
                    <div style={{ fontSize: '10.5px', color: '#64748b', fontFamily: 'system-ui, sans-serif' }}>
                      {proj.github}
                    </div>
                  )}
                </div>
                {proj.desc && (
                  <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#334155', lineHeight: 1.55 }}>
                    {proj.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 6. Methodological & Technical Competencies ── */}
      {data.hasSkills && (
        <section className="cv-section" style={{ marginBottom: '18px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              margin: '0 0 8px',
            }}
          >
            Methodological &amp; Technical Skills
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
            {data.skillCategories.map((cat) => (
              <div key={cat.id}>
                <strong>{cat.title}: </strong>
                <span>{cat.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 7. Honors & Awards (if present) ── */}
      {data.hasAwards && (
        <section className="cv-section" style={{ marginBottom: '18px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              margin: '0 0 8px',
            }}
          >
            Honors &amp; Fellowships
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
            {data.awards.map((a) => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <strong>{a.title}</strong> {a.issuer && `— ${a.issuer}`}
                </span>
                {a.year && <span style={{ color: '#64748b', fontSize: '11px', fontFamily: 'system-ui, sans-serif' }}>{a.year}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 8. Certifications & Memberships (if present) ── */}
      {data.hasCertifications && (
        <section className="cv-section" style={{ marginBottom: '18px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              margin: '0 0 8px',
            }}
          >
            Certifications &amp; Professional Memberships
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
            {data.certifications.map((c) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <strong>{c.name}</strong> {c.issuer && `— ${c.issuer}`}
                </span>
                {c.date && <span style={{ color: '#64748b', fontSize: '11px', fontFamily: 'system-ui, sans-serif' }}>{c.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 9. Languages (if present) ── */}
      {data.hasLanguages && (
        <section className="cv-section">
          <h2
            className="cv-section-title"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accentColor,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
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
    </div>
  );
};
