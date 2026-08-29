import {
  MOCK_EVENT,
  MOCK_USERS,
  MOCK_CHECKIN_LOGS,
  MOCK_ACTIVITY,
} from '../data/mockData';

// Centralized state pointers
let checkInLogs = [...MOCK_CHECKIN_LOGS];
const listeners = new Set();

function notifyListeners() {
  listeners.forEach((fn) => {
    try { fn(); } catch (e) { console.error('CheckIn Listener Error:', e); }
  });
}

export const checkinService = {
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  async getCheckInLogs() {
    return checkInLogs;
  },

  getEventStats() {
    return MOCK_EVENT.stats;
  },

  getParticipantStatus(participantIdOrToken) {
    if (!participantIdOrToken) return null;
    const clean = String(participantIdOrToken).trim().toUpperCase();

    const user = MOCK_USERS.find(
      (u) =>
        u.id?.toUpperCase() === clean ||
        u.email?.toUpperCase() === clean ||
        u.qrCode?.toUpperCase() === clean ||
        u.participantId?.toUpperCase() === clean ||
        (u.qrCode && clean.includes(u.qrCode.toUpperCase()))
    );

    if (!user) return null;
    return {
      isCheckedIn: Boolean(user.isCheckedIn),
      checkInTime: user.checkInTime || null,
      checkInGate: user.checkInGate || null,
      user,
    };
  },

  async processQrCheckIn(qrToken, gateId = 'Main Entrance', scannedBy = 'Gate Scanner Alpha') {
    if (!qrToken || typeof qrToken !== 'string' || !qrToken.trim()) {
      return {
        success: false,
        isInvalid: true,
        error: 'Invalid QR Pass token. Token string cannot be empty.',
      };
    }

    const cleanToken = qrToken.trim().toUpperCase();

    // 1. Find participant matching token, qrCode, or ID
    const participant = MOCK_USERS.find((u) => {
      if (u.qrCode && u.qrCode.toUpperCase() === cleanToken) return true;
      if (u.participantId && u.participantId.toUpperCase() === cleanToken) return true;
      if (u.qrCode && cleanToken.includes(u.qrCode.toUpperCase())) return true;
      if (u.participantId && cleanToken.includes(u.participantId.toUpperCase())) return true;
      return false;
    });

    if (!participant) {
      return {
        success: false,
        isInvalid: true,
        error: 'INVALID PASS — The QR/token could not be verified.',
      };
    }

    // 2. Check duplicate check-in
    const existingLog = checkInLogs.find(
      (l) => l.participantId === participant.id || l.qrCode?.toUpperCase() === participant.qrCode?.toUpperCase()
    );

    if (participant.isCheckedIn || existingLog) {
      const formattedTime = participant.checkInTime
        ? new Date(participant.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '09:14 AM';
      const gateStr = participant.checkInGate || existingLog?.gate || gateId;

      return {
        success: false,
        isDuplicate: true,
        participant,
        existingCheckIn: {
          time: formattedTime,
          gate: gateStr,
        },
        error: `ALREADY CHECKED IN — ${participant.name} checked in at ${formattedTime} (${gateStr}).`,
      };
    }

    // 3. Mark checked in
    const nowIso = new Date().toISOString();
    participant.isCheckedIn = true;
    participant.checkInTime = nowIso;
    participant.checkInGate = gateId;

    // 4. Increment live attendance count
    MOCK_EVENT.stats.totalCheckedIn = Math.min(
      MOCK_EVENT.stats.totalRegistered,
      MOCK_EVENT.stats.totalCheckedIn + 1
    );

    // 5. Create check-in log
    const newLog = {
      id: `chk_${Date.now()}`,
      participantId: participant.id,
      participantName: participant.name,
      qrCode: participant.qrCode || cleanToken,
      eventId: MOCK_EVENT.id,
      scannedAt: nowIso,
      gate: gateId,
      scannedBy,
      status: 'VERIFIED',
    };
    checkInLogs = [newLog, ...checkInLogs];

    // 6. Prepend to activity stream
    MOCK_ACTIVITY.unshift({
      id: `act_${Date.now()}`,
      type: 'CHECKIN',
      iconSymbol: '✓',
      actor: participant.name,
      description: `checked in at ${gateId}`,
      timeAgo: 'Just now',
      statusClass: 'status-success',
    });

    notifyListeners();

    return {
      success: true,
      participant,
      log: newLog,
      message: `VERIFIED: ${participant.name} checked in at ${gateId}!`,
    };
  },

  resetCheckInState() {
    checkInLogs = [...MOCK_CHECKIN_LOGS];
    MOCK_USERS.forEach((u) => {
      if (u.id === 'usr_part_1' || u.id === 'usr_part_4') {
        u.isCheckedIn = false;
        u.checkInTime = null;
        u.checkInGate = null;
      } else if (u.id === 'usr_part_2' || u.id === 'usr_part_3') {
        u.isCheckedIn = true;
      }
    });
    MOCK_EVENT.stats.totalCheckedIn = 214;
    notifyListeners();
  },
};
