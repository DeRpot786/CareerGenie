import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Eye, Sparkles, Layout } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TEMPLATE_REGISTRY } from '../components/templates/templateRegistry';

export const TemplatesGalleryPage = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleUseTemplate = (templateId) => {
    try {
      localStorage.setItem('careergenie_active_template', templateId);
    } catch {}
    navigate('/builder');
  };

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container-max">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Badge variant="primary" size="md" icon={Layout}>
            8 Verified Professional Resume Layouts
          </Badge>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginTop: '1rem', letterSpacing: '-0.02em' }}>
            Resume Templates Gallery
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0.75rem auto 0', fontSize: '1.1rem' }}>
            Choose from 8 genuinely different resume architectures. Each template has its own unique HTML structure, column balance, typography, and section flow.
          </p>
        </div>

        {/* Gallery Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {TEMPLATE_REGISTRY.map((tpl) => (
            <Card
              key={tpl.id}
              className="glass-panel"
              hover
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
              }}
            >
              {/* Template Wireframe Preview Header */}
              <div
                style={{
                  height: '210px',
                  background: '#f8fafc',
                  padding: '1.25rem',
                  position: 'relative',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: tpl.accent,
                      boxShadow: `0 0 8px ${tpl.accent}66`,
                    }}
                  />
                </div>

                {/* SVG Visual Wireframe */}
                <div style={{ transform: 'scale(1.45)', transformOrigin: 'center center' }}>
                  {tpl.renderThumbnail ? tpl.renderThumbnail(false) : null}
                </div>
              </div>

              {/* Template Info */}
              <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  {tpl.category}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.6rem' }}>
                  {tpl.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                  {tpl.description}
                </p>

                {/* Quick Feature Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    <Check size={14} style={{ color: 'var(--accent-emerald)' }} />
                    <span>Structurally unique layout component</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    <Check size={14} style={{ color: 'var(--accent-emerald)' }} />
                    <span>A4 PDF printing &amp; auto-paging verified</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{ flex: 1 }}
                    onClick={() => setSelectedTemplate(tpl)}
                  >
                    <Eye size={14} /> Quick Preview
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    style={{ flex: 1 }}
                    onClick={() => handleUseTemplate(tpl.id)}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detailed Preview Modal */}
        <Modal
          isOpen={!!selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          title={selectedTemplate ? `${selectedTemplate.name} — Layout Details` : ''}
          maxWidth="640px"
          footer={
            selectedTemplate && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Sparkles}
                  onClick={() => handleUseTemplate(selectedTemplate.id)}
                >
                  Build CV with {selectedTemplate.name}
                </Button>
              </>
            )
          }
        >
          {selectedTemplate && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Badge variant="cyan">{selectedTemplate.category}</Badge>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Default accent:</span>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: selectedTemplate.accent }} />
                  <code>{selectedTemplate.accent}</code>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ transform: 'scale(1.75)', transformOrigin: 'center center', padding: '10px 0' }}>
                  {selectedTemplate.renderThumbnail ? selectedTemplate.renderThumbnail(true) : null}
                </div>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {selectedTemplate.description}
              </p>

              <div
                style={{
                  padding: '1.25rem',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Architectural Highlights:
                </div>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <li>Independent HTML layout component ensuring genuine structural diversity.</li>
                  <li>A4 portrait proportion with optimized print media queries for clean PDF generation.</li>
                  <li>Independent accent color customization supported without layout compromise.</li>
                  <li>Automatic hiding of optional empty sections (languages, certs, awards).</li>
                </ul>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
