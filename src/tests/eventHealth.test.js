import { describe, it, expect } from 'vitest';
import { calculateEventHealth } from '../utils/eventHealth';

describe('Event Health Index Engine', () => {
  it('should return OPTIMAL status when metrics are healthy', () => {
    const health = calculateEventHealth({
      totalRegistered: 100,
      totalCheckedIn: 80,
      supportTickets: [],
      evaluationsCompleted: 10,
      totalEvaluationsExpected: 10,
    });
    expect(health.score).toBeGreaterThanOrEqual(85);
    expect(health.status).toBe('OPTIMAL');
  });

  it('should deduct health points for high-priority support ticket backlogs', () => {
    const health = calculateEventHealth({
      totalRegistered: 100,
      totalCheckedIn: 80,
      supportTickets: [
        { id: '1', priority: 'HIGH', status: 'OPEN' },
        { id: '2', priority: 'HIGH', status: 'OPEN' },
      ],
      evaluationsCompleted: 10,
      totalEvaluationsExpected: 10,
    });
    expect(health.score).toBeLessThan(85);
    expect(health.recommendations.length).toBeGreaterThan(0);
  });
});
