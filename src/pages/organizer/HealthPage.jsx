import React from 'react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { MOCK_EVENT, MOCK_SUPPORT_TICKETS } from '../../data/mockData';
import { calculateEventHealth } from '../../utils/eventHealth';
import { Activity, ShieldAlert, CheckCircle, Server, Cpu } from 'lucide-react';

export function HealthPage() {
  const healthData = calculateEventHealth({
    totalRegistered: MOCK_EVENT.stats.totalRegistered,
    totalCheckedIn: MOCK_EVENT.stats.totalCheckedIn,
    supportTickets: MOCK_SUPPORT_TICKETS,
    evaluationsCompleted: MOCK_EVENT.stats.evaluationsCompleted,
    totalEvaluationsExpected: MOCK_EVENT.stats.totalEvaluationsExpected,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-400" />
            Live Event Health Monitor
          </h1>
          <p className="text-sm text-slate-400">
            Real-time algorithmic operational health index factoring venue check-in velocity, support desk backlog, and evaluation throughput.
          </p>
        </div>
        <StatusIndicator status={healthData.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Overall Health Index"
          value={`${healthData.score}%`}
          subtitle={`Status: ${healthData.status}`}
          icon={Activity}
          color={healthData.score > 85 ? 'emerald' : 'amber'}
        />
        <StatCard
          title="Attendance Rate"
          value={`${healthData.checkInRatePercentage}%`}
          subtitle={`${MOCK_EVENT.stats.totalCheckedIn} checked in`}
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="Support Desk Backlog"
          value={healthData.openTicketsCount}
          subtitle="Open participant tickets"
          icon={ShieldAlert}
          color={healthData.openTicketsCount > 3 ? 'rose' : 'amber'}
        />
      </div>

      <Card title="Operational Recommendations Engine" subtitle="Auto-generated triage actions">
        <div className="space-y-3">
          {healthData.recommendations.length > 0 ? (
            healthData.recommendations.map((rec) => (
              <div key={rec.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{rec.title}</h4>
                  <p className="text-xs text-slate-300 mt-1">{rec.action}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              All system metrics are within optimal operating thresholds.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
