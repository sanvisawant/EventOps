import { MOCK_CHECKIN_LOGS, MOCK_USERS } from '../../data/mockData';
import { detectDuplicateCheckIn } from '../../utils/validation';

let currentLogs = [...MOCK_CHECKIN_LOGS];

export const checkinService = {
  async getCheckInLogs() {
    return currentLogs;
  },

  async processQrCheckIn(qrCode, scannedBy = 'Organizer Command Scanner') {
    const dupCheck = detectDuplicateCheckIn(qrCode, currentLogs);
    if (dupCheck.isDuplicate) {
      return {
        success: false,
        error: dupCheck.message,
        isDuplicate: true,
      };
    }

    const participant = MOCK_USERS.find(
      (u) => u.qrCode?.toUpperCase() === qrCode?.toUpperCase()
    );

    if (!participant) {
      return {
        success: false,
        error: 'Invalid QR Pass. No matching registered participant found.',
      };
    }

    const newLog = {
      id: `chk_${Date.now()}`,
      participantId: participant.id,
      participantName: participant.name,
      qrCode,
      scannedAt: new Date().toISOString(),
      scannedBy,
      status: 'VERIFIED',
    };

    currentLogs = [newLog, ...currentLogs];

    return {
      success: true,
      participant,
      log: newLog,
      message: `Verified: ${participant.name} successfully checked in!`,
    };
  }
};
