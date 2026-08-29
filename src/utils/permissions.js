export const ROLES = {
  PARTICIPANT: 'PARTICIPANT',
  JUDGE: 'JUDGE',
  ORGANIZER: 'ORGANIZER',
};

export const PERMISSIONS = {
  [ROLES.PARTICIPANT]: [
    'view_event_dashboard',
    'view_personal_pass',
    'view_schedule',
    'use_team_matchmaking',
    'submit_support_ticket',
    'view_announcements',
    'view_leaderboard',
    'submit_project',
  ],
  [ROLES.JUDGE]: [
    'view_judge_dashboard',
    'view_assigned_submissions',
    'evaluate_rubric',
    'submit_scores',
    'view_leaderboard',
  ],
  [ROLES.ORGANIZER]: [
    'view_command_center',
    'view_checkin_analytics',
    'scan_qr_codes',
    'manage_participants',
    'manage_teams',
    'manage_support_queue',
    'broadcast_announcements',
    'monitor_judging',
    'view_leaderboard',
    'monitor_event_health',
  ],
};

/**
 * Verifies if a user role possesses a specific permission string
 */
export function hasPermission(role, permission) {
  if (!role || !PERMISSIONS[role]) return false;
  return PERMISSIONS[role].includes(permission);
}

/**
 * Returns default root path according to role
 */
export function getDefaultRouteForRole(role) {
  switch (role) {
    case ROLES.ORGANIZER:
      return '/organizer';
    case ROLES.JUDGE:
      return '/judge';
    case ROLES.PARTICIPANT:
    default:
      return '/participant';
  }
}
