import { describe, it, expect, beforeEach } from 'vitest';
import { checkinService } from '../services/checkinService';
import { MOCK_EVENT, MOCK_USERS, MOCK_ACTIVITY } from '../data/mockData';

describe('QR Attendance & Gate Verification Service Engine', () => {
  beforeEach(() => {
    checkinService.resetCheckInState();
  });

  it('1. should validate a valid QR token payload format', async () => {
    const res = await checkinService.processQrCheckIn('EVENTOPS:P-1042:EVT-2026', 'Main Entrance');
    expect(res.success).toBe(true);
    expect(res.participant).toBeDefined();
  });

  it('2. should reject empty or invalid token format', async () => {
    const resEmpty = await checkinService.processQrCheckIn('', 'Main Entrance');
    expect(resEmpty.success).toBe(false);
    expect(resEmpty.isInvalid).toBe(true);
    expect(resEmpty.error).toContain('Token string cannot be empty');
  });

  it('3. should reject unknown or unregistered participant token', async () => {
    const resUnknown = await checkinService.processQrCheckIn('EVENTOPS:P-9999:INVALID', 'Main Entrance');
    expect(resUnknown.success).toBe(false);
    expect(resUnknown.isInvalid).toBe(true);
    expect(resUnknown.error).toContain('INVALID PASS');
  });

  it('4. should process a successful first-time participant check-in', async () => {
    // Sanvi (P-1042) is initially not checked in
    const res = await checkinService.processQrCheckIn('EVENTOPS:P-1042:EVT-2026', 'Main Entrance');
    expect(res.success).toBe(true);
    expect(res.participant.name).toBe('Sanvi Sawant');
    expect(res.participant.isCheckedIn).toBe(true);
  });

  it('5. should reject duplicate check-in attempts for an already checked-in participant', async () => {
    // Check in Sanvi first
    await checkinService.processQrCheckIn('EVENTOPS:P-1042:EVT-2026', 'Main Entrance');

    // Attempt second check-in for Sanvi
    const dupRes = await checkinService.processQrCheckIn('EVENTOPS:P-1042:EVT-2026', 'North Gate');
    expect(dupRes.success).toBe(false);
    expect(dupRes.isDuplicate).toBe(true);
    expect(dupRes.error).toContain('ALREADY CHECKED IN');
  });

  it('6. should record a valid ISO timestamp upon successful check-in', async () => {
    const res = await checkinService.processQrCheckIn('EVENTOPS:P-1046:EVT-2026', 'Workshop Gate'); // Aarav Mehta
    expect(res.success).toBe(true);
    expect(res.log.scannedAt).toBeDefined();
    expect(new Date(res.log.scannedAt).getTime()).not.toBeNaN();
  });

  it('7. should accurately record gate information in the check-in log', async () => {
    const res = await checkinService.processQrCheckIn('EVENTOPS:P-1046:EVT-2026', 'North Gate');
    expect(res.success).toBe(true);
    expect(res.log.gate).toBe('North Gate');
    expect(res.participant.checkInGate).toBe('North Gate');
  });

  it('8. should validate event association ID in check-in log record', async () => {
    const res = await checkinService.processQrCheckIn('EVENTOPS:P-1042:EVT-2026', 'Main Entrance');
    expect(res.success).toBe(true);
    expect(res.log.eventId).toBe(MOCK_EVENT.id);
  });

  it('9. should dynamically update dashboard total checked-in count metric', async () => {
    const initialCheckedIn = MOCK_EVENT.stats.totalCheckedIn;
    await checkinService.processQrCheckIn('EVENTOPS:P-1042:EVT-2026', 'Main Entrance');
    expect(MOCK_EVENT.stats.totalCheckedIn).toBe(initialCheckedIn + 1);
  });

  it('10. should update participant pass status from NOT CHECKED IN to CHECKED IN', async () => {
    const initialStatus = checkinService.getParticipantStatus('P-1042');
    expect(initialStatus.isCheckedIn).toBe(false);

    await checkinService.processQrCheckIn('EVENTOPS:P-1042:EVT-2026', 'Main Entrance');

    const updatedStatus = checkinService.getParticipantStatus('P-1042');
    expect(updatedStatus.isCheckedIn).toBe(true);
    expect(updatedStatus.checkInGate).toBe('Main Entrance');
  });

  it('11. should prepend check-in event to the live activity feed stream', async () => {
    const initialCount = MOCK_ACTIVITY.length;
    await checkinService.processQrCheckIn('EVENTOPS:P-1042:EVT-2026', 'Main Entrance');

    expect(MOCK_ACTIVITY.length).toBe(initialCount + 1);
    expect(MOCK_ACTIVITY[0].actor).toBe('Sanvi Sawant');
    expect(MOCK_ACTIVITY[0].description).toContain('checked in at Main Entrance');
  });
});
