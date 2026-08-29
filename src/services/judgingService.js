import {
  MOCK_RUBRIC_CRITERIA,
  MOCK_TEAMS,
  MOCK_EVENT,
  MOCK_ACTIVITY,
} from '../data/mockData';
import { calculateWeightedScore, compileLeaderboard } from '../utils/scoring';

let teamsStore = JSON.parse(JSON.stringify(MOCK_TEAMS));
let evaluationsStore = [];
const listeners = new Set();

function notifyListeners() {
  listeners.forEach((fn) => {
    try { fn(); } catch (e) { console.error('JudgingService listener error:', e); }
  });
}

export const judgingService = {
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  async getRubric() {
    return MOCK_RUBRIC_CRITERIA;
  },

  async getSubmissions(filter = 'All') {
    const list = teamsStore.filter((t) => t.submission);
    if (filter === 'Pending') {
      return list.filter((t) => t.submission.status !== 'EVALUATED');
    }
    if (filter === 'Evaluated') {
      return list.filter((t) => t.submission.status === 'EVALUATED');
    }
    return list;
  },

  async getSubmissionById(id) {
    if (!id) return teamsStore.find((t) => t.submission) || null;
    return (
      teamsStore.find(
        (t) =>
          t.id === id ||
          t.submission?.id === id ||
          t.submissionId === id ||
          t.id?.toLowerCase() === id?.toLowerCase()
      ) || teamsStore[0]
    );
  },

  getEvaluation(submissionIdOrTeamId, judgeId = 'usr_judge_1') {
    return (
      evaluationsStore.find(
        (e) =>
          (e.teamId === submissionIdOrTeamId || e.submissionId === submissionIdOrTeamId) &&
          e.judgeId === judgeId
      ) || null
    );
  },

  hasEvaluation(submissionIdOrTeamId, judgeId = 'usr_judge_1') {
    return Boolean(this.getEvaluation(submissionIdOrTeamId, judgeId));
  },

  getJudgeMetrics(judgeId = 'usr_judge_1') {
    const assigned = teamsStore.filter((t) => t.submission);
    const evaluated = assigned.filter((t) => t.submission.status === 'EVALUATED');
    const pending = assigned.filter((t) => t.submission.status !== 'EVALUATED');

    const totalScoresSum = evaluated.reduce(
      (sum, t) => sum + (t.scores?.totalWeightedScore || 0),
      0
    );
    const avgScore =
      evaluated.length > 0
        ? Math.round((totalScoresSum / evaluated.length) * 100) / 100
        : 0;

    return {
      totalAssigned: assigned.length,
      evaluatedCount: evaluated.length,
      pendingCount: pending.length,
      averageScore: avgScore,
    };
  },

  async submitEvaluation({
    teamId,
    submissionId,
    judgeId = 'usr_judge_1',
    judgeName = 'Dr. Vikramaditya Rao',
    scores = {},
    feedback = '',
    strengths = [],
    improvements = [],
  }) {
    if (!teamId && !submissionId) {
      return { success: false, error: 'Target submission ID is required.' };
    }

    // 1. Validate all criteria scored between 0 and 10
    for (const crit of MOCK_RUBRIC_CRITERIA) {
      const val = scores[crit.id];
      if (val === undefined || val === null || typeof val !== 'number' || val < 0 || val > 10) {
        return {
          success: false,
          error: `Please score "${crit.name}" between 0 and 10.`,
        };
      }
    }

    // 2. Calculate Weighted Score using scoring.js
    const weightedScore = calculateWeightedScore(scores, MOCK_RUBRIC_CRITERIA);

    const nowIso = new Date().toISOString();
    const targetTeamId = teamId || submissionId;

    // 3. Create or update evaluation record
    const existingIndex = evaluationsStore.findIndex(
      (e) => (e.teamId === targetTeamId || e.submissionId === targetTeamId) && e.judgeId === judgeId
    );

    const evalRecord = {
      id: existingIndex >= 0 ? evaluationsStore[existingIndex].id : `eval_${Date.now()}`,
      teamId: targetTeamId,
      submissionId: submissionId || targetTeamId,
      judgeId,
      judgeName,
      scores: { ...scores },
      weightedScore,
      feedback: feedback.trim(),
      strengths,
      improvements,
      evaluatedAt: nowIso,
    };

    if (existingIndex >= 0) {
      evaluationsStore[existingIndex] = evalRecord;
    } else {
      evaluationsStore.push(evalRecord);
    }

    // 4. Update team submission status and aggregate score
    let targetTeamName = 'Project';
    teamsStore = teamsStore.map((team) => {
      if (team.id === targetTeamId || team.submission?.id === targetTeamId) {
        targetTeamName = team.name;

        // Calculate aggregate weighted score across all judge evaluations for this team
        const teamEvals = evaluationsStore.filter(
          (e) => e.teamId === team.id || e.submissionId === team.submission?.id
        );
        const avgScore =
          teamEvals.reduce((acc, ev) => acc + ev.weightedScore, 0) / (teamEvals.length || 1);

        return {
          ...team,
          submission: {
            ...team.submission,
            status: 'EVALUATED',
            evaluatedAt: nowIso,
          },
          scores: {
            ...scores,
            totalWeightedScore: Math.round(avgScore * 100) / 100,
          },
          evaluationsCount: teamEvals.length,
          feedback: feedback || team.feedback,
        };
      }
      return team;
    });

    // 5. Update Organizer metrics
    MOCK_EVENT.stats.evaluationsCompleted = (MOCK_EVENT.stats.evaluationsCompleted || 24) + (existingIndex >= 0 ? 0 : 1);
    const totalSubmissionsCount = MOCK_EVENT.stats.submissions || 42;
    MOCK_EVENT.stats.pendingJudgments = Math.max(0, totalSubmissionsCount - MOCK_EVENT.stats.evaluationsCompleted);

    // 6. Prepend entry to live activity stream
    MOCK_ACTIVITY.unshift({
      id: `act_${Date.now()}`,
      type: 'EVALUATION',
      iconSymbol: '✓',
      actor: judgeName,
      description: `evaluated ${targetTeamName} — ${weightedScore}/10`,
      timeAgo: 'Just now',
      statusClass: 'status-accent',
    });

    notifyListeners();

    return {
      success: true,
      weightedScore,
      evaluation: evalRecord,
      message: `Evaluation submitted successfully for ${targetTeamName}! Score: ${weightedScore}/10`,
    };
  },

  async getLeaderboard() {
    return compileLeaderboard(teamsStore);
  },

  resetJudgingState() {
    teamsStore = JSON.parse(JSON.stringify(MOCK_TEAMS));
    evaluationsStore = [];
    MOCK_EVENT.stats.evaluationsCompleted = 24;
    MOCK_EVENT.stats.pendingJudgments = 18;
    notifyListeners();
  },
};
