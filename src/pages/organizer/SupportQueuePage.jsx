import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MOCK_SUPPORT_TICKETS } from '../../data/mockData';
import { supportService } from '../../services/support/supportService';
import { CheckCircle } from 'lucide-react';

export function SupportQueuePage() {
  const [tickets, setTickets] = useState(MOCK_SUPPORT_TICKETS);

  const handleUpdateStatus = async (id, status) => {
    await supportService.updateTicketStatus(id, status);
    const updated = await supportService.getTickets();
    setTickets([...updated]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-8">
      <div>
        <h1 className="text-lg font-semibold text-[--color-text-primary]">Support Queue</h1>
        <p className="text-sm text-[--color-text-secondary] mt-0.5">
          Review and resolve participant support requests.
        </p>
      </div>

      <div className="space-y-3">
        {tickets.map((tkt) => (
          <div
            key={tkt.id}
            className="card-base p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-2 border-[--color-accent]"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge
                  variant={tkt.priority === 'HIGH' ? 'danger' : tkt.priority === 'MEDIUM' ? 'warning' : 'info'}
                  size="sm"
                >
                  {tkt.priority}
                </Badge>
                <Badge variant="neutral" size="sm">{tkt.category}</Badge>
                <span className="text-xs font-mono text-[--color-text-placeholder]">{tkt.timeAgo}</span>
              </div>
              <p className="text-sm font-semibold text-[--color-text-primary]">{tkt.title}</p>
              <p className="text-xs text-[--color-text-secondary]">By {tkt.submittedBy}</p>
            </div>

            <div className="flex items-center gap-2">
              {tkt.status !== 'RESOLVED' ? (
                <Button
                  size="sm"
                  variant="secondary"
                  icon={CheckCircle}
                  onClick={() => handleUpdateStatus(tkt.id, 'RESOLVED')}
                >
                  Resolve
                </Button>
              ) : (
                <Badge variant="success">Resolved</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
