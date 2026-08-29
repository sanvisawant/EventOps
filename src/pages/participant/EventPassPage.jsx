import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useRole } from '../../hooks/useRole';
import { CheckCircle2 } from 'lucide-react';

export function EventPassPage() {
  const { activeUser } = useRole();

  return (
    <div className="max-w-sm mx-auto space-y-5 pb-8">
      <div>
        <h1 className="text-lg font-semibold text-[--color-text-primary]">Event Pass</h1>
        <p className="text-sm text-[--color-text-secondary] mt-0.5">
          Show at entry gates and food counters.
        </p>
      </div>

      <div className="card-base p-6 text-center space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[--color-border]">
          <span className="text-xs font-mono font-semibold text-[--color-accent]">EVENTOPS · VERIFIED</span>
          <Badge variant="success" icon={CheckCircle2}>Active</Badge>
        </div>

        {/* QR code */}
        <div className="bg-white p-5 rounded-xl w-44 h-44 mx-auto flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-900" aria-label="QR Code">
            <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" fill="currentColor"/>
            <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" fill="currentColor"/>
            <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" fill="currentColor"/>
            <rect x="40" y="40" width="20" height="20" fill="currentColor"/>
            <rect x="20" y="40" width="10" height="10" fill="currentColor"/>
            <rect x="70" y="50" width="20" height="10" fill="currentColor"/>
            <rect x="50" y="70" width="20" height="20" fill="currentColor"/>
          </svg>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="text-base font-semibold text-[--color-text-primary]">{activeUser.name}</p>
          <p className="text-sm text-[--color-text-secondary] font-mono">{activeUser.email}</p>
          <div className="inline-block mt-2 px-3 py-1 rounded bg-[--color-surface-2] border border-[--color-border] font-mono text-sm font-semibold text-[--color-accent]">
            {activeUser.qrCode}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[--color-border] text-xs text-[--color-text-placeholder] font-mono">
          Checked in · Main Gate
        </div>
      </div>
    </div>
  );
}
