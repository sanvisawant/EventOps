import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { MOCK_USERS } from '../../data/mockData';

export const authService = {
  async getCurrentUser(activeRoleId = 'ORGANIZER') {
    if (isSupabaseConfigured) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return session.user;
      }
    }
    // Fallback to active mock user based on role
    return MOCK_USERS.find((u) => u.role === activeRoleId) || MOCK_USERS[0];
  },

  async login(email, role) {
    if (isSupabaseConfigured) {
      // Supabase auth signIn call when configured
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: 'dummy-password' });
      if (error) throw error;
      return data.user;
    }
    const user = MOCK_USERS.find((u) => u.role === role || u.email === email) || MOCK_USERS[0];
    return user;
  },

  async logout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    return true;
  }
};
