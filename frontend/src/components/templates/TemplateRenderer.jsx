import React from 'react';
import { getTemplateById } from './templateRegistry';

export const TemplateRenderer = ({ templateId, resume, accentColor }) => {
  const templateConfig = getTemplateById(templateId);
  const TemplateComponent = templateConfig.component;

  if (!TemplateComponent) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        Template not found. Please select a valid resume template.
      </div>
    );
  }

  return (
    <TemplateComponent
      resume={resume}
      accentColor={accentColor || templateConfig.accent}
    />
  );
};
