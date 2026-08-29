import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { checkinService } from '../../services/checkinService';
import {
  MOCK_EVENT,
  MOCK_SUPPORT_TICKETS,
  MOCK_ACTIVITY,
  MOCK_TEAMS,
  MOCK_USERS,
} from '../../data/mockData';
import { calculateEventHealth } from '../../utils/eventHealth';
import {
  calculateCheckedInPercentage,
  calculatePendingJudgments,
  calculateOpenSupportTickets,
  calculateUnmatchedParticipants,
  getEventLifecycle,
} from '../../utils/eventMetrics';
import {
  Users,
  QrCode,
  LifeBuoy,
  Megaphone,
  Trophy,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  FileCheck,
  ChevronRight,
  Flame,
} from 'lucide-react';

export function OrganizerDashboardPage() {
  const navigate = useNavigate();
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = checkinService.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsub;
  }, []);

  // Centralized Data & Derived Metrics
  const event = MOCK_EVENT;
  const stats = event.stats;

  const checkedInPct = useMemo(
    () => calculateCheckedInPercentage(stats.totalCheckedIn, stats.totalRegistered),
    [stats.totalCheckedIn, stats.totalRegistered]
  );

  const pendingJudgments = useMemo(
    () => calculatePendingJudgments(stats.submissions, stats.evaluationsCompleted),
    [stats.submissions, stats.evaluationsCompleted]
  );

  const openSupportCount = useMemo(
    () => calculateOpenSupportTickets(MOCK_SUPPORT_TICKETS),
    []
  );

  const unmatchedCount = useMemo(
    () => calculateUnmatchedParticipants(MOCK_USERS, MOCK_TEAMS),
    []
  );

  // Derive Event Health Index & Recommendations
  const healthData = useMemo(() => {
    return calculateEventHealth({
      totalRegistered: stats.totalRegistered,
      totalCheckedIn: stats.totalCheckedIn,
      supportTickets: MOCK_SUPPORT_TICKETS,
      totalSubmissions: stats.submissions,
      evaluationsCompleted: stats.evaluationsCompleted,
      totalEvaluationsExpected: stats.submissions,
      unmatchedParticipants: unmatchedCount,
    });
  }, [stats, unmatchedCount]);

  // Event Lifecycle Pipeline
  const lifecyclePhases = useMemo(
    () => getEventLifecycle(event.currentPhase),
    [event.currentPhase]
  );

  const handleActionNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* ─────────────────────────────────────────────────────────
          HEADER — Mission Control Event Banner
          ─────────────────────────────────────────────────────── */}
      <header className="card-base p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-[--color-accent]">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xs font-mono font-bold uppercase tracking-wider text-[--color-accent] bg-[--color-accent-bg] px-2 py-0.5 rounded border border-[--color-accent-border]">
              EVENTOPS
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded status-success border">
              <span className="live-dot" aria-hidden="true" />
              <span>LIVE ●</span>
            </span>
            <span className="text-xs text-[--color-text-secondary] font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[--color-text-placeholder]" aria-hidden="true" />
              <span>{event.duration}</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[--color-text-primary] tracking-tight mt-1">
            {event.name}
          </h1>
          <p className="text-xs text-[--color-text-secondary]">
            Current Phase:{' '}
            <strong className="text-[--color-text-primary] font-mono font-semibold uppercase">
              {event.currentPhase}
            </strong>
            {' · '}{event.location}
          </p>
        </div>

        {/* Quick Command Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={QrCode}
            onClick={() => handleActionNavigate('/organizer/checkin')}
          >
            Scan QR
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Megaphone}
            onClick={() => handleActionNavigate('/organizer/announcements')}
          >
            Announce
          </Button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────
          SECTION 1 — LIVE EVENT METRICS
          ─────────────────────────────────────────────────────── */}
      <section aria-label="Live Event Metrics">
        <h2 className="sr-only">Live Event Metrics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatCard
            title="Registered"
            value={stats.totalRegistered}
            subtitle="Attendees signed up"
            icon={Users}
          />
          <StatCard
            title="Checked In"
            value={`${stats.totalCheckedIn} / ${stats.totalRegistered}`}
            subtitle={`${checkedInPct}% attendance`}
            icon={QrCode}
            trend={{ value: `↑ ${stats.attendanceTrendPct}%/hr`, isPositive: true }}
          />
          <StatCard
            title="Active Teams"
            value={stats.activeTeams}
            subtitle="Participating teams"
            icon={Layers}
          />
          <StatCard
            title="Submissions"
            value={stats.submissions}
            subtitle="Projects submitted"
            icon={FileCheck}
          />
          <StatCard
            title="Pending Judging"
            value={pendingJudgments}
            subtitle="Awaiting rubric score"
            icon={Award}
            trend={pendingJudgments > 10 ? { value: 'High Queue', isPositive: false } : undefined}
          />
          <StatCard
            title="Open Support"
            value={openSupportCount}
            subtitle="Unresolved tickets"
            icon={LifeBuoy}
            trend={openSupportCount > 5 ? { value: 'Spike', isPositive: false } : undefined}
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          SECTION 5 — EVENT PROGRESS (LIFECYCLE PIPELINE)
          ─────────────────────────────────────────────────────── */}
      <section aria-label="Event Lifecycle Pipeline" className="card-base p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[--color-text-secondary]">
            Event Progress Lifecycle
          </h2>
          <span className="text-xs font-mono text-[--color-accent] font-medium">
            Active Phase: {event.currentPhase}
          </span>
        </div>

        <nav aria-label="Lifecycle progress">
          <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {lifecyclePhases.map((phase, idx) => {
              const isActive = phase.status === 'ACTIVE';
              const isCompleted = phase.status === 'COMPLETED';

              return (
                <li
                  key={phase.id}
                  className={[
                    'p-2.5 rounded-md border text-xs text-center transition-colors flex flex-col items-center justify-center gap-1',
                    isActive
                      ? 'bg-[--color-accent-bg] border-[--color-accent] text-[--color-accent] font-semibold shadow-sm'
                      : isCompleted
                      ? 'bg-[--color-surface-2] border-[--color-border] text-[--color-text-primary]'
                      : 'bg-transparent border-[--color-border] text-[--color-text-placeholder]',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-2xs opacity-75">{idx + 1}.</span>
                    <span className="truncate">{phase.label}</span>
                  </div>
                  <span className="text-2xs font-mono">
                    {isActive ? '● ACTIVE' : isCompleted ? '✓ Done' : 'Next'}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      </section>

      {/* ─────────────────────────────────────────────────────────
          GRID: EVENT HEALTH & ATTENTION REQUIRED (2 COLS)
          ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ─────────────────────────────────────────────────────────
            SECTION 2 — EVENT HEALTH (5 COLS)
            ─────────────────────────────────────────────────────── */}
        <section aria-label="Event Health Index" className="lg:col-span-5 flex flex-col">
          <Card
            title="Event Health Index"
            subtitle="Calculated via src/utils/eventHealth.js"
            action={<StatusIndicator status={healthData.status === 'Healthy' ? 'OPTIMAL' : healthData.status === 'Attention' ? 'WARNING' : 'CRITICAL'} label={healthData.status} />}
            className="flex-1"
          >
            <div className="space-y-5">
              {/* Score Display */}
              <div className="flex items-center justify-between p-4 rounded-md bg-[--color-surface-2] border border-[--color-border]">
                <div>
                  <p className="text-xs text-[--color-text-secondary] font-medium uppercase tracking-wide">
                    Overall Health Score
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold font-mono text-[--color-text-primary] tracking-tight">
                      {healthData.score}
                    </span>
                    <span className="text-sm font-mono text-[--color-text-secondary]">/ 100</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-[--color-accent-bg] text-[--color-accent] border border-[--color-accent-border]">
                  <Activity className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>

              {/* Category Health Breakdown */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wider">
                  Category Breakdown
                </p>

                {[
                  { label: 'Attendance', score: healthData.categories.attendance },
                  { label: 'Team Formation', score: healthData.categories.teamFormation },
                  { label: 'Submissions', score: healthData.categories.submissions },
                  { label: 'Judging', score: healthData.categories.judging },
                  { label: 'Engagement', score: healthData.categories.engagement },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[--color-text-primary] font-medium">{item.label}</span>
                      <span className="font-mono text-[--color-text-secondary]">{item.score}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[--color-surface-2] overflow-hidden border border-[--color-border]">
                      <div
                        className={[
                          'h-full rounded-full transition-all duration-500',
                          item.score >= 85
                            ? 'bg-[--color-success]'
                            : item.score >= 70
                            ? 'bg-[--color-warning]'
                            : 'bg-[--color-danger]',
                        ].join(' ')}
                        style={{ width: `${item.score}%` }}
                        role="progressbar"
                        aria-valuenow={item.score}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label={`${item.label} score ${item.score}%`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* ─────────────────────────────────────────────────────────
            SECTION 3 — ATTENTION REQUIRED (7 COLS)
            ─────────────────────────────────────────────────────── */}
        <section aria-label="Attention Required" className="lg:col-span-7 flex flex-col">
          <Card
            title="Attention Required"
            subtitle="Deterministic operational recommendations derived from state thresholds"
            action={<Badge variant={healthData.recommendations.length > 0 ? 'warning' : 'success'}>{healthData.recommendations.length} Action Items</Badge>}
            className="flex-1"
          >
            {healthData.recommendations.length > 0 ? (
              <div className="space-y-3">
                {healthData.recommendations.map((rec) => {
                  const isCritical = rec.severity === 'CRITICAL';
                  const isWarning = rec.severity === 'WARNING';

                  return (
                    <div
                      key={rec.id}
                      className={[
                        'p-4 rounded-md border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4',
                        isCritical
                          ? 'status-danger'
                          : isWarning
                          ? 'status-warning'
                          : 'status-info',
                      ].join(' ')}
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs font-mono uppercase tracking-wider">
                            {isCritical ? '✕ CRITICAL' : isWarning ? '⚠ WARNING' : 'ℹ NOTICE'}
                          </span>
                          <span className="font-semibold text-sm">{rec.title}</span>
                        </div>
                        <p className="text-xs opacity-90">{rec.description}</p>
                        <p className="text-xs font-medium pt-1">
                          <span className="opacity-75">Action:</span> {rec.recommendedAction}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant={isCritical ? 'danger' : 'primary'}
                        onClick={() => handleActionNavigate(rec.actionRoute || '/organizer')}
                        className="shrink-0"
                      >
                        {rec.actionLabel || 'Resolve'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2 border border-dashed border-[--color-border] rounded-md">
                <CheckCircle2 className="w-8 h-8 text-[--color-success] mx-auto" aria-hidden="true" />
                <p className="text-sm font-semibold text-[--color-text-primary]">
                  No High-Priority Bottlenecks
                </p>
                <p className="text-xs text-[--color-text-secondary]">
                  All event operational metrics are currently within healthy thresholds.
                </p>
              </div>
            )}
          </Card>
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────
          GRID: LIVE ACTIVITY & ATTENDANCE OVERVIEW (2 COLS)
          ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ─────────────────────────────────────────────────────────
            SECTION 4 — LIVE ACTIVITY (7 COLS)
            ─────────────────────────────────────────────────────── */}
        <section aria-label="Live Activity Feed" className="lg:col-span-7">
          <Card title="Live Activity Feed" subtitle="Real-time event stream (newest first)">
            <div className="divide-y divide-[--color-border] max-h-80 overflow-y-auto -mx-5 -mb-4">
              {MOCK_ACTIVITY.map((act) => (
                <div
                  key={act.id}
                  className="px-5 py-3 flex items-start justify-between gap-3 hover:bg-[--color-surface-2] transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`mt-0.5 px-1.5 py-0.5 rounded text-2xs font-bold font-mono border ${act.statusClass}`}
                      aria-hidden="true"
                    >
                      {act.iconSymbol}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-[--color-text-primary]">
                        <strong className="font-semibold text-[--color-text-primary]">
                          {act.actor}
                        </strong>{' '}
                        {act.description}
                      </p>
                    </div>
                  </div>
                  <time className="shrink-0 text-2xs font-mono text-[--color-text-placeholder]">
                    {act.timeAgo}
                  </time>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ─────────────────────────────────────────────────────────
            SECTION 6 — ATTENDANCE OVERVIEW (5 COLS)
            ─────────────────────────────────────────────────────── */}
        <section aria-label="Attendance Overview" className="lg:col-span-5">
          <Card title="Attendance Overview" subtitle="Gate check-in statistics">
            <div className="space-y-4">
              {/* Horizontal Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[--color-text-secondary]">Gate Attendance</span>
                  <span className="font-mono font-bold text-[--color-text-primary]">
                    {stats.totalCheckedIn} / {stats.totalRegistered} ({checkedInPct}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[--color-surface-2] overflow-hidden border border-[--color-border] flex">
                  <div
                    className="h-full bg-[--color-accent] transition-all"
                    style={{ width: `${checkedInPct}%` }}
                    title={`Checked In: ${stats.totalCheckedIn}`}
                  />
                  <div
                    className="h-full bg-[--color-border-strong] transition-all"
                    style={{ width: `${100 - checkedInPct}%` }}
                    title={`Not Checked In: ${stats.totalRegistered - stats.totalCheckedIn}`}
                  />
                </div>
              </div>

              {/* Status Breakdown List */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-md bg-[--color-surface-2] border border-[--color-border] text-center">
                  <p className="text-2xs text-[--color-text-secondary] uppercase font-semibold">
                    Checked In
                  </p>
                  <p className="text-xl font-bold font-mono text-[--color-success] mt-0.5">
                    {stats.totalCheckedIn}
                  </p>
                  <p className="text-2xs text-[--color-text-placeholder] mt-0.5 font-mono">
                    {checkedInPct}% of total
                  </p>
                </div>
                <div className="p-3 rounded-md bg-[--color-surface-2] border border-[--color-border] text-center">
                  <p className="text-2xs text-[--color-text-secondary] uppercase font-semibold">
                    Not Checked In
                  </p>
                  <p className="text-xl font-bold font-mono text-[--color-text-secondary] mt-0.5">
                    {stats.totalRegistered - stats.totalCheckedIn}
                  </p>
                  <p className="text-2xs text-[--color-text-placeholder] mt-0.5 font-mono">
                    {(100 - checkedInPct).toFixed(1)}% remaining
                  </p>
                </div>
              </div>

              {/* Check-In Velocity Context */}
              <div className="p-3 rounded-md border border-[--color-border] bg-[--color-surface-2] flex items-center justify-between text-xs">
                <span className="text-[--color-text-secondary]">Check-In Velocity:</span>
                <span className="font-mono font-semibold text-[--color-accent]">
                  ↑ {stats.attendanceTrendPct}% vs previous hour
                </span>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────
          SECTION 7 — QUICK ACTIONS BAR
          ─────────────────────────────────────────────────────── */}
      <section aria-label="Organizer Quick Actions" className="card-base p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[--color-text-secondary]">
            Organizer Action Controls
          </h2>
          <span className="text-2xs text-[--color-text-placeholder] font-mono">
            Direct navigation to event workflows
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Button
            variant="secondary"
            className="w-full justify-start text-xs"
            icon={QrCode}
            onClick={() => handleActionNavigate('/organizer/checkin')}
          >
            Scan QR
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-start text-xs"
            icon={LifeBuoy}
            onClick={() => handleActionNavigate('/organizer/support')}
          >
            Support Queue
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-start text-xs"
            icon={Megaphone}
            onClick={() => handleActionNavigate('/organizer/announcements')}
          >
            Announce
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-start text-xs"
            icon={Users}
            onClick={() => handleActionNavigate('/participant/matchmaking')}
          >
            View Teams
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-start text-xs"
            icon={Award}
            onClick={() => handleActionNavigate('/judge/submissions')}
          >
            View Judging
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-start text-xs"
            icon={Trophy}
            onClick={() => handleActionNavigate('/organizer/leaderboard')}
          >
            Leaderboard
          </Button>
        </div>
      </section>
    </div>
  );
}
