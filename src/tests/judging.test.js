import { describe, it, expect, beforeEach } from 'vitest';
import { judgingService } from '../services/judgingService';
import { calculateWeightedScore, compileLeaderboard } from '../utils/scoring';
import { MOCK_RUBRIC_CRITERIA, MOCK_EVENT } from '../data/mockData';

describe('Interactive Judging & Evaluation Engine', () => {
  beforeEach(() => {
    judgingService.resetJudgingState();
  });

  it('1. should calculate accurate weighted score using scoring.js for valid rubric inputs', () => {
    const scores = {
      crit_innovation: 9,
      crit_complexity: 8,
      crit_impact: 9,
      crit_design: 8,
    };
    const score = calculateWeightedScore(scores, MOCK_RUBRIC_CRITERIA);
    // (9*0.25 + 8*0.30 + 9*0.25 + 8*0.20) = 2.25 + 2.40 + 2.25 + 1.60 = 8.5
    expect(score).toBe(8.5);
  });

  it('2. should enforce score bounds between 0 and 10', async () => {
    const invalidScores = {
      crit_innovation: 15, // Out of bounds > 10
      crit_complexity: 8,
      crit_impact: 9,
      crit_design: 8,
    };
    const res = await judgingService.submitEvaluation({
      teamId: 'team_alpha',
      scores: invalidScores,
    });
    expect(res.success).toBe(false);
    expect(res.error).toContain('between 0 and 10');
  });

  it('3. should validate missing criterion before accepting evaluation', async () => {
    const incompleteScores = {
      crit_innovation: 9,
      // missing crit_complexity
      crit_impact: 9,
      crit_design: 8,
    };
    const res = await judgingService.submitEvaluation({
      teamId: 'team_alpha',
      scores: incompleteScores,
    });
    expect(res.success).toBe(false);
    expect(res.error).toContain('Please score');
  });

  it('4. should process a valid evaluation submission successfully', async () => {
    const validScores = {
      crit_innovation: 9,
      crit_complexity: 9,
      crit_impact: 8,
      crit_design: 8,
    };
    const res = await judgingService.submitEvaluation({
      teamId: 'team_alpha',
      judgeId: 'usr_judge_1',
      judgeName: 'Dr. Vikramaditya Rao',
      scores: validScores,
      feedback: 'Excellent AI architecture and clean agent separation.',
      strengths: ['Innovation', 'Technical execution'],
      improvements: ['Documentation'],
    });

    expect(res.success).toBe(true);
    expect(res.weightedScore).toBe(8.55);
    expect(res.evaluation.feedback).toBe('Excellent AI architecture and clean agent separation.');
  });

  it('5. should record a valid ISO timestamp upon evaluation submission', async () => {
    const validScores = {
      crit_innovation: 8,
      crit_complexity: 8,
      crit_impact: 8,
      crit_design: 8,
    };
    const res = await judgingService.submitEvaluation({
      teamId: 'team_gamma',
      judgeId: 'usr_judge_1',
      scores: validScores,
    });
    expect(res.success).toBe(true);
    expect(res.evaluation.evaluatedAt).toBeDefined();
    expect(new Date(res.evaluation.evaluatedAt).getTime()).not.toBeNaN();
  });

  it('6. should allow updating an existing evaluation without duplicate duplicate-creation', async () => {
    const validScores = {
      crit_innovation: 8,
      crit_complexity: 8,
      crit_impact: 8,
      crit_design: 8,
    };

    // First submission
    await judgingService.submitEvaluation({
      teamId: 'team_gamma',
      judgeId: 'usr_judge_1',
      scores: validScores,
    });

    // Update submission
    const res = await judgingService.submitEvaluation({
      teamId: 'team_gamma',
      judgeId: 'usr_judge_1',
      scores: { ...validScores, crit_innovation: 10 },
    });

    expect(res.success).toBe(true);
    expect(res.weightedScore).toBe(8.5);
  });

  it('7. should calculate aggregate weighted scores across multiple judge evaluations', async () => {
    // Judge A score: 8.0
    await judgingService.submitEvaluation({
      teamId: 'team_alpha',
      judgeId: 'usr_judge_1',
      scores: { crit_innovation: 8, crit_complexity: 8, crit_impact: 8, crit_design: 8 },
    });

    // Judge B score: 10.0
    await judgingService.submitEvaluation({
      teamId: 'team_alpha',
      judgeId: 'usr_judge_2',
      scores: { crit_innovation: 10, crit_complexity: 10, crit_impact: 10, crit_design: 10 },
    });

    const sub = await judgingService.getSubmissionById('team_alpha');
    expect(sub.evaluationsCount).toBe(2);
    expect(sub.scores.totalWeightedScore).toBe(9); // (8 + 10) / 2 = 9.0
  });

  it('8. should update leaderboard ranking dynamically after evaluation', async () => {
    // Evaluate team_gamma with high score
    await judgingService.submitEvaluation({
      teamId: 'team_gamma',
      judgeId: 'usr_judge_1',
      scores: { crit_innovation: 10, crit_complexity: 10, crit_impact: 10, crit_design: 10 },
    });

    const leaderboard = await judgingService.getLeaderboard();
    expect(leaderboard[0].id).toBe('team_gamma');
    expect(leaderboard[0].rank).toBe(1);
  });

  it('9. should decrement organizer pending judgments count when submission is evaluated', async () => {
    const initialPending = MOCK_EVENT.stats.pendingJudgments;

    await judgingService.submitEvaluation({
      teamId: 'team_alpha',
      judgeId: 'usr_judge_1',
      scores: { crit_innovation: 9, crit_complexity: 8, crit_impact: 9, crit_design: 8 },
    });

    expect(MOCK_EVENT.stats.pendingJudgments).toBe(initialPending - 1);
  });

  it('10. should return correct judge metrics for assigned, evaluated, and pending counts', async () => {
    const metricsBefore = judgingService.getJudgeMetrics('usr_judge_1');
    expect(metricsBefore.totalAssigned).toBeGreaterThan(0);

    await judgingService.submitEvaluation({
      teamId: 'team_alpha',
      judgeId: 'usr_judge_1',
      scores: { crit_innovation: 9, crit_complexity: 8, crit_impact: 9, crit_design: 8 },
    });

    const metricsAfter = judgingService.getJudgeMetrics('usr_judge_1');
    expect(metricsAfter.evaluatedCount).toBe(metricsBefore.evaluatedCount + 1);
    expect(metricsAfter.pendingCount).toBe(metricsBefore.pendingCount - 1);
  });

  it('11. should reject evaluation attempt for null or missing submission ID', async () => {
    const res = await judgingService.submitEvaluation({
      teamId: null,
      submissionId: null,
      scores: { crit_innovation: 9, crit_complexity: 8, crit_impact: 9, crit_design: 8 },
    });
    expect(res.success).toBe(false);
    expect(res.error).toContain('required');
  });

  it('12. should compile leaderboard correctly with zero evaluations baseline', async () => {
    const leaderboard = compileLeaderboard([]);
    expect(leaderboard.length).toBe(0);
  });
});
