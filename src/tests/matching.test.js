import { describe, it, expect } from 'vitest';
import { calculateTeamCompatibility, findBestMatchingTeams } from '../utils/matching';

describe('Team Matchmaking Engine', () => {
  const mockParticipant = {
    id: 'p1',
    name: 'Test Dev',
    skills: ['React', 'Node.js', 'Python'],
    preferredRole: 'Frontend',
    interests: ['AI Tools'],
  };

  const mockTeams = [
    {
      id: 't1',
      name: 'AI Champions',
      requiredSkills: ['React', 'Python'],
      track: 'AI Tools',
    },
    {
      id: 't2',
      name: 'Blockchain Builders',
      requiredSkills: ['Rust', 'Solidity'],
      track: 'Web3',
    },
  ];

  it('should calculate high compatibility score for matching skills and interests', () => {
    const score = calculateTeamCompatibility(mockParticipant, mockTeams[0]);
    expect(score).toBeGreaterThanOrEqual(70);
  });

  it('should calculate lower score for non-matching skills', () => {
    const score = calculateTeamCompatibility(mockParticipant, mockTeams[1]);
    expect(score).toBeLessThan(70);
  });

  it('should rank best matching teams in descending order of match score', () => {
    const ranked = findBestMatchingTeams(mockParticipant, mockTeams);
    expect(ranked[0].team.id).toBe('t1');
    expect(ranked[0].matchScore).toBeGreaterThan(ranked[1].matchScore);
  });
});
