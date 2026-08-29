import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { AppShell } from './components/shared/AppShell';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { UnauthorizedPage } from './pages/auth/UnauthorizedPage';

// Organizer Pages
import { OrganizerDashboardPage } from './pages/organizer/OrganizerDashboardPage';
import { CheckInPage } from './pages/organizer/CheckInPage';
import { SupportQueuePage } from './pages/organizer/SupportQueuePage';
import { AnnouncementsPage } from './pages/organizer/AnnouncementsPage';
import { LeaderboardPage } from './pages/organizer/LeaderboardPage';
import { HealthPage } from './pages/organizer/HealthPage';

// Participant Pages
import { ParticipantDashboardPage } from './pages/participant/ParticipantDashboardPage';
import { EventPassPage } from './pages/participant/EventPassPage';
import { SchedulePage } from './pages/participant/SchedulePage';
import { MatchmakingPage } from './pages/participant/MatchmakingPage';
import { HelpdeskPage } from './pages/participant/HelpdeskPage';
import { ParticipantAnnouncementsPage } from './pages/participant/ParticipantAnnouncementsPage';
import { ParticipantLeaderboardPage } from './pages/participant/ParticipantLeaderboardPage';

// Judge Pages
import { JudgeDashboardPage } from './pages/judge/JudgeDashboardPage';
import { SubmissionsPage } from './pages/judge/SubmissionsPage';
import { EvaluationPage } from './pages/judge/EvaluationPage';
import { JudgeLeaderboardPage } from './pages/judge/JudgeLeaderboardPage';

function RootRedirect() {
  const { isAuthenticated, isDemoMode, activeRole, getDefaultRouteForRole } = useAuth();
  if (!isAuthenticated && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={getDefaultRouteForRole(activeRole)} replace />;
}

export function AppRoutes() {
  const { ROLES } = useAuth();

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Organizer Routes */}
      <Route
        path="/organizer"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
            <AppShell>
              <OrganizerDashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/checkin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
            <AppShell>
              <CheckInPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/support"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
            <AppShell>
              <SupportQueuePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/announcements"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
            <AppShell>
              <AnnouncementsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/leaderboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
            <AppShell>
              <LeaderboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/health"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
            <AppShell>
              <HealthPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Protected Participant Routes */}
      <Route
        path="/participant"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PARTICIPANT]}>
            <AppShell>
              <ParticipantDashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/participant/pass"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PARTICIPANT]}>
            <AppShell>
              <EventPassPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/participant/schedule"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PARTICIPANT]}>
            <AppShell>
              <SchedulePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/participant/matchmaking"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PARTICIPANT]}>
            <AppShell>
              <MatchmakingPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/participant/helpdesk"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PARTICIPANT]}>
            <AppShell>
              <HelpdeskPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/participant/announcements"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PARTICIPANT]}>
            <AppShell>
              <ParticipantAnnouncementsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/participant/leaderboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PARTICIPANT]}>
            <AppShell>
              <ParticipantLeaderboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Protected Judge Routes */}
      <Route
        path="/judge"
        element={
          <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
            <AppShell>
              <JudgeDashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/judge/submissions"
        element={
          <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
            <AppShell>
              <SubmissionsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/judge/evaluation"
        element={
          <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
            <AppShell>
              <EvaluationPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/judge/leaderboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
            <AppShell>
              <JudgeLeaderboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
