import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { judgingService } from '../../services/judgingService';
import { Github, ExternalLink, ClipboardCheck, CheckCircle2, Clock, Filter } from 'lucide-react';

export function SubmissionsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [submissions, setSubmissions] = useState([]);

  const refreshSubmissions = async () => {
    const list = await judgingService.getSubmissions(filter);
    setSubmissions(list);
  };

  useEffect(() => {
    refreshSubmissions();
    const unsub = judgingService.subscribe(() => {
      refreshSubmissions();
    });
    return unsub;
  }, [filter]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-mono font-bold uppercase tracking-wider text-[--color-accent] bg-[--color-accent-bg] px-2 py-0.5 rounded border border-[--color-accent-border]">
              RUBRIC EVALUATION QUEUE
            </span>
            <span className="live-dot" aria-hidden="true" />
            <span className="text-xs text-[--color-text-secondary]">Live Scoring Portal</span>
          </div>
          <h1 className="text-xl font-bold text-[--color-text-primary] tracking-tight">
            Project Submissions Queue
          </h1>
          <p className="text-xs text-[--color-text-secondary]">
            Review codebases, live demos, and submit rubric evaluations for assigned hackathon projects.
          </p>
        </div>

        {/* Queue Filter Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[--color-surface-2] border border-[--color-border]">
          {['All', 'Pending', 'Evaluated'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={[
                'px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer',
                filter === tab
                  ? 'bg-[--color-surface] text-[--color-accent] font-semibold shadow-xs border border-[--color-border]'
                  : 'text-[--color-text-secondary] hover:text-[--color-text-primary]',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List Cards */}
      <div className="space-y-4">
        {submissions.length > 0 ? (
          submissions.map((t) => {
            const isEvaluated = t.submission?.status === 'EVALUATED';

            return (
              <div
                key={t.id}
                className="card-base p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:border-[--color-border-strong]"
              >
                <div className="space-y-3 flex-1 min-w-0">
                  {/* Header Row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[--color-accent] bg-[--color-accent-bg] px-2 py-0.5 rounded border border-[--color-accent-border]">
                      {t.submissionId || '#042'}
                    </span>
                    <Badge variant="brand" size="sm">
                      {t.track}
                    </Badge>
                    <span className="text-sm font-bold text-[--color-text-primary]">{t.name}</span>
                    <span className="text-xs text-[--color-text-secondary] font-mono">
                      ({t.projectName})
                    </span>
                  </div>

                  {/* Problem & Solution Description */}
                  <p className="text-xs text-[--color-text-primary] font-medium leading-relaxed">
                    {t.problem ? `Problem: ${t.problem}` : t.submission?.description}
                  </p>
                  {t.solution && (
                    <p className="text-xs text-[--color-text-secondary] leading-relaxed">
                      Solution: {t.solution}
                    </p>
                  )}

                  {/* Tech Stack Pills & Links */}
                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-[--color-border] flex-wrap text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-2xs font-mono text-[--color-text-placeholder] uppercase">Stack:</span>
                      {(t.techStack || ['React', 'Python', 'Supabase']).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-2xs font-mono bg-[--color-surface-2] border border-[--color-border] text-[--color-text-secondary]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {t.submission?.githubUrl && (
                        <a
                          href={t.submission.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[--color-text-secondary] hover:text-[--color-accent] font-mono text-xs"
                        >
                          <Github className="w-3.5 h-3.5" aria-hidden="true" />
                          Code
                        </a>
                      )}
                      {t.submission?.demoUrl && (
                        <a
                          href={t.submission.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[--color-accent] hover:underline font-mono text-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status & Evaluation Action Column */}
                <div className="flex flex-col items-end justify-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[--color-border]">
                  <Badge
                    variant={isEvaluated ? 'success' : 'warning'}
                    size="md"
                    icon={isEvaluated ? CheckCircle2 : Clock}
                  >
                    {isEvaluated ? `EVALUATED · ${t.scores?.totalWeightedScore}/10` : 'PENDING EVALUATION'}
                  </Badge>

                  <Button
                    variant={isEvaluated ? 'secondary' : 'primary'}
                    size="sm"
                    icon={ClipboardCheck}
                    onClick={() => navigate(`/judge/evaluation?id=${t.id}`)}
                  >
                    {isEvaluated ? 'View / Edit Evaluation' : 'Evaluate Project'}
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card-base p-12 text-center space-y-2">
            <ClipboardCheck className="w-10 h-10 text-[--color-text-placeholder] mx-auto" aria-hidden="true" />
            <h3 className="text-base font-semibold text-[--color-text-primary]">No Submissions Found</h3>
            <p className="text-xs text-[--color-text-secondary]">
              There are currently no projects matching the "{filter}" queue filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
