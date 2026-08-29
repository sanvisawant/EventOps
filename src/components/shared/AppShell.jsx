import React from 'react';
import { TopNavbar } from './TopNavbar';
import { SidebarNav } from './SidebarNav';

export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <SidebarNav />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
