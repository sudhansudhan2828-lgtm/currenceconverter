import React from 'react';
import { ArrowLeftRight, Heart, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-slate-900">HoverCurrency</span>
          </div>
          <p className="text-sm text-slate-500 max-w-sm mb-4 leading-relaxed">
            The instant hover-to-convert currency extension for Chrome and Edge. Convert any price anywhere on the web using personal exchange rates with zero API keys.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secured exclusively with Dodo Payments recurring subscriptions</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-900 mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
            <li><Link to="/how-it-works" className="hover:text-blue-600 transition-colors">How It Works</Link></li>
            <li><Link to="/pricing" className="hover:text-blue-600 transition-colors">Pricing & Plans</Link></li>
            <li><Link to="/extension" className="hover:text-blue-600 transition-colors">Browser Extension</Link></li>
            <li><Link to="/dashboard" className="hover:text-blue-600 transition-colors">User Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-900 mb-3">Resources & Legal</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/how-it-works#features" className="hover:text-blue-600 transition-colors">Features</Link></li>
            <li><a href="https://dodopayments.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors inline-flex items-center gap-1">Dodo Payments <ExternalLink className="w-3 h-3" /></a></li>
            <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>&copy; {new Date().getFullYear()} HoverCurrency. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for global shoppers & travelers
          </span>
        </div>
      </div>
    </footer>
  );
};
