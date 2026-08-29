import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import {
  LayoutDashboard,
  QrCode,
  LifeBuoy,
  Megaphone,
  Trophy,
  Activity,
  Users,
  Calendar,
  Sparkles,
  ClipboardCheck,
  Award,
  FileCheck,
} from 'lucide-react';

export function SidebarNav() {
  const { activeRole, ROLES } = useRole();

  const navs = {
    [ROLES.ORGANIZER]: [
      { to: '/organizer', label: 'Command Center', icon: LayoutDashboard, exact: true },
      { to: '/organizer/checkin', label: 'QR Scanner & Gate', icon: QrCode },
      { to: '/organizer/support', label: 'Support Queue', icon: LifeBuoy, badge: '3' },
      { to: '/organizer/announcements', label: 'Broadcast Center', icon: Megaphone },
      { to: '/organizer/leaderboard', label: 'Live Leaderboard', icon: Trophy },
      { to: '/organizer/health', label: 'System Health', icon: Activity },
    ],
    [ROLES.PARTICIPANT]: [
      { to: '/participant', label: 'Participant Home', icon: LayoutDashboard, exact: true },
      { to: '/participant/pass', label: 'My Event Pass', icon: QrCode },
      { to: '/participant/schedule', label: 'Event Schedule', icon: Calendar },
      { to: '/participant/matchmaking', label: 'Team Matchmaking', icon: Sparkles, badge: 'AI' },
      { to: '/participant/helpdesk', label: 'Support & HelpDesk', icon: LifeBuoy },
      { to: '/participant/announcements', label: 'Announcements', icon: Megaphone },
      { to: '/participant/leaderboard', label: 'Live Leaderboard', icon: Trophy },
    ],
    [ROLES.JUDGE]: [
      { to: '/judge', label: 'Judge Command', icon: LayoutDashboard, exact: true },
      { to: '/judge/submissions', label: 'Assigned Submissions', icon: FileCheck, badge: '3' },
      { to: '/judge/evaluation', label: 'Rubric Evaluator', icon: ClipboardCheck },
      { to: '/judge/leaderboard', label: 'Evaluation Standings', icon: Award },
    ],
  };

  const currentNav = navs[activeRole] || navs[ROLES.PARTICIPANT];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="mb-4 px-2 py-1.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
          Navigation Mode
        </span>
        <div className="text-xs font-bold text-indigo-400 capitalize">
          {activeRole.toLowerCase()} View
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {currentNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 px-2 space-y-1">
        <div className="flex justify-between font-mono">
          <span>Version</span>
          <span className="text-slate-300">v1.0.0-foundation</span>
        </div>
        <div className="flex justify-between font-mono">
          <span>Cloud Run</span>
          <span className="text-emerald-400">Ready</span>
        </div>
      </div>
    </aside>
  );
}
