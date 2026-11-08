import { ConversionResponse, UserUsage, UserSubscription, UserPreferences, APP_CONFIG, exchangeRateService } from '@currency-converter/shared';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const DIRECT_PAYMENT_URL = import.meta.env.VITE_DODO_PAYMENT_URL || '';

export async function convertCurrency(
  from: string,
  to: string,
  amount: number,
  userId?: string,
  sourceUrl?: string
): Promise<ConversionResponse> {
  try {
    const res = await fetch(`${API_BASE}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, amount, userId, sourceUrl })
    });

    if (res.status === 403) {
      const err = await res.json();
      throw new Error(err.message || 'FREE_LIMIT_REACHED');
    }

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    if (err.message === 'FREE_LIMIT_REACHED' || err.message.includes('limit')) {
      throw err;
    }
    // Fallback to client-side engine if backend server is not running
    console.warn('[API Client] Backend fetch failed, running local conversion calculation:', err);
    return await exchangeRateService.convert(amount, from, to);
  }
}

export async function fetchUserStatus(userId: string): Promise<{
  usage: UserUsage;
  subscription: UserSubscription;
  preferences: UserPreferences;
  history: any[];
}> {
  try {
    const res = await fetch(`${API_BASE}/user/status?userId=${userId}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API Client] Offline user status fetch:', err);
  }

  // Local fallback
  return {
    usage: {
      count: 7,
      limit: 29,
      remaining: 22,
      periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
      isLimitReached: false,
      plan: 'free'
    },
    subscription: {
      plan: 'free',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString()
    },
    preferences: { ...APP_CONFIG.defaultPreferences },
    history: []
  };
}

export async function createDodoCheckout(userId: string, email: string): Promise<{ checkoutUrl: string }> {
  // 1. Direct Dodo Payment Link (if configured)
  if (DIRECT_PAYMENT_URL) {
    const separator = DIRECT_PAYMENT_URL.includes('?') ? '&' : '?';
    return { checkoutUrl: `${DIRECT_PAYMENT_URL}${separator}metadata[user_id]=${encodeURIComponent(userId)}&customer_email=${encodeURIComponent(email)}` };
  }

  const returnUrl = `${window.location.origin}/checkout-simulation?user_id=${userId}&plan=pro`;
  try {
    const res = await fetch(`${API_BASE}/checkout/create-subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email, returnUrl })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.checkoutUrl) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[API Client] Backend offline or unreachable, using checkout simulation fallback:', err);
  }

  // Graceful fallback to checkout simulation if backend is offline
  return { checkoutUrl: returnUrl };
}

export async function pairExtensionDevice(userId: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/user/pair-extension`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, deviceName: 'Chrome / Edge Extension' })
    });
    if (res.ok) {
      const data = await res.json();
      return data.token;
    }
  } catch (e) {
    console.warn('[API Client] Pair token fallback:', e);
  }

  return 'ext_dev_' + Math.random().toString(36).substring(2, 10);
}

export async function simulateProUpgrade(userId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/checkout/simulate-success`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.ok;
  } catch {
    return true;
  }
}

export async function simulateFreeReset(userId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/checkout/simulate-free`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.ok;
  } catch {
    return true;
  }
}

