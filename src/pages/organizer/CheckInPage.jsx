import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { MOCK_CHECKIN_LOGS, MOCK_USERS } from '../../data/mockData';
import { checkinService } from '../../services/checkin/checkinService';
import { QrCode, Search, ShieldCheck, UserCheck } from 'lucide-react';

export function CheckInPage() {
  const [qrCode, setQrCode] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [logs, setLogs] = useState(MOCK_CHECKIN_LOGS);
  const [feedback, setFeedback] = useState(null);

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!qrCode.trim()) return;
    const res = await checkinService.processQrCheckIn(qrCode.trim(), 'Gate Scanner Alpha');
    setFeedback(res);
    if (res.success) {
      const updated = await checkinService.getCheckInLogs();
      setLogs(updated);
      setQrCode('');
    }
  };

  const filteredParticipants = MOCK_USERS.filter(
    (u) =>
      u.role === 'PARTICIPANT' &&
      (u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        u.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
        u.qrCode.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-8">
      <div>
        <h1 className="text-lg font-semibold text-[--color-text-primary]">Check-in</h1>
        <p className="text-sm text-[--color-text-secondary] mt-0.5">
          Scan attendee passes or manually verify registrations. Duplicate entries are blocked.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Scanner */}
        <Card title="QR Scanner" subtitle="Enter or paste a QR token" className="lg:col-span-1">
          <form onSubmit={handleScanSubmit} className="space-y-4">
            <Input
              label="QR pass code"
              placeholder="e.g. EVTOPS-PASS-7821"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              icon={QrCode}
              autoFocus
            />
            <Button type="submit" variant="primary" className="w-full" icon={ShieldCheck}>
              Check In
            </Button>
            {feedback && (
              <Alert
                variant={feedback.success ? 'success' : feedback.isDuplicate ? 'warning' : 'danger'}
                title={feedback.success ? 'Access Granted' : 'Scan Notice'}
              >
                {feedback.success ? feedback.message : feedback.error}
              </Alert>
            )}
          </form>
        </Card>

        {/* Participants directory */}
        <Card title="Participants" subtitle="Search and select a token to fill scanner" className="lg:col-span-2">
          <div className="mb-4">
            <Input
              placeholder="Search by name, email or token…"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              icon={Search}
            />
          </div>
          <div className="overflow-x-auto -mx-5 -mb-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[--color-border] bg-[--color-surface-2]">
                  {['Participant', 'Token', 'Status', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[--color-border]">
                {filteredParticipants.map((usr) => (
                  <tr key={usr.id} className="hover:bg-[--color-surface-2] transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-[--color-text-primary]">{usr.name}</p>
                      <p className="text-xs text-[--color-text-secondary]">{usr.email}</p>
                    </td>
                    <td className="px-5 py-3 text-xs font-mono text-[--color-accent]">{usr.qrCode}</td>
                    <td className="px-5 py-3">
                      <Badge variant={usr.isCheckedIn ? 'success' : 'neutral'} size="sm">
                        {usr.isCheckedIn ? 'Checked in' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Button size="sm" variant="secondary" onClick={() => setQrCode(usr.qrCode)} icon={UserCheck}>
                        Select
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
