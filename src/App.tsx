import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { LandingPage } from './pages/LandingPage.js';
import { ConverterPage } from './pages/ConverterPage.js';
import { PricingPage } from './pages/PricingPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { AuthPage } from './pages/AuthPage.js';
import { CheckoutSimulationPage } from './pages/CheckoutSimulationPage.js';
import { ExtensionDownloadPage } from './pages/ExtensionDownloadPage.js';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.js';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/converter" element={<ConverterPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
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

