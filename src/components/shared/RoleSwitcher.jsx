import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, Award } from 'lucide-react';

const ROLE_CONFIGS = [
  { id: 'ORGANIZER', label: 'Organizer', icon: Shield },
  { id: 'PARTICIPANT', label: 'Participant', icon: User },
  { id: 'JUDGE', label: 'Judge', icon: Award },
];

export function RoleSwitcher() {
  const { activeRole, switchDemoRole, toggleDemoMode, isDemoMode, ROLES, getDefaultRouteForRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (roleId) => {
    if (!isDemoMode) toggleDemoMode();
    switchDemoRole(roleId);
    navigate(getDefaultRouteForRole(roleId));
  };

  return (
    <div
      className="flex items-center gap-1 px-1 py-1 rounded-md bg-[--color-surface-2] border border-[--color-border]"
      role="group"
      aria-label="Switch demo role"
    >
      <span className="hidden sm:block text-xs text-[--color-text-placeholder] pr-1 pl-1">Demo:</span>
      {ROLE_CONFIGS.map((role) => {
        const Icon = role.icon;
        const isActive = activeRole === role.id;
        return (
          <button
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            title={`View as ${role.label}`}
            aria-pressed={isActive}
            className={[
              'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
              isActive
                ? 'bg-[--color-surface] text-[--color-text-primary] shadow-sm border border-[--color-border]'
                : 'text-[--color-text-secondary] hover:text-[--color-text-primary] hover:bg-[--color-surface]',
            ].join(' ')}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="hidden md:inline">{role.label}</span>
            <span className="md:hidden">{role.id[0]}</span>
          </button>
        );
      })}
    </div>
  );
}
