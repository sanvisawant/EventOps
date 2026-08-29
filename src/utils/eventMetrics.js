/**
 * Centralized utility functions for deriving event metrics from datasets.
 */

/**
 * Calculates checked-in attendance percentage derived from counts.
 */
export function calculateCheckedInPercentage(totalCheckedIn = 0, totalRegistered = 0) {
  if (!totalRegistered || totalRegistered <= 0) return 0;
  const pct = (totalCheckedIn / totalRegistered) * 100;
  return Math.round(pct * 10) / 10; // 1 decimal place e.g. 86.3
}

/**
 * Calculates pending judgments count (submissions awaiting full evaluation).
 */
export function calculatePendingJudgments(totalSubmissions = 0, completedEvaluations = 0) {
  const pending = totalSubmissions - completedEvaluations;
  return Math.max(0, pending);
}

/**
 * Calculates count of unresolved open support tickets.
 */
export function calculateOpenSupportTickets(tickets = []) {
  if (!Array.isArray(tickets)) return 0;
  return tickets.filter((t) => t.status !== 'RESOLVED').length;
}

/**
 * Calculates count of unmatched participants.
 */
export function calculateUnmatchedParticipants(participants = [], teams = []) {
  if (!Array.isArray(participants)) return 0;
  const soloCount = participants.filter((p) => p.role === 'PARTICIPANT' && !p.teamId).length;
  return soloCount;
}

/**
 * Event Lifecycle phases in sequence
 */
export const EVENT_PHASES = [
  { id: 'REGISTRATION', label: 'Registration' },
  { id: 'CHECK_IN', label: 'Check-In' },
  { id: 'TEAM_FORMATION', label: 'Team Formation' },
  { id: 'BUILDING', label: 'Building' },
  { id: 'SUBMISSION', label: 'Submission' },
  { id: 'JUDGING', label: 'Judging' },
  { id: 'WINNERS', label: 'Winners' },
];

/**
 * Returns phase progress metadata for the event lifecycle.
 */
export function getEventLifecycle(currentPhaseId = 'BUILDING') {
  let foundCurrent = false;
  return EVENT_PHASES.map((phase) => {
    if (phase.id === currentPhaseId) {
      foundCurrent = true;
      return { ...phase, status: 'ACTIVE' };
    }
    return {
      ...phase,
      status: foundCurrent ? 'UPCOMING' : 'COMPLETED',
    };
  });
}
