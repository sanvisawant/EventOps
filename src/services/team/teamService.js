import { MOCK_TEAMS } from '../../data/mockData';
import { compileLeaderboard } from '../../utils/scoring';

export const teamService = {
  async getTeams() {
    return MOCK_TEAMS;
  },

  async getLeaderboard() {
    return compileLeaderboard(MOCK_TEAMS);
  },

  async getTeamById(teamId) {
    return MOCK_TEAMS.find((t) => t.id === teamId) || null;
  }
};
