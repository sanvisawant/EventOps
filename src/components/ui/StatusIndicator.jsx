import React from 'react';

export function StatusIndicator({ status = 'OPTIMAL', label }) {
  const configs = {
    OPTIMAL: {
      dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
      text: 'text-emerald-400 font-semibold',
      defaultLabel: 'SYSTEM OPTIMAL',
    },
    WARNING: {
      dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
      text: 'text-amber-400 font-semibold',
      defaultLabel: 'ATTENTION REQUIRED',
    },
    CRITICAL: {
      dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
      text: 'text-rose-400 font-semibold',
      defaultLabel: 'CRITICAL BACKLOG',
    },
  };

  const config = configs[status] || configs.OPTIMAL;

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
      <span className={`w-2 h-2 rounded-full animate-pulse ${config.dot}`} />
      <span className={config.text}>{label || config.defaultLabel}</span>
    </div>
  );
}
