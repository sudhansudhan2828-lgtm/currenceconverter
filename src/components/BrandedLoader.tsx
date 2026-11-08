import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface BrandedLoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({ 
  label = 'Loading...', 
  size = 'md' 
}) => {
  if (size === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
        <div className="relative flex items-center justify-center mb-4">
          {/* Dual spinning outer rings */}
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          <div className="w-12 h-12 rounded-full border-2 border-indigo-100 border-b-indigo-500 animate-spin-slow absolute"></div>
          
          {/* Center Logo Icon */}
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md absolute animate-pulse-subtle">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-700 animate-pulse">{label}</p>
        <p className="text-xs text-slate-400 mt-1">HoverCurrency Ecosystem</p>
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
        <div className="w-4 h-4 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin"></div>
        {label && <span>{label}</span>}
      </div>
    );
  }

  return (
    <div className="py-8 flex flex-col items-center justify-center space-y-3">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-3 border-blue-100 border-t-blue-600 animate-spin"></div>
        <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-sm absolute">
          <ArrowLeftRight className="w-3.5 h-3.5" />
        </div>
      </div>
      {label && <p className="text-xs font-semibold text-slate-600">{label}</p>}
    </div>
  );
};
