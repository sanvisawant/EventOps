/**
 * Calculates a 0-100 compatibility match score between a participant profile and a team's requirements.
 */
export function calculateTeamCompatibility(participant, team) {
  if (!participant || !team) return 0;

  let score = 0;

  // 1. Skill Overlap (40% weight)
  const participantSkills = (participant.skills || []).map((s) => s.toLowerCase());
  const requiredSkills = (team.requiredSkills || []).map((s) => s.toLowerCase());

  if (requiredSkills.length > 0) {
    const matchedSkills = requiredSkills.filter((req) =>
      participantSkills.some((pSkill) => pSkill.includes(req) || req.includes(pSkill))
    );
    const skillScore = (matchedSkills.length / requiredSkills.length) * 40;
    score += skillScore;
  } else {
    score += 20; // Default baseline if team hasn't listed explicit requirements
  }

  // 2. Preferred Role Fit (30% weight)
  if (participant.preferredRole && team.requiredSkills) {
    const roleMatches = team.requiredSkills.some((req) =>
      req.toLowerCase().includes(participant.preferredRole.toLowerCase()) ||
      participant.preferredRole.toLowerCase().includes(req.toLowerCase())
    );
    if (roleMatches) score += 30;
  }

  // 3. Shared Technical Interests (30% weight)
  const participantInterests = (participant.interests || []).map((i) => i.toLowerCase());
  const teamTrack = (team.track || '').toLowerCase();
  
  const interestMatch = participantInterests.some(
    (interest) => teamTrack.includes(interest) || interest.includes(teamTrack)
  );

  if (interestMatch) {
    score += 30;
  } else if (participantInterests.length > 0) {
    score += 15; // Partial credit for having defined interests
  }

  return Math.min(100, Math.round(score));
}

/**
 * Ranks all available teams for a given solo participant by match score
 */
export function findBestMatchingTeams(participant, teams = []) {
  if (!participant || !teams.length) return [];

  return teams
    .map((team) => ({
      team,
      matchScore: calculateTeamCompatibility(participant, team),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
