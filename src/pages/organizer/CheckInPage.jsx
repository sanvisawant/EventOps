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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Live QR Check-In & Gate Verification
          </h1>
          <p className="text-sm text-slate-400">
            Scan attendee passes or manually verify registrations. Duplicate entry attempts are blocked automatically.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Terminal Card */}
        <Card title="Gate Scanner Console" subtitle="Enter or scan QR code string" className="lg:col-span-1">
          <form onSubmit={handleScanSubmit} className="space-y-4">
            <Input
              label="Scanned QR Pass Code"
              placeholder="e.g. EVTOPS-PASS-AARAV-7821"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              icon={QrCode}
              autoFocus
            />

            <Button type="submit" variant="primary" className="w-full" icon={ShieldCheck}>
              Process Check-In
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

        {/* Registered Participants Verification Table */}
        <Card title="Registered Participants Directory" subtitle="Search and verify status" className="lg:col-span-2">
          <div className="mb-4">
            <Input
              placeholder="Search by name, email or QR pass ID..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">QR Token</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {filteredParticipants.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-semibold text-slate-200">
                      <div>{usr.name}</div>
                      <div className="text-[11px] text-slate-500 font-sans">{usr.email}</div>
                    </td>
                    <td className="px-4 py-3 text-indigo-400">{usr.qrCode}</td>
                    <td className="px-4 py-3">
                      <Badge variant={usr.isCheckedIn ? 'success' : 'neutral'} size="sm">
                        {usr.isCheckedIn ? 'CHECKED IN' : 'NOT CHECKED IN'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setQrCode(usr.qrCode)}
                        icon={UserCheck}
                      >
                        Select Code
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
