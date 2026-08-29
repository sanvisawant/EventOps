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
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand">JUDGE PORTAL</Badge>
            <span className="text-xs font-mono text-slate-400">{activeUser.organization}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Welcome, {activeUser.name}!
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review assigned project submissions, grade against the structured 4-criteria rubric, and submit live scores.
          </p>
        </div>

        <Link to="/judge/evaluation">
          <Button variant="primary" icon={ClipboardCheck}>
            Start Rubric Evaluation
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Assigned Submissions"
          value={assignedSubmissions.length}
          subtitle="Projects in your queue"
          icon={FileCheck}
          color="indigo"
        />
        <StatCard
          title="Evaluations Completed"
          value="2"
          subtitle="Rubric scores submitted"
          icon={ClipboardCheck}
          color="emerald"
        />
        <StatCard
          title="Average Score Given"
          value="8.65 / 10"
          subtitle="Your scoring calibration"
          icon={Award}
          color="amber"
        />
      </div>

      <Card title="Assigned Queue" subtitle="Click to evaluate against rubric criteria">
        <div className="space-y-3">
          {assignedSubmissions.map((team) => (
            <div key={team.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="brand">{team.track}</Badge>
                  <span className="text-xs font-mono text-slate-400">Team: {team.name}</span>
                </div>
                <h4 className="text-base font-bold text-slate-100 mt-1">{team.submission?.description}</h4>
              </div>
              <Link to="/judge/evaluation">
                <Button size="sm" variant="primary" icon={ArrowRight}>
                  Grade Rubric
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
