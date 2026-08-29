import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, Award, Layers } from 'lucide-react';

export function RoleSwitcher() {
  const { activeRole, switchDemoRole, toggleDemoMode, isDemoMode, ROLES, getDefaultRouteForRole } = useAuth();
  const navigate = useNavigate();

  const roleConfigs = [
    {
      id: ROLES.ORGANIZER,
      label: 'Organizer Command Center',
      icon: Shield,
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    },
    {
      id: ROLES.PARTICIPANT,
      label: 'Participant Dashboard',
      icon: User,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: ROLES.JUDGE,
      label: 'Judge Portal',
      icon: Award,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
  ];

  const handleRoleSelect = (roleId) => {
    if (!isDemoMode) {
      toggleDemoMode(); // Enable demo mode when selecting role switcher
    }
    switchDemoRole(roleId);
    navigate(getDefaultRouteForRole(roleId));
  };

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
      <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-slate-400 text-xs font-semibold uppercase tracking-wider">
        <Layers className="w-3.5 h-3.5 text-indigo-400" />
        <span>Demo:</span>
      </div>
      <div className="flex items-center gap-1">
        {roleConfigs.map((role) => {
          const Icon = role.icon;
          const isActive = activeRole === role.id;

          return (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                isActive
                  ? `${role.badgeColor} border font-semibold shadow-sm`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
              title={`Switch view to ${role.label}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{role.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
