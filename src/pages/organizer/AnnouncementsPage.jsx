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
    await announcementService.publishAnnouncement({ title, message, priority, targetRole });
    const updated = await announcementService.getAnnouncements();
    setAnnouncements([...updated]);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-8">
      <div>
        <h1 className="text-lg font-semibold text-[--color-text-primary]">Announcements</h1>
        <p className="text-sm text-[--color-text-secondary] mt-0.5">
          Publish notices to participants, judges, or all attendees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Compose form */}
        <Card title="New Announcement" subtitle="Target a specific audience" className="lg:col-span-1">
          <form onSubmit={handlePublish} className="space-y-4">
            <Input
              label="Title"
              placeholder="e.g. Mentor office hours open"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              icon={Megaphone}
            />
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { label: 'Critical — high urgency', value: 'CRITICAL' },
                { label: 'Important — general notice', value: 'IMPORTANT' },
                { label: 'Info — schedule update', value: 'INFO' },
              ]}
            />
            <Select
              label="Audience"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              options={[
                { label: 'All attendees', value: 'ALL' },
                { label: 'Participants only', value: 'PARTICIPANT' },
                { label: 'Judges only', value: 'JUDGE' },
              ]}
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[--color-text-secondary]">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full rounded-md bg-[--color-surface-2] border border-[--color-border] text-[--color-text-primary] text-sm p-3 placeholder:text-[--color-text-placeholder] focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:border-transparent transition-colors resize-y"
                placeholder="Enter full announcement text…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" className="w-full" icon={Send}>
              Publish
            </Button>
          </form>
        </Card>

        {/* History */}
        <Card title="Published" subtitle="Announcement history" className="lg:col-span-2">
          <div className="space-y-3">
            {announcements.map((anc) => (
              <div
                key={anc.id}
                className="p-4 rounded-md border border-[--color-border] bg-[--color-surface-2] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={anc.priority === 'CRITICAL' ? 'danger' : anc.priority === 'IMPORTANT' ? 'warning' : 'info'} size="sm">
                      {anc.priority}
                    </Badge>
                    <Badge variant="neutral" size="sm">{anc.targetRole}</Badge>
                  </div>
                  <time className="text-xs font-mono text-[--color-text-placeholder]">
                    {new Date(anc.publishedAt).toLocaleTimeString()}
                  </time>
                </div>
                <p className="text-sm font-semibold text-[--color-text-primary]">{anc.title}</p>
                <p className="text-sm text-[--color-text-secondary] leading-relaxed">{anc.message}</p>
                <p className="text-xs text-[--color-text-placeholder] pt-1.5 border-t border-[--color-border] font-mono">
                  By {anc.author}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
