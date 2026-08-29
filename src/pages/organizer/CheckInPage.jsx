import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { checkinService } from '../../services/checkinService';
import { MOCK_USERS } from '../../data/mockData';
import {
  QrCode,
  Search,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MapPin,
  Clock,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

const GATE_OPTIONS = [
  { value: 'Main Entrance', label: 'Gate 1 — Main Entrance' },
  { value: 'North Gate', label: 'Gate 2 — North Gate' },
  { value: 'Workshop Gate', label: 'Gate 3 — Workshop Gate' },
];

const DEMO_TOKENS = [
  { name: 'Sanvi', token: 'EVENTOPS:P-1042:EVT-2026', label: 'Sanvi (P-1042)', status: 'New Pass' },
  { name: 'Rohan', token: 'EVENTOPS:P-1045:EVT-2026', label: 'Rohan (P-1045)', status: 'New Pass' },
  { name: 'Aarav', token: 'EVENTOPS:P-1043:EVT-2026', label: 'Aarav (P-1043)', status: 'Duplicate' },
  { name: 'Priya', token: 'EVENTOPS:P-1044:EVT-2026', label: 'Priya (P-1044)', status: 'Duplicate' },
  { name: 'Invalid', token: 'EVENTOPS:P-9999:INVALID', label: 'Invalid Token', status: 'Invalid' },
];

export function CheckInPage() {
  const [selectedGate, setSelectedGate] = useState('Main Entrance');
  const [qrToken, setQrToken] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [logs, setLogs] = useState([]);
  const [scanState, setScanState] = useState({ status: 'idle', result: null });
  const inputRef = useRef(null);

  const refreshLogs = async () => {
    const l = await checkinService.getCheckInLogs();
    setLogs([...l]);
  };

  useEffect(() => {
    refreshLogs();
    const unsub = checkinService.subscribe(() => {
      refreshLogs();
    });
    return unsub;
  }, []);

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!qrToken.trim()) return;

    setScanState({ status: 'verifying', result: null });

    // Process check-in via service
    const res = await checkinService.processQrCheckIn(qrToken.trim(), selectedGate, 'Gate Scanner Alpha');

    if (res.success) {
      setScanState({ status: 'success', result: res });
      setQrToken('');
    } else if (res.isDuplicate) {
      setScanState({ status: 'duplicate', result: res });
    } else {
      setScanState({ status: 'invalid', result: res });
    }

    refreshLogs();
  };

  const handleQuickFill = (token) => {
    setQrToken(token);
    if (inputRef.current) inputRef.current.focus();
  };

  const participants = MOCK_USERS.filter(
    (u) =>
      u.role === 'PARTICIPANT' &&
      (u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        u.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (u.participantId && u.participantId.toLowerCase().includes(searchFilter.toLowerCase())) ||
        (u.qrCode && u.qrCode.toLowerCase().includes(searchFilter.toLowerCase())))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-mono font-bold uppercase tracking-wider text-[--color-accent] bg-[--color-accent-bg] px-2 py-0.5 rounded border border-[--color-accent-border]">
              ATTENDANCE SYSTEM
            </span>
            <span className="live-dot" aria-hidden="true" />
            <span className="text-xs text-[--color-text-secondary]">Live Verification</span>
          </div>
          <h1 className="text-xl font-bold text-[--color-text-primary] tracking-tight">
            Live Gate QR Scanner
          </h1>
          <p className="text-xs text-[--color-text-secondary]">
            Verify attendee passes, prevent duplicate gate entries, and update live event attendance.
          </p>
        </div>

        {/* Gate Selector */}
        <div className="w-full sm:w-64">
          <Select
            label="Active Check-In Gate"
            value={selectedGate}
            onChange={(e) => setSelectedGate(e.target.value)}
            options={GATE_OPTIONS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanner Terminal Console (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card title="Gate Scanner Console" subtitle={`Active: ${selectedGate}`}>
            <form onSubmit={handleScanSubmit} className="space-y-4">
              {/* Scanner Frame Visualization */}
              <div className="p-4 rounded-lg bg-[--color-surface-2] border border-[--color-border] flex flex-col items-center justify-center text-center gap-2 relative">
                <div className="p-3 rounded-full bg-[--color-accent-bg] text-[--color-accent] border border-[--color-accent-border]">
                  <QrCode className="w-6 h-6" aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold text-[--color-text-primary]">
                  Gate Scanner Ready
                </p>
                <p className="text-2xs text-[--color-text-secondary]">
                  Scan pass barcode or enter participant token below
                </p>
              </div>

              <Input
                label="Scanned QR Pass Code / Token"
                id="qr-input"
                ref={inputRef}
                placeholder="e.g. EVENTOPS:P-1042:EVT-2026"
                value={qrToken}
                onChange={(e) => setQrToken(e.target.value)}
                icon={QrCode}
                autoFocus
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                icon={ShieldCheck}
                disabled={!qrToken.trim() || scanState.status === 'verifying'}
              >
                {scanState.status === 'verifying' ? 'Verifying Pass…' : 'Verify & Check In'}
              </Button>
            </form>

            {/* Quick Fill Demo Passes */}
            <div className="mt-4 pt-4 border-t border-[--color-border] space-y-2">
              <span className="text-2xs font-mono font-semibold uppercase tracking-wider text-[--color-text-placeholder] block">
                Quick Evaluation Demo Passes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_TOKENS.map((demo) => (
                  <button
                    key={demo.token}
                    type="button"
                    onClick={() => handleQuickFill(demo.token)}
                    className="text-2xs font-mono px-2 py-1 rounded bg-[--color-surface-2] hover:bg-[--color-border] text-[--color-accent] border border-[--color-border] transition-colors cursor-pointer"
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Verification Result Display Card */}
          {scanState.status !== 'idle' && (
            <div role="region" aria-live="polite">
              {scanState.status === 'success' && scanState.result && (
                <div className="p-4 rounded-md border status-success space-y-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[--color-success] shrink-0" aria-hidden="true" />
                    <span className="font-bold text-sm font-mono uppercase tracking-wider">
                      ✓ VERIFIED
                    </span>
                  </div>
                  <div className="pl-7 space-y-1 text-xs">
                    <p className="font-bold text-base">{scanState.result.participant.name}</p>
                    <p className="font-mono text-2xs opacity-90">
                      Participant ID: {scanState.result.participant.participantId || 'P-1042'}
                    </p>
                    <p className="opacity-90">
                      Team: {scanState.result.participant.teamName || 'NeuralForge'}
                    </p>
                    <div className="pt-2 border-t border-emerald-500/20 font-mono text-2xs flex items-center justify-between">
                      <span>Gate: {selectedGate}</span>
                      <span>Confirmed: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              )}

              {scanState.status === 'duplicate' && scanState.result && (
                <div className="p-4 rounded-md border status-warning space-y-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[--color-warning] shrink-0" aria-hidden="true" />
                    <span className="font-bold text-sm font-mono uppercase tracking-wider">
                      ⚠ ALREADY CHECKED IN
                    </span>
                  </div>
                  <div className="pl-7 space-y-1 text-xs">
                    <p className="font-bold text-base">{scanState.result.participant?.name || 'Participant'}</p>
                    <p className="opacity-90">
                      Checked in at {scanState.result.existingCheckIn?.time} ({scanState.result.existingCheckIn?.gate})
                    </p>
                    <p className="text-2xs font-mono text-[--color-warning] pt-1">
                      Duplicate entry rejected automatically.
                    </p>
                  </div>
                </div>
              )}

              {scanState.status === 'invalid' && (
                <div className="p-4 rounded-md border status-danger space-y-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-[--color-danger] shrink-0" aria-hidden="true" />
                    <span className="font-bold text-sm font-mono uppercase tracking-wider">
                      ✕ INVALID PASS
                    </span>
                  </div>
                  <div className="pl-7 text-xs">
                    <p className="opacity-90">The QR/token could not be verified.</p>
                    <p className="text-2xs font-mono opacity-75 mt-1">
                      Check for valid EVENTOPS participant token string.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Directory & Check-In History (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card title="Registered Participants Directory" subtitle="Real-time attendance status">
            <div className="mb-3">
              <Input
                placeholder="Search by participant name, ID or QR token…"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                icon={Search}
              />
            </div>

            <div className="overflow-x-auto -mx-5 -mb-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[--color-border] bg-[--color-surface-2]">
                    <th className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide">
                      Participant
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide">
                      Pass ID / Token
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--color-border]">
                  {participants.map((usr) => (
                    <tr key={usr.id} className="hover:bg-[--color-surface-2] transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-sm font-semibold text-[--color-text-primary]">{usr.name}</p>
                        <p className="text-2xs text-[--color-text-secondary] font-mono">
                          ID: {usr.participantId || 'P-1042'} · {usr.teamName || 'Solo'}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-2xs font-mono text-[--color-accent]">
                        {usr.qrCode}
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          variant={usr.isCheckedIn ? 'success' : 'neutral'}
                          size="sm"
                          icon={usr.isCheckedIn ? CheckCircle2 : Clock}
                        >
                          {usr.isCheckedIn ? 'CHECKED IN' : 'NOT CHECKED IN'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleQuickFill(usr.qrCode)}
                          icon={UserCheck}
                        >
                          Select Token
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
