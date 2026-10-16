import React from 'react';
import { normalizeResumeData, hexToRgba } from './templateUtils';

export const ExecutiveTemplate = ({ resume, accentColor = '#0369a1' }) => {
  const data = normalizeResumeData(resume);

  return (
    <div
      id="printable-cv"
      className="printable-cv-document template-executive"
      style={{
        width: '100%',
        maxWidth: '100%',
        background: '#ffffff',
        color: '#0f172a',
        padding: '0 0 16mm',
        boxSizing: 'border-box',
        fontFamily: 'Georgia, Cambria, "Times New Roman", serif',
        lineHeight: 1.55,
        fontSize: '12px',
        minHeight: '297mm',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Top Prestige Accent Bar ── */}
      <div style={{ height: '5px', background: accentColor, width: '100%' }} />

      <div style={{ padding: '16mm 18mm 0' }}>
        {/* ── Strong Executive Header ── */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: `2px solid ${accentColor}`,
            paddingBottom: '16px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                margin: '0 0 4px',
                color: '#0f172a',
                textTransform: 'uppercase',
              }}
            >
              {data.fullName}
            </h1>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: accentColor,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {data.targetRole}
            </div>
          </div>

          {/* Right Aligned Contact Block */}
          <div
            style={{
              textAlign: 'right',
              fontSize: '11px',
              fontFamily: 'system-ui, sans-serif',
              color: '#475569',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            {data.contact.email && <div>{data.contact.email}</div>}
            {data.contact.phone && <div>{data.contact.phone}</div>}
            {data.contact.location && <div>{data.contact.location}</div>}
            {data.contact.linkedin && <div style={{ color: accentColor }}>{data.contact.linkedin}</div>}
          </div>
        </header>

        {/* ── Executive Leadership Profile ── */}
        {data.hasSummary && (
          <section className="cv-section" style={{ marginBottom: '18px' }}>
            <div
              style={{
                borderLeft: `3px solid ${accentColor}`,
                padding: '10px 14px',
                background: hexToRgba(accentColor, 0.04),
                borderRadius: '0 4px 4px 0',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: accentColor,
                  marginBottom: '4px',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                Executive Profile &amp; Leadership Impact
              </div>
              <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.6, color: '#334155' }}>
                {data.summary}
              </p>
            </div>
          </section>
        )}

        {/* ── Core Competencies Micro-Grid ── */}
        {data.hasSkills && (
          <section className="cv-section" style={{ marginBottom: '18px' }}>
            <h2
              className="cv-section-title"
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                borderBottom: '1px solid #cbd5e1',
                paddingBottom: '3px',
                margin: '0 0 10px',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Areas of Expertise &amp; Core Competencies
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '8px',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {data.skillCategories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '6px 10px',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '10.5px', color: accentColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {cat.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px' }}>
                    {cat.items.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Professional Experience & Achievements ── */}
        {data.hasExperience && (
          <section className="cv-section" style={{ marginBottom: '18px' }}>
            <h2
              className="cv-section-title"
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                borderBottom: '1px solid #cbd5e1',
                paddingBottom: '3px',
                margin: '0 0 12px',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Professional Experience &amp; Leadership History
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data.experience.map((exp) => (
                <div key={exp.id} className="cv-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                      {exp.role} <span style={{ fontWeight: 400, color: '#475569' }}>| {exp.company}</span>
                    </span>
                    {exp.duration && (
                      <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', fontFamily: 'system-ui, sans-serif' }}>
                        {exp.duration}
                      </span>
                    )}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul style={{ margin: '4px 0 0', paddingLeft: '18px', color: '#334155', fontSize: '11.5px', lineHeight: 1.55 }}>
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

        {/* ── Strategic Projects ── */}
        {data.hasProjects && (
          <section className="cv-section" style={{ marginBottom: '18px' }}>
            <h2
              className="cv-section-title"
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                borderBottom: '1px solid #cbd5e1',
                paddingBottom: '3px',
                margin: '0 0 10px',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Strategic Initiatives &amp; Key Projects
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.projects.map((proj) => (
                <div key={proj.id} className="cv-item" style={{ borderLeft: `2px solid ${accentColor}`, paddingLeft: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '12.5px', color: '#0f172a' }}>
                      {proj.name}
                    </span>
                    {proj.tech && (
                      <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'system-ui, sans-serif', fontStyle: 'italic' }}>
                        {proj.tech}
                      </span>
                    )}
                  </div>
                  {proj.desc && (
                    <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: '#334155', lineHeight: 1.55 }}>
                      {proj.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Education & Credentials ── */}
        {data.hasEducation && (
          <section className="cv-section" style={{ marginBottom: '18px' }}>
            <h2
              className="cv-section-title"
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                borderBottom: '1px solid #cbd5e1',
                paddingBottom: '3px',
                margin: '0 0 8px',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Education &amp; Academic Honors
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.educationList.map((edu) => (
                <div key={edu.id} className="cv-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '12.5px', color: '#0f172a' }}>
                      {edu.degree}
                    </span>
                    <span style={{ fontSize: '12px', color: '#475569' }}> — {edu.college}</span>
                    {edu.cgpa && <span style={{ fontSize: '11.5px', color: '#64748b' }}> (CGPA: {edu.cgpa})</span>}
                  </div>
                  {edu.graduationYear && (
                    <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'system-ui, sans-serif' }}>
                      {edu.graduationYear}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Certifications, Languages, Awards & Publications ── */}
        {(data.hasCertifications || data.hasLanguages || data.hasAwards || data.hasPublications) && (
          <section className="cv-section" style={{ marginBottom: '18px' }}>
            <h2
              className="cv-section-title"
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                borderBottom: '1px solid #cbd5e1',
                paddingBottom: '3px',
                margin: '0 0 8px',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Honors, Credentials &amp; Affiliations
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px', color: '#334155' }}>
              {data.hasAwards && (
                <div>
                  <strong style={{ color: '#0f172a' }}>Executive Honors &amp; Awards: </strong>
                  {data.awards.map((a) => `${a.title}${a.issuer ? ` (${a.issuer})` : ''}`).join(' • ')}
                </div>
              )}
              {data.hasCertifications && (
                <div>
                  <strong style={{ color: '#0f172a' }}>Certifications: </strong>
                  {data.certifications.map((c) => `${c.name}${c.issuer ? ` (${c.issuer})` : ''}`).join(' • ')}
                </div>
              )}
              {data.hasLanguages && (
                <div>
                  <strong style={{ color: '#0f172a' }}>Languages: </strong>
                  {data.languages.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' • ')}
                </div>
              )}
              {data.hasPublications && (
                <div>
                  <strong style={{ color: '#0f172a' }}>Publications: </strong>
                  {data.publications.map((p) => `${p.title}${p.publisher ? ` — ${p.publisher}` : ''}`).join(' • ')}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
