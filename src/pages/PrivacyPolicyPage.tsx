import React from 'react';
import { Shield, Lock, EyeOff, CheckCircle } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-slate-300">
      <div className="text-center mb-12">
        <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Last Updated: November 2026 &bull; Effective immediately for HoverCurrency Website &amp; Extension
        </p>
      </div>

      <div className="space-y-8 glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-sky-400" />
            1. Overview &amp; Single-Purpose Commitment
          </h2>
          <p>
            HoverCurrency ("we", "our", or "the extension") is engineered with a strict privacy-first principle. 
            The sole purpose of the extension is to detect currency symbols and price figures on web pages you browse 
            and display their converted value in your preferred target currency through a non-intrusive tooltip.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-400" />
            2. Data We DO NOT Collect
          </h2>
          <ul className="space-y-2 list-none pl-1">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>No Browsing History:</strong> We do not track, log, or store the URLs or web pages you visit.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>No Keystroke or Form Data:</strong> The extension ignores input fields, text areas, password boxes, and sensitive user inputs.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>No Sale of Data:</strong> We never sell, rent, or monetize your data with third-party advertisers or brokers.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">
            3. Information Stored Locally on Your Device
          </h2>
          <p>
            The extension uses Chrome and Edge's built-in <code className="bg-slate-900 px-1.5 py-0.5 rounded text-sky-300 font-mono text-xs">chrome.storage</code> API 
            to remember your user preferences:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
            <li>Your chosen target currency (e.g., USD, INR, EUR).</li>
            <li>Your manually entered personal exchange rate from Google.</li>
            <li>Daily notification preferences and dismissal timestamps.</li>
            <li>Excluded website list (domains where hover is disabled).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">
            4. Permissions Justification (Chrome Web Store)
          </h2>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="font-semibold text-white text-xs font-mono text-sky-400">storage</div>
              <div className="text-xs text-slate-400 mt-1">Used exclusively to persist your target currency, exchange rate overrides, and reminder settings across browser sessions.</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="font-semibold text-white text-xs font-mono text-sky-400">alarms &amp; notifications</div>
              <div className="text-xs text-slate-400 mt-1">Used solely to dispatch a single daily notification every 24 hours reminding you to refresh your personal rate, if enabled.</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="font-semibold text-white text-xs font-mono text-sky-400">activeTab</div>
              <div className="text-xs text-slate-400 mt-1">Allows the hover engine to read price text elements in the current active tab only when you hover over them.</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">
            5. Subscriptions &amp; Payment Processing
          </h2>
          <p>
            Payment transactions for the Pro Plan ($9 every 3 months) are processed securely through 
            <strong>Dodo Payments</strong>. We do not store or process your credit card numbers or financial credentials 
            on our servers. All transactions are governed by Dodo Payments' PCI-DSS compliant infrastructure.
          </p>
        </section>

        <section className="pt-4 border-t border-slate-800">
          <h2 className="text-lg font-bold text-white mb-2">
            6. Contact &amp; Inquiries
          </h2>
          <p>
            If you have questions about this Privacy Policy or your data, please contact our support team at:
            <br />
            <a href="mailto:support@hovercurrency.com" className="text-sky-400 hover:text-sky-300 font-semibold underline mt-1 inline-block">
              support@hovercurrency.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

