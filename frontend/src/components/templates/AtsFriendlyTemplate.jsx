import React from 'react';
import { normalizeResumeData } from './templateUtils';

export const AtsFriendlyTemplate = ({ resume, _accentColor = '#000000' }) => {
  const data = normalizeResumeData(resume);

  return (
    <div
      id="printable-cv"
      className="printable-cv-document template-ats-friendly"
      style={{
        width: '100%',
        maxWidth: '100%',
        background: '#ffffff',
        color: '#000000',
        padding: '14mm 16mm',
        boxSizing: 'border-box',
        fontFamily: 'Arial, Helvetica, "Segoe UI", sans-serif',
        lineHeight: 1.5,
        fontSize: '11.5px',
        minHeight: '297mm',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Strict ATS Standard Header (Left Aligned, Standard Contact Line) ── */}
      <header style={{ marginBottom: '16px' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            margin: '0 0 2px',
            color: '#000000',
          }}
        >
          {data.fullName}
        </h1>

        <div
          style={{
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#333333',
            marginBottom: '6px',
          }}
        >
          {data.targetRole}
        </div>

        {data.contactList.length > 0 && (
          <div
            style={{
              fontSize: '11px',
              color: '#333333',
              lineHeight: 1.4,
            }}
          >
            {data.contactList.map((item) => item.label).join(' | ')}
          </div>
        )}
      </header>

      {/* ── 1. PROFESSIONAL SUMMARY ── */}
      {data.hasSummary && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '12.5px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#000000',
              borderBottom: '1px solid #000000',
              paddingBottom: '2px',
              margin: '0 0 6px',
            }}
          >
            PROFESSIONAL SUMMARY
          </h2>
          <p style={{ margin: 0, fontSize: '11.5px', lineHeight: 1.55, color: '#111111' }}>
            {data.summary}
          </p>
        </section>
      )}

      {/* ── 2. TECHNICAL SKILLS ── */}
      {data.hasSkills && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '12.5px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#000000',
              borderBottom: '1px solid #000000',
              paddingBottom: '2px',
              margin: '0 0 6px',
            }}
          >
            TECHNICAL SKILLS
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11.5px' }}>
            {data.skillCategories.map((cat) => (
              <div key={cat.id}>
                <strong>{cat.title}: </strong>
                <span>{cat.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 3. WORK EXPERIENCE ── */}
      {data.hasExperience && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '12.5px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#000000',
              borderBottom: '1px solid #000000',
              paddingBottom: '2px',
              margin: '0 0 8px',
            }}
          >
            WORK EXPERIENCE
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.experience.map((exp) => (
              <div key={exp.id} className="cv-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong>{exp.role}</strong>
                  <span style={{ fontSize: '11px' }}>{exp.duration}</span>
                </div>
                <div style={{ fontStyle: 'italic', color: '#222222', marginBottom: '3px' }}>
                  {exp.company}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11.5px', lineHeight: 1.5 }}>
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

      {/* ── 4. PROJECTS ── */}
      {data.hasProjects && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '12.5px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#000000',
              borderBottom: '1px solid #000000',
              paddingBottom: '2px',
              margin: '0 0 8px',
            }}
          >
            PROJECTS
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.projects.map((proj) => (
              <div key={proj.id} className="cv-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong>{proj.name}</strong>
                  {proj.tech && <span style={{ fontStyle: 'italic', fontSize: '11px' }}>{proj.tech}</span>}
                </div>
                {proj.desc && (
                  <div style={{ margin: '2px 0 0', fontSize: '11.5px', lineHeight: 1.5 }}>
                    {proj.desc}
                  </div>
                )}
                {proj.github && (
                  <div style={{ fontSize: '10.5px', color: '#444444' }}>
                    Repository: {proj.github}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 5. EDUCATION ── */}
      {data.hasEducation && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '12.5px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#000000',
              borderBottom: '1px solid #000000',
              paddingBottom: '2px',
              margin: '0 0 8px',
            }}
          >
            EDUCATION
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.educationList.map((edu) => (
              <div key={edu.id} className="cv-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <strong>{edu.degree}</strong>
                  <div style={{ color: '#222222' }}>
                    {edu.college} {edu.cgpa && `| CGPA: ${edu.cgpa}`}
                  </div>
                </div>
                <div style={{ fontSize: '11px' }}>
                  {edu.graduationYear}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 6. CERTIFICATIONS (if present) ── */}
      {data.hasCertifications && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '12.5px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#000000',
              borderBottom: '1px solid #000000',
              paddingBottom: '2px',
              margin: '0 0 6px',
            }}
          >
            CERTIFICATIONS
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11.5px' }}>
            {data.certifications.map((c) => (
              <div key={c.id}>
                <strong>{c.name}</strong> {c.issuer && `— ${c.issuer}`} {c.date && `(${c.date})`}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 7. LANGUAGES (if present) ── */}
      {data.hasLanguages && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '12.5px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#000000',
              borderBottom: '1px solid #000000',
              paddingBottom: '2px',
              margin: '0 0 6px',
            }}
          >
            LANGUAGES
          </h2>
          <div style={{ fontSize: '11.5px' }}>
            {data.languages.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' | ')}
          </div>
        </section>
      )}

      {/* ── 8. HONORS & AWARDS (if present) ── */}
      {data.hasAwards && (
        <section className="cv-section" style={{ marginBottom: '16px' }}>
          <h2
            className="cv-section-title"
            style={{
              fontSize: '12.5px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#000000',
              borderBottom: '1px solid #000000',
              paddingBottom: '2px',
              margin: '0 0 6px',
            }}
          >
            HONORS &amp; AWARDS
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11.5px' }}>
            {data.awards.map((a) => (
              <div key={a.id}>
                <strong>{a.title}</strong> {a.issuer && `— ${a.issuer}`} {a.year && `(${a.year})`}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 9. PUBLICATIONS (if present) ── */}
      {data.hasPublications && (
        <section className="cv-section">
          <h2
            className="cv-section-title"
            style={{
              fontSize: '12.5px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#000000',
              borderBottom: '1px solid #000000',
              paddingBottom: '2px',
              margin: '0 0 6px',
            }}
          >
            PUBLICATIONS
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px' }}>
            {data.publications.map((p) => (
              <div key={p.id}>
                <strong>{p.title}</strong> {p.publisher && `— ${p.publisher}`} {p.year && `(${p.year})`}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
