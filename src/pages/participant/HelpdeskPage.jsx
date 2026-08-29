import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { useRole } from '../../hooks/useRole';
import { MOCK_SUPPORT_TICKETS } from '../../data/mockData';
import { supportService } from '../../services/support/supportService';
import { validateSupportTicket } from '../../utils/validation';
import { LifeBuoy, Send } from 'lucide-react';

export function HelpdeskPage() {
  const { activeUser } = useRole();
  const [tickets, setTickets] = useState(MOCK_SUPPORT_TICKETS);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [priority, setPriority] = useState('HIGH');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const validation = validateSupportTicket({ title, category, priority });
    if (!validation.isValid) {
      setErrorMsg(Object.values(validation.errors)[0]);
      return;
    }
    const newTkt = await supportService.createTicket({ title, category, priority, submittedBy: activeUser.name });
    const updated = await supportService.getTickets();
    setTickets([...updated]);
    setSuccessMsg(`Ticket #${newTkt.id} submitted. Organizer team notified.`);
    setTitle('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-8">
      <div>
        <h1 className="text-lg font-semibold text-[--color-text-primary]">Help Desk</h1>
        <p className="text-sm text-[--color-text-secondary] mt-0.5">
          Request Wi-Fi support, mentorship, hardware help, or general assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <Card title="New Ticket" subtitle="Sent directly to the organizer queue" className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Issue"
              placeholder="e.g. Wi-Fi drops in Lab 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              icon={LifeBuoy}
            />
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { label: 'Infrastructure & Wi-Fi', value: 'Infrastructure' },
                { label: 'Hardware & Power', value: 'Hardware' },
                { label: 'Mentorship & Tech Help', value: 'Mentorship' },
                { label: 'General Inquiry', value: 'General' },
              ]}
            />
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { label: 'High — urgent blocker', value: 'HIGH' },
                { label: 'Medium — normal request', value: 'MEDIUM' },
                { label: 'Low — general question', value: 'LOW' },
              ]}
            />
            <Button type="submit" variant="primary" className="w-full" icon={Send}>
              Submit Ticket
            </Button>
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}
          </form>
        </Card>

        {/* Ticket queue */}
        <Card title="Your Tickets" subtitle="Status updates in real time" className="lg:col-span-2">
          <div className="space-y-2">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 rounded-md border border-[--color-border] bg-[--color-surface-2]"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant={t.priority === 'HIGH' ? 'danger' : 'warning'} size="sm">{t.priority}</Badge>
                    <Badge variant="neutral" size="sm">{t.category}</Badge>
                    <span className="text-xs font-mono text-[--color-text-placeholder]">{t.timeAgo}</span>
                  </div>
                  <p className="text-sm font-medium text-[--color-text-primary]">{t.title}</p>
                </div>
                <Badge variant={t.status === 'RESOLVED' ? 'success' : 'brand'} size="sm">{t.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
