import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleSwitcher } from './RoleSwitcher';
import { Activity, Clock, ShieldCheck, Wifi, LogOut, User } from 'lucide-react';
import { MOCK_EVENT } from '../../data/mockData';

export function TopNavbar() {
  const { activeUser, activeRole, isAuthenticated, isDemoMode, logout } = useAuth();
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Brand & Event Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-100 text-lg tracking-tight font-mono">
                EVENTOPS
              </span>
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                isDemoMode
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? 'bg-amber-400' : 'bg-emerald-400'} animate-ping`} />
                {isDemoMode ? 'DEMO MODE' : 'AUTHENTICATED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              {MOCK_EVENT.name}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Telemetry Clock */}
      <div className="hidden lg:flex items-center gap-4 px-3 py-1 bg-slate-950/80 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-1.5 text-indigo-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeString || '14:46:24'} UTC+5:30</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Wifi className="w-3.5 h-3.5" />
          <span>Cloud Run Active</span>
        </div>
      </div>

      {/* Right Controls & Role Switcher */}
      <div className="flex items-center gap-3">
        <RoleSwitcher />

        {/* User Info & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-200">
            {activeUser.name ? activeUser.name.charAt(0) : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200">{activeUser.name}</div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              {activeRole}
            </div>
          </div>
          {isAuthenticated && (
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors ml-1"
              title="Sign Out of Session"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
