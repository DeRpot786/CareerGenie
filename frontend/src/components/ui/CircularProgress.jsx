import React from 'react';

export const CircularProgress = ({
  value = 0,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  color = '#6366f1',
  trackColor = 'var(--track-bg)',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round(value)));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated value circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      {/* Center Label */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: size > 100 ? '1.75rem' : '1.25rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-main)',
            lineHeight: 1,
          }}
        >
          {percentage}%
        </span>
        {label && (
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '4px',
              fontWeight: 500,
            }}
          >
            {label}
          </span>
        )}
      </div>
      {sublabel && (
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
            marginTop: '8px',
          }}
        >
          {sublabel}
        </span>
      )}
    </div>
  );
};
