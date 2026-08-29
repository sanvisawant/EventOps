import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { Megaphone } from 'lucide-react';

export function ParticipantAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-indigo-400" />
          Event Broadcast Feed
        </h1>
        <p className="text-sm text-slate-400">
          Official real-time updates and emergency notifications from the Event Command Desk.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_ANNOUNCEMENTS.map((anc) => (
          <Card key={anc.id} className="border-l-4 border-l-indigo-500">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={anc.priority === 'CRITICAL' ? 'danger' : 'brand'}>
                  {anc.priority}
                </Badge>
                <span className="text-xs font-mono text-slate-500">
                  {new Date(anc.publishedAt).toLocaleTimeString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">{anc.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{anc.message}</p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-800 font-mono">
                Author: {anc.author}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
