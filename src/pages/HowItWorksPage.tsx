import React from 'react';
import { 
  Copy, 
  ClipboardPaste, 
  Zap, 
  Clock, 
  BarChart3, 
  Bell, 
  Crown, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="bg-white min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            How It Works
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get Started in 3 Simple Steps
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Use a live exchange rate from Google, paste it once, and it stays active for 24 hours.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.25 21.36 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.01-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Search on Google</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Search for the live rate, like "USD to INR live rate".
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <Copy className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Copy the Rate</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Copy the current exchange rate (e.g. 87.12).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <ClipboardPaste className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Paste & Save</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Paste it in HoverCurrency and save it. The rate will be valid for 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="space-y-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Zap className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">Instant Conversion</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Convert currencies on any website with a quick hover.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Layers className="w-6 h-6 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Personal Rate</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Use a trusted rate from Google (no API key needed).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Clock className="w-6 h-6 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">24-Hour Validity</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Your saved rate stays active for 24 hours.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">Conversion History</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Track your past conversions anytime.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Bell className="w-6 h-6 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">Daily Reminder</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Get notified to update your rate every 24 hours.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <Crown className="w-6 h-6 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-base">Pro: Unlimited</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Remove limits and convert without restrictions.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
