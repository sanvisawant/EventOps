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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Assigned Submissions Queue
        </h1>
        <p className="text-sm text-slate-400">
          Review candidate codebases, live demos, and project summaries.
        </p>
      </div>

      <div className="space-y-4">
        {submissions.map((t) => (
          <Card key={t.id} className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="brand">{t.track}</Badge>
                  <span className="text-xs font-mono text-indigo-400">{t.name}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">{t.submission.description}</h3>
                <div className="flex items-center gap-4 text-xs">
                  <a
                    href={t.submission.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-indigo-400 flex items-center gap-1 font-mono"
                  >
                    <Github className="w-4 h-4" />
                    GitHub Repo
                  </a>
                  {t.submission.demoUrl && (
                    <a
                      href={t.submission.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>

              <div>
                <Link to="/judge/evaluation">
                  <Button variant="primary" icon={ClipboardCheck}>
                    Evaluate Project
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
