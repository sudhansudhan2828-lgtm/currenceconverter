import React from 'react';
import { FileText, Shield, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-white min-h-[85vh] py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-slate-700 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mb-4 shadow-sm">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last Updated: November 2026 &bull; Effective for all users of HoverCurrency Website &amp; Extension
        </p>
      </div>

      <div className="space-y-8 bg-slate-50/50 rounded-2xl p-6 sm:p-10 border border-slate-200 text-sm leading-relaxed shadow-sm">
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or using the HoverCurrency website (<a href="https://currenceconverter.me" className="text-blue-600 underline font-semibold">https://currenceconverter.me</a>) or installing the HoverCurrency Chrome/Edge browser extension, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            2. Description of Service
          </h2>
          <p>
            HoverCurrency provides browser extension and web tools that detect prices across third-party websites and display their calculated equivalent in your preferred target currency. Users can convert rates using live exchange references or enter personal custom rates.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            3. Free Plan &amp; Pro Subscriptions
          </h2>
          <p className="mb-2">
            HoverCurrency offers both a Free Plan and a paid Pro Subscription:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-3">
            <li><strong>Free Tier:</strong> Includes up to 29 conversions per month with basic history and standard features.</li>
            <li><strong>Pro Tier ($9 / 3 months):</strong> Includes unlimited conversions worldwide, real-time sync across devices, and premium priority support.</li>
          </ul>
          <p>
            Payments are securely billed and managed through our Merchant of Record, <strong>Dodo Payments</strong>. Subscriptions renew automatically every 3 months unless cancelled. You may cancel your subscription at any time directly through your <Link to="/dashboard" className="text-blue-600 underline">Dashboard</Link> or by contacting support. Upon cancellation, your Pro benefits remain active until the end of the current paid billing cycle.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            4. Financial Disclaimer &amp; Conversion Accuracy
          </h2>
          <p>
            Exchange rates provided by HoverCurrency and user-entered personal rates are for informational and convenience purposes only. While we strive to provide reliable exchange estimates, actual bank transaction fees, credit card foreign transaction surcharges, and dynamic merchant exchange spreads may differ. HoverCurrency does not provide investment, foreign exchange trading, or financial advice.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            5. Acceptable Use &amp; Intellectual Property
          </h2>
          <p>
            You agree not to reverse engineer, decompile, scrape, or distribute harmful code through our software, nor bypass authentication or conversion usage limits. All trademarks, logos, and software code related to HoverCurrency are the property of HoverCurrency.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            6. Contact &amp; Support
          </h2>
          <p>
            If you have questions, feedback, or support inquiries regarding these terms or your subscription, please contact us at:
            <br />
            <strong>Email:</strong> <a href="mailto:sudhansudhann222@gmail.com" className="text-blue-600 underline">sudhansudhann222@gmail.com</a>
            <br />
            <strong>Website:</strong> <a href="https://currenceconverter.me" className="text-blue-600 underline">https://currenceconverter.me</a>
          </p>
        </section>
      </div>
    </div>
  );
};

