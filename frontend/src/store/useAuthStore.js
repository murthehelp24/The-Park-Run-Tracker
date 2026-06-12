import { create } from 'zustand';
import { loginAPI, registerAPI, getWristbandAPI, googleLoginAPI } from '../services/api';
import { supabase } from '../services/supabaseClient';

export const useAuthStore = create((set, get) => ({
  // --- States ---
  user: null,
  wristband: null,
  loading: true,
  isAuthenticated: false,

  // --- Actions ---
  initializeAuth: async () => {
    // 1. Listen for Supabase auth state change (Google OAuth callback redirect)
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const email = session.user.email;
        const fullName = session.user.user_metadata?.full_name || '';
        const firstName = fullName.split(' ')[0] || session.user.user_metadata?.given_name || 'Google';
        const lastName = fullName.split(' ').slice(1).join(' ') || session.user.user_metadata?.family_name || 'User';
        
        try {
          // Sync authenticated Google user with our Express backend
          const res = await googleLoginAPI(email, firstName, lastName);
          if (res.success && res.data) {
            const { token, user: userData } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            set({ user: userData, isAuthenticated: true });
            await get().fetchWristband(userData.id);
            
            // Clean up Supabase local session to prevent duplicate runs
            await supabase.auth.signOut();
          }
        } catch (err) {
          console.error("Failed to sync Google user with backend:", err);
        }
      }
    });

    // 2. Load existing session from local storage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        set({ user: parsedUser, isAuthenticated: true });
        await get().fetchWristband(parsedUser.id);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        get().logout();
      }
    }
    set({ loading: false });
  },

  fetchWristband: async (userId) => {
    try {
      const response = await getWristbandAPI(userId);
      if (response.success && response.data) {
        const wb = Array.isArray(response.data) ? response.data[0] : response.data;
        set({ wristband: wb || null });
      }
    } catch (error) {
      console.error("Failed to fetch wristband info:", error);
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await loginAPI(email, password);
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData, isAuthenticated: true });
        await get().fetchWristband(userData.id);
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: errorMsg };
    } finally {
      set({ loading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
          queryParams: {
            prompt: 'select_account',
          },
        }
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Google sign in failed:", error);
      return { success: false, message: error.message || 'Google sign in failed.' };
    } finally {
      set({ loading: false });
    }
  },

  register: async (firstName, lastName, email, password) => {
    set({ loading: true });
    try {
      const response = await registerAPI(firstName, lastName, email, password);
      if (response.success) {
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: errorMsg };
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, wristband: null, isAuthenticated: false });
  },

  refreshWristband: () => {
    const user = get().user;
    if (user) {
      get().fetchWristband(user.id);
    }
  },

  updateWristbandState: (newWristband) => {
    set({ wristband: newWristband });
  }
}));
