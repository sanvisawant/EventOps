import React from 'react';

export function Badge({ children, variant = 'neutral', size = 'md', className = '', icon: Icon }) {
  const variants = {
    success: 'status-success border',
    warning: 'status-warning border',
    danger:  'status-danger  border',
    info:    'status-info    border',
    brand:   'status-accent  border',
    neutral: [
      'bg-[--color-surface-2] text-[--color-text-secondary]',
      'border border-[--color-border]',
    ].join(' '),
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={[
        'inline-flex items-center gap-1 font-medium rounded',
        variants[variant] || variants.neutral,
        sizes[size] || sizes.md,
        className,
      ].join(' ')}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />}
      {children}
    </span>
  );
}
