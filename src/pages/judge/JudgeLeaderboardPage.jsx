import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MOCK_TEAMS } from '../../data/mockData';
import { compileLeaderboard } from '../../utils/scoring';

export function JudgeLeaderboardPage() {
  const leaderboard = compileLeaderboard(MOCK_TEAMS);

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-8">
      <div>
        <h1 className="text-lg font-semibold text-[--color-text-primary]">Standings</h1>
        <p className="text-sm text-[--color-text-secondary] mt-0.5">
          Aggregate scores across all tracks.
        </p>
      </div>

      <Card title="Current Standings">
        <div className="overflow-x-auto -mx-5 -mb-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[--color-border] bg-[--color-surface-2]">
                {['Rank', 'Team', 'Track', 'Score'].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[--color-border]">
              {leaderboard.map((t) => (
                <tr key={t.id} className="hover:bg-[--color-surface-2] transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-[--color-text-secondary]">
                    #{t.rank}
                  </td>
                  <td className="px-5 py-3 font-semibold text-[--color-text-primary]">{t.name}</td>
                  <td className="px-5 py-3">
                    <Badge variant="brand" size="sm">{t.track}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-bold text-[--color-accent]">
                    {t.weightedScore} / 10
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
