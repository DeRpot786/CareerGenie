import React from 'react';

export const Badge = ({
  children,
  variant = 'primary',
  size: _size = 'md',
  icon: Icon,
  className = '',
  ...props
}) => {
  const variantMap = {
    primary: 'badge-primary',
    emerald: 'badge-emerald',
    amber: 'badge-amber',
    rose: 'badge-rose',
    cyan: 'badge-cyan',
  };

  return (
    <span className={`badge ${variantMap[variant] || 'badge-primary'} ${className}`} {...props}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};
