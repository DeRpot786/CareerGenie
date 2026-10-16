import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  color = 'primary',
  height = 8,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorStyles = {
    primary: 'var(--grad-primary)',
    emerald: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    cyan: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
    amber: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    rose: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
  };

  return (
    <div className={`w-full ${className}`} style={{ width: '100%' }}>
      {(label || showPercentage) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontSize: '0.85rem',
            fontWeight: 500,
          }}
        >
          {label && <span style={{ color: 'var(--text-muted)' }}>{label}</span>}
          {showPercentage && (
            <span style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        className="progress-bar-container"
        style={{ height: `${height}px` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentage}%`,
            background: colorStyles[color] || colorStyles.primary,
          }}
        />
      </div>
    </div>
  );
};
