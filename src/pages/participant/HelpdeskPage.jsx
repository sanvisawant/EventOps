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

    const newTkt = await supportService.createTicket({
      title,
      category,
      priority,
      submittedBy: activeUser.name,
    });

    const updated = await supportService.getTickets();
    setTickets([...updated]);
    setSuccessMsg(`Ticket #${newTkt.id} dispatched to Organizer Command Desk!`);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <LifeBuoy className="w-6 h-6 text-indigo-400" />
          Participant Support & Issue Submission
        </h1>
        <p className="text-sm text-slate-400">
          Request Wi-Fi assistance, power strips, mentorship, or hardware troubleshooting directly from organizers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Submission Form */}
        <Card title="Submit Support Request" subtitle="Dispatches to live organizer queue" className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Issue Summary"
              placeholder="e.g. Wi-Fi disconnects in Lab 3"
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
              label="Priority Level"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { label: 'HIGH (Urgent Blocker)', value: 'HIGH' },
                { label: 'MEDIUM (Normal Request)', value: 'MEDIUM' },
                { label: 'LOW (General Question)', value: 'LOW' },
              ]}
            />

            <Button type="submit" variant="primary" className="w-full" icon={Send}>
              Dispatch Ticket
            </Button>

            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}
          </form>
        </Card>

        {/* Existing Support Requests */}
        <Card title="Your Ticket Status Queue" subtitle="Updates live as organizers resolve issues" className="lg:col-span-2">
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={t.priority === 'HIGH' ? 'danger' : 'warning'}>{t.priority}</Badge>
                    <Badge variant="neutral">{t.category}</Badge>
                    <span className="text-xs font-mono text-slate-500">{t.timeAgo}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{t.title}</h4>
                </div>
                <Badge variant={t.status === 'RESOLVED' ? 'success' : 'brand'}>{t.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
