import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { useRole } from '../../hooks/useRole';
import { teamService } from '../../services/teamService';
import { calculateTeamSkillGaps } from '../../utils/matching';
import { MOCK_USERS } from '../../data/mockData';
import {
  Sparkles,
  Users,
  UserPlus,
  CheckCircle2,
  Filter,
  SlidersHorizontal,
  Brain,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
  Check,
} from 'lucide-react';

export function MatchmakingPage() {
  const { activeUser } = useRole();
  const currentUser = useMemo(() => {
    return MOCK_USERS.find((u) => u.id === activeUser?.id || u.email === activeUser?.email) || MOCK_USERS[0];
  }, [activeUser]);

  // Filters State
  const [roleFilter, setRoleFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');
  const [interestFilter, setInterestFilter] = useState('All');

  // UI Modals & Interaction State
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sentMap, setSentMap] = useState({});
  const [, setTick] = useState(0);

  // Editable Profile State
  const [editRole, setEditRole] = useState(currentUser.preferredRole || 'AI / Backend');
  const [editSkillsStr, setEditSkillsStr] = useState((currentUser.skills || []).join(', '));
  const [editInterestsStr, setEditInterestsStr] = useState((currentUser.interests || []).join(', '));

  useEffect(() => {
    const unsub = teamService.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsub;
  }, []);

  // Compute Team Skill Gaps
  const teamGaps = useMemo(() => {
    const teamMembers = currentUser.teamId
      ? MOCK_USERS.filter((u) => u.teamId === currentUser.teamId && u.id !== currentUser.id)
      : [];
    return calculateTeamSkillGaps(currentUser, teamMembers);
  }, [currentUser]);

  // Ranked Candidate Matches
  const matches = useMemo(() => {
    return teamService.getRecommendedMatches(currentUser, {
      role: roleFilter,
      skill: skillFilter,
      interest: interestFilter,
    });
  }, [currentUser, roleFilter, skillFilter, interestFilter]);

  const handleRequestJoin = (candidateId) => {
    const res = teamService.sendJoinRequest(currentUser.id, candidateId);
    if (res.success) {
      setSentMap((prev) => ({ ...prev, [candidateId]: true }));
    }
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    const newSkills = editSkillsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const newInterests = editInterestsStr.split(',').map((i) => i.trim()).filter(Boolean);
    teamService.updateUserPreferences(currentUser.id, newSkills, editRole, newInterests);
    setIsEditModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-mono font-bold uppercase tracking-wider text-[--color-accent] bg-[--color-accent-bg] px-2 py-0.5 rounded border border-[--color-accent-border]">
              ALGORITHMIC MATCHMAKING
            </span>
            <span className="live-dot" aria-hidden="true" />
            <span className="text-xs text-[--color-text-secondary]">Complementary Fit Engine</span>
          </div>
          <h1 className="text-xl font-bold text-[--color-text-primary] tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[--color-accent]" aria-hidden="true" />
            Smart Match
          </h1>
          <p className="text-xs text-[--color-text-secondary]">
            Find teammates whose skills and interests complement yours.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={SlidersHorizontal}
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit Preferences
        </Button>
      </div>

      {/* Top Section — Current Participant Profile & Team Capability Gaps */}
      <div className="card-base p-6 border-l-4 border-l-[--color-accent]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Participant Context */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full bg-[--color-surface-2] border border-[--color-border]"
              />
              <div>
                <h2 className="text-base font-bold text-[--color-text-primary] flex items-center gap-2">
                  {currentUser.name}
                  <Badge variant="brand" size="sm">
                    {currentUser.preferredRole || 'AI / Backend'}
                  </Badge>
                </h2>
                <p className="text-xs text-[--color-text-secondary]">
                  Team: <strong className="text-[--color-text-primary]">{currentUser.teamName || 'NeuralForge'}</strong> · {currentUser.tagline}
                </p>
              </div>
            </div>

            {/* Current Skills & Interests */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-2xs font-semibold text-[--color-text-placeholder] uppercase">Skills:</span>
                {(currentUser.skills || []).map((skill) => (
                  <Badge key={skill} variant="neutral" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-2xs font-semibold text-[--color-text-placeholder] uppercase">Interests:</span>
                {(currentUser.interests || []).map((interest) => (
                  <span
                    key={interest}
                    className="px-2 py-0.5 rounded text-2xs font-mono bg-[--color-surface-2] border border-[--color-border] text-[--color-text-secondary]"
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Team Skill Gaps Analysis */}
          <div className="md:col-span-5 p-4 rounded-md bg-[--color-surface-2] border border-[--color-border] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[--color-text-primary] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[--color-accent]" aria-hidden="true" />
                Team Skill Gap Analysis
              </span>
              <span className="text-2xs font-mono text-[--color-text-placeholder]">NeuralForge</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-2xs">
                <span className="text-[--color-text-secondary]">Current Capabilities:</span>
                <span className="font-mono text-[--color-success]">Backend ✓ · ML ✓</span>
              </div>
              <div className="flex items-start justify-between text-2xs">
                <span className="text-[--color-text-secondary]">Recommended Additions:</span>
                <span className="font-mono text-[--color-warning] font-semibold text-right">
                  {teamGaps.missingCapabilities.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Filters Bar */}
      <div className="card-base p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[--color-text-secondary]">
          <Filter className="w-4 h-4 text-[--color-accent]" aria-hidden="true" />
          <span>Filter Candidates:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-1 justify-end max-w-2xl">
          <div className="w-36">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { label: 'All Roles', value: 'All' },
                { label: 'Frontend', value: 'Frontend' },
                { label: 'Backend', value: 'Backend' },
                { label: 'Designer', value: 'Designer' },
                { label: 'DevOps', value: 'DevOps' },
              ]}
            />
          </div>

          <div className="w-36">
            <Select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              options={[
                { label: 'All Skills', value: 'All' },
                { label: 'React', value: 'React' },
                { label: 'Python', value: 'Python' },
                { label: 'Figma', value: 'Figma' },
                { label: 'Docker', value: 'Docker' },
              ]}
            />
          </div>

          <div className="w-40">
            <Select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              options={[
                { label: 'All Interests', value: 'All' },
                { label: 'Healthcare', value: 'Healthcare' },
                { label: 'Generative AI', value: 'Generative AI' },
                { label: 'FinTech', value: 'FinTech' },
                { label: 'DevTools', value: 'DevTools' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Match Result Cards Grid */}
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map(({ candidate, matchScore, matchLevel, reasons }) => {
            const isRequestSent = sentMap[candidate.id] || teamService.hasPendingRequest(currentUser.id, candidate.id);
            const isStrongMatch = matchScore >= 85;

            return (
              <div
                key={candidate.id}
                className="card-base p-5 flex flex-col justify-between gap-4 transition-colors hover:border-[--color-border-strong]"
              >
                <div className="space-y-3">
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-10 h-10 rounded-full bg-[--color-surface-2] border border-[--color-border] shrink-0"
                      />
                      <div>
                        <h3 className="text-base font-bold text-[--color-text-primary] leading-snug">
                          {candidate.name}
                        </h3>
                        <p className="text-xs text-[--color-text-secondary]">
                          {candidate.preferredRole} · ID: {candidate.participantId || 'P-1046'}
                        </p>
                      </div>
                    </div>

                    {/* Prominent Match Score Pill */}
                    <div className="text-right shrink-0">
                      <div className="inline-flex flex-col items-center justify-center px-3 py-1.5 rounded-md bg-[--color-accent-bg] border border-[--color-accent-border]">
                        <span className="text-base font-bold font-mono text-[--color-accent]">
                          {matchScore}%
                        </span>
                        <span className="text-2xs font-mono text-[--color-text-secondary]">
                          {matchLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tagline / Bio */}
                  <p className="text-xs text-[--color-text-secondary] italic">
                    "{candidate.tagline || 'Passionate hackathon participant looking for team.'}"
                  </p>

                  {/* Skills & Interests */}
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {(candidate.skills || []).map((skill) => (
                        <Badge key={skill} variant="neutral" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(candidate.interests || []).map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-0.5 rounded text-2xs font-mono bg-[--color-surface-2] border border-[--color-border] text-[--color-text-secondary]"
                        >
                          #{interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Why This Match Box */}
                  <div className="p-3 rounded-md border border-[--color-border] bg-[--color-surface-2] space-y-1 text-xs">
                    <span className="font-semibold text-[--color-text-primary] text-2xs uppercase tracking-wider block">
                      Why this match:
                    </span>
                    <ul className="space-y-1 text-2xs text-[--color-text-secondary]">
                      {reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[--color-accent] font-bold">+</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-[--color-border]">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    View Profile
                  </Button>

                  {isRequestSent ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[--color-success]">
                      <Check className="w-4 h-4" aria-hidden="true" />
                      Request Sent ✓
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      icon={UserPlus}
                      onClick={() => handleRequestJoin(candidate.id)}
                    >
                      Request to Join
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="card-base p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-[--color-text-placeholder] mx-auto" aria-hidden="true" />
          <h3 className="text-base font-semibold text-[--color-text-primary]">
            No Strong Matches Found
          </h3>
          <p className="text-xs text-[--color-text-secondary] max-w-sm mx-auto">
            Try broadening your role, skill, or interest filters to discover more potential teammates.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setRoleFilter('All');
              setSkillFilter('All');
              setInterestFilter('All');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <Modal
          isOpen={Boolean(selectedCandidate)}
          onClose={() => setSelectedCandidate(null)}
          title={`Candidate Profile — ${selectedCandidate.name}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedCandidate.avatar}
                alt={selectedCandidate.name}
                className="w-12 h-12 rounded-full border border-[--color-border]"
              />
              <div>
                <h4 className="text-base font-bold text-[--color-text-primary]">{selectedCandidate.name}</h4>
                <p className="text-xs text-[--color-text-secondary]">
                  {selectedCandidate.preferredRole} · Participant ID: {selectedCandidate.participantId || 'P-1046'}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[--color-text-secondary]">
                <strong className="text-[--color-text-primary]">Tagline:</strong> "{selectedCandidate.tagline}"
              </p>

              <div>
                <strong className="text-[--color-text-primary] block mb-1">Skills & Stack:</strong>
                <div className="flex flex-wrap gap-1">
                  {(selectedCandidate.skills || []).map((s) => (
                    <Badge key={s} variant="neutral" size="sm">{s}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <strong className="text-[--color-text-primary] block mb-1">Project Interests:</strong>
                <div className="flex flex-wrap gap-1">
                  {(selectedCandidate.interests || []).map((i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-2xs font-mono bg-[--color-surface-2] border border-[--color-border] text-[--color-text-secondary]">
                      #{i}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[--color-border] flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelectedCandidate(null)}>
                Close
              </Button>
              {!sentMap[selectedCandidate.id] ? (
                <Button
                  variant="primary"
                  icon={UserPlus}
                  onClick={() => {
                    handleRequestJoin(selectedCandidate.id);
                    setSelectedCandidate(null);
                  }}
                >
                  Request Teammate
                </Button>
              ) : (
                <span className="text-xs font-mono font-semibold text-[--color-success] py-2">
                  Request Sent ✓
                </span>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Preferences Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Matchmaking Preferences"
        >
          <form onSubmit={handleSavePreferences} className="space-y-4">
            <Select
              label="Preferred Role"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              options={[
                { label: 'AI / Backend', value: 'AI / Backend' },
                { label: 'Frontend Developer', value: 'Frontend Developer' },
                { label: 'Product Designer', value: 'Product Designer' },
                { label: 'DevOps Specialist', value: 'DevOps Specialist' },
              ]}
            />

            <div className="space-y-1 text-xs">
              <label className="block font-semibold text-[--color-text-primary]">
                Skills (comma separated)
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-[--color-border] bg-[--color-surface-2] text-[--color-text-primary] p-2.5"
                value={editSkillsStr}
                onChange={(e) => setEditSkillsStr(e.target.value)}
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-semibold text-[--color-text-primary]">
                Project Interests (comma separated)
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-[--color-border] bg-[--color-surface-2] text-[--color-text-primary] p-2.5"
                value={editInterestsStr}
                onChange={(e) => setEditInterestsStr(e.target.value)}
              />
            </div>

            <div className="pt-3 border-t border-[--color-border] flex justify-end gap-2">
              <Button variant="secondary" type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Preferences
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
