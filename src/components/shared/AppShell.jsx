import React from 'react';
import { TopNavbar } from './TopNavbar';
import { SidebarNav } from './SidebarNav';

export function AppShell({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[--color-bg]">
      <TopNavbar />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav />
        <main className="flex-1 overflow-y-auto p-6 bg-[--color-bg]">
          {children}
        </main>
      </div>
    </div>
  );
}
