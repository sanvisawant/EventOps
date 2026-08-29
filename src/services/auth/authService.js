import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { MOCK_USERS } from '../../data/mockData';
import { validateRole, validateEmail } from '../../utils/validation';

let localSessionUser = null;

export const authService = {
  /**
   * Registers a new user with Supabase Auth and creates a corresponding profile
   */
  async signUp({ email, password, name, role = 'PARTICIPANT' }) {
    // Validate inputs
    const emailVal = validateEmail(email);
    if (!emailVal.isValid) throw new Error(emailVal.error);

    const roleVal = validateRole(role);
    if (!roleVal.isValid) throw new Error(roleVal.error);

    // Restrict public ORGANIZER self-registration
    if (role === 'ORGANIZER') {
      throw new Error('ORGANIZER accounts cannot be created via public sign-up. Please contact the lead director.');
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Upsert into public.profiles
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          name,
          email,
          role,
          created_at: new Date().toISOString(),
        });
        if (profileError) {
          console.warn('Profile creation warning:', profileError.message);
        }
      }

      return {
        user: data.user,
        profile: { id: data.user?.id, email, name, role },
      };
    }

    // Fallback Mock Registration
    const newUser = {
      id: `usr_mock_${Date.now()}`,
      email,
      name,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      qrCode: `EVTOPS-PASS-${name.toUpperCase().replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      isCheckedIn: false,
    };

    localSessionUser = newUser;
    return { user: newUser, profile: newUser };
  },

  /**
   * Signs in an existing user with Supabase Auth or mock fallback
   */
  async signIn({ email, password }) {
    const emailVal = validateEmail(email);
    if (!emailVal.isValid) throw new Error(emailVal.error);

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const profile = await this.getUserProfile(data.user.id);
      return {
        user: data.user,
        profile: profile || {
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role || 'PARTICIPANT',
          name: data.user.user_metadata?.name || email.split('@')[0],
        },
      };
    }

    // Mock Login
    const existing = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const mockProfile = existing || {
      id: `usr_demo_${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'PARTICIPANT',
      qrCode: `EVTOPS-PASS-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      isCheckedIn: true,
    };

    localSessionUser = mockProfile;
    return { user: mockProfile, profile: mockProfile };
  },

  /**
   * Signs out the active user session
   */
  async signOut() {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Sign out error:', error.message);
    }
    localSessionUser = null;
    return true;
  },

  /**
   * Fetches current active session
   */
  async getSession() {
    if (isSupabaseConfigured) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await this.getUserProfile(session.user.id);
        return {
          session,
          user: session.user,
          profile: profile || {
            id: session.user.id,
            email: session.user.email,
            role: session.user.user_metadata?.role || 'PARTICIPANT',
            name: session.user.user_metadata?.name || session.user.email.split('@')[0],
          },
        };
      }
      return null;
    }

    if (localSessionUser) {
      return {
        session: { access_token: 'mock-token' },
        user: localSessionUser,
        profile: localSessionUser,
      };
    }

    return null;
  },

  /**
   * Fetches user profile from public.profiles table
   */
  async getUserProfile(userId) {
    if (!isSupabaseConfigured || !userId) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) return null;
      return data;
    } catch {
      return null;
    }
  },

  /**
   * Subscribes to Supabase authentication state changes
   */
  onAuthStateChange(callback) {
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            const profile = await this.getUserProfile(session.user.id);
            callback(event, session, profile);
          } else {
            callback(event, null, null);
          }
        }
      );
      return subscription;
    }
    return { unsubscribe: () => {} };
  },
};
