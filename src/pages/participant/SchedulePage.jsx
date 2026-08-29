import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MOCK_SCHEDULE } from '../../data/mockData';
import { Clock, MapPin } from 'lucide-react';

export function SchedulePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-8">
      <div>
        <h1 className="text-lg font-semibold text-[--color-text-primary]">Schedule</h1>
        <p className="text-sm text-[--color-text-secondary] mt-0.5">
          Official timeline of sessions, sprints, and judging.
        </p>
      </div>

      <div className="space-y-3">
        {MOCK_SCHEDULE.map((item) => (
          <div key={item.id} className="card-base p-4 flex items-start gap-4">
            <div className="flex flex-col items-center justify-center rounded-md bg-[--color-surface-2] border border-[--color-border] p-2.5 w-20 shrink-0 text-center">
              <Clock className="w-3.5 h-3.5 text-[--color-text-secondary] mb-1" aria-hidden="true" />
              <span className="text-xs font-mono font-semibold text-[--color-text-primary]">{item.time}</span>
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge
                  variant={item.status === 'COMPLETED' ? 'success' : item.status === 'IN_PROGRESS' ? 'warning' : 'neutral'}
                  size="sm"
                >
                  {item.status.replace('_', ' ')}
                </Badge>
                <Badge variant="brand" size="sm">{item.category}</Badge>
              </div>
              <p className="text-sm font-semibold text-[--color-text-primary]">{item.title}</p>
              <div className="flex items-center gap-1 text-xs text-[--color-text-secondary]">
                <MapPin className="w-3 h-3 text-[--color-text-placeholder]" aria-hidden="true" />
                <span>{item.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
