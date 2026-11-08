import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSubscription, UserUsage, UserPreferences, APP_CONFIG } from '@currency-converter/shared';
import { fetchUserStatus, simulateFreeReset } from '../services/api.js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  subscription: UserSubscription;
  usage: UserUsage;
  preferences: UserPreferences;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  loginAsDemo: () => void;
  logout: () => void;
  refreshStatus: () => Promise<void>;
  resetToFree: () => Promise<void>;
  setPreferences: (prefs: UserPreferences) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('hc_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    // Default logged in user for immediate testing convenience
    return {
      id: 'usr_demo_8829',
      email: 'alex.rivera@example.com',
      name: 'Alex Rivera',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    };
  });

  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'free',
    status: 'active',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString()
  });

  const [usage, setUsage] = useState<UserUsage>({
    count: 14,
    limit: 29,
    remaining: 15,
    periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
    isLimitReached: false,
    plan: 'free'
  });

  const [preferences, setPreferences] = useState<UserPreferences>(APP_CONFIG.defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);

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

  const login = async (email: string) => {
    setIsLoading(true);
    const mockUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      name: email.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    setUser(mockUser);
    setIsLoading(false);
  };

  const signup = async (email: string, _pass: string, name: string) => {
    setIsLoading(true);
    const mockUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      name: name || email.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    setUser(mockUser);
    setIsLoading(false);
  };

  const loginAsDemo = () => {
    setUser({
      id: 'usr_demo_8829',
      email: 'alex.rivera@example.com',
      name: 'Alex Rivera',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    });
  };

  const logout = () => {
    setUser(null);
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

