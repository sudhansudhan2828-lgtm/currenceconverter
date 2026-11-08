import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftRight, 
  Check, 
  CheckCircle2, 
  Zap, 
  Copy, 
  ClipboardPaste, 
  ShieldCheck, 
  Clock, 
  Crown, 
  Pin, 
  ExternalLink 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [convertAmount, setConvertAmount] = useState<number>(100);
  const rate = 87.12;
  const converted = (convertAmount * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white text-slate-900">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Zap className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
              <span>Chrome Extension</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Convert Currency <br />
              <span className="text-slate-900">Instantly, Anywhere</span> <br />
              <span className="text-slate-900">on the Web</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              A simple and fast currency converter that works right where you browse. Get the latest rate from Google, paste it once, and use it for 24 hours.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/extension"
                className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-sm transition-all"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm0 4.8a7.2 7.2 0 1 1 0 14.4 7.2 7.2 0 0 1 0-14.4zm0 2.4a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6z" />
                </svg>
                <span>Add to Chrome – Free</span>
              </Link>

              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3.5 rounded-xl border border-slate-300 shadow-sm transition-all"
              >
                <span>View Pricing</span>
              </Link>
            </div>

            {/* Checkmarks */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>No API key</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Works offline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Lightweight & fast</span>
              </div>
            </div>
          </div>

          {/* Right Column: Preview of the Extension Popup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
              {/* Extension Top Header */}
              <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-sm text-slate-900">HoverCurrency</span>
                </div>
                <Pin className="w-4 h-4 text-slate-400 rotate-45" />
              </div>

              <div className="p-4 space-y-4">
                {/* Hero Rate Blue Card */}
                <div className="rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 p-4 text-white shadow-md relative overflow-hidden">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-1">
                    CURRENT PERSONAL RATE
                  </div>
                  <div className="text-2xl font-extrabold tracking-tight mb-3">
                    1 USD = <span className="text-emerald-400">87.12</span> INR
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-blue-200 pt-1 border-t border-blue-800/60">
                    <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Fresh Rate
                    </span>
                    <span>Updated Today at 09:22 AM</span>
                  </div>
                </div>

                {/* Convert Box */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <ArrowLeftRight className="w-3 h-3 text-blue-600" />
                    <span>Convert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(Number(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <div className="px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                      USD ▾
                    </div>
                  </div>

                  {/* Mint Green Converted Box */}
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm text-center">
                    = {converted} INR
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-slate-100 bg-slate-50/50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How It Works
            </h2>
          </div>

          {/* 3 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                {/* 4-Color Google G */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.25 21.36 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.01-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Search on Google</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Search "USD to INR live rate"
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <Copy className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Copy the rate</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Copy the current rate (e.g. 87.12)
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <ClipboardPaste className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Paste & Save</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Paste it in HoverCurrency and use it for 24 hours
              </p>
            </div>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-slate-900 text-sm">Instant Conversion</h4>
              <p className="text-xs text-slate-500">Convert while browsing any website.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-sm">Your Personal Rate</h4>
              <p className="text-xs text-slate-500">Use the rate you trust (from Google).</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-slate-900 text-sm">24-Hour Freshness</h4>
              <p className="text-xs text-slate-500">Rate stays valid for 24 hours.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-slate-900 text-sm">Pro for More</h4>
              <p className="text-xs text-slate-500">Unlimited conversions with the Pro plan.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
