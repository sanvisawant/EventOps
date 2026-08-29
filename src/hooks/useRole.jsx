import { useAuth } from '../context/AuthContext';

/**
 * Backward compatibility wrapper over useAuth
 */
export function useRole() {
  const auth = useAuth();
  return {
    activeRole: auth.activeRole,
    activeUser: auth.activeUser,
    switchRole: auth.switchDemoRole,
    ROLES: auth.ROLES,
    isDemoMode: auth.isDemoMode,
    toggleDemoMode: auth.toggleDemoMode,
  };
}
