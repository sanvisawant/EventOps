import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useRole } from '../../hooks/useRole';
import { Activity, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { switchRole, ROLES } = useRole();
  const navigate = useNavigate();
  const [role, setRole] = useState(ROLES.ORGANIZER);
  const [email, setEmail] = useState('sanvi.organizer@eventops.io');

  const handleLogin = (e) => {
    e.preventDefault();
    switchRole(role);
    if (role === ROLES.ORGANIZER) navigate('/organizer');
    else if (role === ROLES.JUDGE) navigate('/judge');
    else navigate('/participant');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
            EVENTOPS
          </h1>
          <p className="text-sm text-slate-400">
            The real-time operating system for live events.
          </p>
        </div>

        <Card title="Command Console Authentication" subtitle="Select demo role session">
          <form onSubmit={handleLogin} className="space-y-4">
            <Select
              label="Select Access Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { label: 'Organizer Command Director', value: ROLES.ORGANIZER },
                { label: 'Event Participant', value: ROLES.PARTICIPANT },
                { label: 'Evaluator / Judge', value: ROLES.JUDGE },
              ]}
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" variant="primary" className="w-full" icon={ShieldCheck}>
              Enter EVENTOPS Console
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
