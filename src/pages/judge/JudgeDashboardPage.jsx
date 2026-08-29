import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useRole } from '../../hooks/useRole';
import { judgingService } from '../../services/judgingService';
import { Award, FileCheck, ClipboardCheck, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export function JudgeDashboardPage() {
  const { activeUser } = useRole();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalAssigned: 0,
    evaluatedCount: 0,
    pendingCount: 0,
    averageScore: 0,
  });

  const refreshData = async () => {
    const subs = await judgingService.getSubmissions();
    const met = judgingService.getJudgeMetrics(activeUser?.id);
    setSubmissions(subs);
    setMetrics(met);
  };

  useEffect(() => {
    refreshData();
    const unsub = judgingService.subscribe(() => {
      refreshData();
    });
    return unsub;
  }, [activeUser]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <header className="card-base p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-[--color-accent]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand">JUDGE PORTAL</Badge>
            <span className="text-xs font-mono text-[--color-text-secondary]">
              {activeUser.organization || 'Google Cloud Platform'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-[--color-text-primary] tracking-tight">
            Welcome, {activeUser.name || 'Judge'}
          </h1>
          <p className="text-xs text-[--color-text-secondary]">
            Review project submissions against defined 4-criteria rubrics and submit scores securely.
          </p>
        </div>
        <Button
          variant="primary"
          icon={ClipboardCheck}
          onClick={() => navigate('/judge/submissions')}
        >
          View Submissions Queue
        </Button>
      </header>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Assigned"
          value={metrics.totalAssigned}
          subtitle="Total assigned projects"
          icon={FileCheck}
        />
        <StatCard
          title="Evaluated"
          value={metrics.evaluatedCount}
          subtitle="Rubric scores submitted"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending"
          value={metrics.pendingCount}
          subtitle="Awaiting evaluation"
          icon={Clock}
          trend={metrics.pendingCount > 0 ? { value: `${metrics.pendingCount} left`, isPositive: false } : undefined}
        />
        <StatCard
          title="Avg Score"
          value={metrics.averageScore ? `${metrics.averageScore}` : 'N/A'}
          subtitle="Out of 10.0"
          icon={Award}
        />
      </div>

      {/* Submission Queue Section */}
      <Card title="Project Submissions Queue" subtitle="Click Evaluate to open 4-criteria rubric grading">
        <div className="divide-y divide-[--color-border] -mx-5 -mb-4">
          {submissions.map((team) => {
            const isEvaluated = team.submission?.status === 'EVALUATED';

            return (
              <div
                key={team.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[--color-surface-2] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[--color-accent]">
                      {team.submissionId || '#042'}
                    </span>
                    <Badge variant="brand" size="sm">
                      {team.track}
                    </Badge>
                    <span className="text-xs font-bold text-[--color-text-primary]">{team.name}</span>
                    <span className="text-xs text-[--color-text-secondary]">({team.projectName})</span>
                  </div>
                  <p className="text-xs text-[--color-text-secondary] line-clamp-1">
                    {team.submission?.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge
                    variant={isEvaluated ? 'success' : 'warning'}
                    size="md"
                    icon={isEvaluated ? CheckCircle2 : Clock}
                  >
                    {isEvaluated ? `EVALUATED · ${team.scores?.totalWeightedScore}/10` : 'PENDING'}
                  </Badge>

                  <Button
                    size="sm"
                    variant={isEvaluated ? 'secondary' : 'primary'}
                    icon={ArrowRight}
                    onClick={() => navigate(`/judge/evaluation?id=${team.id}`)}
                  >
                    {isEvaluated ? 'View Evaluation' : 'Evaluate'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
