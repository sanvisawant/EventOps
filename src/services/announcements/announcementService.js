import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';

let currentAnnouncements = [...MOCK_ANNOUNCEMENTS];

export const announcementService = {
  async getAnnouncements() {
    return currentAnnouncements;
  },

  async publishAnnouncement({ title, message, priority = 'IMPORTANT', targetRole = 'ALL', author }) {
    const newAnnouncement = {
      id: `anc_${Date.now()}`,
      title,
      message,
      priority,
      targetRole,
      publishedAt: new Date().toISOString(),
      author: author || 'Organizer Command Desk',
    };
    currentAnnouncements = [newAnnouncement, ...currentAnnouncements];
    return newAnnouncement;
  }
};
