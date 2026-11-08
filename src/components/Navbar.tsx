import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Crown, LogOut, Menu, X, Home, Clock, Settings, CreditCard, User, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const Navbar: React.FC = () => {
  const { user, subscription, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPro = subscription.plan === 'pro';
  const isDashboardView = ['/dashboard', '/settings', '/history', '/converter'].some(p => location.pathname.startsWith(p));

  // Automatically close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            HoverCurrency
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        {isDashboardView ? (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/dashboard"
              className={`py-5 transition-colors relative ${
                location.pathname === '/dashboard' && !location.search.includes('history')
                  ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/converter"
              className={`py-5 transition-colors relative ${
                location.pathname === '/converter'
                  ? 'text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Conversions
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

        {/* Right CTA / Controls Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <>
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

              {!isDashboardView && (
                <Link
                  to="/dashboard"
                  className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              <Link
                to="/settings"
                className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
                title={`${user?.name || 'User'} (${user?.email || ''})`}
              >
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : (user?.email ? user.email.slice(0, 2).toUpperCase() : 'U')}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          {user && (
            <Link
              to="/settings"
              className="w-7 h-7 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-sm"
            >
              {user?.name ? user.name.slice(0, 1).toUpperCase() : (user?.email ? user.email.slice(0, 1).toUpperCase() : 'U')}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar for Dashboard Views */}
      {isDashboardView && (
        <div className="md:hidden border-t border-slate-100 bg-slate-50/80 px-4 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              location.pathname === '/dashboard' && !location.search.includes('history')
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/converter"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              location.pathname === '/converter'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            Conversions
          </Link>
          <Link
            to="/dashboard?tab=history"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              location.search.includes('history')
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            History
          </Link>
          <Link
            to="/settings"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              location.pathname === '/settings'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            Settings
          </Link>
          <Link
            to="/pricing"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              location.pathname === '/pricing'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            Billing
          </Link>
        </div>
      )}

      {/* Mobile Drawer Menu (Expandable) */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-fade-in">
          {user ? (
            <div className="space-y-3">
              {/* User Banner */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900">{user?.name || 'User'}</div>
                  <div className="text-xs text-slate-500 truncate max-w-[190px]">{user?.email}</div>
                </div>
                <Link
                  to="/pricing"
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    isPro
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <Crown className="w-3 h-3" />
                  <span>{isPro ? 'Pro' : 'Free'}</span>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Home className="w-4 h-4 text-blue-600" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/converter"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeftRight className="w-4 h-4 text-slate-400" />
                  <span>Conversions</span>
                </Link>
                <Link
                  to="/dashboard?tab=history"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>History</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </Link>
                <Link
                  to="/pricing"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span>Pricing &amp; Billing</span>
                </Link>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/how-it-works#features"
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/how-it-works"
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  How It Works
                </Link>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/auth"
                  className="w-full py-2.5 rounded-xl font-semibold text-sm text-center text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/extension"
                  className="w-full py-2.5 rounded-xl font-bold text-sm text-center text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Get Extension
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
