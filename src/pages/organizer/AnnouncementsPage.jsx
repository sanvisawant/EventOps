import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { announcementService } from '../../services/announcements/announcementService';
import { Megaphone, Send } from 'lucide-react';

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('IMPORTANT');
  const [targetRole, setTargetRole] = useState('ALL');

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    await announcementService.publishAnnouncement({
      title,
      message,
      priority,
      targetRole,
    });

    const updated = await announcementService.getAnnouncements();
    setAnnouncements([...updated]);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Broadcast Announcement Center
        </h1>
        <p className="text-sm text-slate-400">
          Push real-time notifications to participant feeds, judges, or venue screens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Publish Announcement Form */}
        <Card title="New Broadcast Message" subtitle="Target all or specific roles" className="lg:col-span-1">
          <form onSubmit={handlePublish} className="space-y-4">
            <Input
              label="Announcement Title"
              placeholder="e.g. Mentor Office Hours starting in Lab 204"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              icon={Megaphone}
            />

            <Select
              label="Priority Level"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { label: 'CRITICAL (High Urgency)', value: 'CRITICAL' },
                { label: 'IMPORTANT (General Notice)', value: 'IMPORTANT' },
                { label: 'INFO (Schedule Update)', value: 'INFO' },
              ]}
            />

            <Select
              label="Audience Scope"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              options={[
                { label: 'All Event Attendees (Broadcast)', value: 'ALL' },
                { label: 'Participants Only', value: 'PARTICIPANT' },
                { label: 'Judges Only', value: 'JUDGE' },
              ]}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Message Body
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-100 text-sm p-3 font-sans"
                placeholder="Enter complete announcement details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" icon={Send}>
              Broadcast Message Now
            </Button>
          </form>
        </Card>

        {/* Live Broadcast Feed */}
        <Card title="Published Announcements History" subtitle="Live feed visible across user dashboards" className="lg:col-span-2">
          <div className="space-y-4">
            {announcements.map((anc) => (
              <div key={anc.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={anc.priority === 'CRITICAL' ? 'danger' : 'brand'}>
                      {anc.priority}
                    </Badge>
                    <Badge variant="neutral">Target: {anc.targetRole}</Badge>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {new Date(anc.publishedAt).toLocaleTimeString()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100">{anc.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{anc.message}</p>
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-900 font-mono">
                  By: {anc.author}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
