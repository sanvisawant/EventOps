import React from 'react';

export function StatusIndicator({ status = 'OPTIMAL', label }) {
  const configs = {
    OPTIMAL: {
      dotClass: 'bg-[--color-success]',
      textClass: 'text-[--color-success]',
      defaultLabel: '✓ Live',
    },
    WARNING: {
      dotClass: 'bg-[--color-warning]',
      textClass: 'text-[--color-warning]',
      defaultLabel: '⚠ Needs attention',
    },
    CRITICAL: {
      dotClass: 'bg-[--color-danger]',
      textClass: 'text-[--color-danger]',
      defaultLabel: '✕ Critical',
    },
  };

  const cfg = configs[status] || configs.OPTIMAL;

  return (
    <div className="inline-flex items-center gap-2 text-xs font-medium">
      <span className={`live-dot ${cfg.dotClass}`} aria-hidden="true" />
      <span className={cfg.textClass}>{label || cfg.defaultLabel}</span>
    </div>
  );
}
