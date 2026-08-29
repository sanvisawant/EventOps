import { describe, it, expect } from 'vitest';
import {
  calculateCheckedInPercentage,
  calculatePendingJudgments,
  calculateOpenSupportTickets,
  calculateUnmatchedParticipants,
  getEventLifecycle,
} from '../utils/eventMetrics';
import { calculateEventHealth } from '../utils/eventHealth';

describe('Event Metrics & Derived Logic Engine', () => {
  it('1. should accurately calculate checked-in attendance percentage', () => {
    const pct1 = calculateCheckedInPercentage(214, 248);
    expect(pct1).toBe(86.3);

    const pct2 = calculateCheckedInPercentage(0, 100);
    expect(pct2).toBe(0);

    const pctZero = calculateCheckedInPercentage(50, 0);
    expect(pctZero).toBe(0);
  });

  it('2. should accurately calculate pending judgments count', () => {
    const pending = calculatePendingJudgments(42, 24);
    expect(pending).toBe(18);

    const pendingZero = calculatePendingJudgments(30, 30);
    expect(pendingZero).toBe(0);
  });

  it('3. should accurately calculate open support tickets count', () => {
    const mockTickets = [
      { id: '1', status: 'OPEN' },
      { id: '2', status: 'IN_PROGRESS' },
      { id: '3', status: 'RESOLVED' },
    ];
    const openCount = calculateOpenSupportTickets(mockTickets);
    expect(openCount).toBe(2);
  });

  it('4. should correctly map event lifecycle phases and mark active phase', () => {
    const lifecycle = getEventLifecycle('BUILDING');
    expect(lifecycle.length).toBe(7);

    const buildingPhase = lifecycle.find((p) => p.id === 'BUILDING');
    expect(buildingPhase?.status).toBe('ACTIVE');

    const regPhase = lifecycle.find((p) => p.id === 'REGISTRATION');
    expect(regPhase?.status).toBe('COMPLETED');

    const judgingPhase = lifecycle.find((p) => p.id === 'JUDGING');
    expect(judgingPhase?.status).toBe('UPCOMING');
  });

  it('5. should generate a deterministic recommendation for a judging bottleneck', () => {
    const health = calculateEventHealth({
      totalRegistered: 248,
      totalCheckedIn: 214,
      supportTickets: [],
      totalSubmissions: 42,
      evaluationsCompleted: 24, // 18 pending >= 10
      totalEvaluationsExpected: 42,
      unmatchedParticipants: 0,
    });

    const judgingBottleneckRec = health.recommendations.find(
      (r) => r.type === 'JUDGING_BOTTLENECK'
    );
    expect(judgingBottleneckRec).toBeDefined();
    expect(judgingBottleneckRec?.severity).toBe('CRITICAL');
    expect(judgingBottleneckRec?.title).toBe('Judging Bottleneck');
    expect(judgingBottleneckRec?.description).toContain('18 submissions are waiting for evaluation');
    expect(judgingBottleneckRec?.recommendedAction).toBe('Rebalance judge assignments.');
    expect(judgingBottleneckRec?.actionRoute).toBe('/judge/submissions');
  });

  it('6. should generate a deterministic recommendation for unmatched participants gap', () => {
    const health = calculateEventHealth({
      totalRegistered: 248,
      totalCheckedIn: 214,
      supportTickets: [],
      totalSubmissions: 42,
      evaluationsCompleted: 42,
      totalEvaluationsExpected: 42,
      unmatchedParticipants: 14, // >= 5 threshold
    });

    const teamGapRec = health.recommendations.find(
      (r) => r.type === 'TEAM_FORMATION_GAP'
    );
    expect(teamGapRec).toBeDefined();
    expect(teamGapRec?.severity).toBe('WARNING');
    expect(teamGapRec?.title).toBe('Team Formation Gap');
    expect(teamGapRec?.description).toContain('14 participants are currently unmatched');
    expect(teamGapRec?.recommendedAction).toBe('Open the smart matchmaking pool.');
    expect(teamGapRec?.actionRoute).toBe('/participant/matchmaking');
  });
});
