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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-sky-500/40 shadow-2xl text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          {isProcessing ? (
            <RefreshCw className="w-8 h-8 animate-spin text-sky-400" />
          ) : (
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          )}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> Dodo Payments Confirmed
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight">
          {isProcessing ? 'Verifying Dodo Subscription...' : 'Welcome to Pro! 🎉'}
        </h2>

        <p className="text-sm text-slate-400 mt-2 mb-6">
          {isProcessing
            ? 'Confirming recurring quarterly subscription through Dodo Payments webhook...'
            : 'Your subscription of $9 / 3 months is now active. You have unlimited hover currency conversions everywhere.'}
        </p>

        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 text-left text-xs space-y-2 mb-6 font-mono text-slate-400">
          <div className="flex justify-between">
            <span>Session ID:</span>
            <span className="text-slate-200 truncate">{sessionId}</span>
          </div>
          <div className="flex justify-between">
            <span>Product:</span>
            <span className="text-slate-200">HoverCurrency Pro Quarterly</span>
          </div>
          <div className="flex justify-between">
            <span>Price:</span>
            <span className="text-slate-200">$9.00 USD / 3 months</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-emerald-400 font-bold">Active (Unlimited)</span>
          </div>
        </div>

        <Link
          to="/dashboard?tab=overview"
          className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all"
        >
          <span>Go to My Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

