import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { judgingService } from '../../services/judgingService';
import { Github, ExternalLink, Trophy, Award } from 'lucide-react';

const rankLabel = (rank) => (rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`);

export function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);

  const refreshLeaderboard = async () => {
    const list = await judgingService.getLeaderboard();
    setLeaderboard(list);
  };

  useEffect(() => {
    refreshLeaderboard();
    const unsub = judgingService.subscribe(() => {
      refreshLeaderboard();
    });
    return unsub;
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xs font-mono font-bold uppercase tracking-wider text-[--color-accent] bg-[--color-accent-bg] px-2 py-0.5 rounded border border-[--color-accent-border]">
            LIVE RANKINGS
          </span>
          <span className="live-dot" aria-hidden="true" />
          <span className="text-xs text-[--color-text-secondary]">Real-Time Aggregate Scores</span>
        </div>
        <h1 className="text-xl font-bold text-[--color-text-primary] tracking-tight">
          Event Leaderboard
        </h1>
        <p className="text-xs text-[--color-text-secondary]">
          Real-time aggregate rankings dynamically computed via src/utils/scoring.js as judges submit evaluations.
        </p>
      </div>

      <Card title="Project Standings">
        <div className="overflow-x-auto -mx-5 -mb-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[--color-border] bg-[--color-surface-2]">
                <th className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide text-center">
                  Rank
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide">
                  Project & Team
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide">
                  Track
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide">
                  Links
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide text-center">
                  Evaluations
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide text-right">
                  Weighted Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--color-border]">
              {leaderboard.map((team) => (
                <tr key={team.id} className="hover:bg-[--color-surface-2] transition-colors">
                  <td className="px-5 py-3 text-center font-mono font-bold text-[--color-text-primary] text-base">
                    {rankLabel(team.rank)}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-bold text-[--color-text-primary]">
                      {team.projectName || team.name}
                    </p>
                    <p className="text-2xs text-[--color-text-secondary]">
                      Team {team.name} · {team.tagline}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="brand" size="sm">
                      {team.track}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    {team.submission ? (
                      <div className="flex items-center gap-3">
                        {team.submission.githubUrl && (
                          <a
                            href={team.submission.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[--color-text-secondary] hover:text-[--color-accent] inline-flex items-center gap-1 font-mono text-xs"
                          >
                            <Github className="w-3.5 h-3.5" aria-hidden="true" />
                            Code
                          </a>
                        )}
                        {team.submission.demoUrl && (
                          <a
                            href={team.submission.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[--color-accent] hover:underline inline-flex items-center gap-1 font-mono text-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                            Demo
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-2xs text-[--color-text-placeholder]">Pending</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center font-mono text-[--color-text-secondary] text-xs">
                    {team.evaluationsCount || 0}
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-bold text-[--color-accent] text-base">
                    {team.scores?.totalWeightedScore ? `${team.scores.totalWeightedScore} / 10` : '—'}
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
