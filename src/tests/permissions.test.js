import { describe, it, expect } from 'vitest';
import { hasPermission, ROLES } from '../utils/permissions';

describe('Role Permission Access Guard', () => {
  it('should grant organizer specific command center permissions', () => {
    expect(hasPermission(ROLES.ORGANIZER, 'view_command_center')).toBe(true);
    expect(hasPermission(ROLES.ORGANIZER, 'broadcast_announcements')).toBe(true);
  });

  it('should deny participant organizer-only permissions', () => {
    expect(hasPermission(ROLES.PARTICIPANT, 'view_command_center')).toBe(false);
    expect(hasPermission(ROLES.PARTICIPANT, 'scan_qr_codes')).toBe(false);
  });

  it('should grant judge evaluation permissions', () => {
    expect(hasPermission(ROLES.JUDGE, 'evaluate_rubric')).toBe(true);
    expect(hasPermission(ROLES.JUDGE, 'submit_scores')).toBe(true);
  });
});
