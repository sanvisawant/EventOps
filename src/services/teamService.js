import { MOCK_USERS, MOCK_TEAMS } from '../data/mockData';
import { rankCandidateMatches, calculateTeamSkillGaps } from '../utils/matching';

const sentRequests = new Set();
const listeners = new Set();

function notifyListeners() {
  listeners.forEach((fn) => {
    try { fn(); } catch (e) { console.error('TeamService listener error:', e); }
  });
}

export const teamService = {
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  async getTeams() {
    return MOCK_TEAMS;
  },

  async getTeamById(teamId) {
    return MOCK_TEAMS.find((t) => t.id === teamId) || null;
  },

  getRecommendedMatches(user, filters = {}) {
    if (!user) return [];
    const teamMembers = user.teamId
      ? MOCK_USERS.filter((u) => u.teamId === user.teamId && u.id !== user.id)
      : [];
    const teamGaps = calculateTeamSkillGaps(user, teamMembers);
    return rankCandidateMatches(user, MOCK_USERS, filters, teamGaps);
  },

  sendJoinRequest(fromUserId, candidateId) {
    const key = `${fromUserId}:${candidateId}`;
    if (sentRequests.has(key)) {
      return {
        success: false,
        error: 'Teammate request has already been sent to this participant.',
      };
    }

    sentRequests.add(key);
    notifyListeners();

    return {
      success: true,
      message: 'Your teammate request has been sent.',
    };
  },

  hasPendingRequest(fromUserId, candidateId) {
    return sentRequests.has(`${fromUserId}:${candidateId}`);
  },

  updateUserPreferences(userId, newSkills, newRole, newInterests) {
    const user = MOCK_USERS.find((u) => u.id === userId || u.email === userId);
    if (user) {
      if (Array.isArray(newSkills)) user.skills = newSkills;
      if (newRole) user.preferredRole = newRole;
      if (Array.isArray(newInterests)) user.interests = newInterests;
      notifyListeners();
    }
    return user;
  },
};
