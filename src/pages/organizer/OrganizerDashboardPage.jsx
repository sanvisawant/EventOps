import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { Alert } from '../../components/ui/Alert';
import { Input } from '../../components/ui/Input';
import { MOCK_EVENT, MOCK_CHECKIN_LOGS, MOCK_SUPPORT_TICKETS, MOCK_USERS } from '../../data/mockData';
import { calculateEventHealth } from '../../utils/eventHealth';
import { checkinService } from '../../services/checkin/checkinService';
import { Users, QrCode, LifeBuoy, Award, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';

export function OrganizerDashboardPage() {
  const [logs, setLogs] = useState(MOCK_CHECKIN_LOGS);
  const [supportTickets] = useState(MOCK_SUPPORT_TICKETS);
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [checkedInCount, setCheckedInCount] = useState(MOCK_EVENT.stats.totalCheckedIn);

  const healthData = calculateEventHealth({
    totalRegistered: MOCK_EVENT.stats.totalRegistered,
    totalCheckedIn: checkedInCount,
    supportTickets,
    evaluationsCompleted: MOCK_EVENT.stats.evaluationsCompleted,
    totalEvaluationsExpected: MOCK_EVENT.stats.totalEvaluationsExpected,
  });

  const handleSimulateScan = async (e) => {
    e.preventDefault();
    if (!qrInput.trim()) return;
    const res = await checkinService.processQrCheckIn(qrInput.trim());
    setScanResult(res);
    if (res.success) {
      setCheckedInCount((prev) => prev + 1);
      const updatedLogs = await checkinService.getCheckInLogs();
      setLogs(updatedLogs);
      setQrInput('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-8">
      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Check-ins"
          value={`${checkedInCount} / ${MOCK_EVENT.stats.totalRegistered}`}
          subtitle={`${healthData.checkInRatePercentage}% attendance`}
          icon={Users}
        />
        <StatCard
          title="Open Tickets"
          value={healthData.openTicketsCount}
          subtitle={`${MOCK_EVENT.health.avgSupportResponseMinutes}m avg response`}
          icon={LifeBuoy}
        />
        <StatCard
          title="Judging"
          value={`${MOCK_EVENT.stats.evaluationsCompleted} / ${MOCK_EVENT.stats.totalEvaluationsExpected}`}
          subtitle={`${healthData.judgingProgressPercentage}% complete`}
          icon={Award}
        />
        <StatCard
          title="Health Score"
          value={`${healthData.score}%`}
          subtitle={`Status: ${healthData.status}`}
          icon={Activity}
          trend={{ value: healthData.score > 85 ? 'Good' : 'Needs attention', isPositive: healthData.score > 85 }}
        />
      </div>

      {/* Scanner + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Gate Scanner */}
        <Card title="QR Scanner" subtitle="Verify participant passes">
          <form onSubmit={handleSimulateScan} className="space-y-4">
            <Input
              label="Participant QR code or token"
              placeholder="e.g. EVTOPS-PASS-7821"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              icon={QrCode}
            />
            <Button type="submit" variant="primary" className="w-full" icon={QrCode}>
              Verify &amp; Check In
            </Button>

            {/* Quick fill */}
            <div className="pt-3 border-t border-[--color-border]">
              <p className="text-xs text-[--color-text-secondary] mb-2">Quick fill from participants:</p>
              <div className="flex flex-wrap gap-1.5">
                {MOCK_USERS.filter((u) => u.role === 'PARTICIPANT').map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setQrInput(u.qrCode)}
                    className="text-xs font-mono px-2 py-1 rounded border border-[--color-border] bg-[--color-surface-2] hover:bg-[--color-border] text-[--color-accent] transition-colors"
                  >
                    {u.name.split(' ')[0]} ({u.qrCode.slice(-4)})
                  </button>
                ))}
              </div>
            </div>

            {scanResult && (
              <Alert
                variant={scanResult.success ? 'success' : scanResult.isDuplicate ? 'warning' : 'danger'}
                title={scanResult.success ? 'Check-In Successful' : 'Verification Notice'}
              >
                {scanResult.success ? scanResult.message : scanResult.error}
              </Alert>
            )}
          </form>
        </Card>

        {/* Recommendations */}
        <Card title="Recommendations" subtitle="Real-time operational suggestions" className="lg:col-span-2">
          {healthData.recommendations.length > 0 ? (
            <div className="space-y-2">
              {healthData.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-start gap-3 p-3 rounded-md border border-[--color-border] bg-[--color-surface-2]"
                >
                  <AlertTriangle
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      rec.severity === 'CRITICAL' ? 'text-[--color-danger]' : 'text-[--color-warning]'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-[--color-text-primary]">{rec.title}</p>
                      <Badge variant={rec.severity === 'CRITICAL' ? 'danger' : 'warning'} size="sm">
                        {rec.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-[--color-text-secondary]">{rec.action}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center border border-dashed border-[--color-border] rounded-md">
              <CheckCircle2 className="w-7 h-7 text-[--color-success] mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm font-medium text-[--color-text-primary]">All systems normal</p>
              <p className="text-xs text-[--color-text-secondary] mt-0.5">No operational interventions required.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Check-in log table */}
      <Card title="Check-in Log" subtitle="Recent gate activity">
        <div className="overflow-x-auto -mx-5 -mb-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[--color-border] bg-[--color-surface-2]">
                {['Time', 'Participant', 'Token', 'Gate', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[--color-border]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[--color-surface-2] transition-colors">
                  <td className="px-5 py-3 text-xs font-mono text-[--color-text-secondary]">
                    {new Date(log.scannedAt).toLocaleTimeString()}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-[--color-text-primary]">{log.participantName}</td>
                  <td className="px-5 py-3 text-xs font-mono text-[--color-accent]">{log.qrCode}</td>
                  <td className="px-5 py-3 text-xs text-[--color-text-secondary]">{log.scannedBy}</td>
                  <td className="px-5 py-3">
                    <Badge variant="success" size="sm">Verified</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
