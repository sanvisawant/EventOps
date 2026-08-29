import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MOCK_SCHEDULE } from '../../data/mockData';
import { Calendar, Clock, MapPin } from 'lucide-react';

export function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-400" />
          Event Schedule & Agenda
        </h1>
        <p className="text-sm text-slate-400">
          Official timeline of keynote sessions, hacking sprints, support windows, and judging.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_SCHEDULE.map((item) => (
          <Card key={item.id} className="relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center shrink-0 w-24">
                  <Clock className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                  <span className="text-xs font-mono font-bold text-slate-200">{item.time}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === 'COMPLETED' ? 'success' : item.status === 'IN_PROGRESS' ? 'warning' : 'neutral'}>
                      {item.status}
                    </Badge>
                    <Badge variant="brand">{item.category}</Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{item.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
