import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useRole } from '../../hooks/useRole';
import { MOCK_TEAMS } from '../../data/mockData';
import { findBestMatchingTeams } from '../../utils/matching';
import { Sparkles, Users, Code, Target, UserPlus } from 'lucide-react';

export function MatchmakingPage() {
  const { activeUser } = useRole();
  const matchedTeams = findBestMatchingTeams(activeUser, MOCK_TEAMS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          Smart Team Matchmaking Engine
        </h1>
        <p className="text-sm text-slate-400">
          Algorithmic team compatibility based on your technical skills, role preference, and track interests.
        </p>
      </div>

      {/* User Skills Summary */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase">Your Profile Match Vector:</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {(activeUser.skills || ['React', 'Python', 'Tailwind']).map((skill) => (
              <Badge key={skill} variant="brand">
                {skill}
              </Badge>
            ))}
            <Badge variant="neutral">Role: {activeUser.preferredRole || 'Frontend'}</Badge>
          </div>
        </div>
      </div>

      {/* Matching Teams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matchedTeams.map(({ team, matchScore }) => (
          <Card key={team.id} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="brand">{team.track}</Badge>
                <h3 className="text-lg font-bold text-slate-100 mt-2">{team.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{team.tagline}</p>
              </div>

              {/* Match Score Circular Pill */}
              <div className="text-right">
                <div className="inline-flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
                  <span className="text-lg font-extrabold font-mono text-indigo-400">{matchScore}%</span>
                  <span className="text-[9px] font-mono text-indigo-300 uppercase">Match</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-slate-400">Seeking Skills: </span>
                {(team.requiredSkills || []).join(', ')}
              </div>
              <div className="text-xs text-slate-400 line-clamp-2">
                {team.submission?.description || 'Building high impact submission.'}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                {team.members.length} Members Registered
              </span>
              <Button size="sm" variant="primary" icon={UserPlus}>
                Request Join
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
