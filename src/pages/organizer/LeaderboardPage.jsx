import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MOCK_TEAMS } from '../../data/mockData';
import { compileLeaderboard } from '../../utils/scoring';
import { Github, ExternalLink } from 'lucide-react';

const rankLabel = (rank) => rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

export function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    setLeaderboard(compileLeaderboard(MOCK_TEAMS));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-8">
      <div>
        <h1 className="text-lg font-semibold text-[--color-text-primary]">Leaderboard</h1>
        <p className="text-sm text-[--color-text-secondary] mt-0.5">
          Real-time aggregate rankings as judges submit evaluations.
        </p>
      </div>

      <Card title="Project Standings">
        <div className="overflow-x-auto -mx-5 -mb-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[--color-border] bg-[--color-surface-2]">
                {['Rank', 'Team', 'Track', 'Links', 'Evals', 'Score'].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[--color-border]">
              {leaderboard.map((team) => (
                <tr key={team.id} className="hover:bg-[--color-surface-2] transition-colors">
                  <td className="px-5 py-3 text-center font-mono font-bold text-[--color-text-primary]">
                    {rankLabel(team.rank)}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-[--color-text-primary]">{team.name}</p>
                    <p className="text-xs text-[--color-text-secondary]">{team.tagline}</p>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="brand" size="sm">{team.track}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    {team.submission ? (
                      <div className="flex items-center gap-3">
                        {team.submission.githubUrl && (
                          <a
                            href={team.submission.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[--color-text-secondary] hover:text-[--color-accent] inline-flex items-center gap-1 text-xs"
                          >
                            <Github className="w-3.5 h-3.5" />
                            Code
                          </a>
                        )}
                        {team.submission.demoUrl && (
                          <a
                            href={team.submission.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[--color-accent] hover:underline inline-flex items-center gap-1 text-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Demo
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-[--color-text-placeholder]">Pending</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center font-mono text-[--color-text-secondary] text-sm">
                    {team.evaluationsCount || 0}
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-bold text-[--color-accent] text-base">
                    {team.weightedScore ? `${team.weightedScore} / 10` : '—'}
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
