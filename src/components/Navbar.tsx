import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftRight, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const Navbar: React.FC = () => {
  const { user, subscription } = useAuth();
  const location = useLocation();

  const isPro = subscription.plan === 'pro';
  const isDashboardView = ['/dashboard', '/settings', '/history'].some(p => location.pathname.startsWith(p));

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            HoverCurrency
          </span>
        </Link>

        {/* Center Navigation Links / Tabs */}
        {isDashboardView ? (
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              to="/dashboard"
              className={`py-5 transition-colors relative ${
                location.pathname === '/dashboard'
                  ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard?tab=history"
              className={`py-5 transition-colors relative ${
                location.search.includes('history')
                  ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              History
            </Link>
            <Link
              to="/settings"
              className={`py-5 transition-colors relative ${
                location.pathname === '/settings'
                  ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Settings
            </Link>
            <Link
              to="/pricing"
              className={`py-5 transition-colors relative ${
                location.pathname === '/pricing'
                  ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Billing
            </Link>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link
              to="/"
              className={`py-5 transition-colors relative ${
                location.pathname === '/'
                  ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/how-it-works#features"
              className={`py-5 transition-colors relative ${
                location.pathname === '/how-it-works' && location.hash === '#features'
                  ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className={`py-5 transition-colors relative ${
                location.pathname === '/pricing'
                  ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/how-it-works"
              className={`py-5 transition-colors relative ${
                location.pathname === '/how-it-works' && location.hash !== '#features'
                  ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              How It Works
            </Link>
          </nav>
        )}

        {/* Right CTA / User controls */}
        {isDashboardView ? (
          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isPro
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{isPro ? 'Pro' : 'Free Plan'}</span>
            </Link>
            <Link
              to="/settings"
              className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
              title={user?.name || 'Sudhan M'}
            >
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'SM'}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/auth"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/extension"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
            >
              Get Extension
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
