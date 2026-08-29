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
  Settings,
  ChevronRight,
} from 'lucide-react';

const NAV_GROUPS = {
  ORGANIZER: [
    {
      label: 'Overview',
      items: [
        { to: '/organizer', label: 'Command Center', icon: LayoutDashboard, exact: true },
      ],
    },
    {
      label: 'Event',
      items: [
        { to: '/organizer/checkin', label: 'Check-in', icon: QrCode },
        { to: '/organizer/support', label: 'Support', icon: LifeBuoy, badge: '3' },
        { to: '/organizer/announcements', label: 'Announcements', icon: Megaphone },
      ],
    },
    {
      label: 'Evaluation',
      items: [
        { to: '/organizer/leaderboard', label: 'Leaderboard', icon: Trophy },
      ],
    },
    {
      label: 'Monitoring',
      items: [
        { to: '/organizer/health', label: 'System Health', icon: Activity },
      ],
    },
  ],
  PARTICIPANT: [
    {
      label: 'Overview',
      items: [
        { to: '/participant', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { to: '/participant/pass', label: 'Event Pass', icon: QrCode },
      ],
    },
    {
      label: 'Event',
      items: [
        { to: '/participant/schedule', label: 'Schedule', icon: Calendar },
        { to: '/participant/matchmaking', label: 'Team Matching', icon: Sparkles },
        { to: '/participant/announcements', label: 'Announcements', icon: Megaphone },
      ],
    },
    {
      label: 'Support',
      items: [
        { to: '/participant/helpdesk', label: 'Help Desk', icon: LifeBuoy },
        { to: '/participant/leaderboard', label: 'Leaderboard', icon: Trophy },
      ],
    },
  ],
  JUDGE: [
    {
      label: 'Overview',
      items: [
        { to: '/judge', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      ],
    },
    {
      label: 'Evaluation',
      items: [
        { to: '/judge/submissions', label: 'Submissions', icon: FileCheck },
        { to: '/judge/evaluation', label: 'Evaluate', icon: ClipboardCheck },
        { to: '/judge/leaderboard', label: 'Standings', icon: Award },
      ],
    },
  ],
};

export function SidebarNav() {
  const { activeRole } = useRole();
  const groups = NAV_GROUPS[activeRole] || NAV_GROUPS.PARTICIPANT;

  return (
    <aside className="w-52 bg-[--color-surface] border-r border-[--color-border] shrink-0 flex flex-col min-h-[calc(100vh-3.5rem)]">
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto" aria-label="Main navigation">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-2 mb-1.5 text-2xs font-semibold uppercase tracking-widest text-[--color-text-placeholder]">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.exact}
                      className={({ isActive }) =>
                        [
                          'flex items-center justify-between px-2.5 py-2 rounded-md text-sm transition-colors group',
                          isActive
                            ? 'bg-[--color-accent-bg] text-[--color-accent] font-medium'
                            : 'text-[--color-text-secondary] hover:text-[--color-text-primary] hover:bg-[--color-surface-2]',
                        ].join(' ')
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-2xs font-mono font-semibold px-1.5 py-0.5 rounded bg-[--color-danger-bg] text-[--color-danger] border border-[--color-danger-border]">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-[--color-border]">
        <p className="text-2xs text-[--color-text-placeholder] font-mono text-center">v1.0 · main</p>
      </div>
    </aside>
  );
}
