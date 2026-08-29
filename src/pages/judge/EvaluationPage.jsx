import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { MOCK_RUBRIC_CRITERIA, MOCK_TEAMS } from '../../data/mockData';
import { calculateWeightedScore } from '../../utils/scoring';
import { validateScore } from '../../utils/validation';
import { judgingService } from '../../services/judging/judgingService';
import { ClipboardCheck, Star, Send, CheckCircle } from 'lucide-react';

export function EvaluationPage() {
  const selectedTeam = MOCK_TEAMS[0]; // Synthetix AI
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
    setScores((prev) => ({
      ...prev,
      [critId]: Math.min(10, Math.max(0, numeric)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate score bounds
    for (const [id, score] of Object.entries(scores)) {
      const v = validateScore(score, 0, 10);
      if (!v.isValid) {
        setResultMsg({ success: false, message: v.error });
        return;
      }
    }

    const res = await judgingService.submitEvaluation({
      teamId: selectedTeam.id,
      scores,
      feedback,
    });

    setResultMsg(res);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <ClipboardCheck className="w-6 h-6 text-indigo-400" />
          Structured Rubric Evaluator
        </h1>
        <p className="text-sm text-slate-400">
          Evaluating Team: <span className="font-bold text-slate-200">{selectedTeam.name}</span> ({selectedTeam.track})
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rubric Scoring Form */}
        <Card title="Weighted Rubric Criteria" subtitle="Scores range 0.0 - 10.0" className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {MOCK_RUBRIC_CRITERIA.map((crit) => (
              <div key={crit.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-100">{crit.name}</h4>
                      <Badge variant="brand">Weight: {(crit.weight * 100).toFixed(0)}%</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{crit.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      className="w-20 rounded-lg bg-slate-900 border border-slate-700 text-center font-mono font-bold text-indigo-400 text-lg py-1.5"
                      value={scores[crit.id] ?? 0}
                      onChange={(e) => handleScoreChange(crit.id, e.target.value)}
                    />
                    <span className="text-xs text-slate-500 font-mono">/ 10</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Constructive Qualitative Feedback
              </label>
              <textarea
                rows={3}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm p-3"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" icon={Send}>
              Submit Live Evaluation
            </Button>

            {resultMsg && (
              <Alert variant={resultMsg.success ? 'success' : 'danger'} title="Evaluation Submission">
                {resultMsg.message}
              </Alert>
            )}
          </form>
        </Card>

        {/* Live Aggregate Telemetry Card */}
        <Card title="Live Score Aggregate" subtitle="Calculated total weighted score">
          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-3">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Total Weighted Score
            </div>
            <div className="text-4xl font-extrabold font-mono text-indigo-400 tracking-tight">
              {weightedScore} <span className="text-lg text-slate-500">/ 10</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-900">
              Submitting this score will update the team's standing on the Live Leaderboard immediately.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
