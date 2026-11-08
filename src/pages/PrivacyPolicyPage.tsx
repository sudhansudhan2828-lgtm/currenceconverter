import React from 'react';
import { Shield, Lock, EyeOff, CheckCircle } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white min-h-[85vh] py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-slate-700">
      <div className="text-center mb-12">
        <div className="inline-flex p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mb-4 shadow-sm">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last Updated: November 2026 &bull; Effective immediately for HoverCurrency Website &amp; Extension
        </p>
      </div>

      <div className="space-y-8 bg-slate-50/50 rounded-2xl p-6 sm:p-10 border border-slate-200 text-sm leading-relaxed shadow-sm">
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            1. Overview &amp; Single-Purpose Commitment
          </h2>
          <p>
            HoverCurrency ("we", "our", or "the extension") is engineered with a strict privacy-first principle. 
            The sole purpose of the extension is to detect currency symbols and price figures on web pages you browse 
            and display their converted value in your preferred target currency through a non-intrusive tooltip.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-600" />
            2. Data We DO NOT Collect
          </h2>
          <ul className="space-y-2.5 list-none pl-1">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No Browsing History:</strong> We do not track, log, or store the URLs or web pages you visit.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No Keystroke or Form Data:</strong> The extension completely ignores input fields, text areas, password boxes, and sensitive user inputs.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No Sale of Data:</strong> We never sell, rent, or monetize your data with third-party advertisers or brokers.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            3. Local Storage &amp; Exchange Rate Handling
          </h2>
          <p>
            Your personal exchange rate and currency preferences are saved locally inside your browser using the standard 
            Chrome Storage API. The rates you enter remain solely on your device. We do not transmit your personal rates 
            or search history to external servers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            4. Payments &amp; Subscriptions
          </h2>
          <p>
            Paid subscriptions for HoverCurrency Pro are processed exclusively by 
            <a href="https://dodopayments.com" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold underline ml-1">
              Dodo Payments
            </a>, our authorized Merchant of Record. We do not collect or store full credit card numbers or banking passwords on our servers.
          </p>
        </section>
      </div>
    </div>
  );
};
