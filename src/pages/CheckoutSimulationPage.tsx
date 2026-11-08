import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { simulateProUpgrade } from '../services/api.js';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export const CheckoutSimulationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshStatus } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  const sessionId = searchParams.get('session_id') || 'dodo_sub_' + Math.random().toString(36).substring(2, 8);
  const targetUserId = searchParams.get('user_id') || user?.id || 'usr_demo_8829';

  useEffect(() => {
    const activate = async () => {
      try {
        await simulateProUpgrade(targetUserId);
        await refreshStatus();
      } catch (e) {
        console.warn('Activation error:', e);
      } finally {
        setIsProcessing(false);
      }
    };

    activate();
  }, [targetUserId]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50/50 animate-fade-in">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
          {isProcessing ? (
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          ) : (
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          )}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> Dodo Payments Confirmed
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {isProcessing ? 'Verifying Dodo Subscription...' : 'Welcome to Pro! 🎉'}
        </h2>

        <p className="text-sm text-slate-500 mt-2 mb-6">
          {isProcessing
            ? 'Confirming recurring quarterly subscription through Dodo Payments webhook...'
            : 'Your subscription of $9 / 3 months is now active. You have unlimited hover currency conversions everywhere.'}
        </p>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs space-y-2 mb-6 font-mono text-slate-600">
          <div className="flex justify-between">
            <span>Session ID:</span>
            <span className="text-slate-900 font-semibold truncate">{sessionId}</span>
          </div>
          <div className="flex justify-between">
            <span>Product:</span>
            <span className="text-slate-900 font-semibold">HoverCurrency Pro Quarterly</span>
          </div>
          <div className="flex justify-between">
            <span>Price:</span>
            <span className="text-slate-900 font-semibold">$9.00 USD / 3 months</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-emerald-600 font-bold">Active (Unlimited)</span>
          </div>
        </div>

        <Link
          to="/dashboard?tab=overview"
          className="w-full py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <span>Go to My Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

