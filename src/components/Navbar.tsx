import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftRight, Download, Sparkles, User, ExternalLink, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const Navbar: React.FC = () => {
  const { user, subscription, usage } = useAuth();
  const location = useLocation();

  const isPro = subscription.plan === 'pro';

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              HoverCurrency
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                SaaS
              </span>
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <Link
            to="/converter"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/converter' ? 'text-white bg-slate-800/80' : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            Live Converter
          </Link>
          <a
            href="/#how-it-works"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
          >
            How it Works
          </a>
          <a
            href="/#currencies"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
          >
            160+ Currencies
          </a>
          <Link
            to="/pricing"
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              location.pathname === '/pricing' ? 'text-white bg-slate-800/80' : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            Pricing
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              $9 / 3 mos
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Usage Badge */}
          {isPro ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro Unlimited</span>
            </div>
          ) : (
            <Link
              to="/pricing"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-700/60 hover:border-sky-500/50 transition-colors"
              title="Monthly Free Tier Usage"
            >
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span>{usage.count}/29 Free Used</span>
            </Link>
          )}

          {/* Extension Install CTA */}
          <Link
            to="/extension"
            className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Install Extension</span>
          </Link>

          {/* Dashboard / Auth Button */}
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-sky-500/30"
              />
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-500/20 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

