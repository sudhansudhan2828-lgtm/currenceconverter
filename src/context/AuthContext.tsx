import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSubscription, UserUsage, UserPreferences, APP_CONFIG } from '@currency-converter/shared';
import { fetchUserStatus, simulateFreeReset } from '../services/api.js';
import { supabase } from '../services/supabase-client.js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  error?: string;
  requiresEmailConfirmation?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  subscription: UserSubscription;
  usage: UserUsage;
  preferences: UserPreferences;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<AuthResult>;
  signup: (email: string, pass: string, name: string) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<AuthResult>;
  verifyOtp: (email: string, token: string, type?: 'signup' | 'recovery' | 'email') => Promise<AuthResult>;
  forgotPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  resetToFree: () => Promise<void>;
  setPreferences: (prefs: UserPreferences) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const formatAuthError = (err: any, fallback: string): string => {
  const msg = typeof err === 'string' ? err : (err?.message || '');
  if (msg.includes('Failed to fetch') || msg.includes('network') || msg.includes('offline') || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return 'Network disconnected: Unable to connect to Supabase. Please check your internet connection and try again.';
  }
  return msg || fallback;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('hc_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null;
  });

  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'free',
    status: 'active',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString()
  });

  const [usage, setUsage] = useState<UserUsage>({
    count: 0,
    limit: 29,
    remaining: 29,
    periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
    isLimitReached: false,
    plan: 'free'
  });

  const [preferences, setPreferences] = useState<UserPreferences>(APP_CONFIG.defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);

  // Sync Supabase Auth session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            avatarUrl: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`
          };
          setUser(profile);
          localStorage.setItem('hc_user', JSON.stringify(profile));
        }
      } catch (err) {
        console.warn('[Supabase Auth] Session fetch error:', err);
      }
    };

    initSession();

    // Listen for auth state changes (login, logout, token refresh, password recovery)
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            avatarUrl: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`
          };
          setUser(profile);
          localStorage.setItem('hc_user', JSON.stringify(profile));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('hc_user');
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const refreshStatus = async () => {
    if (!user) return;
    try {
      const data = await fetchUserStatus(user.id);
      if (data) {
        setSubscription(data.subscription);
        setUsage(data.usage);
        if (data.preferences) setPreferences(data.preferences);
      }
    } catch (err) {
      console.warn('Failed to refresh status:', err);
    }
  };

  const resetToFree = async () => {
    if (user) {
      try {
        await simulateFreeReset(user.id);
      } catch (e) {
        console.warn('Reset error:', e);
      }
    }
    setSubscription({
      plan: 'free',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString()
    });
    setUsage((prev) => ({
      ...prev,
      plan: 'free',
      limit: 29,
      remaining: Math.max(0, 29 - prev.count),
      isLimitReached: prev.count >= 29
    }));
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('hc_user', JSON.stringify(user));
      refreshStatus();
    } else {
      localStorage.removeItem('hc_user');
    }
  }, [user]);

  // Real Supabase Login with Password
  const login = async (email: string, pass: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || email.split('@')[0],
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        setUser(profile);
        return { success: true };
      }

      return { success: false, error: 'Login failed. Please check credentials.' };
    } catch (err: any) {
      return { success: false, error: formatAuthError(err, 'An unexpected error occurred.') };
    } finally {
      setIsLoading(false);
    }
  };

  // Real Supabase Sign Up (Triggers Confirmation Email)
  const signup = async (email: string, pass: string, name: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if Supabase requires email confirmation
      if (data.user && (!data.session || data.user.identities?.length === 0)) {
        return {
          success: true,
          requiresEmailConfirmation: true,
          message: 'Confirmation email sent! Please check your inbox to verify your account.'
        };
      }

      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          name: name || email.split('@')[0],
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        setUser(profile);
        return { success: true };
      }

      return { success: false, error: 'Registration could not be completed.' };
    } catch (err: any) {
      return { success: false, error: formatAuthError(err, 'Registration failed.') };
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Login
  const loginWithGoogle = async (): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: formatAuthError(err, 'Google sign in failed.') };
    } finally {
      setIsLoading(false);
    }
  };

  // Real Supabase Forgot Password (Triggers Reset Email)
  const forgotPassword = async (email: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=update-password`
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'Password reset email sent! Check your inbox (and spam folder) for the reset link.'
      };
    } catch (err: any) {
      return { success: false, error: formatAuthError(err, 'Failed to send password reset email.') };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify 6-digit OTP code from email (for signup or password recovery)
  const verifyOtp = async (
    email: string,
    token: string,
    type: 'signup' | 'recovery' | 'email' = 'signup'
  ): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const otpType = type === 'recovery' ? 'recovery' : (type === 'signup' ? 'signup' : 'email');
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: otpType as any
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || email.split('@')[0],
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        setUser(profile);
        localStorage.setItem('hc_user', JSON.stringify(profile));
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: formatAuthError(err, 'OTP verification failed.') };
    } finally {
      setIsLoading(false);
    }
  };

  // Update Password (used after clicking email link or from settings)
  const updatePassword = async (newPassword: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, message: 'Password updated successfully!' };
    } catch (err: any) {
      return { success: false, error: formatAuthError(err, 'Failed to update password.') };
    } finally {
      setIsLoading(false);
    }
  };

  // One-click demo login
  const loginAsDemo = () => {
    const demoUser: UserProfile = {
      id: 'usr_demo_8829',
      email: 'alex.rivera@example.com',
      name: 'Alex Rivera',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    };
    setUser(demoUser);
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setUser(null);
    localStorage.removeItem('hc_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        usage,
        preferences,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        verifyOtp,
        forgotPassword,
        updatePassword,
        loginAsDemo,
        logout,
        refreshStatus,
        resetToFree,
        setPreferences
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
