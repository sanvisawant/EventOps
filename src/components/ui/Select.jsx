import React from 'react';

export function Select({
  label,
  options = [],
  error,
  id,
  className = '',
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`block w-full rounded-lg bg-slate-950 border ${
          error ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
        } text-slate-100 text-sm px-3.5 py-2 transition-colors ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
