import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MOCK_TEAMS } from '../../data/mockData';
import { compileLeaderboard } from '../../utils/scoring';
import { Trophy } from 'lucide-react';

export function ParticipantLeaderboardPage() {
  const leaderboard = compileLeaderboard(MOCK_TEAMS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          Live Leaderboard
        </h1>
        <p className="text-sm text-slate-400">
          Current team standings calculated dynamically from verified judge evaluations.
        </p>
      </div>

      <Card title="Team Rankings" subtitle="Live score updates">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 text-center">Rank</th>
                <th className="px-4 py-3">Team Name</th>
                <th className="px-4 py-3">Track</th>
                <th className="px-4 py-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {leaderboard.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/50">
                  <td className="px-4 py-4 text-center font-bold">
                    {t.rank === 1 ? '🥇' : t.rank === 2 ? '🥈' : t.rank === 3 ? '🥉' : `#${t.rank}`}
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-100">{t.name}</td>
                  <td className="px-4 py-4 font-sans">
                    <Badge variant="brand">{t.track}</Badge>
                  </td>
                  <td className="px-4 py-4 text-right font-extrabold text-indigo-400">
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
