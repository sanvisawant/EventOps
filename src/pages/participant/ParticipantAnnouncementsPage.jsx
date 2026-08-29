import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';

export function ParticipantAnnouncementsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-8">
      <div>
        <h1 className="text-lg font-semibold text-[--color-text-primary]">Announcements</h1>
        <p className="text-sm text-[--color-text-secondary] mt-0.5">
          Real-time updates and notices from the organizer team.
        </p>
      </div>

      <div className="space-y-3">
        {MOCK_ANNOUNCEMENTS.map((anc) => (
          <div
            key={anc.id}
            className="card-base p-4 space-y-2 border-l-2 border-[--color-accent]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant={anc.priority === 'CRITICAL' ? 'danger' : anc.priority === 'IMPORTANT' ? 'warning' : 'info'}
                  size="sm"
                >
                  {anc.priority}
                </Badge>
              </div>
              <time className="text-xs font-mono text-[--color-text-placeholder]">
                {new Date(anc.publishedAt).toLocaleTimeString()}
              </time>
            </div>
            <p className="text-sm font-semibold text-[--color-text-primary]">{anc.title}</p>
            <p className="text-sm text-[--color-text-secondary] leading-relaxed">{anc.message}</p>
            <p className="text-xs text-[--color-text-placeholder] pt-2 border-t border-[--color-border] font-mono">
              {anc.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
