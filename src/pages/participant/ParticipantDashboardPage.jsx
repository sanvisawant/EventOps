import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useRole } from '../../hooks/useRole';
import { MOCK_SCHEDULE, MOCK_ANNOUNCEMENTS, MOCK_TEAMS } from '../../data/mockData';
import { QrCode, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ParticipantDashboardPage() {
  const { activeUser } = useRole();
  const currentTeam = MOCK_TEAMS.find((t) => t.id === activeUser.teamId);

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-8">
      {/* Welcome header */}
      <div className="card-base p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="success">Checked in</Badge>
            <span className="text-xs font-mono text-[--color-text-secondary]">{activeUser.qrCode}</span>
          </div>
          <h1 className="text-xl font-semibold text-[--color-text-primary] tracking-tight">
            Welcome back, {activeUser.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-[--color-text-secondary] mt-0.5">
            Your event pass, team, and announcements — all in one place.
          </p>
        </div>
        <Link to="/participant/pass">
          <Button variant="primary" icon={QrCode}>View Pass</Button>
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pass preview */}
        <Card title="Event Pass" subtitle="Show at entry gates">
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-20 h-20 bg-white p-2 rounded-lg">
              <svg viewBox="0 0 100 100" className="w-full h-full text-gray-900" aria-label="QR Code">
                <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" fill="currentColor"/>
                <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" fill="currentColor"/>
                <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" fill="currentColor"/>
                <rect x="40" y="40" width="20" height="20" fill="currentColor"/>
                <rect x="20" y="40" width="10" height="10" fill="currentColor"/>
                <rect x="70" y="50" width="20" height="10" fill="currentColor"/>
                <rect x="50" y="70" width="20" height="20" fill="currentColor"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xs font-mono font-semibold text-[--color-accent]">{activeUser.qrCode}</p>
              <p className="text-xs text-[--color-text-secondary] mt-0.5">{activeUser.name}</p>
            </div>
          </div>
        </Card>

        {/* Team status */}
        <Card title="Team" subtitle="Your project group">
          {currentTeam ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="brand">{currentTeam.track}</Badge>
                <Badge variant="success">Complete</Badge>
              </div>
              <div>
                <p className="font-semibold text-[--color-text-primary]">{currentTeam.name}</p>
                <p className="text-xs text-[--color-text-secondary] mt-0.5">{currentTeam.tagline}</p>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-[--color-border] text-xs text-[--color-text-secondary]">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{currentTeam.members.length} members</span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center space-y-3">
              <Sparkles className="w-7 h-7 text-[--color-accent] mx-auto" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-[--color-text-primary]">No team yet</p>
                <p className="text-xs text-[--color-text-secondary] mt-0.5">Find teammates using smart matching.</p>
              </div>
              <Link to="/participant/matchmaking">
                <Button variant="primary" size="sm" icon={Sparkles}>Find Match</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Latest announcement */}
        <Card title="Announcements" subtitle="Latest organizer update">
          {MOCK_ANNOUNCEMENTS[0] ? (
            <div className="space-y-2">
              <Badge variant={MOCK_ANNOUNCEMENTS[0].priority === 'URGENT' ? 'danger' : 'warning'}>
                {MOCK_ANNOUNCEMENTS[0].priority}
              </Badge>
              <p className="text-sm font-medium text-[--color-text-primary]">{MOCK_ANNOUNCEMENTS[0].title}</p>
              <p className="text-xs text-[--color-text-secondary] line-clamp-3">{MOCK_ANNOUNCEMENTS[0].message}</p>
              <Link to="/participant/announcements" className="text-xs text-[--color-accent] hover:underline">
                View all
              </Link>
            </div>
          ) : (
            <p className="text-xs text-[--color-text-secondary]">No recent announcements.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
