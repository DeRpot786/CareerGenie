import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  glow = false,
  style = {},
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`glass-panel ${hover ? 'glass-panel-hover card-lift' : ''} ${className}`}
      {...props}
    >
      {glow && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </div>
  );
};
