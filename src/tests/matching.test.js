import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateCandidateMatchScore,
  rankCandidateMatches,
  calculateTeamSkillGaps,
} from '../utils/matching';
import { teamService } from '../services/teamService';

describe('Smart Team Matchmaking Engine', () => {
  const userA = {
    id: 'user_backend_ml',
    name: 'Sanvi Sawant',
    skills: ['Python', 'Machine Learning', 'FastAPI'],
    preferredRole: 'AI / Backend',
    interests: ['Healthcare', 'Generative AI'],
    role: 'PARTICIPANT',
  };

  const userB_Frontend = {
    id: 'user_frontend',
    name: 'Aarav Mehta',
    skills: ['React', 'TypeScript', 'UI/UX Design'],
    preferredRole: 'Frontend Developer',
    interests: ['Healthcare', 'Generative AI'],
    role: 'PARTICIPANT',
  };

  const userC_DuplicateBackend = {
    id: 'user_dup_backend',
    name: 'Rohan Patil',
    skills: ['Python', 'Machine Learning', 'FastAPI'],
    preferredRole: 'AI / Backend',
    interests: ['FinTech'],
    role: 'PARTICIPANT',
  };

  it('1. should calculate high compatibility for complementary skills & roles', () => {
    const res = calculateCandidateMatchScore(userA, userB_Frontend);
    expect(res.matchScore).toBeGreaterThanOrEqual(85);
    expect(res.matchLevel).toBe('Strong Match');
  });

  it('2. should calculate lower compatibility for duplicate roles and unrelated interests', () => {
    const res = calculateCandidateMatchScore(userA, userC_DuplicateBackend);
    expect(res.matchScore).toBeLessThan(75);
  });

  it('3. should increase compatibility when shared project interests exist', () => {
    const resWithShared = calculateCandidateMatchScore(userA, userB_Frontend);
    const userNoInterest = { ...userB_Frontend, interests: ['Unrelated Field'] };
    const resNoShared = calculateCandidateMatchScore(userA, userNoInterest);
    expect(resWithShared.matchScore).toBeGreaterThan(resNoShared.matchScore);
  });

  it('4. should apply role compatibility correctly', () => {
    const resDifferentRole = calculateCandidateMatchScore(userA, userB_Frontend);
    const resSameRole = calculateCandidateMatchScore(userA, userC_DuplicateBackend);
    expect(resDifferentRole.matchScore).toBeGreaterThan(resSameRole.matchScore);
  });

  it('5. should factor team capability gaps into candidate recommendation scores', () => {
    const teamGaps = calculateTeamSkillGaps(userA, []); // Missing Frontend & Design
    expect(teamGaps.missingCapabilities.length).toBeGreaterThan(0);
    const res = calculateCandidateMatchScore(userA, userB_Frontend, teamGaps);
    expect(res.reasons.some((r) => r.includes('capability gap'))).toBe(true);
  });

  it('6. should return candidate match results sorted strictly from highest score to lowest', () => {
    const candidates = [userC_DuplicateBackend, userB_Frontend];
    const ranked = rankCandidateMatches(userA, candidates);
    expect(ranked.length).toBe(2);
    expect(ranked[0].candidate.id).toBe('user_frontend');
    expect(ranked[0].matchScore).toBeGreaterThanOrEqual(ranked[1].matchScore);
  });

  it('7. should always maintain match score within bounds [0, 100]', () => {
    const res = calculateCandidateMatchScore(userA, userB_Frontend);
    expect(res.matchScore).toBeGreaterThanOrEqual(0);
    expect(res.matchScore).toBeLessThanOrEqual(100);
  });

  it('8. should generate accurate, deterministic match reasons reflecting matching factors', () => {
    const res = calculateCandidateMatchScore(userA, userB_Frontend);
    expect(res.reasons.length).toBeGreaterThan(0);
    expect(res.reasons.some((r) => r.toLowerCase().includes('healthcare'))).toBe(true);
  });

  it('9. should prevent duplicate teammate requests in teamService', () => {
    const req1 = teamService.sendJoinRequest('usr_part_1', 'usr_cand_1');
    expect(req1.success).toBe(true);
    const req2 = teamService.sendJoinRequest('usr_part_1', 'usr_cand_1');
    expect(req2.success).toBe(false);
    expect(req2.error).toContain('already been sent');
  });

  it('10. should handle filter criteria yielding no matches gracefully', () => {
    const candidates = [userB_Frontend];
    const filtered = rankCandidateMatches(userA, candidates, { role: 'UnmatchedRole' });
    expect(filtered.length).toBe(0);
  });

  it('11. should return ranked matches via teamService getRecommendedMatches API', () => {
    const matches = teamService.getRecommendedMatches(userA);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].matchScore).toBeGreaterThan(0);
  });

  it('12. should update user preferences and reflect in teamService', () => {
    const updated = teamService.updateUserPreferences('usr_part_1', ['Go', 'Docker'], 'DevOps Engineer', ['Cloud Native']);
    expect(updated).toBeDefined();
    expect(updated.preferredRole).toBe('DevOps Engineer');
  });

  it('13. should calculate missing team skill gaps accurately', () => {
    const gaps = calculateTeamSkillGaps(userA, []);
    expect(gaps.hasFrontend).toBe(false);
    expect(gaps.hasDesign).toBe(false);
    expect(gaps.missingCapabilities).toContain('Frontend Development');
  });
});
