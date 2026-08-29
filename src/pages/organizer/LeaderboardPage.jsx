import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MOCK_TEAMS } from '../../data/mockData';
import { compileLeaderboard } from '../../utils/scoring';
import { Trophy, Award, Github, ExternalLink, Star } from 'lucide-react';

export function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    setLeaderboard(compileLeaderboard(MOCK_TEAMS));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Live Event Leaderboard
          </h1>
          <p className="text-sm text-slate-400">
            Real-time aggregate rankings dynamically computed as judges submit rubric evaluations.
          </p>
        </div>
      </div>

      <Card title="Project Submissions & Standings" subtitle="Automated rank calculations">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 text-center">Rank</th>
                <th className="px-4 py-3">Team Name</th>
                <th className="px-4 py-3">Track</th>
                <th className="px-4 py-3">Submission</th>
                <th className="px-4 py-3 text-center">Evaluations</th>
                <th className="px-4 py-3 text-right">Weighted Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leaderboard.map((team) => (
                <tr key={team.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4 text-center font-mono font-bold">
                    {team.rank === 1 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        🥇
                      </span>
                    ) : team.rank === 2 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/30">
                        🥈
                      </span>
                    ) : team.rank === 3 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/30">
                        🥉
                      </span>
                    ) : (
                      <span className="text-slate-400">#{team.rank}</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-slate-100">{team.name}</div>
                    <div className="text-xs text-slate-400">{team.tagline}</div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="brand">{team.track}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    {team.submission ? (
                      <div className="flex items-center gap-3">
                        {team.submission.githubUrl && (
                          <a
                            href={team.submission.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-indigo-400 inline-flex items-center gap-1 text-xs"
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
                            className="text-indigo-400 hover:underline inline-flex items-center gap-1 text-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Demo
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-slate-300">
                    {team.evaluationsCount || 0}
                  </td>
                  <td className="px-4 py-4 text-right font-mono font-extrabold text-indigo-400 text-base">
                    {team.weightedScore ? `${team.weightedScore} / 10` : 'N/A'}
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
