import React from 'react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { MOCK_EVENT, MOCK_SUPPORT_TICKETS } from '../../data/mockData';
import { calculateEventHealth } from '../../utils/eventHealth';
import { Activity, ShieldAlert, CheckCircle } from 'lucide-react';

export function HealthPage() {
  const healthData = calculateEventHealth({
    totalRegistered: MOCK_EVENT.stats.totalRegistered,
    totalCheckedIn: MOCK_EVENT.stats.totalCheckedIn,
    supportTickets: MOCK_SUPPORT_TICKETS,
    evaluationsCompleted: MOCK_EVENT.stats.evaluationsCompleted,
    totalEvaluationsExpected: MOCK_EVENT.stats.totalEvaluationsExpected,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[--color-text-primary]">System Health</h1>
          <p className="text-sm text-[--color-text-secondary] mt-0.5">
            Operational health index across check-in, support, and evaluation.
          </p>
        </div>
        <StatusIndicator status={healthData.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Health Score"
          value={`${healthData.score}%`}
          subtitle={`Status: ${healthData.status}`}
          icon={Activity}
        />
        <StatCard
          title="Attendance"
          value={`${healthData.checkInRatePercentage}%`}
          subtitle={`${MOCK_EVENT.stats.totalCheckedIn} checked in`}
          icon={CheckCircle}
        />
        <StatCard
          title="Open Tickets"
          value={healthData.openTicketsCount}
          subtitle="Support backlog"
          icon={ShieldAlert}
        />
      </div>

      <Card title="Recommendations" subtitle="Auto-generated operational actions">
        <div className="space-y-2">
          {healthData.recommendations.length > 0 ? (
            healthData.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="flex items-start gap-3 p-3 rounded-md border border-[--color-border] bg-[--color-surface-2]"
              >
                <ShieldAlert
                  className={`w-4 h-4 shrink-0 mt-0.5 ${rec.severity === 'CRITICAL' ? 'text-[--color-danger]' : 'text-[--color-warning]'}`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-[--color-text-primary]">{rec.title}</p>
                  <p className="text-xs text-[--color-text-secondary] mt-0.5">{rec.action}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-sm text-[--color-text-secondary]">
              All metrics are within optimal operating thresholds.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
