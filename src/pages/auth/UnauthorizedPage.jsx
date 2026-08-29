import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UnauthorizedPage({ requiredRole, currentRole }) {
  const { activeRole, getDefaultRouteForRole } = useAuth();
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate(getDefaultRouteForRole(activeRole || currentRole));
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <Card className="text-center p-8 border-rose-500/30 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-rose-400" />
          </div>

          <Badge variant="danger" className="mb-2">
            HTTP 403 • ACCESS DENIED
          </Badge>

          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight mt-2">
            Restricted Role Access
          </h1>

          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Your current role (<span className="font-mono font-bold text-indigo-400">{currentRole || activeRole}</span>) does not have authorization to view this command page.
          </p>

          {requiredRole && (
            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
              Required Permission Tier: <span className="text-amber-400 font-bold">{requiredRole}</span>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-center">
            <Button variant="primary" icon={ArrowLeft} onClick={handleReturnHome}>
              Return to Authorized Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
