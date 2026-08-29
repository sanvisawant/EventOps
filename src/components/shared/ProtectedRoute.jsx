import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UnauthorizedPage } from '../../pages/auth/UnauthorizedPage';
import { Activity } from 'lucide-react';

export function ProtectedRoute({ allowedRoles = [], children }) {
  const { isAuthenticated, activeRole, isDemoMode, isLoading } = useAuth();

  // 1. Session Restoration Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[--color-bg] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-lg bg-[--color-accent] flex items-center justify-center animate-pulse">
          <Activity className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <p className="text-sm text-[--color-text-secondary]">Verifying session…</p>
      </div>
    );
  }

  // 2. Demo Mode Authorization Check
  if (isDemoMode) {
    if (allowedRoles.length > 0 && !allowedRoles.includes(activeRole)) {
      return <UnauthorizedPage requiredRole={allowedRoles[0]} currentRole={activeRole} />;
    }
    return children;
  }

  // 3. Authenticated Mode Check
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 4. Role Privilege Check
  if (allowedRoles.length > 0 && !allowedRoles.includes(activeRole)) {
    return <UnauthorizedPage requiredRole={allowedRoles[0]} currentRole={activeRole} />;
  }

  return children;
}
