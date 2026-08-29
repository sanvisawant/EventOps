import { describe, it, expect } from 'vitest';
import { validateRole, validateEmail, validatePasswordMatch } from '../utils/validation';
import { hasPermission, ROLES } from '../utils/permissions';

describe('Security & Authentication Unit Tests', () => {
  describe('Role Validation & Escalation Guard', () => {
    it('should recognize valid roles (PARTICIPANT, JUDGE, ORGANIZER)', () => {
      expect(validateRole(ROLES.PARTICIPANT).isValid).toBe(true);
      expect(validateRole(ROLES.JUDGE).isValid).toBe(true);
      expect(validateRole(ROLES.ORGANIZER).isValid).toBe(true);
    });

    it('should reject invalid or arbitrary role escalation attempts', () => {
      expect(validateRole('SUPER_ADMIN').isValid).toBe(false);
      expect(validateRole('ROOT').isValid).toBe(false);
      expect(validateRole('<script>alert(1)</script>').isValid).toBe(false);
      expect(validateRole(null).isValid).toBe(false);
    });
  });

  describe('Form Validation & Credential Guards', () => {
    it('should validate proper email formats', () => {
      expect(validateEmail('organizer@eventops.io').isValid).toBe(true);
      expect(validateEmail('invalid-email').isValid).toBe(false);
      expect(validateEmail('').isValid).toBe(false);
    });

    it('should enforce password length and confirmation match', () => {
      expect(validatePasswordMatch('password123', 'password123').isValid).toBe(true);
      expect(validatePasswordMatch('password123', 'different').isValid).toBe(false);
      expect(validatePasswordMatch('12345', '12345').isValid).toBe(false); // < 6 chars
    });
  });

  describe('Role-Based Access Control (RBAC) Permission Isolation', () => {
    it('should strictly deny PARTICIPANT access to ORGANIZER command center actions', () => {
      expect(hasPermission(ROLES.PARTICIPANT, 'view_command_center')).toBe(false);
      expect(hasPermission(ROLES.PARTICIPANT, 'scan_qr_codes')).toBe(false);
      expect(hasPermission(ROLES.PARTICIPANT, 'broadcast_announcements')).toBe(false);
      expect(hasPermission(ROLES.PARTICIPANT, 'manage_support_queue')).toBe(false);
    });

    it('should strictly deny JUDGE access to ORGANIZER management actions', () => {
      expect(hasPermission(ROLES.JUDGE, 'view_command_center')).toBe(false);
      expect(hasPermission(ROLES.JUDGE, 'scan_qr_codes')).toBe(false);
      expect(hasPermission(ROLES.JUDGE, 'manage_support_queue')).toBe(false);
    });

    it('should grant JUDGE rubric scoring and submission evaluation rights', () => {
      expect(hasPermission(ROLES.JUDGE, 'view_judge_dashboard')).toBe(true);
      expect(hasPermission(ROLES.JUDGE, 'evaluate_rubric')).toBe(true);
      expect(hasPermission(ROLES.JUDGE, 'submit_scores')).toBe(true);
    });

    it('should grant ORGANIZER full operational command rights', () => {
      expect(hasPermission(ROLES.ORGANIZER, 'view_command_center')).toBe(true);
      expect(hasPermission(ROLES.ORGANIZER, 'scan_qr_codes')).toBe(true);
      expect(hasPermission(ROLES.ORGANIZER, 'broadcast_announcements')).toBe(true);
      expect(hasPermission(ROLES.ORGANIZER, 'monitor_event_health')).toBe(true);
    });
  });
});
