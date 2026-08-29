import React from 'react';

export function Alert({ children, title, variant = 'info', className = '' }) {
  const configs = {
    info: {
      statusClass: 'status-info border rounded-md',
      icon: '→',
      symbol: 'ℹ',
    },
    success: {
      statusClass: 'status-success border rounded-md',
      icon: '✓',
      symbol: '✓',
    },
    warning: {
      statusClass: 'status-warning border rounded-md',
      icon: '⚠',
      symbol: '⚠',
    },
    danger: {
      statusClass: 'status-danger border rounded-md',
      icon: '✕',
      symbol: '✕',
    },
  };

  const cfg = configs[variant] || configs.info;

  return (
    <div
      className={`p-3.5 flex items-start gap-3 text-sm ${cfg.statusClass} ${className}`}
      role="alert"
    >
      <span className="shrink-0 font-bold text-base leading-none mt-0.5" aria-hidden="true">
        {cfg.symbol}
      </span>
      <div>
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
