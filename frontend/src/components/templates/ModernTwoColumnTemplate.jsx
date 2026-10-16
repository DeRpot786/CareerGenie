import React from 'react';
import { normalizeResumeData, hexToRgba } from './templateUtils';

export const ModernTwoColumnTemplate = ({ resume, accentColor = '#2563eb' }) => {
  const data = normalizeResumeData(resume);

  return (
    <div
      id="printable-cv"
      className="printable-cv-document template-modern-two-column"
      style={{
        width: '100%',
        maxWidth: '100%',
        background: '#ffffff',
        color: '#0f172a',
        padding: '14mm 16mm',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: 1.5,
        fontSize: '11.8px',
        minHeight: '297mm',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Top Full-Width Header ── */}
      <header
        style={{
          borderBottom: `2px solid ${accentColor}`,
          paddingBottom: '12px',
          marginBottom: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '0 0 4px',
              color: '#0f172a',
            }}
          >
            {data.fullName}
          </h1>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: accentColor,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {data.targetRole}
          </div>
        </div>

        {/* Top Quick Contact Strip */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '2px',
            fontSize: '11px',
            color: '#64748b',
          }}
        >
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.location && <span>{data.contact.location}</span>}
        </div>
      </header>

      {/* ── Two-Column Split Layout ── */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'stretch',
          flex: 1,
        }}
      >
        {/* ── MAIN COLUMN (66% Width) ── */}
        <div style={{ flex: '1 1 66%', minWidth: 0 }}>
          {/* Summary */}
          {data.hasSummary && (
            <section className="cv-section" style={{ marginBottom: '18px' }}>
              <h2
                className="cv-section-title"
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: accentColor,
                  borderBottom: `1px solid ${hexToRgba(accentColor, 0.2)}`,
                  paddingBottom: '4px',
                  margin: '0 0 8px',
                }}
              >
                Professional Profile
              </h2>
              <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.6, color: '#334155' }}>
                {data.summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {data.hasExperience && (
            <section className="cv-section" style={{ marginBottom: '18px' }}>
              <h2
                className="cv-section-title"
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: accentColor,
                  borderBottom: `1px solid ${hexToRgba(accentColor, 0.2)}`,
                  paddingBottom: '4px',
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
                    <div style={{ fontSize: '11.5px', color: accentColor, fontWeight: 600, marginBottom: '4px' }}>
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

          {/* Education */}
          {data.hasEducation && (
            <section className="cv-section" style={{ marginBottom: '18px' }}>
              <h2
                className="cv-section-title"
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: accentColor,
                  borderBottom: `1px solid ${hexToRgba(accentColor, 0.2)}`,
                  paddingBottom: '4px',
                  margin: '0 0 10px',
                }}
              >
                Education
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.educationList.map((edu) => (
                  <div key={edu.id} className="cv-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '12.5px', color: '#0f172a' }}>
                        {edu.degree}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#475569' }}>
                        {edu.college}
                        {edu.cgpa && <span> • CGPA: {edu.cgpa}</span>}
                      </div>
                    </div>
                    {edu.graduationYear && (
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                        {edu.graduationYear}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Projects */}
          {data.hasProjects && (
            <section className="cv-section" style={{ marginBottom: '18px' }}>
              <h2
                className="cv-section-title"
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: accentColor,
                  borderBottom: `1px solid ${hexToRgba(accentColor, 0.2)}`,
                  paddingBottom: '4px',
                  margin: '0 0 10px',
                }}
              >
                Projects
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
        </div>

        {/* ── SECONDARY SIDEBAR (34% Width) ── */}
        <div
          style={{
            flex: '0 0 34%',
            minWidth: 0,
            borderLeft: `1px solid #e2e8f0`,
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* Contact Details */}
          {data.contactList.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: accentColor,
                  margin: '0 0 8px',
                  borderBottom: `1px solid ${hexToRgba(accentColor, 0.2)}`,
                  paddingBottom: '3px',
                }}
              >
                Contact
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                {data.contactList.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', wordBreak: 'break-all' }}>
                    <span style={{ color: accentColor, fontSize: '11px' }}>{item.icon}</span>
                    <span style={{ color: '#334155' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorized Skills */}
          {data.hasSkills && (
            <div>
              <h3
                style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: accentColor,
                  margin: '0 0 8px',
                  borderBottom: `1px solid ${hexToRgba(accentColor, 0.2)}`,
                  paddingBottom: '3px',
                }}
              >
                Skills
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <div style={{ fontWeight: 700, fontSize: '11px', color: '#0f172a', marginBottom: '3px' }}>
                      {cat.title}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {cat.items.map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '10.5px',
                            background: '#f1f5f9',
                            color: '#334155',
                            padding: '2px 6px',
                            borderRadius: '4px',
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

          {/* Certifications */}
          {data.hasCertifications && (
            <div>
              <h3
                style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: accentColor,
                  margin: '0 0 8px',
                  borderBottom: `1px solid ${hexToRgba(accentColor, 0.2)}`,
                  paddingBottom: '3px',
                }}
              >
                Certifications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                {data.certifications.map((c) => (
                  <div key={c.id}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                    {c.issuer && <div style={{ color: '#64748b' }}>{c.issuer} {c.date && `(${c.date})`}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.hasLanguages && (
            <div>
              <h3
                style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: accentColor,
                  margin: '0 0 8px',
                  borderBottom: `1px solid ${hexToRgba(accentColor, 0.2)}`,
                  paddingBottom: '3px',
                }}
              >
                Languages
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                {data.languages.map((l) => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                    <span style={{ fontWeight: 600 }}>{l.name}</span>
                    {l.proficiency && <span style={{ color: '#64748b' }}>{l.proficiency}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards / Additional (if present) */}
          {data.hasAwards && (
            <div>
              <h3
                style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: accentColor,
                  margin: '0 0 8px',
                  borderBottom: `1px solid ${hexToRgba(accentColor, 0.2)}`,
                  paddingBottom: '3px',
                }}
              >
                Awards &amp; Honors
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                {data.awards.map((a) => (
                  <div key={a.id}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{a.title}</div>
                    {a.issuer && <div style={{ color: '#64748b' }}>{a.issuer} {a.year && `(${a.year})`}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publications (if present) */}
          {data.hasPublications && (
            <div>
              <h3
                style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: accentColor,
                  margin: '0 0 8px',
                  borderBottom: `1px solid ${hexToRgba(accentColor, 0.2)}`,
                  paddingBottom: '3px',
                }}
              >
                Publications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                {data.publications.map((p) => (
                  <div key={p.id}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.title}</div>
                    {p.publisher && <div style={{ color: '#64748b' }}>{p.publisher} {p.year && `(${p.year})`}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
