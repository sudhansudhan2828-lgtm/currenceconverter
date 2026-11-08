import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftRight, 
  Clock, 
  Settings as SettingsIcon, 
  CreditCard, 
  Crown, 
  Home, 
  Bell, 
  User as UserIcon, 
  ShieldCheck, 
  Edit3, 
  ChevronRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const SettingsPage: React.FC = () => {
  const { user, subscription, resetToFree } = useAuth();
  const [targetCurrency, setTargetCurrency] = useState('INR – Indian Rupee');
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const isPro = subscription.plan === 'pro';

  return (
    <div className="bg-slate-50/50 min-h-[88vh] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Home className="w-4 h-4 text-slate-400" />
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
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm bg-blue-50 text-blue-600 transition-colors"
            >
              <SettingsIcon className="w-4 h-4 text-blue-600" />
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
              Account & Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your currency preferences, reminders and subscription.
            </p>
          </div>

          {/* 4 Cards in 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Currency Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                <h2 className="font-bold text-sm text-slate-900">Currency Settings</h2>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600">Your Target Currency</label>
                <select
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="INR – Indian Rupee">🇮🇳 INR – Indian Rupee</option>
                  <option value="EUR – Euro">🇪🇺 EUR – Euro</option>
                  <option value="GBP – British Pound">🇬🇧 GBP – British Pound</option>
                  <option value="CAD – Canadian Dollar">🇨🇦 CAD – Canadian Dollar</option>
                  <option value="AUD – Australian Dollar">🇦🇺 AUD – Australian Dollar</option>
                  <option value="JPY – Japanese Yen">🇯🇵 JPY – Japanese Yen</option>
                </select>
              </div>
            </div>

            {/* Card 2: Rate & Reminder */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <h2 className="font-bold text-sm text-slate-900">Rate & Reminder</h2>
              </div>

              {/* Toggle Row */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Daily Update Reminder</div>
                  <div className="text-[11px] text-slate-500">Notify me every 24 hours to refresh the rate</div>
                </div>
                <button
                  type="button"
                  onClick={() => setReminderEnabled(!reminderEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                    reminderEnabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      reminderEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Rate Validity Row */}
              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Rate Validity</div>
                  <div className="text-[11px] text-slate-500">Your saved rate will stay active for 24 hours.</div>
                </div>
              </div>
            </div>

            {/* Card 3: Account */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-blue-600" />
                <h2 className="font-bold text-sm text-slate-900">Account</h2>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Name</span>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <span>Sudhan M</span>
                    <Edit3 className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-blue-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Email</span>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <span>sudhanm@gmail.com</span>
                    <Edit3 className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-blue-600" />
                  </div>
                </div>

                <div className="pt-1">
                  <button className="text-blue-600 hover:text-blue-700 font-semibold text-xs flex items-center gap-1">
                    <span>Change Password</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 4: Subscription */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <h2 className="font-bold text-sm text-slate-900">Subscription</h2>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isPro ? 'Pro Plan – Active' : 'Free Plan – Active'}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Next billing: Feb 8, 2027</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {isPro ? '$9 every 3 months via Dodo Payments' : 'Free tier (29 conversions/month)'}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Link
                  to="/pricing"
                  className="flex-1 py-2 text-center rounded-xl font-semibold text-xs border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  Manage Subscription
                </Link>

                <button
                  onClick={resetToFree}
                  className="flex-1 py-2 text-center rounded-xl font-semibold text-xs border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                >
                  Cancel Plan
                </button>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};
