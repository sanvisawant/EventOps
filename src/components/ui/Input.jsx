import React from 'react';

export function Input({
  label,
  error,
  helperText,
  id,
  type = 'text',
  className = '',
  icon: Icon,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-[--color-text-secondary]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[--color-text-placeholder]">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={[
            'block w-full rounded-md text-sm transition-colors',
            'bg-[--color-surface-2] text-[--color-text-primary]',
            'placeholder:text-[--color-text-placeholder]',
            'border px-3 py-2',
            error
              ? 'border-[--color-danger] focus:outline-none focus:ring-2 focus:ring-[--color-danger] focus:border-transparent'
              : 'border-[--color-border] focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:border-transparent',
            Icon ? 'pl-9' : '',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[--color-danger]">{error}</p>}
      {helperText && !error && <p className="text-xs text-[--color-text-secondary]">{helperText}</p>}
    </div>
  );
}
