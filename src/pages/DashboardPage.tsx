import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { pairExtensionDevice } from '../services/api.js';
import {
  User,
  Sparkles,
  Zap,
  Download,
  Copy,
  Check,
  CreditCard,
  Settings,
  History,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  Sliders,
  Plus
} from 'lucide-react';
import {
  CURRENCIES,
  DEFAULT_RATE_PROFILES,
  RateProfile,
  RateMode,
  exchangeRateService
} from '@currency-converter/shared';
import { Link, useSearchParams } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, subscription, usage, preferences, refreshStatus, setPreferences } = useAuth();
  const [searchParams] = useSearchParams();
  const [pairToken, setPairToken] = useState<string>('');
  const [isCopiedToken, setIsCopiedToken] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rates' | 'history' | 'preferences' | 'subscription'>(
    (searchParams.get('tab') as any) || 'overview'
  );

  const [prefTargetCurrency, setPrefTargetCurrency] = useState(preferences.defaultTargetCurrency || 'INR');
  const [prefPrecision, setPrefPrecision] = useState(preferences.precision || 2);
  const [isSavedPrefs, setIsSavedPrefs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dual Rate Engine Profiles
  const [rateMode, setRateMode] = useState<RateMode>(preferences.rateMode || 'automatic');
  const [profiles, setProfiles] = useState<RateProfile[]>([...DEFAULT_RATE_PROFILES]);
  const [activeProfileId, setActiveProfileId] = useState<string>(preferences.activeProfileId || 'prof_personal');
  const [bulkInput, setBulkInput] = useState<string>('');
  const [rateSyncMessage, setRateSyncMessage] = useState<string | null>(null);

  const isPro = subscription.plan === 'pro';

  useEffect(() => {
    if (user) {
      pairExtensionDevice(user.id).then((token) => setPairToken(token));
    }
  }, [user]);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(pairToken);
    setIsCopiedToken(true);
    setTimeout(() => setIsCopiedToken(false), 2000);
  };

  const handleSavePreferences = () => {
    const updated = {
      ...preferences,
      defaultTargetCurrency: prefTargetCurrency,
      precision: prefPrecision,
      rateMode,
      activeProfileId
    };
    setPreferences(updated);
    setIsSavedPrefs(true);
    setTimeout(() => setIsSavedPrefs(false), 2500);
  };

  const handleImportBulkRates = () => {
    if (!bulkInput.trim()) return;
    const parsed = exchangeRateService.parseBulkRatesText(bulkInput, prefTargetCurrency);
    if (parsed.length === 0) {
      alert('Could not parse rates. Use formats like:\n1 EUR = 94.70 INR\nUSD = 87.12 INR');
      return;
    }

    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === activeProfileId) {
          const newRates = { ...p.rates };
          for (const item of parsed) {
            newRates[`${item.from}_${item.to}`] = item.rate;
          }
          return { ...p, rates: newRates, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );

    setBulkInput('');
    setRateSyncMessage(`✓ Imported ${parsed.length} rates into profile!`);
    setTimeout(() => setRateSyncMessage(null), 3500);
  };

  // Sample conversions history
  const conversionHistory = [
    { id: '1', from: 'USD', to: 'INR', original: 49.99, converted: 4355.13, rate: 87.12, site: 'amazon.com', date: 'Today, 2:15 PM', mode: 'Auto' },
    { id: '2', from: 'EUR', to: 'INR', original: 129.00, converted: 12216.30, rate: 94.70, site: 'zara.com', date: 'Today, 1:40 PM', mode: 'Manual (Bank)' },
    { id: '3', from: 'GBP', to: 'INR', original: 85.50, converted: 9447.75, rate: 110.50, site: 'asos.com', date: 'Yesterday, 6:20 PM', mode: 'Manual (Personal)' },
    { id: '4', from: 'JPY', to: 'INR', original: 6800, converted: 3842.00, rate: 0.565, site: 'rakuten.co.jp', date: 'Yesterday, 11:05 AM', mode: 'Auto' },
    { id: '5', from: 'USD', to: 'INR', original: 12.99, converted: 1131.69, rate: 87.12, site: 'ebay.com', date: 'Nov 6, 2026', mode: 'Auto' }
  ];

  const filteredHistory = conversionHistory.filter(
    (h) =>
      h.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.site.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const usagePercentage = isPro ? 100 : Math.min(100, Math.round((usage.count / 29) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Header Profile Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
            alt={user?.name || 'User'}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-500/40"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{user?.name || 'Demo User'}</h1>
              {isPro ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Pro Member
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                  Free Plan
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshStatus}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
          {!isPro && (
            <Link
              to="/pricing"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upgrade to Pro ($9 / 3 mos)</span>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 text-sm font-semibold text-slate-400 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3 transition-colors relative whitespace-nowrap ${
            activeTab === 'overview' ? 'text-sky-400' : 'hover:text-white'
          }`}
        >
          Overview & Extension
          {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400" />}
        </button>
        <button
          onClick={() => setActiveTab('rates')}
          className={`pb-3 px-3 transition-colors relative whitespace-nowrap ${
            activeTab === 'rates' ? 'text-amber-400' : 'hover:text-white'
          }`}
        >
          Rate Profiles & Dual Engine
          {activeTab === 'rates' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-3 transition-colors relative whitespace-nowrap ${
            activeTab === 'history' ? 'text-sky-400' : 'hover:text-white'
          }`}
        >
          Conversion History
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400" />}
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 px-3 transition-colors relative whitespace-nowrap ${
            activeTab === 'preferences' ? 'text-sky-400' : 'hover:text-white'
          }`}
        >
          Currency Preferences
          {activeTab === 'preferences' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400" />}
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={`pb-3 px-3 transition-colors relative whitespace-nowrap ${
            activeTab === 'subscription' ? 'text-sky-400' : 'hover:text-white'
          }`}
        >
          Dodo Billing & Plan
          {activeTab === 'subscription' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400" />}
        </button>
      </div>

      {/* TAB 1: OVERVIEW & EXTENSION PAIRING */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Usage Meter Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold text-slate-400">Monthly Usage Counter</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {isPro ? 'Pro Unlimited' : `${usage.count} of 29 Used`}
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPro
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 w-full'
                      : usagePercentage >= 80
                      ? 'bg-gradient-to-r from-amber-500 to-red-500'
                      : 'bg-gradient-to-r from-sky-400 to-blue-500'
                  }`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
                <span>{isPro ? 'Unlimited hover conversions' : `${29 - usage.count} free conversions remaining`}</span>
                <span>Resets on {new Date(usage.periodEnd).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Active Rate Engine Mode:</span>
                <span className="font-bold text-sky-300 uppercase">{rateMode}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs mt-4">
              <span className="text-slate-400">Enforced atomically on backend</span>
              {!isPro && (
                <Link to="/pricing" className="text-sky-400 font-semibold hover:underline">
                  Upgrade Now &rarr;
                </Link>
              )}
            </div>
          </div>

          {/* Browser Extension Pairing Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold text-slate-400">Browser Extension Connection</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ready to Pair
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Connect your browser extension to synchronize Pro unlimited access, custom rate profiles, and preferences.
              </p>

              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Your Device Pairing Token:
              </label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl mb-3">
                <input
                  type="text"
                  readOnly
                  value={pairToken || 'ext_loading_token...'}
                  className="bg-transparent font-mono text-xs text-sky-300 w-full outline-none select-all"
                />
                <button
                  onClick={handleCopyToken}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors flex items-center gap-1 flex-shrink-0"
                >
                  {isCopiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopiedToken ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500">
                Paste this token into the extension popup &rarr; <strong>Settings &rarr; Account Pairing</strong>.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs mt-4">
              <Link to="/extension" className="text-sky-400 hover:underline flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Installation Guide
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DUAL RATE ENGINE & PROFILES */}
      {activeTab === 'rates' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                Rate Profiles & Dual Engine Manager
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose between Automatic API rates or configure custom profiles for bank spreads and corporate invoices.
              </p>
            </div>

            {/* Mode Segmented Switcher */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setRateMode('automatic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  rateMode === 'automatic'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Automatic API
              </button>
              <button
                onClick={() => setRateMode('manual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  rateMode === 'manual'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ✏️ Manual Profiles
              </button>
            </div>
          </div>

          {rateSyncMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{rateSyncMessage}</span>
            </div>
          )}

          {/* Profile Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Saved Profiles
              </span>

              <div className="space-y-2">
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setActiveProfileId(p.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      activeProfileId === p.id
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs mb-1">
                      <span>{p.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {Object.keys(p.rates || {}).length} rates
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{p.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Rates Table & Bulk Importer */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  Custom Rates in &quot;{activeProfile.name}&quot;
                </span>
                <span className="text-xs text-amber-400 font-mono">
                  {Object.keys(activeProfile.rates || {}).length} pairs active
                </span>
              </div>

              {/* Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40 max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-500 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5 font-semibold">Pair</th>
                      <th className="p-2.5 font-semibold">Custom Exchange Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {Object.entries(activeProfile.rates || {}).map(([key, val]) => {
                      const [from, to] = key.split('_');
                      return (
                        <tr key={key} className="hover:bg-slate-800/40">
                          <td className="p-2.5 text-white font-bold">1 {from}</td>
                          <td className="p-2.5 text-amber-300 font-bold">{val} {to}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bulk Importer */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-400 block mb-1">
                  Bulk Paste Rates Table into &quot;{activeProfile.name}&quot;
                </span>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder={`1 EUR = 94.70 INR\nUSD = 87.12 INR\nGBP = 110.50 INR`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-amber-200 font-mono outline-none focus:border-amber-500/50 h-20"
                />
                <button
                  onClick={handleImportBulkRates}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                >
                  Import into {activeProfile.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONVERSION HISTORY */}
      {activeTab === 'history' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Full Conversion Audit Log</h3>
              <p className="text-xs text-slate-400">All prices successfully hovered and converted.</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 text-xs text-white border border-slate-800 rounded-lg px-3 py-1.5 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-semibold">Mode</th>
                  <th className="pb-3 font-semibold">Original Price</th>
                  <th className="pb-3 font-semibold">Converted Target</th>
                  <th className="pb-3 font-semibold">Rate</th>
                  <th className="pb-3 font-semibold">Website</th>
                  <th className="pb-3 font-semibold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/40">
                    <td className="py-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300">
                        {item.mode}
                      </span>
                    </td>
                    <td className="py-3 text-white font-semibold">
                      {CURRENCIES[item.from]?.symbol}{item.original.toLocaleString()} {item.from}
                    </td>
                    <td className="py-3 text-sky-400 font-bold">
                      {CURRENCIES[item.to]?.symbol}{item.converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {item.to}
                    </td>
                    <td className="py-3 text-slate-400">
                      1 {item.from} = {item.rate.toFixed(4)} {item.to}
                    </td>
                    <td className="py-3 text-slate-300 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        {item.site}
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-500 font-sans">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CURRENCY PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 max-w-2xl space-y-6">
          <h3 className="text-base font-bold text-white">General Preferences</h3>

          {isSavedPrefs && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" /> Preferences saved and synchronized!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Default Target Currency (Global)
              </label>
              <select
                value={prefTargetCurrency}
                onChange={(e) => setPrefTargetCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-sky-500 cursor-pointer"
              >
                {Object.keys(CURRENCIES).map((c) => (
                  <option key={c} value={c}>
                    {CURRENCIES[c].flag} {c} - {CURRENCIES[c].name} ({CURRENCIES[c].symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Decimal Precision
              </label>
              <select
                value={prefPrecision}
                onChange={(e) => setPrefPrecision(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value={0}>0 Decimals (e.g. ₹4,350)</option>
                <option value={2}>2 Decimals (e.g. ₹4,350.00)</option>
                <option value={4}>4 Decimals (e.g. ₹4,350.0000)</option>
              </select>
            </div>

            <button
              onClick={handleSavePreferences}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: DODO BILLING & SUBSCRIPTION */}
      {activeTab === 'subscription' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-sky-400" />
              Dodo Payments Subscription
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              {isPro ? 'Pro Active' : 'Free Tier'}
            </span>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Current Plan:</span>
              <span className="font-semibold text-white">{isPro ? 'Pro Plan ($9 / 3 months)' : 'Free Plan ($0 / month)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Conversion Limit:</span>
              <span className="font-semibold text-white">{isPro ? 'Unlimited conversions' : '29 conversions'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Next Billing Date:</span>
              <span className="font-semibold text-white">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Gateway:</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Dodo Payments (Encrypted)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            {!isPro ? (
              <Link
                to="/pricing"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-500/20 transition-all text-center"
              >
                Upgrade to Pro – $9 / 3 mos
              </Link>
            ) : (
              <button
                onClick={() => alert('Dodo Payments customer portal session opened. You can update billing details or cancel renewal.')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Manage Subscription on Dodo</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
