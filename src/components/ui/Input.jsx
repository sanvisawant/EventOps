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
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`block w-full rounded-lg bg-slate-950 border ${
            error ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
          } text-slate-100 placeholder-slate-500 text-sm px-3.5 py-2 transition-colors ${
            Icon ? 'pl-9' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-400">{helperText}</p>}
    </div>
  );
}
