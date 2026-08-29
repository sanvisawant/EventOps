import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RoleProvider, useRole } from './hooks/useRole';
import { AppShell } from './components/shared/AppShell';

// Pages
import { OrganizerDashboardPage } from './pages/organizer/OrganizerDashboardPage';
import { CheckInPage } from './pages/organizer/CheckInPage';
import { SupportQueuePage } from './pages/organizer/SupportQueuePage';
import { AnnouncementsPage } from './pages/organizer/AnnouncementsPage';
import { LeaderboardPage } from './pages/organizer/LeaderboardPage';
import { HealthPage } from './pages/organizer/HealthPage';

import { ParticipantDashboardPage } from './pages/participant/ParticipantDashboardPage';
import { EventPassPage } from './pages/participant/EventPassPage';
import { SchedulePage } from './pages/participant/SchedulePage';
import { MatchmakingPage } from './pages/participant/MatchmakingPage';
import { HelpdeskPage } from './pages/participant/HelpdeskPage';
import { ParticipantAnnouncementsPage } from './pages/participant/ParticipantAnnouncementsPage';
import { ParticipantLeaderboardPage } from './pages/participant/ParticipantLeaderboardPage';

import { JudgeDashboardPage } from './pages/judge/JudgeDashboardPage';
import { SubmissionsPage } from './pages/judge/SubmissionsPage';
import { EvaluationPage } from './pages/judge/EvaluationPage';
import { JudgeLeaderboardPage } from './pages/judge/JudgeLeaderboardPage';

import { LoginPage } from './pages/auth/LoginPage';
import { getDefaultRouteForRole } from './utils/permissions';

function RootRedirect() {
  const { activeRole } = useRole();
  return <Navigate to={getDefaultRouteForRole(activeRole)} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Organizer Routes */}
      <Route
        path="/organizer"
        element={
          <AppShell>
            <OrganizerDashboardPage />
          </AppShell>
        }
      />
      <Route
        path="/organizer/checkin"
        element={
          <AppShell>
            <CheckInPage />
          </AppShell>
        }
      />
      <Route
        path="/organizer/support"
        element={
          <AppShell>
            <SupportQueuePage />
          </AppShell>
        }
      />
      <Route
        path="/organizer/announcements"
        element={
          <AppShell>
            <AnnouncementsPage />
          </AppShell>
        }
      />
      <Route
        path="/organizer/leaderboard"
        element={
          <AppShell>
            <LeaderboardPage />
          </AppShell>
        }
      />
      <Route
        path="/organizer/health"
        element={
          <AppShell>
            <HealthPage />
          </AppShell>
        }
      />

      {/* Participant Routes */}
      <Route
        path="/participant"
        element={
          <AppShell>
            <ParticipantDashboardPage />
          </AppShell>
        }
      />
      <Route
        path="/participant/pass"
        element={
          <AppShell>
            <EventPassPage />
          </AppShell>
        }
      />
      <Route
        path="/participant/schedule"
        element={
          <AppShell>
            <SchedulePage />
          </AppShell>
        }
      />
      <Route
        path="/participant/matchmaking"
        element={
          <AppShell>
            <MatchmakingPage />
          </AppShell>
        }
      />
      <Route
        path="/participant/helpdesk"
        element={
          <AppShell>
            <HelpdeskPage />
          </AppShell>
        }
      />
      <Route
        path="/participant/announcements"
        element={
          <AppShell>
            <ParticipantAnnouncementsPage />
          </AppShell>
        }
      />
      <Route
        path="/participant/leaderboard"
        element={
          <AppShell>
            <ParticipantLeaderboardPage />
          </AppShell>
        }
      />

      {/* Judge Routes */}
      <Route
        path="/judge"
        element={
          <AppShell>
            <JudgeDashboardPage />
          </AppShell>
        }
      />
      <Route
        path="/judge/submissions"
        element={
          <AppShell>
            <SubmissionsPage />
          </AppShell>
        }
      />
      <Route
        path="/judge/evaluation"
        element={
          <AppShell>
            <EvaluationPage />
          </AppShell>
        }
      />
      <Route
        path="/judge/leaderboard"
        element={
          <AppShell>
            <JudgeLeaderboardPage />
          </AppShell>
        }
      />

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default function App() {
  return (
    <RoleProvider>
      <AppRoutes />
    </RoleProvider>
  );
}
