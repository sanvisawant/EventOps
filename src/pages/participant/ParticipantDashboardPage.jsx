import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useRole } from '../../hooks/useRole';
import { MOCK_SCHEDULE, MOCK_ANNOUNCEMENTS, MOCK_TEAMS } from '../../data/mockData';
import { QrCode, Calendar, Sparkles, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ParticipantDashboardPage() {
  const { activeUser } = useRole();
  const currentTeam = MOCK_TEAMS.find((t) => t.id === activeUser.teamId);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="success">CHECKED IN</Badge>
            <span className="text-xs font-mono text-slate-400">Pass ID: {activeUser.qrCode}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Welcome back, {activeUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your personal live event operations dashboard. Access your QR pass, match with teams, or view schedule updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/participant/pass">
            <Button variant="primary" icon={QrCode}>
              View QR Pass
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pass Preview Card */}
        <Card title="Personal Event Pass" subtitle="Show at gate & food counters">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-3">
            <div className="w-24 h-24 mx-auto bg-white p-2 rounded-lg flex items-center justify-center">
              {/* SVG QR Code Simulation */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" fill="currentColor"/>
                <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" fill="currentColor"/>
                <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" fill="currentColor"/>
                <rect x="40" y="40" width="20" height="20" fill="currentColor"/>
                <rect x="20" y="40" width="10" height="10" fill="currentColor"/>
                <rect x="70" y="50" width="20" height="10" fill="currentColor"/>
                <rect x="50" y="70" width="20" height="20" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-mono text-indigo-400 font-bold">{activeUser.qrCode}</p>
              <p className="text-xs text-slate-400 mt-0.5">{activeUser.name}</p>
            </div>
          </div>
        </Card>

        {/* Team Status Card */}
        <Card title="Team Formation Status" subtitle="Smart matchmaking engine">
          {currentTeam ? (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="brand">{currentTeam.track}</Badge>
                <Badge variant="success">TEAM COMPLETED</Badge>
              </div>
              <h4 className="text-base font-bold text-slate-100">{currentTeam.name}</h4>
              <p className="text-xs text-slate-400">{currentTeam.tagline}</p>
              <div className="pt-2 text-xs text-slate-300 font-mono flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>{currentTeam.members.length} Members</span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
              <div>
                <p className="text-sm font-bold text-slate-200">Looking for a Team?</p>
                <p className="text-xs text-slate-400 mt-1">Use our AI compatibility algorithm to find teammates matching your skills.</p>
              </div>
              <Link to="/participant/matchmaking">
                <Button variant="primary" size="sm" icon={Sparkles}>
                  Find Match
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Latest Announcement */}
        <Card title="Latest Broadcast" subtitle="Live organizer notices">
          {MOCK_ANNOUNCEMENTS[0] ? (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <Badge variant="danger">{MOCK_ANNOUNCEMENTS[0].priority}</Badge>
              <h4 className="text-sm font-bold text-slate-100">{MOCK_ANNOUNCEMENTS[0].title}</h4>
              <p className="text-xs text-slate-300 line-clamp-3">{MOCK_ANNOUNCEMENTS[0].message}</p>
            </div>
          ) : (
            <div className="p-4 text-xs text-slate-400">No recent announcements.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
