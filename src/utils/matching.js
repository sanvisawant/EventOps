/**
 * Smart Matchmaking Engine for EVENTOPS.
 * Calculates deterministic compatibility scores (0-100%) and match reasons based on:
 * 1. Skill complementarity (fills gaps)
 * 2. Role compatibility
 * 3. Shared project interests
 * 4. Team capability gap fulfillment
 */

const FRONTEND_SKILLS = ['react', 'vue', 'angular', 'ui/ux', 'figma', 'css', 'typescript', 'frontend', 'tailwind', 'mobile', 'flutter'];
const BACKEND_SKILLS = ['python', 'node.js', 'fastapi', 'express', 'go', 'postgresql', 'supabase', 'docker', 'java', 'backend'];
const AI_SKILLS = ['machine learning', 'ml', 'python', 'tensorflow', 'pytorch', 'ai', 'langchain', 'generative ai', 'data science'];
const DESIGN_SKILLS = ['figma', 'ui/ux', 'ui/ux design', 'css animations', 'accessibility', 'product design', 'design systems'];

/**
 * Categorizes a skill into a domain vector.
 */
function getSkillDomains(skills = []) {
  const domains = new Set();
  skills.forEach((s) => {
    const lower = s.toLowerCase();
    if (FRONTEND_SKILLS.some((k) => lower.includes(k))) domains.add('FRONTEND');
    if (BACKEND_SKILLS.some((k) => lower.includes(k))) domains.add('BACKEND');
    if (AI_SKILLS.some((k) => lower.includes(k))) domains.add('AI');
    if (DESIGN_SKILLS.some((k) => lower.includes(k))) domains.add('DESIGN');
  });
  return Array.from(domains);
}

/**
 * Calculates team capability gaps for a team or single participant.
 */
export function calculateTeamSkillGaps(participant, teamMembers = []) {
  const currentSkills = new Set();
  const allMembers = [participant, ...teamMembers].filter(Boolean);

  allMembers.forEach((m) => {
    (m.skills || []).forEach((s) => currentSkills.add(s.toLowerCase()));
  });

  const domains = getSkillDomains(Array.from(currentSkills));

  const missing = [];
  if (!domains.includes('FRONTEND')) missing.push('Frontend Development');
  if (!domains.includes('DESIGN')) missing.push('UI/UX Design');
  if (!domains.includes('BACKEND') && !domains.includes('AI')) missing.push('Backend / AI Engineering');
  if (!domains.includes('DEV_OPS') && !currentSkills.has('docker')) missing.push('DevOps & Deployment');

  return {
    hasFrontend: domains.includes('FRONTEND'),
    hasBackend: domains.includes('BACKEND'),
    hasAI: domains.includes('AI'),
    hasDesign: domains.includes('DESIGN'),
    missingCapabilities: missing.length > 0 ? missing : ['DevOps / Cloud Architecture'],
  };
}

/**
 * Calculates a 0-100 compatibility match score between two participants or a participant & candidate.
 */
export function calculateCandidateMatchScore(user, candidate, teamGaps = null) {
  if (!user || !candidate || user.id === candidate.id) return 0;

  let score = 50; // Baseline starting score for registered participants
  const reasons = [];

  const userSkills = (user.skills || []).map((s) => s.toLowerCase());
  const candidateSkills = (candidate.skills || []).map((s) => s.toLowerCase());
  const userRole = (user.preferredRole || '').toLowerCase();
  const candidateRole = (candidate.preferredRole || '').toLowerCase();
  const userInterests = (user.interests || []).map((i) => i.toLowerCase());
  const candidateInterests = (candidate.interests || []).map((i) => i.toLowerCase());

  // 1. Skill Complementarity (+25 points max)
  const userDomains = getSkillDomains(user.skills);
  const candidateDomains = getSkillDomains(candidate.skills);

  const newDomains = candidateDomains.filter((d) => !userDomains.includes(d));
  if (newDomains.length > 0) {
    score += Math.min(25, newDomains.length * 15);
    reasons.push(
      `Your ${userDomains.join('/') || 'backend'} skills complement ${candidate.name.split(' ')[0]}'s ${newDomains.join('/').toLowerCase()} expertise.`
    );
  } else {
    score += 5;
  }

  // 2. Shared Project Interests (+25 points max)
  const sharedInterests = candidateInterests.filter((ci) =>
    userInterests.some((ui) => ui.includes(ci) || ci.includes(ui))
  );

  if (sharedInterests.length > 0) {
    score += Math.min(25, sharedInterests.length * 12);
    reasons.push(`Shared interest in ${sharedInterests.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' & ')}.`);
  }

  // 3. Role Complementarity (+20 points max)
  if (userRole && candidateRole && userRole !== candidateRole) {
    score += 20;
    reasons.push(`Role fit: ${user.preferredRole || 'Backend'} & ${candidate.preferredRole || 'Frontend'}.`);
  } else if (userRole && candidateRole && userRole === candidateRole) {
    score -= 10; // Penalty for identical duplicate role
  }

  // 4. Team Capability Gap Fulfillment (+15 points max)
  if (teamGaps) {
    let filledGap = false;
    if (!teamGaps.hasFrontend && candidateDomains.includes('FRONTEND')) {
      score += 15;
      filledGap = true;
      reasons.push(`Fills your team's Frontend Development capability gap.`);
    }
    if (!teamGaps.hasDesign && candidateDomains.includes('DESIGN')) {
      score += 15;
      filledGap = true;
      reasons.push(`Fills your team's UI/UX Design capability gap.`);
    }
    if (!filledGap && !teamGaps.hasBackend && candidateDomains.includes('BACKEND')) {
      score += 10;
      reasons.push(`Strengthens backend infrastructure capability.`);
    }
  }

  // Ensure bounded score [0, 100]
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  // Fallback reason if none generated
  if (reasons.length === 0) {
    reasons.push('General skill and hackathon track alignment.');
  }

  return {
    matchScore: finalScore,
    reasons,
    matchLevel:
      finalScore >= 90
        ? 'Strong Match'
        : finalScore >= 80
        ? 'High Match'
        : finalScore >= 65
        ? 'Good Match'
        : 'Moderate Match',
  };
}

/**
 * Ranks all available candidates for a given participant, applying optional filters.
 */
export function rankCandidateMatches(user, candidates = [], filters = {}, teamGaps = null) {
  if (!user || !Array.isArray(candidates)) return [];

  let pool = candidates.filter((c) => c.id !== user.id && c.role === 'PARTICIPANT');

  // Filter by Role
  if (filters.role && filters.role !== 'All') {
    pool = pool.filter(
      (c) =>
        (c.preferredRole || '').toLowerCase().includes(filters.role.toLowerCase()) ||
        filters.role.toLowerCase().includes((c.preferredRole || '').toLowerCase())
    );
  }

  // Filter by Skill
  if (filters.skill && filters.skill !== 'All') {
    pool = pool.filter((c) =>
      (c.skills || []).some((s) => s.toLowerCase().includes(filters.skill.toLowerCase()))
    );
  }

  // Filter by Interest
  if (filters.interest && filters.interest !== 'All') {
    pool = pool.filter((c) =>
      (c.interests || []).some((i) => i.toLowerCase().includes(filters.interest.toLowerCase()))
    );
  }

  return pool
    .map((candidate) => {
      const matchResult = calculateCandidateMatchScore(user, candidate, teamGaps);
      return {
        candidate,
        ...matchResult,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Legacy support: Calculates a 0-100 compatibility match score between a participant and a team
 */
export function calculateTeamCompatibility(participant, team) {
  if (!participant || !team) return 0;
  let score = 20;

  const participantSkills = (participant.skills || []).map((s) => s.toLowerCase());
  const requiredSkills = (team.requiredSkills || []).map((s) => s.toLowerCase());

  if (requiredSkills.length > 0) {
    const matchedSkills = requiredSkills.filter((req) =>
      participantSkills.some((pSkill) => pSkill.includes(req) || req.includes(pSkill))
    );
    score += (matchedSkills.length / requiredSkills.length) * 40;
  } else {
    score += 20;
  }

  if (participant.preferredRole && team.requiredSkills) {
    const roleMatches = team.requiredSkills.some((req) =>
      req.toLowerCase().includes(participant.preferredRole.toLowerCase())
    );
    if (roleMatches) score += 20;
  }

  const participantInterests = (participant.interests || []).map((i) => i.toLowerCase());
  const teamTrack = (team.track || '').toLowerCase();
  const interestMatch = participantInterests.some((interest) => teamTrack.includes(interest));
  if (interestMatch) score += 20;

  return Math.min(100, Math.round(score));
}

export function findBestMatchingTeams(participant, teams = []) {
  if (!participant || !teams.length) return [];
  return teams
    .map((team) => ({
      team,
      matchScore: calculateTeamCompatibility(participant, team),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
