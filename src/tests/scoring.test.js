import { describe, it, expect } from 'vitest';
import { calculateWeightedScore, compileLeaderboard } from '../utils/scoring';

describe('Rubric Scoring & Leaderboard System', () => {
  const criteria = [
    { id: 'crit_1', weight: 0.5 },
    { id: 'crit_2', weight: 0.5 },
  ];

  it('should correctly calculate weighted total score', () => {
    const rawScores = { crit_1: 10, crit_2: 6 };
    const score = calculateWeightedScore(rawScores, criteria);
    expect(score).toBe(8); // (10*0.5) + (6*0.5) = 8
  });

  it('should correctly rank teams by total weighted score', () => {
    const teams = [
      { id: 't1', name: 'Team 1', scores: { totalWeightedScore: 7.5 } },
      { id: 't2', name: 'Team 2', scores: { totalWeightedScore: 9.2 } },
      { id: 't3', name: 'Team 3', scores: { totalWeightedScore: 8.0 } },
    ];

    const leaderboard = compileLeaderboard(teams);
    expect(leaderboard[0].id).toBe('t2');
    expect(leaderboard[0].rank).toBe(1);
    expect(leaderboard[1].id).toBe('t3');
    expect(leaderboard[1].rank).toBe(2);
    expect(leaderboard[2].id).toBe('t1');
    expect(leaderboard[2].rank).toBe(3);
  });
});
