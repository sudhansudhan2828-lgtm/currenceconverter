import React from 'react';
import { Download, Chrome, CheckCircle2, FolderCheck, ShieldCheck, ArrowRight, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExtensionDownloadPage: React.FC = () => {
  return (
    <div className="bg-white min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Download className="w-3.5 h-3.5" /> Manifest V3 Extension
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Install HoverCurrency Extension
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Experience instant hover conversions on Google Chrome, Microsoft Edge, Brave, and all Chromium browsers.
          </p>
          <div className="pt-2">
            <a
              href="/HoverCurrency-Extension-v1.0.0.zip"
              download="HoverCurrency-Extension-v1.0.0.zip"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Extension (.ZIP)</span>
            </a>
          </div>
        </div>

        {/* Guide Steps */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Chrome className="w-5 h-5 text-blue-600" />
            <span>How to Load the Extension in 3 Easy Steps</span>
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-sm border border-blue-200">
                1
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Download &amp; Unzip</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Click the <strong>Download Extension</strong> button above, then extract the downloaded ZIP file to a folder on your computer.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-sm border border-blue-200">
                2
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Open Extensions Manager &amp; Toggle Developer Mode</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  In Chrome, go to <code className="bg-slate-100 px-2 py-0.5 rounded text-blue-700 font-mono text-xs border border-slate-200">chrome://extensions</code> (or <code className="bg-slate-100 px-2 py-0.5 rounded text-blue-700 font-mono text-xs border border-slate-200">edge://extensions</code>). Then switch on <strong>Developer mode</strong> in the top-right corner.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-sm border border-blue-200">
                3
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Click "Load unpacked"</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-2">
                  Click the <strong>Load unpacked</strong> button at the top-left and select the extracted extension folder. HoverCurrency is instantly installed!
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero external currency APIs &bull; Local storage only</span>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
