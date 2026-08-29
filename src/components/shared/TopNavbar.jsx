import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { RoleSwitcher } from './RoleSwitcher';
import { Sun, Moon, LogOut, Activity } from 'lucide-react';

export function TopNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { activeUser, activeRole, isAuthenticated, logout } = useAuth();

  return (
    <header className="h-14 bg-[--color-surface] border-b border-[--color-border] sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[--color-accent]" aria-hidden="true" />
          <span className="font-bold text-[--color-text-primary] tracking-tight">EVENTOPS</span>
        </div>
        <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-[--color-text-secondary] border-l border-[--color-border] pl-3">
          <span className="live-dot" aria-hidden="true" />
          <span>Live</span>
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <RoleSwitcher />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-[--color-text-secondary] hover:text-[--color-text-primary] hover:bg-[--color-surface-2] transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark'
            ? <Sun className="w-4 h-4" />
            : <Moon className="w-4 h-4" />
          }
        </button>

        {/* Divider + User */}
        <div className="flex items-center gap-2 pl-2 border-l border-[--color-border]">
          <div
            className="w-7 h-7 rounded-full bg-[--color-accent-bg] border border-[--color-accent-border] flex items-center justify-center text-xs font-semibold text-[--color-accent]"
            aria-hidden="true"
          >
            {activeUser?.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-[--color-text-primary] leading-none">{activeUser?.name || 'User'}</p>
            <p className="text-2xs text-[--color-text-secondary] mt-0.5 uppercase tracking-wide font-mono">{activeRole}</p>
          </div>
          {isAuthenticated && (
            <button
              onClick={logout}
              className="p-1.5 rounded text-[--color-text-secondary] hover:text-[--color-danger] hover:bg-[--color-surface-2] transition-colors ml-0.5"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
