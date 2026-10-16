import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({
  variant = 'full', // 'full' (image with text) | 'icon' (symbol only) | 'combo' (symbol image + typography)
  size = 'md', // 'sm' | 'md' | 'lg'
  linkTo = '/',
  className = '',
  style = {},
}) => {
  // Height definitions
  const heights = {
    sm: 32,
    md: 40,
    lg: 52,
  };

  const currentHeight = heights[size] || heights.md;

  const content = (() => {
    if (variant === 'full') {
      return (
        <img
          src="/logo.png"
          alt="CareerGenie Logo"
          style={{
            height: `${currentHeight}px`,
            width: 'auto',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 2px 8px rgba(99, 102, 241, 0.2))',
          }}
          className="brand-logo-img"
        />
      );
    }

    if (variant === 'icon') {
      return (
        <img
          src="/logo-icon.png"
          alt="CareerGenie Mark"
          style={{
            height: `${currentHeight}px`,
            width: 'auto',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 2px 10px rgba(99, 102, 241, 0.25))',
          }}
          className="brand-icon-img"
        />
      );
    }

    // 'combo' variant: Brand icon symbol with high-contrast theme typography
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src="/logo-icon.png"
          alt="CareerGenie Mark"
          style={{
            height: `${currentHeight}px`,
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 2px 10px rgba(99, 102, 241, 0.3))',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: size === 'sm' ? '1.1rem' : size === 'lg' ? '1.5rem' : '1.3rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              color: 'var(--text-main)',
            }}
          >
            Career<span className="gradient-text">Genie</span>
          </span>
          {size !== 'sm' && (
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.02em', marginTop: '-2px' }}>
              AI Career Operating System
            </span>
          )}
        </div>
      </div>
    );
  })();

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          textDecoration: 'none',
          ...style,
        }}
        className={`brand-logo-link ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        ...style,
      }}
      className={`brand-logo-wrap ${className}`}
    >
      {content}
    </div>
  );
};
