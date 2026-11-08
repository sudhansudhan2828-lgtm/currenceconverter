import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MousePointer,
  Zap,
  Globe2,
  CheckCircle2,
  ChevronDown,
  Layers,
  Lock,
  Cpu
} from 'lucide-react';
import { InteractiveConverterCard } from '../components/InteractiveConverterCard.js';
import { HoverSimulationDemo } from '../components/HoverSimulationDemo.js';
import { CURRENCIES, POPULAR_CURRENCIES } from '@currency-converter/shared';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [currencySearch, setCurrencySearch] = useState<string>('');

  const faqs = [
    {
      q: 'How does Hover-to-Convert work without modifying the webpage?',
      a: 'Our browser extension listens for cursor hover events over recognized currency symbols and formats. It calculates the conversion through an isolated, closed Shadow DOM layer that floats right above your cursor. It never alters the original webpage HTML, links, or buttons.'
    },
    {
      q: 'How does the 29 Free Conversions limit work?',
      a: 'Free users receive 29 successful price conversions per monthly billing period. Conversions are counted only when you hover over an identifiable price and a valid conversion is calculated. Repeated hovers on the exact same price item are cached and not counted twice. When you reach 29, a friendly upgrade prompt invites you to unlock unlimited conversions.'
    },
    {
      q: 'How much does the Pro plan cost?',
      a: 'The Pro plan is $9 every 3 months (recurring quarterly via Dodo Payments). It unlocks unlimited hover conversions, premium custom rate profiles, and cross-device browser synchronization.'
    },
    {
      q: 'Which payment provider do you use?',
      a: 'We use Dodo Payments as our exclusive, highly secure subscription billing provider. It supports cards, local payment methods, automated recurring billing, and instant customer portal management.'
    },
    {
      q: 'Does it work with Amazon, eBay, Airbnb, and international stores?',
      a: 'Yes! The extension handles multiple currency symbols ($, €, £, ₹, ¥, etc.), ISO 3-letter codes (USD, EUR, GBP, INR), and both American (1,299.99) and European (1.299,99) number formatting.'
    }
  ];

  const filteredCurrencies = Object.keys(CURRENCIES).filter((code) => {
    const c = CURRENCIES[code];
    return (
      code.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.symbol.toLowerCase().includes(currencySearch.toLowerCase())
    );
  });

  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center pt-8 sm:pt-16 pb-6 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Hover-to-Convert SaaS & Browser Extension</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Convert Any Price Anywhere. <br />
          <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Just By Hovering.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
          Stop copying numbers into Google. Hover over any price on any shopping, travel, or foreign website to see it instantly converted into your currency.
        </p>

        {/* Hero Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/extension"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            <span>Install Browser Extension</span>
          </Link>

          <Link
            to="/converter"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors"
          >
            <span>Open Web Calculator</span>
            <ArrowRight className="w-4 h-4 text-sky-400" />
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 29 Free conversions included</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Chrome & Edge compatible</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dodo Payments secured</span>
        </div>
      </section>

      {/* Interactive Converter Card in Hero */}
      <section className="max-w-4xl mx-auto">
        <InteractiveConverterCard />
      </section>

      {/* Live Interactive Store Simulation Demo */}
      <section id="demo" className="scroll-mt-20">
        <HoverSimulationDemo />
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">Effortless Experience</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2">
            How HoverCurrency Works
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            No copy-pasting, no tab-switching, and zero friction. Your browsing flow stays completely uninterrupted.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 relative group hover:border-sky-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-6 font-bold text-lg border border-sky-500/20 group-hover:scale-110 transition-transform">
              <MousePointer className="w-6 h-6" />
            </div>
            <div className="text-xs uppercase font-bold text-slate-500 mb-1">Step 1</div>
            <h3 className="text-lg font-bold text-white mb-2">1. Hover Over Any Price</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Browse any shopping, travel, hotel, or e-commerce platform. When you see a price (e.g. $49.99, €120, £85), simply place your cursor over it.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-slate-800 relative group hover:border-sky-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 font-bold text-lg border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="text-xs uppercase font-bold text-slate-500 mb-1">Step 2</div>
            <h3 className="text-lg font-bold text-white mb-2">2. Intelligent Detection</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our smart regex engine parses currency symbols, European vs US decimal formats, and page context in under 5 milliseconds.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-slate-800 relative group hover:border-sky-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 font-bold text-lg border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-xs uppercase font-bold text-slate-500 mb-1">Step 3</div>
            <h3 className="text-lg font-bold text-white mb-2">3. Instant Floating Tooltip</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              An elegant, non-intrusive tooltip appears near your cursor showing the exact price in your home currency with live exchange rates.
            </p>
          </div>
        </div>
      </section>

      {/* 160+ Currencies Grid */}
      <section id="currencies" className="scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">Global Coverage</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2">
            160+ Supported Currencies
          </h2>
          <p className="text-slate-400 mt-3 text-sm">
            From USD, EUR, and GBP to INR, JPY, and AED — convert every major world currency in real time.
          </p>

          <div className="mt-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by code, symbol, or country (e.g. EUR, Yen, $)..."
              value={currencySearch}
              onChange={(e) => setCurrencySearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-2 border border-slate-800/80 rounded-2xl glass-panel">
          {filteredCurrencies.slice(0, 36).map((code) => {
            const c = CURRENCIES[code];
            return (
              <div
                key={code}
                className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 flex items-center gap-2.5 hover:border-slate-700 transition-colors"
              >
                <span className="text-xl">{c.flag}</span>
                <div className="truncate">
                  <div className="font-bold text-xs text-white">{code}</div>
                  <div className="text-[10px] text-slate-400 truncate">{c.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">Simple & Transparent</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2">
            Fair Pricing for Everyone
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            Start completely free with 29 conversions per month, or unlock unlimited hover conversions for just $9 every 3 months.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Free Tier */}
          <div className="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Free Plan</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Starter
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-extrabold text-white">$0</span>
                <span className="text-slate-400 text-sm font-medium">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Perfect for casual shoppers and occasional price checks across international stores.
              </p>

              <ul className="space-y-3.5 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>29 successful conversions</strong> per month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Hover-to-convert on all websites</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>All 160+ world currencies & symbols</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Real-time exchange rate information</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Usage counter & reset tracker</span>
                </li>
              </ul>
            </div>

            <Link
              to="/extension"
              className="w-full py-3 rounded-xl text-center text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="glass-panel rounded-3xl p-8 border-2 border-sky-500/50 bg-gradient-to-b from-slate-900 via-slate-900 to-sky-950/30 flex flex-col justify-between relative shadow-2xl glow-primary">
            <div className="absolute -top-3.5 right-8 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 uppercase tracking-wider shadow-md">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Pro Plan
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Dodo Recurring
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-extrabold text-white">$9</span>
                <span className="text-slate-400 text-sm font-medium">/ 3 months (recurring quarterly)</span>
              </div>
              <p className="text-slate-300 text-sm mb-6">
                For frequent online shoppers, digital nomads, and cross-border shoppers who need unlimited conversions.
              </p>

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
                  <span><strong>Personal Google Rate System & Custom Profiles</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Daily update reminder notifications (Chrome Alarms)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Cross-device synchronization</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Website exclusion list & custom formatting</span>
                </li>
              </ul>
            </div>

            <Link
              to="/pricing"
              className="w-full py-3.5 rounded-xl text-center text-sm font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/30 transition-all"
            >
              Upgrade to Pro – $9 / 3 mos
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="scroll-mt-20 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">Answers</span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-xl border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-sky-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                    openFaq === idx ? 'transform rotate-180 text-sky-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="glass-panel rounded-3xl p-10 sm:p-14 border border-sky-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/40 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Start Converting Prices Effortlessly
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mb-8">
            Install the extension on Chrome or Edge and experience instant hover-to-convert currency right on your favorite websites.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/extension"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-500/25 transition-all"
            >
              Install Free Extension
            </Link>
            <Link
              to="/pricing"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            >
              View Pro Plan ($9 / 3 mos)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

