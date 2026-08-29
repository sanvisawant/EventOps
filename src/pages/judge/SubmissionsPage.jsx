import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MOCK_TEAMS } from '../../data/mockData';
import { Github, ExternalLink, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SubmissionsPage() {
  const submissions = MOCK_TEAMS.filter((t) => t.submission);

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-8">
      <div>
        <h1 className="text-lg font-semibold text-[--color-text-primary]">Submissions</h1>
        <p className="text-sm text-[--color-text-secondary] mt-0.5">
          Review codebases, demos, and project summaries.
        </p>
      </div>

      <div className="space-y-3">
        {submissions.map((t) => (
          <div key={t.id} className="card-base p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="brand" size="sm">{t.track}</Badge>
                <span className="text-xs font-mono text-[--color-text-secondary]">{t.name}</span>
              </div>
              <p className="text-sm font-semibold text-[--color-text-primary]">{t.submission.description}</p>
              <div className="flex items-center gap-4 text-xs">
                <a
                  href={t.submission.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[--color-text-secondary] hover:text-[--color-accent] transition-colors font-mono"
                >
                  <Github className="w-3.5 h-3.5" />
                  Code
                </a>
                {t.submission.demoUrl && (
                  <a
                    href={t.submission.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[--color-accent] hover:underline font-mono"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Demo
                  </a>
                )}
              </div>
            </div>
            <Link to="/judge/evaluation">
              <Button variant="primary" size="sm" icon={ClipboardCheck}>Evaluate</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
