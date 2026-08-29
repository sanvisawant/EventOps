import React from 'react';

export function Select({ label, options = [], error, id, className = '', ...props }) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-[--color-text-secondary]"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={[
          'block w-full rounded-md text-sm px-3 py-2 border transition-colors',
          'bg-[--color-surface-2] text-[--color-text-primary]',
          error
            ? 'border-[--color-danger] focus:ring-[--color-danger]'
            : 'border-[--color-border] focus:ring-[--color-accent]',
          'focus:outline-none focus:ring-2 focus:border-transparent',
          className,
        ].join(' ')}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-[--color-danger]">{error}</p>}
    </div>
  );
}
