import React, { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/Badge';
import { QRCode } from '../../components/ui/QRCode';
import { useRole } from '../../hooks/useRole';
import { checkinService } from '../../services/checkinService';
import { MOCK_EVENT } from '../../data/mockData';
import { ShieldCheck, CheckCircle2, Clock, MapPin, Building, Sparkles } from 'lucide-react';

export function EventPassPage() {
  const { activeUser } = useRole();
  const [statusInfo, setStatusInfo] = useState(() =>
    checkinService.getParticipantStatus(activeUser?.id || activeUser?.email || 'P-1042')
  );

  useEffect(() => {
    const unsub = checkinService.subscribe(() => {
      const updated = checkinService.getParticipantStatus(activeUser?.id || activeUser?.email || 'P-1042');
      if (updated) setStatusInfo(updated);
    });
    return unsub;
  }, [activeUser]);

  const user = statusInfo?.user || activeUser || {};
  const isCheckedIn = Boolean(statusInfo?.isCheckedIn || user.isCheckedIn);
  const checkInTime = statusInfo?.checkInTime || user.checkInTime;
  const checkInGate = statusInfo?.checkInGate || user.checkInGate || 'Main Entrance';

  const participantId = user.participantId || 'P-1042';
  const qrToken = user.qrCode || `EVENTOPS:${participantId}:EVT-2026`;
  const teamName = user.teamName || (user.teamId ? 'NeuralForge' : 'Solo Participant');

  const formattedTime = checkInTime
    ? new Date(checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-12">
      <div className="text-center space-y-1">
        <span className="text-2xs font-mono font-bold uppercase tracking-wider text-[--color-accent] bg-[--color-accent-bg] px-2.5 py-0.5 rounded border border-[--color-accent-border]">
          DIGITAL EVENT PASS
        </span>
        <h1 className="text-xl font-bold text-[--color-text-primary] tracking-tight">
          {MOCK_EVENT.name}
        </h1>
        <p className="text-xs text-[--color-text-secondary]">
          Present this QR pass at venue gates, food counters, and help desks.
        </p>
      </div>

      <div className="card-base p-6 text-center space-y-6 shadow-card border-[--color-border-strong] relative overflow-hidden">
        {/* Top pass badge */}
        <div className="flex items-center justify-between pb-4 border-b border-[--color-border]">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[--color-accent]">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>EVENTOPS VERIFIED</span>
          </div>

          <Badge
            variant={isCheckedIn ? 'success' : 'warning'}
            size="md"
            icon={isCheckedIn ? CheckCircle2 : Clock}
          >
            {isCheckedIn ? 'CHECKED IN' : 'NOT CHECKED IN'}
          </Badge>
        </div>

        {/* SVG QR Code */}
        <div className="flex flex-col items-center justify-center space-y-2 py-2">
          <QRCode value={qrToken} size={190} label={`Event Pass for ${user.name || 'Participant'}`} />
          <span className="text-2xs font-mono text-[--color-text-placeholder]">
            Safe Payload: {qrToken}
          </span>
        </div>

        {/* Participant Information */}
        <div className="space-y-2 pt-2 border-t border-[--color-border]">
          <div>
            <h2 className="text-lg font-bold text-[--color-text-primary] tracking-tight">
              {user.name || 'Sanvi Sawant'}
            </h2>
            <p className="text-xs text-[--color-text-secondary] font-mono">{user.email || 'sanvi.sawant@example.com'}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <div className="p-2.5 rounded bg-[--color-surface-2] border border-[--color-border] text-left">
              <span className="text-2xs font-mono text-[--color-text-placeholder] uppercase block">Participant ID</span>
              <span className="font-mono font-bold text-[--color-text-primary]">{participantId}</span>
            </div>
            <div className="p-2.5 rounded bg-[--color-surface-2] border border-[--color-border] text-left">
              <span className="text-2xs font-mono text-[--color-text-placeholder] uppercase block">Team</span>
              <span className="font-semibold text-[--color-text-primary] truncate block">{teamName}</span>
            </div>
          </div>
        </div>

        {/* Live Gate Status Footer */}
        <div className="pt-4 border-t border-[--color-border] text-xs">
          {isCheckedIn ? (
            <div className="flex items-center justify-center gap-2 status-success p-2.5 rounded border font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Checked in at {formattedTime} ({checkInGate})</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 status-warning p-2.5 rounded border font-mono">
              <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Awaiting Gate Verification</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
