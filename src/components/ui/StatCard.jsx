import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, trend }) {
  return (
    <div className="card-base p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-xs text-[--color-text-secondary] font-medium">{title}</p>
          <p className="text-2xl font-semibold text-[--color-text-primary] tracking-tight font-mono">
            {value}
          </p>
        </div>
        {Icon && (
          <div className="p-2 rounded-md bg-[--color-surface-2] text-[--color-text-secondary]">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="pt-2 border-t border-[--color-border] flex items-center justify-between text-xs text-[--color-text-secondary]">
          <span>{subtitle}</span>
          {trend && (
            <span
              className={trend.isPositive ? 'text-[--color-success] font-medium' : 'text-[--color-danger] font-medium'}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
