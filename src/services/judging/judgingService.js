import { MOCK_RUBRIC_CRITERIA, MOCK_TEAMS } from '../../data/mockData';
import { calculateWeightedScore } from '../../utils/scoring';

let teamsStore = [...MOCK_TEAMS];

export const judgingService = {
  async getRubric() {
    return MOCK_RUBRIC_CRITERIA;
  },

  async getAssignedSubmissions(judgeId) {
    // For demo, return all teams with submissions
    return teamsStore.filter((t) => t.submission);
  },

  async submitEvaluation({ teamId, judgeId, scores, feedback }) {
    const weightedScore = calculateWeightedScore(scores, MOCK_RUBRIC_CRITERIA);
    
    teamsStore = teamsStore.map((team) => {
      if (team.id === teamId) {
        return {
          ...team,
          scores: {
            ...scores,
            totalWeightedScore: weightedScore,
          },
          evaluationsCount: (team.evaluationsCount || 0) + 1,
          feedback: feedback || team.feedback,
        };
      }
      return team;
    });

    return {
      success: true,
      weightedScore,
      message: `Evaluation submitted. Total score: ${weightedScore}/10`,
    };
  }
};
