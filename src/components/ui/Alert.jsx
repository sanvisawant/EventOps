import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export function Alert({ children, title, variant = 'info', className = '' }) {
  const configs = {
    info: {
      icon: Info,
      styles: 'bg-sky-500/10 border-sky-500/20 text-sky-200',
      iconStyle: 'text-sky-400',
    },
    success: {
      icon: CheckCircle,
      styles: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200',
      iconStyle: 'text-emerald-400',
    },
    warning: {
      icon: AlertTriangle,
      styles: 'bg-amber-500/10 border-amber-500/20 text-amber-200',
      iconStyle: 'text-amber-400',
    },
    danger: {
      icon: XCircle,
      styles: 'bg-rose-500/10 border-rose-500/20 text-rose-200',
      iconStyle: 'text-rose-400',
    },
  };

  const config = configs[variant] || configs.info;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 ${config.styles} ${className}`} role="alert">
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconStyle}`} aria-hidden="true" />
      <div className="text-sm">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
