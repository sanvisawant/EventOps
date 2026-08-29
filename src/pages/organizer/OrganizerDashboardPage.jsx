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
import {
  Users,
  QrCode,
  LifeBuoy,
  Award,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

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
    <div className="space-y-6">
      {/* Top Banner / Event Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <StatusIndicator status={healthData.status} />
            <span className="text-xs font-mono text-slate-400">
              Event Command ID: {MOCK_EVENT.id}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Organizer Live Operations Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time telemetry and check-in scanner for live venue orchestration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" icon={QrCode} onClick={() => window.location.hash = '/organizer/checkin'}>
            Launch Scanner Booth
          </Button>
        </div>
      </div>

      {/* Telemetry Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Live Check-Ins"
          value={`${checkedInCount} / ${MOCK_EVENT.stats.totalRegistered}`}
          subtitle={`${healthData.checkInRatePercentage}% Venue Attendance`}
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Active Support Queue"
          value={healthData.openTicketsCount}
          subtitle={`${MOCK_EVENT.health.avgSupportResponseMinutes}m avg response time`}
          icon={LifeBuoy}
          color={healthData.openTicketsCount > 3 ? 'rose' : 'amber'}
        />
        <StatCard
          title="Judging Completion"
          value={`${MOCK_EVENT.stats.evaluationsCompleted} / ${MOCK_EVENT.stats.totalEvaluationsExpected}`}
          subtitle={`${healthData.judgingProgressPercentage}% Rubric Evaluations In`}
          icon={Award}
          color="indigo"
        />
        <StatCard
          title="Event Health Index"
          value={`${healthData.score} %`}
          subtitle={`Status: ${healthData.status}`}
          icon={Activity}
          color={healthData.score > 85 ? 'emerald' : 'amber'}
        />
      </div>

      {/* Live QR Verification Quick Scanner & System Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Gate Scanner */}
        <Card title="Quick Gate Scanner Simulation" subtitle="Verify participant passes instantly">
          <form onSubmit={handleSimulateScan} className="space-y-4">
            <Input
              label="Participant QR Code or Token"
              placeholder="e.g. EVTOPS-PASS-AARAV-7821"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              icon={QrCode}
            />

            <div className="flex gap-2">
              <Button type="submit" variant="primary" className="w-full">
                Verify & Check In
              </Button>
            </div>

            {/* Quick Demo Fill Buttons */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                Quick Demo Tokens:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {MOCK_USERS.filter((u) => u.role === 'PARTICIPANT').map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setQrInput(u.qrCode)}
                    className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors"
                  >
                    {u.name.split(' ')[0]} ({u.qrCode.slice(-4)})
                  </button>
                ))}
              </div>
            </div>

            {scanResult && (
              <Alert
                variant={scanResult.success ? 'success' : scanResult.isDuplicate ? 'warning' : 'danger'}
                title={scanResult.success ? 'Check-In Success!' : 'Verification Notice'}
              >
                {scanResult.success ? scanResult.message : scanResult.error}
              </Alert>
            )}
          </form>
        </Card>

        {/* Operational Recommendations Engine */}
        <Card title="Operational Recommendations" subtitle="Real-time recommendations engine" className="lg:col-span-2">
          {healthData.recommendations.length > 0 ? (
            <div className="space-y-3">
              {healthData.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3"
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      rec.severity === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-100">{rec.title}</h4>
                      <Badge variant={rec.severity === 'CRITICAL' ? 'danger' : 'warning'} size="sm">
                        {rec.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{rec.action}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-200">System Operating Optimally</p>
              <p className="text-xs text-slate-400 mt-1">No critical operational interventions required right now.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Live Stream Stream Log Preview */}
      <Card title="Live Check-In Telemetry Feed" subtitle="Real-time gate activity stream">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Participant</th>
                <th className="px-4 py-3">QR Token</th>
                <th className="px-4 py-3">Scanner Gate</th>
                <th className="px-4 py-3">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(log.scannedAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-200">{log.participantName}</td>
                  <td className="px-4 py-3 text-indigo-400">{log.qrCode}</td>
                  <td className="px-4 py-3 text-slate-400">{log.scannedBy}</td>
                  <td className="px-4 py-3">
                    <Badge variant="success" size="sm">
                      VERIFIED
                    </Badge>
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
