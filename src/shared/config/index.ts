import { RateProfile, DualRateEngineConfig, PersonalRateConfig } from '../types/index.js';

export const DEFAULT_PERSONAL_RATE: PersonalRateConfig = {
  baseCurrency: 'USD',
  targetCurrency: 'INR',
  rate: 87.12,
  lastUpdated: new Date().toISOString(),
  dailyReminderEnabled: true,
  additionalRates: {
    'EUR_INR': 94.70,
    'GBP_INR': 110.50,
    'JPY_INR': 0.58,
    'CAD_INR': 63.50,
    'AUD_INR': 57.80
  }
};

export const DEFAULT_RATE_PROFILES: RateProfile[] = [
  {
    id: 'prof_personal',
    name: 'Personal Rate',
    description: 'Custom rates obtained from Google for personal purchases and budgeting',
    baseCurrency: 'INR',
    rates: {
      'USD_INR': 87.12,
      'EUR_INR': 94.70,
      'GBP_INR': 110.50,
      'JPY_INR': 0.58,
      'CAD_INR': 63.50,
      'AUD_INR': 57.80,
      'AED_INR': 23.75,
      'SGD_INR': 65.20
    },
    isDefault: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prof_bank',
    name: 'Bank Exchange Rate',
    description: 'Typical credit card and bank foreign exchange rate with 2-3% spread',
    baseCurrency: 'INR',
    rates: {
      'USD_INR': 89.50,
      'EUR_INR': 97.20,
      'GBP_INR': 113.80,
      'JPY_INR': 0.60,
      'CAD_INR': 65.20,
      'AUD_INR': 59.40,
      'AED_INR': 24.40,
      'SGD_INR': 67.00
    },
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prof_business',
    name: 'Business Rate',
    description: 'Corporate accounting and invoice valuation rates',
    baseCurrency: 'USD',
    rates: {
      'USD_EUR': 0.92,
      'USD_GBP': 0.79,
      'USD_INR': 87.00,
      'USD_JPY': 154.00,
      'USD_CAD': 1.38,
      'USD_AUD': 1.52
    },
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prof_travel',
    name: 'Travel Rate',
    description: 'Cash airport exchange and kiosk rates for holiday trips',
    baseCurrency: 'INR',
    rates: {
      'USD_INR': 90.00,
      'EUR_INR': 98.00,
      'GBP_INR': 115.00,
      'JPY_INR': 0.62,
      'AED_INR': 25.00,
      'THB_INR': 2.65
    },
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prof_custom',
    name: 'Custom Rate',
    description: 'User-defined direct currency pairs and overrides',
    rates: {
      'EUR_INR': 94.70,
      'USD_INR': 87.12
    },
    updatedAt: new Date().toISOString()
  }
];

export const DEFAULT_DUAL_RATE_CONFIG: DualRateEngineConfig = {
  mode: 'manual', // Default to personal manual rate engine
  activeProfileId: 'prof_personal',
  profiles: DEFAULT_RATE_PROFILES,
  fallbackToAutomaticOnError: false
};

export const APP_CONFIG = {
  appName: 'HoverCurrency',
  appTagline: 'Instant Hover-to-Convert Currency Ecosystem',
  websiteUrl: 'https://currenceconverter.me',
  apiUrl: 'http://localhost:3000/api',
  plans: {
    free: {
      name: 'Free',
      price: 0,
      monthlyConversionsLimit: 29,
      features: [
        '29 successful conversions per month',
        'Personal exchange rate system (Google rate entry)',
        'Hover-to-convert engine on all websites',
        'Daily update reminders & stale rate alerts',
        'Target currency selection (160+ currencies)',
        'Usage counter & reset tracker'
      ]
    },
    pro: {
      name: 'Pro',
      price: 9,
      interval: '3 months',
      intervalCount: 3,
      monthlyConversionsLimit: Infinity,
      features: [
        'Unlimited currency conversions',
        'Unlimited hover-to-convert usage',
        'Premium rate profiles (Personal, Bank, Business, Travel)',
        'Cross-device browser sync',
        'Priority 24/7 support',
        'No conversion limits'
      ]
    }
  },
  defaultPreferences: {
    defaultBaseCurrency: 'USD',
    defaultTargetCurrency: 'INR',
    hoverEnabled: true,
    tooltipTheme: 'dark' as const,
    precision: 2,
    autoDetectSource: true,
    excludedDomains: [
      'paypal.com',
      'chase.com',
      'bankofamerica.com',
      'wellsfargo.com'
    ],
    showRateTimestamp: true,
    rateMode: 'manual' as const,
    activeProfileId: 'prof_personal'
  },
  personalRate: DEFAULT_PERSONAL_RATE,
  dualRateEngine: DEFAULT_DUAL_RATE_CONFIG,
  dodoPayments: {
    sandboxUrl: 'https://test.dodopayments.com',
    productionUrl: 'https://api.dodopayments.com',
    defaultProductId: 'p_quarterly_pro_9'
  }
};
