import React from 'react';

export function Card({ children, className = '', title, subtitle, action }) {
  return (
    <div className={`bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-100 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
