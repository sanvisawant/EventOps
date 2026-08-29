import React from 'react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UnauthorizedPage({ requiredRole, currentRole }) {
  const { activeRole, getDefaultRouteForRole } = useAuth();
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate(getDefaultRouteForRole(activeRole || currentRole));
  };

  return (
    <div className="min-h-screen bg-[--color-bg] flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-[--color-danger-bg] border border-[--color-danger-border] flex items-center justify-center mx-auto">
          <Lock className="w-5 h-5 text-[--color-danger]" aria-hidden="true" />
        </div>

        <div>
          <p className="text-xs font-mono font-semibold text-[--color-danger] mb-2">403 — Access Denied</p>
          <h1 className="text-xl font-semibold text-[--color-text-primary] tracking-tight">
            You don't have permission to view this page
          </h1>
          <p className="text-sm text-[--color-text-secondary] mt-2 leading-relaxed">
            Your role{' '}
            <span className="font-mono font-semibold text-[--color-text-primary]">
              {currentRole || activeRole}
            </span>
            {' '}cannot access this area.
            {requiredRole && (
              <> Required: <span className="font-mono font-semibold text-[--color-warning]">{requiredRole}</span>.</>
            )}
          </p>
        </div>

        <Button variant="primary" icon={ArrowLeft} onClick={handleReturnHome}>
          Go to your dashboard
        </Button>
      </div>
    </div>
  );
}
