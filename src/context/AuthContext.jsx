import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth/authService';
import { ROLES, getDefaultRouteForRole } from '../utils/permissions';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true); // Default to Demo Mode for interactive evaluation
  const [demoRole, setDemoRole] = useState(ROLES.ORGANIZER);
  const [authError, setAuthError] = useState(null);

  // Restore session on mount
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const currentSession = await authService.getSession();
        if (mounted && currentSession) {
          setSession(currentSession.session);
          setUserProfile(currentSession.profile);
        }
      } catch (err) {
        console.warn('Session restoration notice:', err.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initSession();

    // Subscribe to auth changes
    const subscription = authService.onAuthStateChange((_event, newSession, profile) => {
      if (!mounted) return;
      if (newSession) {
        setSession(newSession);
        setUserProfile(profile || {
          id: newSession.user.id,
          email: newSession.user.email,
          role: newSession.user.user_metadata?.role || ROLES.PARTICIPANT,
          name: newSession.user.user_metadata?.name || newSession.user.email.split('@')[0],
        });
        setIsDemoMode(false); // Switch to authenticated mode on real login
      } else {
        setSession(null);
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, []);

  const login = async ({ email, password }) => {
    setAuthError(null);
    try {
      const res = await authService.signIn({ email, password });
      setSession(res.user);
      setUserProfile(res.profile);
      setIsDemoMode(false);
      return res;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const signUp = async ({ email, password, name, role }) => {
    setAuthError(null);
    try {
      const res = await authService.signUp({ email, password, name, role });
      setSession(res.user);
      setUserProfile(res.profile);
      setIsDemoMode(false);
      return res;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    await authService.signOut();
    setSession(null);
    setUserProfile(null);
    setIsDemoMode(true);
    setDemoRole(ROLES.ORGANIZER);
  };

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const switchDemoRole = (newRole) => {
    if (ROLES[newRole]) {
      setDemoRole(newRole);
    }
  };

  // Determine active effective role
  const isAuthenticated = Boolean(userProfile || session);
  const activeRole = isDemoMode
    ? demoRole
    : userProfile?.role || ROLES.PARTICIPANT;

  const activeUser = isDemoMode
    ? MOCK_USERS.find((u) => u.role === demoRole) || MOCK_USERS[0]
    : userProfile || { name: 'User', role: activeRole };

  return (
    <AuthContext.Provider
      value={{
        session,
        userProfile,
        activeUser,
        activeRole,
        isAuthenticated,
        isDemoMode,
        isLoading,
        authError,
        login,
        signUp,
        logout,
        toggleDemoMode,
        switchDemoRole,
        ROLES,
        getDefaultRouteForRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
