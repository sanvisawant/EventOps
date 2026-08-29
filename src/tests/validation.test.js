import { describe, it, expect } from 'vitest';
import { validateScore, detectDuplicateCheckIn, validateGithubUrl } from '../utils/validation';

describe('Validation Utilities', () => {
  it('should validate scores within 0-10 bounds', () => {
    expect(validateScore(8.5).isValid).toBe(true);
    expect(validateScore(12).isValid).toBe(false);
    expect(validateScore(-1).isValid).toBe(false);
    expect(validateScore('invalid').isValid).toBe(false);
  });

  it('should detect duplicate QR code check-ins', () => {
    const existingLogs = [{ qrCode: 'PASS-123', scannedAt: '2026-08-29T10:00:00Z' }];
    
    const resDuplicate = detectDuplicateCheckIn('PASS-123', existingLogs);
    expect(resDuplicate.isDuplicate).toBe(true);

    const resNew = detectDuplicateCheckIn('PASS-999', existingLogs);
    expect(resNew.isDuplicate).toBe(false);
  });

  it('should validate GitHub repository URLs', () => {
    expect(validateGithubUrl('https://github.com/facebook/react')).toBe(true);
    expect(validateGithubUrl('https://invalid-url.com')).toBe(false);
  });
});
