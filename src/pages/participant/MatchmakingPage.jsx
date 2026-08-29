import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useRole } from '../../hooks/useRole';
import { MOCK_TEAMS } from '../../data/mockData';
import { findBestMatchingTeams } from '../../utils/matching';
import { Sparkles, Users, UserPlus } from 'lucide-react';

export function MatchmakingPage() {
  const { activeUser } = useRole();
  const matchedTeams = findBestMatchingTeams(activeUser, MOCK_TEAMS);

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-8">
      <div>
        <h1 className="text-lg font-semibold text-[--color-text-primary]">Team Matching</h1>
        <p className="text-sm text-[--color-text-secondary] mt-0.5">
          Compatible teams based on your skills, role preference, and track interests.
        </p>
      </div>

      {/* Skills summary */}
      <div className="card-base p-4 flex flex-wrap items-center gap-3">
        <span className="text-xs text-[--color-text-secondary] font-medium">Your skills:</span>
        {(activeUser.skills || ['React', 'Python', 'Tailwind']).map((skill) => (
          <Badge key={skill} variant="brand" size="sm">{skill}</Badge>
        ))}
        <Badge variant="neutral" size="sm">Role: {activeUser.preferredRole || 'Frontend'}</Badge>
      </div>

      {/* Team cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matchedTeams.map(({ team, matchScore }) => (
          <div key={team.id} className="card-base p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <Badge variant="brand" size="sm">{team.track}</Badge>
                <p className="text-base font-semibold text-[--color-text-primary]">{team.name}</p>
                <p className="text-xs text-[--color-text-secondary]">{team.tagline}</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-md bg-[--color-accent-bg] border border-[--color-accent-border] px-3 py-2 min-w-14">
                <span className="text-lg font-bold font-mono text-[--color-accent]">{matchScore}%</span>
                <span className="text-2xs font-mono text-[--color-text-secondary] uppercase">match</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-[--color-border]">
              <p className="text-xs text-[--color-text-secondary]">
                <span className="text-[--color-text-primary] font-medium">Seeking: </span>
                {(team.requiredSkills || []).join(', ')}
              </p>
              <p className="text-xs text-[--color-text-secondary] line-clamp-2">
                {team.submission?.description || 'Building a high-impact project.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[--color-border]">
              <div className="flex items-center gap-1.5 text-xs text-[--color-text-secondary]">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{team.members.length} members</span>
              </div>
              <Button size="sm" variant="primary" icon={UserPlus}>Request Join</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
