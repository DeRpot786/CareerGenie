import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({
  variant = 'icon',
  size = 'md',
  className = '',
  style = {},
  showLabel = false,
}) => {
  const { isDark, toggleTheme } = useTheme();

  const title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={title}
        title={title}
        className={`theme-pill-btn ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: size === 'sm' ? '0.35rem 0.75rem' : '0.5rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
          fontSize: size === 'sm' ? '0.8rem' : '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all var(--transition-normal)',
          outline: 'none',
          boxShadow: 'var(--shadow-sm)',
          ...style,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#fbbf24' : '#4f46e5',
            transition: 'transform 0.3s ease',
            transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)',
          }}
        >
          {isDark ? <Sun size={size === 'sm' ? 14 : 16} /> : <Moon size={size === 'sm' ? 14 : 16} />}
        </span>
        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    );
  }

  // Default 'icon' variant - minimal, sleek, premium circular/rounded button
  const dimensions = size === 'sm' ? '32px' : size === 'lg' ? '44px' : '38px';
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={title}
      title={title}
      className={`theme-toggle-btn ${className}`}
      style={{
        width: dimensions,
        height: dimensions,
        minWidth: dimensions,
        borderRadius: 'var(--radius-md)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-main)',
        cursor: 'pointer',
        transition: 'all var(--transition-normal)',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        ...style,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? '#fbbf24' : '#4f46e5',
          transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(180deg) scale(1)',
        }}
      >
        {isDark ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
      </span>
      {showLabel && (
        <span style={{ marginLeft: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};
