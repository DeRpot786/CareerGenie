import React from 'react';
import { normalizeResumeData, hexToRgba } from './templateUtils';

export const CreativeTemplate = ({ resume, accentColor = '#e11d48' }) => {
  const data = normalizeResumeData(resume);

  return (
    <div
      id="printable-cv"
      className="printable-cv-document template-creative"
      style={{
        width: '100%',
        maxWidth: '100%',
        background: '#ffffff',
        color: '#0f172a',
        padding: '14mm 16mm',
        boxSizing: 'border-box',
        fontFamily: '"Outfit", "Inter", system-ui, -apple-system, sans-serif',
        lineHeight: 1.5,
        fontSize: '12px',
        minHeight: '297mm',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Creative Editorial Header ── */}
      <header style={{ marginBottom: '22px' }}>
        <div style={{ display: 'inline-block', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              background: hexToRgba(accentColor, 0.1),
              color: accentColor,
              padding: '3px 10px',
              borderRadius: '999px',
              border: `1px solid ${hexToRgba(accentColor, 0.25)}`,
            }}
          >
            {data.targetRole}
          </span>
        </div>

        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 8px',
            color: '#0f172a',
            lineHeight: 1.1,
          }}
        >
          {data.fullName}
        </h1>

        {data.contactList.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px 14px',
              fontSize: '11px',
              color: '#475569',
              fontWeight: 500,
              paddingBottom: '12px',
              borderBottom: `2px solid ${accentColor}`,
            }}
          >
            {data.contactList.map((item) => (
              <span key={item.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: accentColor }}>{item.icon}</span>
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ── 1. Editorial Quote-Style Summary ── */}
      {data.hasSummary && (
        <section className="cv-section" style={{ marginBottom: '20px' }}>
          <div
            style={{
              background: '#f8fafc',
              borderLeft: `4px solid ${accentColor}`,
              padding: '12px 16px',
              borderRadius: '0 8px 8px 0',
              fontStyle: 'normal',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.65, color: '#334155' }}>
              &ldquo;{data.summary}&rdquo;
            </p>
          </div>
        </section>
      )}

      {/* ── 2. Projects: Modular 2-Column Showcase Cards ── */}
      {data.hasProjects && (
        <section className="cv-section" style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <h2
              className="cv-section-title"
              style={{
                fontSize: '13px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#0f172a',
                margin: 0,
              }}
            >
              Featured Projects &amp; Work
            </h2>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
            }}
          >
            {data.projects.map((proj) => (
              <div
                key={proj.id}
                className="cv-item"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>
                      {proj.name}
                    </div>
                    {proj.github && (
                      <span style={{ fontSize: '10px', color: accentColor, fontWeight: 700 }}>
                        Code ↗
                      </span>
                    )}
                  </div>
                  {proj.desc && (
                    <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#475569', lineHeight: 1.5 }}>
                      {proj.desc}
                    </p>
                  )}
                </div>
                {proj.techList && proj.techList.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {proj.techList.map((t, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '9.5px',
                          fontWeight: 600,
                          background: hexToRgba(accentColor, 0.08),
                          color: accentColor,
                          padding: '1px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 3. Work Experience with Visual Timeline Accents ── */}
      {data.hasExperience && (
        <section className="cv-section" style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <h2
              className="cv-section-title"
              style={{
                fontSize: '13px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#0f172a',
                margin: 0,
              }}
            >
              Experience Timeline
            </h2>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: `2px solid ${hexToRgba(accentColor, 0.3)}`, paddingLeft: '14px', marginLeft: '4px' }}>
            {data.experience.map((exp) => (
              <div key={exp.id} className="cv-item" style={{ position: 'relative' }}>
                {/* Timeline Node Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-19px',
                    top: '4px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: accentColor,
                    border: '2px solid #ffffff',
                    boxShadow: `0 0 0 1px ${accentColor}`,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>
                    {exp.role} <span style={{ fontWeight: 500, color: '#64748b' }}>@ {exp.company}</span>
                  </span>
                  {exp.duration && (
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: accentColor }}>
                      {exp.duration}
                    </span>
                  )}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul style={{ margin: '4px 0 0', paddingLeft: '16px', color: '#475569', fontSize: '11.5px', lineHeight: 1.55 }}>
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

      {/* ── 4. Creative Visual Skills Taxonomy ── */}
      {data.hasSkills && (
        <section className="cv-section" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <h2
              className="cv-section-title"
              style={{
                fontSize: '13px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#0f172a',
                margin: 0,
              }}
            >
              Skills &amp; Capabilities
            </h2>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.skillCategories.map((cat) => (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', minWidth: '130px' }}>
                  {cat.title}:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {cat.items.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 600,
                        background: '#f1f5f9',
                        color: '#334155',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 5. Education & Credentials ── */}
      {data.hasEducation && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <h2
              className="cv-section-title"
              style={{
                fontSize: '13px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#0f172a',
                margin: 0,
              }}
            >
              Education &amp; Background
            </h2>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {data.educationList.map((edu) => (
              <div key={edu.id} className="cv-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: '12px', color: '#0f172a' }}>
                    {edu.degree}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#64748b' }}> — {edu.college}</span>
                  {edu.cgpa && <span style={{ fontSize: '11px', color: accentColor, fontWeight: 600 }}> ({edu.cgpa})</span>}
                </div>
                {edu.graduationYear && (
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                    {edu.graduationYear}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 6. Honors, Certifications & Languages (if present) ── */}
      {(data.hasCertifications || data.hasLanguages || data.hasAwards || data.hasPublications) && (
        <section className="cv-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <h2
              className="cv-section-title"
              style={{
                fontSize: '13px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#0f172a',
                margin: 0,
              }}
            >
              Honors, Certifications &amp; Languages
            </h2>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
            {data.hasAwards && (
              <div>
                <strong style={{ color: '#0f172a' }}>Awards &amp; Honors: </strong>
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
  );
};
