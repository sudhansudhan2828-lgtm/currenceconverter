import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Copy, Check, RefreshCw, Zap, Sliders, AlertCircle, Edit3, RotateCcw } from 'lucide-react';
import {
  CURRENCIES,
  POPULAR_CURRENCIES,
  exchangeRateService,
  RateMode,
  RateProfile,
  DEFAULT_RATE_PROFILES
} from '@currency-converter/shared';
import { useAuth } from '../context/AuthContext.js';

interface Props {
  onConversionComplete?: (conversion: any) => void;
  className?: string;
  showEngineSelector?: boolean;
}

export const InteractiveConverterCard: React.FC<Props> = ({
  onConversionComplete,
  className = '',
  showEngineSelector = true
}) => {
  const { preferences } = useAuth();
  const [amount, setAmount] = useState<number>(100);
  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>(preferences.defaultTargetCurrency || 'INR');
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Dual Rate Engine State
  const [rateMode, setRateMode] = useState<RateMode>('automatic');
  const [profiles, setProfiles] = useState<RateProfile[]>([...DEFAULT_RATE_PROFILES]);
  const [activeProfileId, setActiveProfileId] = useState<string>('prof_personal');
  const [inlineRateInput, setInlineRateInput] = useState<string>('');
  const [manualError, setManualError] = useState<string | null>(null);
  const [rateProvider, setRateProvider] = useState<string>('');

  const currencyCodes = Object.keys(CURRENCIES).sort((a, b) => {
    const isPopA = POPULAR_CURRENCIES.includes(a);
    const isPopB = POPULAR_CURRENCIES.includes(b);
    if (isPopA && !isPopB) return -1;
    if (!isPopA && isPopB) return 1;
    return a.localeCompare(b);
  });

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const performConvert = async () => {
    if (isNaN(amount) || amount <= 0) return;
    setIsLoading(true);
    setManualError(null);

    try {
      exchangeRateService.setMode(rateMode);
      exchangeRateService.setProfiles(profiles);
      exchangeRateService.setActiveProfile(activeProfileId);

      const res = await exchangeRateService.convert(amount, fromCode, toCode, {
        mode: rateMode,
        profileId: activeProfileId
      });

      setResult(res.convertedAmount);
      setRate(res.rate);
      setLastUpdated(res.lastUpdated);
      setRateProvider(res.rateProvider);

      if (onConversionComplete) {
        onConversionComplete(res);
      }
    } catch (err: any) {
      if (err.name === 'MissingManualRateError' || err.message?.includes('Manual exchange rate not found')) {
        setManualError(err.message);
        setResult(null);
        setRate(null);
      } else {
        console.error('Conversion failed:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    performConvert();
  }, [amount, fromCode, toCode, rateMode, activeProfileId, profiles]);

  // Update inline rate input placeholder when pair changes
  useEffect(() => {
    if (rateMode === 'manual') {
      const direct = activeProfile.rates[`${fromCode}_${toCode}`];
      if (direct !== undefined) {
        setInlineRateInput(direct.toString());
      } else {
        setInlineRateInput('');
      }
    }
  }, [fromCode, toCode, activeProfileId, rateMode]);

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const handleCopy = () => {
    if (result !== null) {
      const meta = CURRENCIES[toCode];
      navigator.clipboard.writeText(
        `${meta.symbol}${result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCode}`
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSaveInlineRate = () => {
    const parsed = parseFloat(inlineRateInput);
    if (isNaN(parsed) || parsed <= 0) return;

    const pairKey = `${fromCode}_${toCode}`;
    const updatedProfiles = profiles.map((p) => {
      if (p.id === activeProfileId) {
        return {
          ...p,
          rates: { ...p.rates, [pairKey]: parsed },
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    setProfiles(updatedProfiles);
    setManualError(null);
  };

  const handleRestoreAutomatic = () => {
    setRateMode('automatic');
    setManualError(null);
  };

  const fromMeta = CURRENCIES[fromCode];
  const toMeta = CURRENCIES[toCode];

  return (
    <div className={`glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl ${className}`}>
      {/* Top Header & Segmented Mode Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-sky-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4 fill-sky-400" />
            Dual Exchange Rate Engine
          </span>
          <span className="text-xs text-slate-400 mt-0.5 block">
            {rateMode === 'automatic'
              ? 'Using Live Market Spot Rates (Updated Hourly)'
              : `Using Custom Rate Profile: ${activeProfile.name}`}
          </span>
        </div>

        {showEngineSelector && (
          <div className="flex items-center gap-2">
            {/* Segmented Control */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setRateMode('automatic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  rateMode === 'automatic'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡ Automatic</span>
              </button>

              <button
                type="button"
                onClick={() => setRateMode('manual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  rateMode === 'manual'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>✏️ Manual</span>
              </button>
            </div>

            {rateMode === 'manual' ? (
              <button
                onClick={handleRestoreAutomatic}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 border border-slate-700 transition-colors"
                title="Restore Automatic Live Rates"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Restore Auto</span>
              </button>
            ) : (
              <button
                onClick={performConvert}
                disabled={isLoading}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1"
                title="Refresh rates"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Manual Mode Active Profile & Inline Override Bar */}
      {rateMode === 'manual' && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-300 whitespace-nowrap flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Active Profile:
            </span>
            <select
              value={activeProfileId}
              onChange={(e) => setActiveProfileId(e.target.value)}
              className="bg-slate-900 border border-amber-500/40 text-xs font-semibold text-white px-2.5 py-1.5 rounded-lg outline-none cursor-pointer"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-200/80 font-mono whitespace-nowrap">
              1 {fromCode} =
            </span>
            <input
              type="number"
              step="any"
              value={inlineRateInput}
              onChange={(e) => setInlineRateInput(e.target.value)}
              placeholder="Custom Rate"
              className="w-28 bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-xs px-2.5 py-1.5 rounded-lg outline-none"
            />
            <span className="text-xs text-amber-200/80 font-mono">{toCode}</span>
            <button
              onClick={handleSaveInlineRate}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
            >
              Save Rate
            </button>
          </div>
        </div>
      )}

      {/* Missing Manual Rate Alert Banner */}
      {manualError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{manualError}</span>
          </div>
          <button
            onClick={handleRestoreAutomatic}
            className="px-3 py-1.5 rounded-lg font-bold bg-red-500/20 text-red-200 hover:bg-red-500/30 border border-red-500/40 transition-colors whitespace-nowrap self-start sm:self-center"
          >
            Switch to Automatic
          </button>
        </div>
      )}

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center mb-6">
        {/* From Amount & Currency */}
        <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-3 focus-within:border-sky-500 transition-colors">
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">You Pay / Convert</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent text-xl font-bold text-white outline-none"
              placeholder="0.00"
              min="0"
              step="any"
            />
            <select
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className="bg-slate-800 text-sm font-semibold text-white rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none cursor-pointer hover:bg-slate-700/80 transition-colors"
            >
              {currencyCodes.map((code) => (
                <option key={code} value={code} className="bg-slate-900 text-white">
                  {CURRENCIES[code].flag} {code}
                </option>
              ))}
            </select>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {fromMeta.flag} {fromMeta.name} ({fromMeta.symbol})
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center">
          <button
            onClick={handleSwap}
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-sky-400 hover:text-white transition-all transform hover:rotate-180 duration-300"
            title="Swap currencies"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* To Currency */}
        <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-3 focus-within:border-sky-500 transition-colors">
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">You Receive / Target</label>
          <div className="flex items-center gap-3">
            <div className={`w-full text-xl font-bold truncate ${rateMode === 'manual' ? 'text-amber-300' : 'text-sky-400'}`}>
              {result !== null
                ? `${toMeta.symbol}${result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '...'}
            </div>
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="bg-slate-800 text-sm font-semibold text-white rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none cursor-pointer hover:bg-slate-700/80 transition-colors"
            >
              {currencyCodes.map((code) => (
                <option key={code} value={code} className="bg-slate-900 text-white">
                  {CURRENCIES[code].flag} {code}
                </option>
              ))}
            </select>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {toMeta.flag} {toMeta.name} ({toMeta.symbol})
          </div>
        </div>
      </div>

      {/* Result Footer Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 rounded-xl p-4 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
            <span>Exchange Rate:</span>
            <span className={`font-semibold ${rateMode === 'manual' ? 'text-amber-300' : 'text-white'}`}>
              1 {fromCode} = {rate ? rate.toFixed(4) : '...'} {toCode}
            </span>
            {rate && (
              <span className="text-[10px] text-slate-500">
                (1 {toCode} = {(1 / rate).toFixed(4)} {fromCode})
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-2">
            <span>Provider: {rateProvider || 'Open Exchange Rates'}</span>
            <span>&bull;</span>
            <span>
              Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Live'}
            </span>
            {rateMode === 'manual' && (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                Custom Rate Active
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleCopy}
          disabled={result === null}
          className="flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-all disabled:opacity-50"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{isCopied ? 'Copied to Clipboard' : 'Copy Converted Result'}</span>
        </button>
      </div>
    </div>
  );
};
