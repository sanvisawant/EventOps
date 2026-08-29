import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MOCK_SUPPORT_TICKETS } from '../../data/mockData';
import { supportService } from '../../services/support/supportService';
import { LifeBuoy, CheckCircle, Clock } from 'lucide-react';

export function SupportQueuePage() {
  const [tickets, setTickets] = useState(MOCK_SUPPORT_TICKETS);

  const handleUpdateStatus = async (id, status) => {
    await supportService.updateTicketStatus(id, status);
    const updated = await supportService.getTickets();
    setTickets([...updated]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Participant HelpDesk & Support Queue
        </h1>
        <p className="text-sm text-slate-400">
          Monitor and resolve technical, venue, and infrastructure requests raised by participants.
        </p>
      </div>

      <div className="space-y-4">
        {tickets.map((tkt) => (
          <Card key={tkt.id} className="border-l-4 border-l-indigo-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      tkt.priority === 'HIGH'
                        ? 'danger'
                        : tkt.priority === 'MEDIUM'
                        ? 'warning'
                        : 'info'
                    }
                  >
                    {tkt.priority} PRIORITY
                  </Badge>
                  <Badge variant="neutral">{tkt.category}</Badge>
                  <span className="text-xs font-mono text-slate-500">{tkt.timeAgo}</span>
                </div>
                <h3 className="text-base font-bold text-slate-100">{tkt.title}</h3>
                <p className="text-xs text-slate-400">Submitted by: {tkt.submittedBy}</p>
              </div>

              <div className="flex items-center gap-2">
                {tkt.status !== 'RESOLVED' ? (
                  <Button
                    size="sm"
                    variant="primary"
                    icon={CheckCircle}
                    onClick={() => handleUpdateStatus(tkt.id, 'RESOLVED')}
                  >
                    Mark Resolved
                  </Button>
                ) : (
                  <Badge variant="success" size="lg">
                    RESOLVED
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
