import React, { useState } from 'react';
import { CheckCircle2, Sparkles, ShieldCheck, Zap, Lock, CreditCard, RefreshCw, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { createDodoCheckout, simulateProUpgrade } from '../services/api.js';
import { useNavigate } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  const { user, subscription, refreshStatus } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const isPro = subscription.plan === 'pro';

  const handleProCheckout = async () => {
    setIsLoading(true);
    setErrMessage(null);
    try {
      const targetUserId = user?.id || 'usr_guest_' + Date.now();
      const targetEmail = user?.email || 'shopper@example.com';

      const checkout = await createDodoCheckout(targetUserId, targetEmail);
      if (checkout.checkoutUrl) {
        window.location.href = checkout.checkoutUrl;
      }
    } catch (err: any) {
      console.warn('Checkout error:', err);
      setErrMessage(err.message || 'Unable to connect to Dodo Payments API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantTestUpgrade = async () => {
    setIsLoading(true);
    try {
      const targetUserId = user?.id || 'usr_demo_8829';
      await simulateProUpgrade(targetUserId);
      await refreshStatus();
      navigate('/dashboard?tab=subscription&activated=true');
    } catch (e: any) {
      setErrMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Simple, Transparent Subscription
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Choose Your Conversion Plan
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          Enjoy 29 free conversions every month or unlock unlimited hover-to-convert power across the entire web.
        </p>
      </div>

      {errMessage && (
        <div className="max-w-xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {errMessage}
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* FREE PLAN */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Free Tier</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                $0 / month
              </span>
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-extrabold text-white">$0</span>
              <span className="text-slate-400 text-sm font-medium">/forever</span>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Generous starter plan for everyday shoppers checking international item prices.
            </p>

            <div className="h-px bg-slate-800 mb-6" />

            <ul className="space-y-3.5 text-sm text-slate-300 mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>29 successful conversions</strong> per month</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Hover-to-convert engine on all websites</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Currency selection (160+ currencies)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Basic web currency converter</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Real-time exchange rate information</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Monthly usage counter & reset</span>
              </li>
            </ul>
          </div>

          <button
            disabled={!isPro}
            onClick={() => navigate('/extension')}
            className={`w-full py-3.5 rounded-xl font-bold text-sm text-center transition-colors ${
              !isPro
                ? 'bg-slate-800/80 text-slate-400 cursor-default border border-slate-700/60'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {!isPro ? 'Current Plan (Active)' : 'Revert to Free'}
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="glass-panel rounded-3xl p-8 border-2 border-sky-500/50 bg-gradient-to-b from-slate-900 via-slate-900 to-sky-950/40 flex flex-col justify-between relative shadow-2xl glow-primary">
          <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 uppercase tracking-wider shadow-md">
            Best Value
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Pro Plan
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">
                Dodo Payments
              </span>
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-extrabold text-white">$9</span>
              <span className="text-slate-400 text-sm font-medium">/ 3 months (recurring quarterly)</span>
            </div>
            <p className="text-slate-300 text-sm mb-6">
              Complete freedom with unlimited hover conversions and premium custom rate profiles.
            </p>

            <div className="h-px bg-slate-800 mb-6" />

            <ul className="space-y-3.5 text-sm text-slate-200 mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span><strong>Unlimited currency conversions</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span><strong>Unlimited hover-to-convert usage</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span><strong>Premium Rate Profiles</strong> (Bank, Business, Travel, Custom)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Daily update reminder alarms via Chrome Alarms</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Cross-device browser synchronization</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Website exclusion list & custom formatting</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            {isPro ? (
              <div className="w-full py-3.5 rounded-xl font-bold text-sm text-center bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your Pro Subscription is Active</span>
              </div>
            ) : (
              <button
                onClick={handleProCheckout}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                <span>Upgrade via Dodo Payments ($9 / 3 mos)</span>
              </button>
            )}

            {/* Test helper for immediate developer / review preview */}
            {!isPro && (
              <button
                onClick={handleInstantTestUpgrade}
                disabled={isLoading}
                className="w-full text-center text-xs text-sky-400 hover:text-sky-300 underline py-1 transition-colors"
              >
                ⚡ Instant Pro Activation (One-Click Dev Preview)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security & Dodo Payments Assurance */}
      <div className="max-w-2xl mx-auto glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Exclusive Payment Provider: Dodo Payments</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          All transactions are processed through Dodo Payments official recurring billing infrastructure. Your payment details are encrypted with bank-level security and never stored on our servers. Cancel anytime with a single click.
        </p>
      </div>
    </div>
  );
};

