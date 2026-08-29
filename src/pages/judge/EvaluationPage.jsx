import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useRole } from '../../hooks/useRole';
import { judgingService } from '../../services/judgingService';
import { calculateWeightedScore } from '../../utils/scoring';
import { MOCK_RUBRIC_CRITERIA } from '../../data/mockData';
import {
  Award,
  CheckCircle2,
  Github,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Edit3,
  Trophy,
} from 'lucide-react';

const STRENGTH_TAGS = [
  'Innovation',
  'Technical execution',
  'Impact & Value',
  'UX & Accessibility',
];

const IMPROVEMENT_TAGS = [
  'Scalability',
  'Documentation',
  'Presentation',
  'Edge Case Handling',
];

export function EvaluationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeUser } = useRole();
  const targetId = searchParams.get('id') || 'team_alpha';

  const [team, setTeam] = useState(null);
  const [scores, setScores] = useState({
    crit_innovation: 9,
    crit_complexity: 8,
    crit_impact: 9,
    crit_design: 8,
  });
  const [feedback, setFeedback] = useState('');
  const [selectedStrengths, setSelectedStrengths] = useState(['Innovation', 'Impact & Value']);
  const [selectedImprovements, setSelectedImprovements] = useState(['Documentation']);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [error, setError] = useState('');
  const [isEditingUnlocked, setIsEditingUnlocked] = useState(false);

  useEffect(() => {
    async function loadData() {
      const sub = await judgingService.getSubmissionById(targetId);
      setTeam(sub);

      const existing = judgingService.getEvaluation(sub.id, activeUser?.id);
      if (existing) {
        setScores(existing.scores || {});
        setFeedback(existing.feedback || '');
        setSelectedStrengths(existing.strengths || []);
        setSelectedImprovements(existing.improvements || []);
        setSubmittedResult({ weightedScore: existing.weightedScore });
        setIsSubmitted(true);
      }
    }
    loadData();
  }, [targetId, activeUser]);

  // Live Draft Score Calculation using scoring.js
  const draftScore = useMemo(() => {
    return calculateWeightedScore(scores, MOCK_RUBRIC_CRITERIA);
  }, [scores]);

  const handleScoreChange = (criterionId, val) => {
    setScores((prev) => ({
      ...prev,
      [criterionId]: val,
    }));
  };

  const toggleStrength = (tag) => {
    setSelectedStrengths((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleImprovement = (tag) => {
    setSelectedImprovements((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all 4 criteria scored
    for (const crit of MOCK_RUBRIC_CRITERIA) {
      if (scores[crit.id] === undefined || scores[crit.id] === null) {
        setError(`Please assign a score for ${crit.name}.`);
        return;
      }
    }

    const res = await judgingService.submitEvaluation({
      teamId: team.id,
      submissionId: team.submission?.id || team.id,
      judgeId: activeUser?.id || 'usr_judge_1',
      judgeName: activeUser?.name || 'Dr. Vikramaditya Rao',
      scores,
      feedback,
      strengths: selectedStrengths,
      improvements: selectedImprovements,
    });

    if (res.success) {
      setSubmittedResult(res);
      setIsSubmitted(true);
      setIsEditingUnlocked(false);
    } else {
      setError(res.error || 'Failed to submit evaluation.');
    }
  };

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-xs text-[--color-text-secondary]">
        Loading submission details…
      </div>
    );
  }

  const isAlreadyEvaluated = isSubmitted && !isEditingUnlocked;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/judge/submissions')}
        >
          Back to Submissions Queue
        </Button>
        <span className="text-2xs font-mono font-bold uppercase tracking-wider text-[--color-accent] bg-[--color-accent-bg] px-2.5 py-1 rounded border border-[--color-accent-border]">
          RUBRIC EVALUATION
        </span>
      </div>

      {/* Submission Overview Card */}
      <div className="card-base p-6 border-l-4 border-l-[--color-accent] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[--color-accent]">
                {team.submissionId || '#042'}
              </span>
              <Badge variant="brand" size="sm">
                {team.track}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-[--color-text-primary] tracking-tight">
              {team.projectName || team.name}
            </h1>
            <p className="text-xs text-[--color-text-secondary]">
              Team: <strong className="text-[--color-text-primary]">{team.name}</strong> · Members: {(team.members || []).join(', ')}
            </p>
          </div>

          <div className="text-right shrink-0">
            {isAlreadyEvaluated ? (
              <Badge variant="success" size="md" icon={CheckCircle2}>
                EVALUATED · {submittedResult?.weightedScore || team.scores?.totalWeightedScore}/10
              </Badge>
            ) : (
              <div className="inline-flex flex-col items-center justify-center px-4 py-2 rounded-md bg-[--color-accent-bg] border border-[--color-accent-border]">
                <span className="text-2xs uppercase tracking-wider font-mono text-[--color-text-secondary]">
                  DRAFT SCORE
                </span>
                <span className="text-xl font-extrabold font-mono text-[--color-accent]">
                  {draftScore} / 10
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Problem & Solution */}
        <div className="space-y-2 pt-2 border-t border-[--color-border] text-xs">
          <p className="text-[--color-text-primary]">
            <strong className="font-semibold text-[--color-text-primary]">Problem:</strong> {team.problem || team.submission?.description}
          </p>
          {team.solution && (
            <p className="text-[--color-text-secondary]">
              <strong className="font-semibold text-[--color-text-primary]">Solution:</strong> {team.solution}
            </p>
          )}
        </div>

        {/* Tech Stack & Links Footer */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-[--color-border] flex-wrap text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-2xs font-mono text-[--color-text-placeholder] uppercase">Stack:</span>
            {(team.techStack || ['React', 'Python', 'FastAPI']).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-2xs font-mono bg-[--color-surface-2] border border-[--color-border] text-[--color-text-secondary]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {team.submission?.githubUrl && (
              <a
                href={team.submission.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[--color-text-secondary] hover:text-[--color-accent] font-mono text-xs"
              >
                <Github className="w-3.5 h-3.5" aria-hidden="true" />
                Code Repository
              </a>
            )}
            {team.submission?.demoUrl && (
              <a
                href={team.submission.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[--color-accent] hover:underline font-mono text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                Live Demo App
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation View if Already Submitted */}
      {isAlreadyEvaluated ? (
        <Card title="Evaluation Confirmation" subtitle="This submission has been evaluated and recorded.">
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-md border status-success flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[--color-success]" aria-hidden="true" />
                  <span className="font-bold text-sm font-mono">✓ EVALUATION SUBMITTED</span>
                </div>
                <p className="opacity-90">
                  Total Weighted Score: <strong className="font-mono text-sm">{submittedResult?.weightedScore || team.scores?.totalWeightedScore} / 10</strong>
                </p>
                <p className="text-2xs opacity-75 font-mono">
                  Evaluated by: {activeUser?.name || 'Dr. Vikramaditya Rao'}
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                icon={Edit3}
                onClick={() => setIsEditingUnlocked(true)}
              >
                Edit Evaluation
              </Button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/judge/submissions')}
              >
                Back to Submissions
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Trophy}
                onClick={() => navigate('/judge/leaderboard')}
              >
                View Leaderboard
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        /* Evaluation Rubric Form */
        <form onSubmit={handleSubmitEvaluation} className="space-y-6">
          {error && (
            <div className="p-3 rounded-md border status-danger text-xs font-medium">
              {error}
            </div>
          )}

          {/* 4-Criteria Rubric Scoring Grid */}
          <Card title="Rubric Scoring Grid" subtitle="Assign scores 0 - 10 for each criterion (Weights enforced via src/utils/scoring.js)">
            <div className="space-y-6">
              {MOCK_RUBRIC_CRITERIA.map((crit) => {
                const currentVal = scores[crit.id] ?? 0;
                const weightPct = Math.round(crit.weight * 100);

                return (
                  <div
                    key={crit.id}
                    className="p-4 rounded-md border border-[--color-border] bg-[--color-surface-2] space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-[--color-text-primary] flex items-center gap-2">
                          {crit.name}
                          <span className="text-2xs font-mono font-bold text-[--color-accent] bg-[--color-accent-bg] px-2 py-0.5 rounded border border-[--color-accent-border]">
                            Weight: {weightPct}%
                          </span>
                        </h3>
                        <p className="text-xs text-[--color-text-secondary] mt-0.5">{crit.description}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-bold font-mono text-[--color-accent]">
                          {currentVal}
                        </span>
                        <span className="text-xs text-[--color-text-secondary] font-mono"> / 10</span>
                      </div>
                    </div>

                    {/* Numeric Button Scale 0 - 10 */}
                    <div className="flex items-center justify-between gap-1 overflow-x-auto pt-1">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleScoreChange(crit.id, num)}
                          className={[
                            'flex-1 min-w-[2.2rem] py-2 rounded text-xs font-bold font-mono transition-colors border cursor-pointer',
                            currentVal === num
                              ? 'bg-[--color-accent] text-white border-[--color-accent] shadow-xs'
                              : 'bg-[--color-surface] text-[--color-text-primary] border-[--color-border] hover:bg-[--color-surface-2]',
                          ].join(' ')}
                          aria-label={`Score ${num} for ${crit.name}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Structured Feedback & Tags */}
          <Card title="Structured Qualitative Feedback" subtitle="Optional strengths tags & constructive notes">
            <div className="space-y-4">
              {/* Strength Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[--color-text-primary] block">
                  Project Strengths:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STRENGTH_TAGS.map((tag) => {
                    const isSelected = selectedStrengths.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleStrength(tag)}
                        className={[
                          'px-2.5 py-1 rounded text-2xs font-mono transition-colors border cursor-pointer',
                          isSelected
                            ? 'status-success font-semibold'
                            : 'bg-[--color-surface-2] text-[--color-text-secondary] border-[--color-border]',
                        ].join(' ')}
                      >
                        {isSelected ? '✓ ' : '+ '}{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Areas to Improve Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[--color-text-primary] block">
                  Areas to Improve:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {IMPROVEMENT_TAGS.map((tag) => {
                    const isSelected = selectedImprovements.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleImprovement(tag)}
                        className={[
                          'px-2.5 py-1 rounded text-2xs font-mono transition-colors border cursor-pointer',
                          isSelected
                            ? 'status-warning font-semibold'
                            : 'bg-[--color-surface-2] text-[--color-text-secondary] border-[--color-border]',
                        ].join(' ')}
                      >
                        {isSelected ? '✓ ' : '+ '}{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Feedback Textarea */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[--color-text-primary] block">
                  Overall Judge Comments & Recommendations:
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-[--color-border] bg-[--color-surface-2] p-3 text-xs text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
                  placeholder="Provide constructive feedback for the team…"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Submission Bar */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-[--color-surface-2] border border-[--color-border]">
            <div>
              <span className="text-2xs uppercase tracking-wider font-mono text-[--color-text-secondary] block">
                Calculated Weighted Score
              </span>
              <span className="text-xl font-extrabold font-mono text-[--color-accent]">
                {draftScore} / 10
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              icon={Award}
              size="md"
            >
              Submit Rubric Evaluation
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
