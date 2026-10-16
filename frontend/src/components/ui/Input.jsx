import React from 'react';

export const FormField = ({ label, error, required, children, helperText, className = '' }) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: 'var(--accent-rose)' }}>*</span>}
        </label>
      )}
      {children}
      {helperText && !error && (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{helperText}</span>
      )}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export const Input = React.forwardRef(({
  label,
  error,
  required,
  helperText,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  const inputEl = (
    <div style={{ position: 'relative', width: '100%' }}>
      {Icon && (
        <div
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <Icon size={18} />
        </div>
      )}
      <input
        ref={ref}
        className={`form-input ${className}`}
        style={{
          paddingLeft: Icon ? '40px' : undefined,
          borderColor: error ? 'var(--accent-rose)' : undefined,
        }}
        {...props}
      />
    </div>
  );

  if (label || error || helperText) {
    return (
      <FormField label={label} error={error} required={required} helperText={helperText}>
        {inputEl}
      </FormField>
    );
  }

  return inputEl;
});

Input.displayName = 'Input';
