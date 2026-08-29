import React from 'react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useRole } from '../../hooks/useRole';
import { MOCK_TEAMS } from '../../data/mockData';
import { Award, FileCheck, ClipboardCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function JudgeDashboardPage() {
  const { activeUser } = useRole();
  const assignedSubmissions = MOCK_TEAMS.filter((t) => t.submission);

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="card-base p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="brand">Judge</Badge>
            <span className="text-xs font-mono text-[--color-text-secondary]">{activeUser.organization}</span>
          </div>
          <h1 className="text-xl font-semibold text-[--color-text-primary] tracking-tight">
            Welcome, {activeUser.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-[--color-text-secondary] mt-0.5">
            Review submitted projects and submit rubric evaluations.
          </p>
        </div>
        <Link to="/judge/evaluation">
          <Button variant="primary" icon={ClipboardCheck}>Evaluate</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Assigned" value={assignedSubmissions.length} subtitle="Projects in queue" icon={FileCheck} />
        <StatCard title="Completed" value="2" subtitle="Rubric scores submitted" icon={ClipboardCheck} />
        <StatCard title="Avg Score" value="8.65" subtitle="Out of 10" icon={Award} />
      </div>

      {/* Assignment queue */}
      <Card title="Submission Queue" subtitle="Click to evaluate against rubric criteria">
        <div className="space-y-2">
          {assignedSubmissions.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between p-4 rounded-md border border-[--color-border] bg-[--color-surface-2]"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="brand" size="sm">{team.track}</Badge>
                  <span className="text-xs text-[--color-text-secondary] font-mono">{team.name}</span>
                </div>
                <p className="text-sm font-medium text-[--color-text-primary]">{team.submission?.description}</p>
              </div>
              <Link to="/judge/evaluation">
                <Button size="sm" variant="primary" icon={ArrowRight}>Grade</Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
