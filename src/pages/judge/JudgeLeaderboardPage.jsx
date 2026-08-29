import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MOCK_TEAMS } from '../../data/mockData';
import { compileLeaderboard } from '../../utils/scoring';
import { Award } from 'lucide-react';

export function JudgeLeaderboardPage() {
  const leaderboard = compileLeaderboard(MOCK_TEAMS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-400" />
          Evaluation Standings Summary
        </h1>
        <p className="text-sm text-slate-400">
          Overview of scored project submissions across all tracks.
        </p>
      </div>

      <Card title="Current Standings" subtitle="Live aggregate scores">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-mono">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 text-center">Rank</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Track</th>
                <th className="px-4 py-3 text-right">Weighted Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leaderboard.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/50">
                  <td className="px-4 py-4 text-center font-bold">#{t.rank}</td>
                  <td className="px-4 py-4 font-bold text-slate-100">{t.name}</td>
                  <td className="px-4 py-4 font-sans">
                    <Badge variant="brand">{t.track}</Badge>
                  </td>
                  <td className="px-4 py-4 text-right text-indigo-400 font-bold">
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
