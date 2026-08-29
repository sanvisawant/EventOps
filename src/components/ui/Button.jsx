import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const focusRing = {
    primary: 'focus-visible:ring-[--color-accent]',
    secondary: 'focus-visible:ring-[--color-border-strong]',
    ghost: 'focus-visible:ring-[--color-accent]',
    outline: 'focus-visible:ring-[--color-accent]',
    danger: 'focus-visible:ring-[--color-danger]',
  };

  const variants = {
    primary: [
      'bg-[--color-accent] text-white',
      'hover:opacity-90 active:opacity-95',
    ].join(' '),
    secondary: [
      'bg-[--color-surface-2] text-[--color-text-primary]',
      'border border-[--color-border]',
      'hover:bg-[--color-border] active:opacity-90',
    ].join(' '),
    ghost: [
      'bg-transparent text-[--color-text-secondary]',
      'hover:bg-[--color-surface-2] hover:text-[--color-text-primary]',
    ].join(' '),
    outline: [
      'bg-transparent text-[--color-text-primary]',
      'border border-[--color-border-strong]',
      'hover:bg-[--color-surface-2]',
    ].join(' '),
    danger: [
      'bg-[--color-danger] text-white',
      'hover:opacity-90',
    ].join(' '),
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-4 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${focusRing[variant] || ''} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
      {children}
    </button>
  );
}
