/**
 * Calculates a live Event Health Index (0 - 100) and operational recommendations.
 */
export function calculateEventHealth({
  totalRegistered = 100,
  totalCheckedIn = 0,
  supportTickets = [],
  evaluationsCompleted = 0,
  totalEvaluationsExpected = 1,
}) {
  let healthScore = 100;
  const recommendations = [];

  // 1. Support Ticket Backlog Impact (up to -30 points)
  const openHighPriority = supportTickets.filter(
    (t) => t.status !== 'RESOLVED' && t.priority === 'HIGH'
  ).length;
  const openTotal = supportTickets.filter((t) => t.status !== 'RESOLVED').length;

  if (openHighPriority > 0) {
    const penalty = Math.min(25, openHighPriority * 10);
    healthScore -= penalty;
    recommendations.push({
      id: 'rec_support_high',
      severity: 'CRITICAL',
      title: 'High-Priority Support Queue Spike',
      action: `Dispatch hardware/mentor staff to resolve ${openHighPriority} urgent tickets immediately.`,
    });
  }

  if (openTotal > 5) {
    healthScore -= 10;
    recommendations.push({
      id: 'rec_support_backlog',
      severity: 'WARNING',
      title: 'Support Desk Backlog Exceeds Threshold',
      action: 'Assign additional volunteers to handle support queue inquiries.',
    });
  }

  // 2. Attendance & Check-In Velocity (up to -20 points)
  const checkInRate = totalRegistered > 0 ? (totalCheckedIn / totalRegistered) * 100 : 0;
  if (checkInRate < 40 && totalRegistered > 50) {
    healthScore -= 15;
    recommendations.push({
      id: 'rec_checkin_slow',
      severity: 'WARNING',
      title: 'Check-In Rate Below Expected Target',
      action: 'Open secondary scanner lane at gate B to clear entry queue.',
    });
  }

  // 3. Judging Evaluation Progress (up to -20 points)
  const judgingProgress =
    totalEvaluationsExpected > 0
      ? (evaluationsCompleted / totalEvaluationsExpected) * 100
      : 100;

  if (judgingProgress < 20 && totalEvaluationsExpected > 0) {
    recommendations.push({
      id: 'rec_judging_lag',
      severity: 'INFO',
      title: 'Judging Kickoff Pending',
      action: 'Notify judges to start scoring assigned project submissions.',
    });
  }

  // Ensure bounds [0, 100]
  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

  // Categorize status
  let status = 'OPTIMAL';
  if (healthScore < 70) status = 'CRITICAL';
  else if (healthScore < 85) status = 'WARNING';

  return {
    score: healthScore,
    status,
    checkInRatePercentage: Math.round(checkInRate),
    judgingProgressPercentage: Math.round(judgingProgress),
    openTicketsCount: openTotal,
    recommendations,
  };
}
