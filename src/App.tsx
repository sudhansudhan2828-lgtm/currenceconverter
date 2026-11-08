import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { LandingPage } from './pages/LandingPage.js';
import { HowItWorksPage } from './pages/HowItWorksPage.js';
import { ConverterPage } from './pages/ConverterPage.js';
import { PricingPage } from './pages/PricingPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { AuthPage } from './pages/AuthPage.js';
import { CheckoutSimulationPage } from './pages/CheckoutSimulationPage.js';
import { ExtensionDownloadPage } from './pages/ExtensionDownloadPage.js';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.js';

// Automatically routes email password reset tokens/hashes from anywhere to /auth?mode=update-password
const AuthRecoveryWatcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    const isRecovery =
      hash.includes('type=recovery') ||
      (hash.includes('access_token') && hash.includes('recovery')) ||
      search.includes('type=recovery') ||
      (search.includes('mode=update-password') && location.pathname !== '/auth');

    if (isRecovery && location.pathname !== '/auth') {
      navigate(`/auth?mode=update-password${hash}`);
    }
  }, [location, navigate]);

  return null;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthRecoveryWatcher />
        <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/features" element={<HowItWorksPage />} />
              <Route path="/converter" element={<ConverterPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/checkout-simulation" element={<CheckoutSimulationPage />} />
              <Route path="/extension" element={<ExtensionDownloadPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};
