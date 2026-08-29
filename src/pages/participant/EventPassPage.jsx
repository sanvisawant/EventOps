import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useRole } from '../../hooks/useRole';
import { QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function EventPassPage() {
  const { activeUser } = useRole();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Personal Event Access Pass
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Present this verified QR token at venue gate checkpoints, food halls, and info counters.
        </p>
      </div>

      <Card className="p-6 text-center space-y-6 border-indigo-500/30 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <span className="text-xs font-mono font-bold text-indigo-400">EVENTOPS VERIFIED PASS</span>
          <Badge variant="success" icon={CheckCircle2}>
            ACTIVE
          </Badge>
        </div>

        <div className="bg-white p-6 rounded-2xl w-48 h-48 mx-auto shadow-inner flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
            <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" fill="currentColor"/>
            <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" fill="currentColor"/>
            <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" fill="currentColor"/>
            <rect x="40" y="40" width="20" height="20" fill="currentColor"/>
            <rect x="20" y="40" width="10" height="10" fill="currentColor"/>
            <rect x="70" y="50" width="20" height="10" fill="currentColor"/>
            <rect x="50" y="70" width="20" height="20" fill="currentColor"/>
          </svg>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100">{activeUser.name}</h2>
          <p className="text-sm text-slate-400 font-mono">{activeUser.email}</p>
          <div className="inline-block mt-2 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800 font-mono text-sm font-bold text-indigo-400">
            {activeUser.qrCode}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono">
          Checked in at 09:14 AM • Main Gate Scanner
        </div>
      </Card>
    </div>
  );
}
