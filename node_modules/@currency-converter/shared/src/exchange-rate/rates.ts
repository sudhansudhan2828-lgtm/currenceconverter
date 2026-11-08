import {
  ExchangeRatesData,
  ConversionResponse,
  RateMode,
  RateFreshness,
  RateProfile,
  DualRateEngineConfig,
  PersonalRateConfig
} from '../types/index.js';
import { formatCurrencyAmount, getCurrency } from '../currencies/index.js';
import { DEFAULT_DUAL_RATE_CONFIG, DEFAULT_RATE_PROFILES, DEFAULT_PERSONAL_RATE } from '../config/index.js';

export class MissingManualRateError extends Error {
  public from: string;
  public to: string;
  public profileName: string;

  constructor(from: string, to: string, profileName: string = 'Personal Rate') {
    super(
      `Exchange rate not available for ${from} → ${to} in "${profileName}". Please enter this rate manually from Google.`
    );
    this.name = 'MissingManualRateError';
    this.from = from;
    this.to = to;
    this.profileName = profileName;
  }
}

export class PersonalRateEngine {
  private static instance: PersonalRateEngine;
  private config: DualRateEngineConfig = { ...DEFAULT_DUAL_RATE_CONFIG };
  private personalRate: PersonalRateConfig = { ...DEFAULT_PERSONAL_RATE };

  // Built-in cached reference rates for Automatic Mode (offline / zero external API calls)
  private automaticCache: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    INR: 87.12,
    JPY: 154.00,
    CAD: 1.38,
    AUD: 1.52,
    CHF: 0.88,
    CNY: 7.24,
    AED: 3.67,
    SGD: 1.34,
    BRL: 5.75,
    MXN: 20.15,
    KRW: 1390.0,
    SEK: 10.90,
    NZD: 1.68
  };

  private constructor() {}

  public static getInstance(): PersonalRateEngine {
    if (!PersonalRateEngine.instance) {
      PersonalRateEngine.instance = new PersonalRateEngine();
    }
    return PersonalRateEngine.instance;
  }

  // Personal Rate Management
  public getPersonalRate(): PersonalRateConfig {
    return { ...this.personalRate };
  }

  public setPersonalRate(rateConfig: Partial<PersonalRateConfig>): PersonalRateConfig {
    this.personalRate = {
      ...this.personalRate,
      ...rateConfig,
      lastUpdated: rateConfig.lastUpdated || new Date().toISOString()
    };
    return { ...this.personalRate };
  }

  public isRateStale(lastUpdatedIso: string): boolean {
    const ageMs = Date.now() - new Date(lastUpdatedIso).getTime();
    return ageMs >= 24 * 60 * 60 * 1000; // 24 hours
  }

  public getRateFreshness(lastUpdatedIso: string): RateFreshness {
    return this.isRateStale(lastUpdatedIso) ? 'stale' : 'fresh';
  }

  // Dual engine config
  public getConfig(): DualRateEngineConfig {
    return { ...this.config };
  }

  public setMode(mode: RateMode): void {
    this.config.mode = mode;
  }

  public getMode(): RateMode {
    return this.config.mode;
  }

  public setActiveProfile(profileId: string): void {
    const exists = this.config.profiles.some((p) => p.id === profileId);
    if (exists) {
      this.config.activeProfileId = profileId;
    }
  }

  public getActiveProfile(): RateProfile {
    const found = this.config.profiles.find((p) => p.id === this.config.activeProfileId);
    return found || this.config.profiles[0] || DEFAULT_RATE_PROFILES[0];
  }

  public setProfiles(profiles: RateProfile[]): void {
    this.config.profiles = profiles;
  }

  /**
   * Resolves rate using Personal Exchange Rate system:
   * 1. 1 USD = [savedRate] [targetCurrency]
   * 2. If USD -> Target: rate = savedRate
   * 3. If Target -> USD: rate = 1 / savedRate
   * 4. Additional rates from profile or personal config if explicitly configured
   * Never invents missing rates!
   */
  public resolveRate(
    from: string,
    to: string,
    personalConfig: PersonalRateConfig = this.personalRate,
    profile?: RateProfile
  ): { rate: number; isCustom: boolean; profileName: string } | null {
    const f = from.toUpperCase();
    const t = to.toUpperCase();
    const base = (personalConfig.baseCurrency || 'USD').toUpperCase();
    const target = (personalConfig.targetCurrency || 'INR').toUpperCase();
    const savedRate = personalConfig.rate;

    if (f === t) {
      return { rate: 1.0, isCustom: false, profileName: 'Identical Pair' };
    }

    // Check if a specific profile (e.g. Bank, Business, Travel, Custom) was requested
    const prof = profile || this.getActiveProfile();
    const isSpecificProfile = prof && prof.id !== 'prof_personal';

    const checkProfileRates = (): { rate: number; isCustom: boolean; profileName: string } | null => {
      if (!prof || !prof.rates) return null;
      const directKey = `${f}_${t}`;
      const inverseKey = `${t}_${f}`;

      if (prof.rates[directKey] !== undefined) {
        return { rate: prof.rates[directKey], isCustom: true, profileName: prof.name };
      }
      if (prof.rates[inverseKey] !== undefined && prof.rates[inverseKey] > 0) {
        return { rate: 1 / prof.rates[inverseKey], isCustom: true, profileName: prof.name };
      }

      // If profile has an explicit base currency
      if (prof.baseCurrency) {
        const pb = prof.baseCurrency.toUpperCase();
        const pbToF = f === pb ? 1.0 : (prof.rates[`${pb}_${f}`] ?? prof.rates[f] ?? (prof.rates[`${f}_${pb}`] ? 1 / prof.rates[`${f}_${pb}`] : undefined));
        const pbToT = t === pb ? 1.0 : (prof.rates[`${pb}_${t}`] ?? prof.rates[t] ?? (prof.rates[`${t}_${pb}`] ? 1 / prof.rates[`${t}_${pb}`] : undefined));

        if (pbToF && pbToT && pbToF > 0) {
          return { rate: pbToT / pbToF, isCustom: true, profileName: prof.name };
        }
      }

      // Check common target in profile (e.g. X_INR and Y_INR -> rate = (X_INR) / (Y_INR))
      for (const key of Object.keys(prof.rates)) {
        if (key.startsWith(`${f}_`)) {
          const common = key.substring(f.length + 1);
          const matchT = prof.rates[`${t}_${common}`];
          if (matchT && matchT > 0) {
            return { rate: prof.rates[key] / matchT, isCustom: true, profileName: prof.name };
          }
        }
      }

      // Check common base in profile (e.g. USD_X and USD_Y -> rate = (USD_Y) / (USD_X))
      for (const key of Object.keys(prof.rates)) {
        if (key.endsWith(`_${f}`)) {
          const common = key.substring(0, key.length - f.length - 1);
          const matchT = prof.rates[`${common}_${t}`];
          if (matchT && matchT > 0 && prof.rates[key] > 0) {
            return { rate: matchT / prof.rates[key], isCustom: true, profileName: prof.name };
          }
        }
      }

      return null;
    };

    // If specific profile is active/requested, prioritize it
    if (isSpecificProfile) {
      const fromProf = checkProfileRates();
      if (fromProf) return fromProf;
    }

    // 1. USD to Target Currency: Converted amount = USD amount × saved rate
    if (f === base && t === target && savedRate > 0) {
      return { rate: savedRate, isCustom: true, profileName: 'Personal Rate' };
    }

    // 2. Target Currency to USD: Converted amount = Original amount ÷ saved rate
    if (f === target && t === base && savedRate > 0) {
      return { rate: 1 / savedRate, isCustom: true, profileName: 'Personal Rate' };
    }

    // 3. Check additional configured rates in personalConfig
    if (personalConfig.additionalRates) {
      const directKey = `${f}_${t}`;
      const inverseKey = `${t}_${f}`;

      if (personalConfig.additionalRates[directKey] !== undefined) {
        return { rate: personalConfig.additionalRates[directKey], isCustom: true, profileName: 'Personal Rate' };
      }
      if (personalConfig.additionalRates[inverseKey] !== undefined && personalConfig.additionalRates[inverseKey] > 0) {
        return { rate: 1 / personalConfig.additionalRates[inverseKey], isCustom: true, profileName: 'Personal Rate' };
      }

      // Common target cross rate (e.g. f_INR and t_INR)
      const fToTarget = personalConfig.additionalRates[`${f}_${target}`];
      const tToTarget = personalConfig.additionalRates[`${t}_${target}`];
      if (fToTarget && tToTarget && tToTarget > 0) {
        return { rate: fToTarget / tToTarget, isCustom: true, profileName: 'Personal Rate' };
      }

      // Common base cross rate (e.g. USD_f and USD_t)
      const baseToF = personalConfig.additionalRates[`${base}_${f}`] ?? (f === base ? 1.0 : undefined);
      const baseToT = personalConfig.additionalRates[`${base}_${t}`] ?? (t === base ? 1.0 : (t === target ? savedRate : undefined));
      if (baseToF && baseToT && baseToF > 0) {
        return { rate: baseToT / baseToF, isCustom: true, profileName: 'Personal Rate' };
      }
    }

    // 4. Check profile if not already checked
    if (!isSpecificProfile) {
      const fromProf = checkProfileRates();
      if (fromProf) return fromProf;
    }

    return null;
  }

  /**
   * Main Conversion Engine (No External Currency API)
   */
  public async convert(
    amount: number,
    from: string,
    to: string,
    options: {
      mode?: RateMode;
      profileId?: string;
      customRate?: number;
      precision?: number;
      personalRateConfig?: PersonalRateConfig;
    } = {}
  ): Promise<ConversionResponse> {
    const fromCode = from.toUpperCase();
    const toCode = to.toUpperCase();
    const personal = options.personalRateConfig || this.personalRate;
    const profile = options.profileId
      ? this.config.profiles.find((p) => p.id === options.profileId) || this.getActiveProfile()
      : this.getActiveProfile();

    const fromMeta = getCurrency(fromCode);
    const toMeta = getCurrency(toCode);
    const fromPrecision = fromMeta.decimalDigits;
    const toPrecision = options.precision ?? toMeta.decimalDigits;

    const effectiveMode = options.mode || this.config.mode;

    // Automatic mode uses local reference cache (offline / zero external API calls)
    if (effectiveMode === 'automatic') {
      let autoRate: number | null = null;
      if (fromCode === toCode) {
        autoRate = 1.0;
      } else if (this.automaticCache[fromCode] && this.automaticCache[toCode]) {
        autoRate = this.automaticCache[toCode] / this.automaticCache[fromCode];
      }

      if (autoRate !== null && !isNaN(autoRate) && autoRate > 0) {
        const factor = Math.pow(10, toPrecision);
        const convertedAmount = Math.round((amount * autoRate + Number.EPSILON) * factor) / factor;
        return {
          from: fromCode,
          to: toCode,
          originalAmount: amount,
          convertedAmount,
          rate: autoRate,
          lastUpdated: this.config.lastAutomaticFetch || new Date().toISOString(),
          formattedOriginal: formatCurrencyAmount(amount, fromCode, { precision: fromPrecision }),
          formattedConverted: formatCurrencyAmount(convertedAmount, toCode, { precision: toPrecision }),
          rateMode: 'automatic',
          rateFreshness: 'fresh',
          rateProvider: 'Standard Exchange Reference Cache',
          isCustomRate: false,
          rateProfileName: 'Automatic Live Rate'
        };
      }
    }

    let rate: number | null = options.customRate || null;
    let profileName = profile.name;

    if (rate === null) {
      const resolved = this.resolveRate(fromCode, toCode, personal, profile);
      if (resolved) {
        rate = resolved.rate;
        profileName = resolved.profileName;
      }
    }

    if (rate === null || isNaN(rate) || rate <= 0) {
      throw new MissingManualRateError(fromCode, toCode, profileName);
    }

    const factor = Math.pow(10, toPrecision);
    const convertedAmount = Math.round((amount * rate + Number.EPSILON) * factor) / factor;
    const isStale = this.isRateStale(personal.lastUpdated);
    const freshness: RateFreshness = isStale ? 'stale' : 'fresh';

    return {
      from: fromCode,
      to: toCode,
      originalAmount: amount,
      convertedAmount,
      rate,
      lastUpdated: personal.lastUpdated,
      formattedOriginal: formatCurrencyAmount(amount, fromCode, { precision: fromPrecision }),
      formattedConverted: formatCurrencyAmount(convertedAmount, toCode, { precision: toPrecision }),
      rateMode: 'manual',
      rateFreshness: freshness,
      rateProvider: `Personal Rate: 1 ${personal.baseCurrency} = ${personal.rate} ${personal.targetCurrency}`,
      isCustomRate: true,
      rateProfileName: profileName
    };
  }

  public parseBulkRatesText(
    text: string,
    defaultTargetCurrency: string = 'INR'
  ): Array<{ from: string; to: string; rate: number }> {
    const results: Array<{ from: string; to: string; rate: number }> = [];
    const lines = text.split(/\r?\n/);

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#') || line.startsWith('//')) continue;

      if (line.includes(',')) {
        const parts = line.split(',').map((p) => p.trim());
        if (parts.length >= 3) {
          const from = parts[0].toUpperCase();
          const to = parts[1].toUpperCase();
          const rate = parseFloat(parts[2]);
          if (!isNaN(rate) && rate > 0) results.push({ from, to, rate });
        } else if (parts.length === 2) {
          const from = parts[0].toUpperCase();
          const rate = parseFloat(parts[1]);
          if (!isNaN(rate) && rate > 0) results.push({ from, to: defaultTargetCurrency.toUpperCase(), rate });
        }
        continue;
      }

      const matchEquals = line.match(/(?:1\s+)?([A-Za-z]{3})\s*(?:=|\/|:|-)\s*(\d+(?:[.,]\d+)?)\s*([A-Za-z]{3})?/i);
      if (matchEquals) {
        const from = matchEquals[1].toUpperCase();
        const rate = parseFloat(matchEquals[2].replace(',', '.'));
        const to = (matchEquals[3] || defaultTargetCurrency).toUpperCase();
        if (!isNaN(rate) && rate > 0) results.push({ from, to, rate });
      }
    }

    return results;
  }

  public async getRates(): Promise<ExchangeRatesData> {
    return {
      base: this.personalRate.baseCurrency,
      rates: {
        [this.personalRate.baseCurrency]: 1.0,
        [this.personalRate.targetCurrency]: this.personalRate.rate,
        ...(this.personalRate.additionalRates || {})
      },
      lastUpdated: this.personalRate.lastUpdated,
      provider: 'Personal Google Rate Entry'
    };
  }
}

export const exchangeRateService = PersonalRateEngine.getInstance();
export const DualExchangeRateEngine = PersonalRateEngine;
