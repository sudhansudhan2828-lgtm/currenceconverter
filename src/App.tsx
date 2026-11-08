import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
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
