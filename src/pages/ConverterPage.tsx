import React, { useState } from 'react';
import { InteractiveConverterCard } from '../components/InteractiveConverterCard.js';
import {
  History,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Trash2,
  ArrowUpRight,
  Sliders,
  FileSpreadsheet,
  Check,
  Plus,
  RefreshCw,
  FolderPlus
} from 'lucide-react';
import {
  CURRENCIES,
  DEFAULT_RATE_PROFILES,
  RateProfile,
  exchangeRateService
} from '@currency-converter/shared';

interface HistoryItem {
  id: string;
  from: string;
  to: string;
  originalAmount: number;
  convertedAmount: number;
  rate: number;
  time: string;
  mode?: string;
}

export const ConverterPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: '1',
      from: 'USD',
      to: 'INR',
      originalAmount: 100,
      convertedAmount: 8712.0,
      rate: 87.12,
      time: 'Just now',
      mode: 'automatic'
    },
    {
      id: '2',
      from: 'EUR',
      to: 'INR',
      originalAmount: 50,
      convertedAmount: 4735.0,
      rate: 94.70,
      time: '12 mins ago',
      mode: 'manual'
    },
    {
      id: '3',
      from: 'GBP',
      to: 'INR',
      originalAmount: 120,
      convertedAmount: 13260.0,
      rate: 110.50,
      time: '1 hour ago',
      mode: 'manual'
    }
  ]);

  // Profiles Manager State
  const [profiles, setProfiles] = useState<RateProfile[]>([...DEFAULT_RATE_PROFILES]);
  const [activeProfileId, setActiveProfileId] = useState<string>('prof_personal');
  const [bulkInput, setBulkInput] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Single Pair inputs
  const [singleFrom, setSingleFrom] = useState<string>('EUR');
  const [singleTo, setSingleTo] = useState<string>('INR');
  const [singleRate, setSingleRate] = useState<string>('');

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const popularPairs = [
    { from: 'USD', to: 'EUR', label: 'USD / EUR', rate: '0.92' },
    { from: 'EUR', to: 'USD', label: 'EUR / USD', rate: '1.09' },
    { from: 'USD', to: 'INR', label: 'USD / INR', rate: '87.12' },
    { from: 'GBP', to: 'USD', label: 'GBP / USD', rate: '1.27' },
    { from: 'USD', to: 'JPY', label: 'USD / JPY', rate: '154.30' },
    { from: 'USD', to: 'CAD', label: 'USD / CAD', rate: '1.38' }
  ];

  const handleConversionComplete = (res: any) => {
    setHistory((prev) => [
      {
        id: Date.now().toString(),
        from: res.from,
        to: res.to,
        originalAmount: res.originalAmount,
        convertedAmount: res.convertedAmount,
        rate: res.rate,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: res.rateMode
      },
      ...prev.slice(0, 9)
    ]);
  };

  const handleAddSinglePair = () => {
    const parsed = parseFloat(singleRate);
    if (isNaN(parsed) || parsed <= 0) return;

    const pairKey = `${singleFrom}_${singleTo}`;
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === activeProfileId) {
          return {
            ...p,
            rates: { ...p.rates, [pairKey]: parsed },
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );
    setSingleRate('');
    setImportStatus(`✓ Saved 1 ${singleFrom} = ${parsed} ${singleTo}`);
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleImportBulk = () => {
    if (!bulkInput.trim()) return;

    const parsed = exchangeRateService.parseBulkRatesText(bulkInput, 'INR');
    if (parsed.length === 0) {
      alert('Could not parse any valid rates. Use formats like:\n1 EUR = 94.70 INR\nUSD = 87.12 INR\nEUR,INR,94.70');
      return;
    }

    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === activeProfileId) {
          const newRates = { ...p.rates };
          for (const item of parsed) {
            newRates[`${item.from}_${item.to}`] = item.rate;
          }
          return {
            ...p,
            rates: newRates,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    setBulkInput('');
    setImportStatus(`✓ Successfully imported ${parsed.length} rates into "${activeProfile.name}"!`);
    setTimeout(() => setImportStatus(null), 4000);
  };

  const handleDeleteRate = (pairKey: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === activeProfileId) {
          const updated = { ...p.rates };
          delete updated[pairKey];
          return { ...p, rates: updated, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
          <TrendingUp className="w-3.5 h-3.5" /> Dual Exchange Rate Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Currency Converter Calculator
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Switch seamlessly between <strong>Live Automatic Rates</strong> and <strong>Custom Manual Rate Profiles</strong> with institutional precision.
        </p>
      </div>

      {/* Main Converter Card */}
      <div className="max-w-4xl mx-auto">
        <InteractiveConverterCard onConversionComplete={handleConversionComplete} />
      </div>

      {/* MANUAL RATE PROFILES & BULK IMPORTER SECTION */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              Manual Rate Profiles & Bulk Table Importer
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Save customized bank spreads, negotiated contract rates, or personal travel exchange rates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Profile:</span>
            <select
              value={activeProfileId}
              onChange={(e) => setActiveProfileId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs font-bold text-white px-3 py-1.5 rounded-lg outline-none cursor-pointer"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Add Pair & Bulk Paste */}
          <div className="space-y-6">
            {/* Single pair adder */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs font-bold text-slate-300 block mb-2">1. Add Individual Pair</span>
              <div className="grid grid-cols-7 gap-2 items-center">
                <select
                  value={singleFrom}
                  onChange={(e) => setSingleFrom(e.target.value)}
                  className="col-span-2 bg-slate-800 text-xs font-semibold text-white p-2 rounded-lg border border-slate-700 outline-none"
                >
                  {Object.keys(CURRENCIES).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <span className="col-span-1 text-center text-xs text-slate-400 font-bold">&rarr;</span>

                <select
                  value={singleTo}
                  onChange={(e) => setSingleTo(e.target.value)}
                  className="col-span-2 bg-slate-800 text-xs font-semibold text-white p-2 rounded-lg border border-slate-700 outline-none"
                >
                  {Object.keys(CURRENCIES).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <input
                  type="number"
                  step="any"
                  placeholder="Rate"
                  value={singleRate}
                  onChange={(e) => setSingleRate(e.target.value)}
                  className="col-span-2 bg-slate-800 text-xs font-bold text-amber-300 p-2 rounded-lg border border-slate-700 outline-none"
                />
              </div>

              <button
                onClick={handleAddSinglePair}
                className="mt-3 w-full py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Pair to {activeProfile.name}</span>
              </button>
            </div>

            {/* Bulk paste */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs font-bold text-slate-300 block mb-1">
                2. Paste Rate Tables / CSV
              </span>
              <span className="text-[11px] text-slate-500 block mb-2">
                Paste lines formatted like &quot;1 EUR = 94.70 INR&quot;, &quot;USD = 87.12 INR&quot;, or CSV format.
              </span>

              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder={`1 EUR = 94.70 INR\nUSD = 87.12 INR\nGBP = 110.50 INR`}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-amber-200 font-mono outline-none focus:border-amber-500/50 h-24"
              />

              <button
                onClick={handleImportBulk}
                className="mt-2.5 px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Parse & Import Rates</span>
              </button>
            </div>
          </div>

          {/* Right: Saved Rates in Active Profile */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300">
                  Custom Rates in &quot;{activeProfile.name}&quot;
                </span>
                <span className="text-[11px] text-amber-400 font-semibold">
                  {Object.keys(activeProfile.rates || {}).length} pairs configured
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-500 border-b border-slate-800">
                    <tr>
                      <th className="p-2 font-semibold">Pair</th>
                      <th className="p-2 font-semibold">Custom Rate</th>
                      <th className="p-2 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {Object.entries(activeProfile.rates || {}).map(([key, val]) => {
                      const [from, to] = key.split('_');
                      return (
                        <tr key={key} className="hover:bg-slate-800/30">
                          <td className="p-2 text-white font-bold">1 {from}</td>
                          <td className="p-2 text-amber-300 font-bold">{val} {to}</td>
                          <td className="p-2 text-right">
                            <button
                              onClick={() => handleDeleteRate(key)}
                              className="text-red-400 hover:text-red-300 font-sans"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 text-[11px] text-slate-500">
              Rates automatically synchronize with your Browser Extension when paired.
            </div>
          </div>
        </div>
      </div>

      {/* Popular Currency Pairs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            Popular Spot Forex Pairs
          </h3>
          <span className="text-xs text-slate-500">Live Spot Cross Rates</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularPairs.map((pair) => (
            <div
              key={pair.label}
              className="glass-panel p-3.5 rounded-xl border border-slate-800 hover:border-sky-500/30 transition-colors"
            >
              <div className="text-xs font-semibold text-slate-400 mb-1">{pair.label}</div>
              <div className="text-lg font-bold text-white font-mono">{pair.rate}</div>
              <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> Live rate
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion History */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-bold text-white">Recent Conversions</h3>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
              <tr>
                <th className="pb-3 font-semibold">Mode</th>
                <th className="pb-3 font-semibold">Original Amount</th>
                <th className="pb-3 font-semibold">Converted Result</th>
                <th className="pb-3 font-semibold">Rate Applied</th>
                <th className="pb-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 font-sans">
                    {item.mode === 'manual' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Custom Rate
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Automatic
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-white font-semibold">
                    {CURRENCIES[item.from]?.symbol}
                    {item.originalAmount.toLocaleString()} {item.from}
                  </td>
                  <td className="py-3 text-sky-400 font-bold">
                    {CURRENCIES[item.to]?.symbol}
                    {item.convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {item.to}
                  </td>
                  <td className="py-3 text-slate-400">
                    1 {item.from} = {item.rate.toFixed(4)} {item.to}
                  </td>
                  <td className="py-3 text-right text-slate-500 font-sans">
                    {item.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
