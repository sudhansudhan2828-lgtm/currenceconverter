import React from 'react';
import { Download, Chrome, CheckCircle2, FolderCheck, Terminal, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExtensionDownloadPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
          <Download className="w-3.5 h-3.5" /> Manifest V3 Extension
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Install HoverCurrency Extension
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Experience instant hover conversions on Google Chrome, Microsoft Edge, Brave, and Chromium browsers.
        </p>
      </div>

      {/* Guide Steps */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Chrome className="w-5 h-5 text-sky-400" />
          How to Load the Extension in 3 Easy Steps
        </h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center flex-shrink-0 text-sm">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Open the Extensions Manager</h3>
              <p className="text-sm text-slate-400 mt-1">
                In Chrome, navigate to <code className="bg-slate-900 px-2 py-0.5 rounded text-sky-300 font-mono text-xs">chrome://extensions</code> (or <code className="bg-slate-900 px-2 py-0.5 rounded text-sky-300 font-mono text-xs">edge://extensions</code> in Microsoft Edge).
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center flex-shrink-0 text-sm">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Toggle &quot;Developer Mode&quot;</h3>
              <p className="text-sm text-slate-400 mt-1">
                Turn on the <strong>Developer mode</strong> toggle located at the top-right corner of the Extensions page.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center flex-shrink-0 text-sm">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Click &quot;Load unpacked&quot;</h3>
              <p className="text-sm text-slate-400 mt-1">
                Click the <strong>Load unpacked</strong> button and select the folder:
              </p>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs text-sky-300 mt-2 select-all flex items-center justify-between">
                <span>c:\Users\Sudhan M\Downloads\Extensions\currency-converter-extension</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ready immediately. No restart required.</span>
          </div>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Dashboard to Pair</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

