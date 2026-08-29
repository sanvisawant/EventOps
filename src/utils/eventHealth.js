/**
 * Calculates a live Event Health Index (0 - 100), category breakdowns, and deterministic operational recommendations.
 */
export function calculateEventHealth({
  totalRegistered = 248,
  totalCheckedIn = 214,
  supportTickets = [],
  totalSubmissions = 42,
  evaluationsCompleted = 24,
  totalEvaluationsExpected = 42,
  unmatchedParticipants = 14,
}) {
  const recommendations = [];

  // 1. Support Ticket Backlog Impact
  const openHighPriority = supportTickets.filter(
    (t) => t.status !== 'RESOLVED' && t.priority === 'HIGH'
  ).length;
  const openSupportCount = supportTickets.filter((t) => t.status !== 'RESOLVED').length;

  // 2. Attendance score & rate
  const attendanceRate = totalRegistered > 0 ? (totalCheckedIn / totalRegistered) * 100 : 0;
  const attendanceScore = Math.min(100, Math.round(attendanceRate));

  // 3. Team Formation score
  const teamFormationScore = Math.max(0, Math.min(100, Math.round(100 - unmatchedParticipants * 2)));

  // 4. Submissions score
  const submissionRate = totalRegistered > 0 ? (totalSubmissions / (totalRegistered / 4)) * 100 : 0;
  const submissionsScore = Math.min(100, Math.round(Math.max(60, submissionRate)));

  // 5. Judging score
  const pendingJudgments = Math.max(0, totalSubmissions - evaluationsCompleted);
  const judgingProgress =
    totalEvaluationsExpected > 0
      ? (evaluationsCompleted / totalEvaluationsExpected) * 100
      : 100;
  const judgingScore = Math.min(100, Math.round(judgingProgress));

  // 6. Engagement score
  const engagementScore = Math.max(0, Math.min(100, 95 - openSupportCount * 2));

  // Overall Weighted Health Score
  let overallScore = Math.round(
    attendanceScore * 0.25 +
    teamFormationScore * 0.15 +
    submissionsScore * 0.20 +
    judgingScore * 0.25 +
    engagementScore * 0.15
  );

  // Apply penalties for support tickets
  if (openHighPriority > 0) {
    const penalty = Math.min(25, openHighPriority * 10);
    overallScore -= penalty;
  }

  // Ensure bounds [0, 100]
  overallScore = Math.max(0, Math.min(100, overallScore));

  // Deterministic Recommendations Generation based on state thresholds

  // High-Priority Support Queue Spike
  if (openHighPriority > 0) {
    recommendations.push({
      id: 'rec_support_high',
      severity: 'CRITICAL',
      type: 'SUPPORT_SPIKE',
      title: 'High-Priority Support Queue Spike',
      description: `${openHighPriority} urgent tickets require immediate attention.`,
      recommendedAction: `Dispatch hardware/mentor staff to resolve ${openHighPriority} urgent tickets.`,
      actionLabel: 'Open Support Queue',
      actionRoute: '/organizer/support',
    });
  }

  // Threshold 1: Judging Bottleneck
  if (pendingJudgments >= 10) {
    recommendations.push({
      id: 'rec_judging_bottleneck',
      severity: 'CRITICAL',
      type: 'JUDGING_BOTTLENECK',
      title: 'Judging Bottleneck',
      description: `${pendingJudgments} submissions are waiting for evaluation.`,
      recommendedAction: 'Rebalance judge assignments.',
      actionLabel: 'Review Judging',
      actionRoute: '/judge/submissions',
    });
  }

  // Threshold 2: Team Formation Gap
  if (unmatchedParticipants >= 5) {
    recommendations.push({
      id: 'rec_team_formation',
      severity: 'WARNING',
      type: 'TEAM_FORMATION_GAP',
      title: 'Team Formation Gap',
      description: `${unmatchedParticipants} participants are currently unmatched.`,
      recommendedAction: 'Open the smart matchmaking pool.',
      actionLabel: 'View Teams',
      actionRoute: '/participant/matchmaking',
    });
  }

  // Threshold 3: Support Spike (General)
  if (openSupportCount >= 5 && openHighPriority === 0) {
    recommendations.push({
      id: 'rec_support_spike',
      severity: 'WARNING',
      type: 'SUPPORT_SPIKE',
      title: 'Support Queue Backlog',
      description: `${openSupportCount} participant issues are currently open.`,
      recommendedAction: 'Review the support queue.',
      actionLabel: 'Open Support Queue',
      actionRoute: '/organizer/support',
    });
  }

  // Determine Overall Status
  let status = 'OPTIMAL';
  let statusLabel = 'Healthy';
  if (overallScore < 70) {
    status = 'CRITICAL';
    statusLabel = 'Critical';
  } else if (overallScore < 85) {
    status = 'WARNING';
    statusLabel = 'Attention';
  }

  return {
    score: overallScore,
    status, // 'OPTIMAL', 'WARNING', 'CRITICAL'
    statusLabel, // 'Healthy', 'Attention', 'Critical'
    categories: {
      attendance: attendanceScore,
      teamFormation: teamFormationScore,
      submissions: submissionsScore,
      judging: judgingScore,
      engagement: engagementScore,
    },
    metrics: {
      attendanceRatePercentage: Math.round(attendanceRate),
      pendingJudgments,
      openTicketsCount: openSupportCount,
      unmatchedParticipants,
    },
    recommendations,
  };
}
