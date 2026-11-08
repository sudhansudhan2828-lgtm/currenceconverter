import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftRight, 
  Clock, 
  BarChart3, 
  Settings, 
  CreditCard, 
  Crown, 
  Home, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const DashboardPage: React.FC = () => {
  const { user, subscription, usage } = useAuth();
  const [convertAmount, setConvertAmount] = useState<number>(100);
  const [sourceCurrency, setSourceCurrency] = useState<string>('USD');
  const [targetCurrency, setTargetCurrency] = useState<string>('INR');

  const isPro = subscription.plan === 'pro';
  const rate = 87.12;
  const converted = (convertAmount * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-slate-50/50 min-h-[88vh] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm bg-blue-50 text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4 text-blue-600" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/converter"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4 text-slate-400" />
              <span>Conversions</span>
            </Link>

            <Link
              to="/dashboard?tab=history"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>History</span>
            </Link>

            <Link
              to="/settings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </Link>

            <Link
              to="/pricing"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>Billing</span>
            </Link>
          </div>

          {/* Pro Plan Card in Sidebar */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-300" />
              <span className="font-bold text-sm">Pro Plan</span>
            </div>
            <p className="text-xs text-blue-100">Unlimited conversions</p>
            <div className="text-xs font-semibold text-white">$9 every 3 months</div>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1 text-xs font-bold text-white hover:underline pt-1"
            >
              <span>Manage Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, Sudhan 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Here's your current rate and usage.
            </p>
          </div>

          {/* Row 1: Two Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Personal Rate */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-1">
                    CURRENT PERSONAL RATE
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    1 USD = <span className="text-emerald-400">87.12</span> INR
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-blue-100 pt-4 mt-4 border-t border-white/15">
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Fresh (24h)
                </span>
                <span>Updated Today at 09:22 AM</span>
              </div>
            </div>

            {/* Card 2: Monthly Conversions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-sm text-slate-900">Monthly Conversions</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {usage.count} / {usage.limit === Infinity ? '∞' : usage.limit} used
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (usage.count / 29) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {usage.remaining === Infinity ? 'Unlimited remaining' : `${usage.remaining} remaining`}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {isPro ? 'Pro Plan' : 'Free Plan'}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Quick Convert Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-sm text-slate-900">Quick Convert</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-5 flex items-center gap-2">
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(Number(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <select 
                  value={sourceCurrency}
                  onChange={(e) => setSourceCurrency(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex justify-center">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
              </div>

              <div className="sm:col-span-5 flex items-center gap-2">
                <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-emerald-700">
                  {converted}
                </div>
                <select 
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 3: Recent Conversions Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h2 className="font-bold text-sm text-slate-900">Recent Conversions</h2>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>49.99 USD</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-bold text-slate-900">4,355.13 INR</span>
                </div>
                <span className="text-xs text-slate-400">Today, 09:18 AM</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>100 EUR</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-bold text-slate-900">9,470.00 INR</span>
                </div>
                <span className="text-xs text-slate-400">Today, 09:10 AM</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>1,000 USD</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-bold text-slate-900">87,120.00 INR</span>
                </div>
                <span className="text-xs text-slate-400">Yesterday, 05:42 PM</span>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};
