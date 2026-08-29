import React from 'react';

export function Card({ children, className = '', title, subtitle, action }) {
  return (
    <div
      className={[
        'card-base',
        'overflow-hidden',
        className,
      ].join(' ')}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[--color-border]">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-[--color-text-primary] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[--color-text-secondary] mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
