import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 28, className = '', text = 'Loading...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '2rem',
      }}
      className={className}
    >
      <Loader2
        size={size}
        className="animate-spin text-indigo-500"
        style={{ color: 'var(--primary-500)' }}
      />
      {text && <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{text}</span>}
    </div>
  );
};
