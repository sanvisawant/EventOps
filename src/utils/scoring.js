/**
 * Computes total weighted score (0-10) for a submission given rubric criteria and judge scores.
 * @param {Object} rawScores Map of criteriaId -> numeric score (0-10)
 * @param {Array} criteria List of criteria objects containing { id, weight }
 */
export function calculateWeightedScore(rawScores = {}, criteria = []) {
  if (!criteria || criteria.length === 0) return 0;

  let totalWeightedScore = 0;
  let totalWeight = 0;

  criteria.forEach((crit) => {
    const score = rawScores[crit.id] ?? 0;
    const weight = crit.weight ?? 0.25;
    totalWeightedScore += score * weight;
    totalWeight += weight;
  });

  if (totalWeight === 0) return 0;

  // Normalize if weights don't sum to 1
  const finalScore = totalWeightedScore / (totalWeight > 1 ? totalWeight : 1);
  return Math.round(finalScore * 100) / 100;
}

/**
 * Compiles a ranked leaderboard from an array of teams with evaluations
 */
export function compileLeaderboard(teams = []) {
  if (!teams || teams.length === 0) return [];

  const ranked = [...teams]
    .map((team) => {
      const weightedScore = team.scores?.totalWeightedScore ?? 0;
      return {
        ...team,
        weightedScore,
      };
    })
    .sort((a, b) => b.weightedScore - a.weightedScore);

  let currentRank = 1;
  return ranked.map((team, index) => {
    if (index > 0 && team.weightedScore < ranked[index - 1].weightedScore) {
      currentRank = index + 1;
    }
    return {
      ...team,
      rank: currentRank,
    };
  });
}
