import React, { useState } from 'react';
import { Check, ShieldCheck, RefreshCw, Zap, Crown, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { createDodoCheckout } from '../services/api.js';
import { useNavigate } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  const { user, subscription, resetToFree } = useAuth();
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

  return (
    <div className="bg-white min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Pricing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple & Transparent Pricing
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Choose the plan that fits your usage. Start for free, upgrade when you need unlimited conversions.
          </p>
        </div>

        {errMessage && (
          <div className="max-w-md mx-auto p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {errMessage}
          </div>
        )}

        {/* 2-Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
          
          {/* FREE PLAN */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-lg text-slate-900">Free</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">For casual users</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-sm font-medium text-slate-500">/ month</span>
              </div>

              <div className="border-t border-slate-100 pt-6 mb-6">
                <ul className="space-y-3.5 text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                    <span>29 conversions per month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                    <span>Use your own live rate (from Google)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                    <span>Rate valid for 24 hours</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                    <span>Basic conversion history</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              {isPro ? (
                <button
                  onClick={resetToFree}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                >
                  Downgrade to Free
                </button>
              ) : (
                <button
                  onClick={() => navigate('/extension')}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Get Started Free
                </button>
              )}
            </div>
          </div>

          {/* PRO PLAN */}
          <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-md flex flex-col justify-between overflow-hidden relative">
            {/* Top Blue Header */}
            <div className="bg-blue-600 text-white p-6 sm:p-8 relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-300" />
                  <span className="font-bold text-lg text-white">Pro</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-blue-600 shadow-sm">
                  Most Popular
                </span>
              </div>
              <p className="text-xs text-blue-100 mb-6">For power users & frequent conversions</p>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-white">$9</span>
                <span className="text-sm font-medium text-blue-100">/ every 3 months</span>
              </div>
              <p className="text-xs text-blue-200 mt-1">($3 per month)</p>
            </div>

            {/* Bottom White Body */}
            <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
              <ul className="space-y-3.5 text-sm text-slate-700 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                  <span className="font-medium text-slate-900">Unlimited conversions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                  <span>Save and manage your rate</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                  <span>Conversion history (unlimited)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                  <span>24-hour auto reminder</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>

              <div>
                {isPro ? (
                  <div className="space-y-2">
                    <div className="w-full py-3 rounded-xl font-bold text-sm text-center bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span>Pro Plan Active</span>
                    </div>
                    <button
                      onClick={resetToFree}
                      className="w-full text-center text-xs text-slate-500 hover:text-red-600 underline py-1 transition-colors"
                    >
                      Reset to Free (Test Mode)
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleProCheckout}
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Upgrade to Pro</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom 3 Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6">
          <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">Secure Payment</div>
              <div className="text-[11px] text-slate-500">via Dodo Payments</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
            <RefreshCw className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">Cancel Anytime</div>
              <div className="text-[11px] text-slate-500">No long-term lock-in</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
            <Zap className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">Quarterly Billing</div>
              <div className="text-[11px] text-slate-500">$9 every 3 months</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
