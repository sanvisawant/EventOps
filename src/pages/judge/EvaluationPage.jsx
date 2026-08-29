import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { MOCK_RUBRIC_CRITERIA, MOCK_TEAMS } from '../../data/mockData';
import { calculateWeightedScore } from '../../utils/scoring';
import { validateScore } from '../../utils/validation';
import { judgingService } from '../../services/judging/judgingService';
import { Send } from 'lucide-react';

export function EvaluationPage() {
  const selectedTeam = MOCK_TEAMS[0];
  const [scores, setScores] = useState({
    crit_innovation: 9,
    crit_complexity: 9,
    crit_design: 8,
    crit_impact: 9,
  });
  const [feedback, setFeedback] = useState('Excellent implementation of agentic fallback loops and real-time telemetry.');
  const [resultMsg, setResultMsg] = useState(null);

  const weightedScore = calculateWeightedScore(scores, MOCK_RUBRIC_CRITERIA);

  const handleScoreChange = (critId, val) => {
    const numeric = parseFloat(val) || 0;
    setScores((prev) => ({ ...prev, [critId]: Math.min(10, Math.max(0, numeric)) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const [id, score] of Object.entries(scores)) {
      const v = validateScore(score, 0, 10);
      if (!v.isValid) { setResultMsg({ success: false, message: v.error }); return; }
    }
    const res = await judgingService.submitEvaluation({ teamId: selectedTeam.id, scores, feedback });
    setResultMsg(res);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-8">
      <div>
        <h1 className="text-lg font-semibold text-[--color-text-primary]">Evaluate</h1>
        <p className="text-sm text-[--color-text-secondary] mt-0.5">
          Scoring: <span className="text-[--color-text-primary] font-medium">{selectedTeam.name}</span>
          {' '}· {selectedTeam.track}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rubric form */}
        <Card title="Rubric Criteria" subtitle="Score 0.0–10.0 per criterion" className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {MOCK_RUBRIC_CRITERIA.map((crit) => (
              <div
                key={crit.id}
                className="flex items-start justify-between gap-4 p-4 rounded-md border border-[--color-border] bg-[--color-surface-2]"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-[--color-text-primary]">{crit.name}</p>
                    <Badge variant="brand" size="sm">
                      {(crit.weight * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-[--color-text-secondary]">{crit.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-20 rounded-md bg-[--color-surface] border border-[--color-border] text-center font-mono font-bold text-[--color-accent] text-base py-1.5 focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
                    value={scores[crit.id] ?? 0}
                    onChange={(e) => handleScoreChange(crit.id, e.target.value)}
                    aria-label={`Score for ${crit.name}`}
                  />
                  <span className="text-xs text-[--color-text-placeholder] font-mono">/ 10</span>
                </div>
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[--color-text-secondary]">
                Feedback
              </label>
              <textarea
                rows={3}
                className="w-full rounded-md bg-[--color-surface-2] border border-[--color-border] text-[--color-text-primary] text-sm p-3 placeholder:text-[--color-text-placeholder] focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:border-transparent transition-colors resize-y"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide constructive feedback…"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" icon={Send}>
              Submit Evaluation
            </Button>

            {resultMsg && (
              <Alert variant={resultMsg.success ? 'success' : 'danger'} title="Evaluation Submission">
                {resultMsg.message}
              </Alert>
            )}
          </form>
        </Card>

        {/* Score aggregate */}
        <Card title="Weighted Total">
          <div className="py-6 text-center space-y-2">
            <p className="text-xs text-[--color-text-secondary] font-medium uppercase tracking-wide">Total Score</p>
            <div className="text-5xl font-bold font-mono text-[--color-accent] tracking-tight">
              {weightedScore}
            </div>
            <p className="text-sm text-[--color-text-secondary]">/ 10</p>
            <p className="text-xs text-[--color-text-secondary] pt-4 border-t border-[--color-border] leading-relaxed">
              Submitting will immediately update standings on the leaderboard.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
