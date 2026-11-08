import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Eye, HelpCircle } from 'lucide-react';
import { CURRENCIES, exchangeRateService } from '@currency-converter/shared';

interface ProductItem {
  id: string;
  name: string;
  image: string;
  category: string;
  priceRaw: string;
  originalAmount: number;
  originalCurrency: string;
}

const SAMPLE_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Acoustic Wireless ANC Headphones',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    priceRaw: '$49.99',
    originalAmount: 49.99,
    originalCurrency: 'USD'
  },
  {
    id: 'prod-2',
    name: 'Minimalist Swiss Movement Watch',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
    priceRaw: '€ 129,00',
    originalAmount: 129.00,
    originalCurrency: 'EUR'
  },
  {
    id: 'prod-3',
    name: 'All-Weather Travel Canvas Backpack',
    category: 'Travel Gear',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
    priceRaw: '£85.50',
    originalAmount: 85.50,
    originalCurrency: 'GBP'
  },
  {
    id: 'prod-4',
    name: 'Kyoto Ceramic Tea Ceremony Set',
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
    priceRaw: '¥6,800',
    originalAmount: 6800,
    originalCurrency: 'JPY'
  }
];

export const HoverSimulationDemo: React.FC = () => {
  const [targetCurrency, setTargetCurrency] = useState<string>('INR');
  const [hoveredProduct, setHoveredProduct] = useState<ProductItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [conversionData, setConversionData] = useState<{
    converted: string;
    rate: number;
  } | null>(null);

  const handlePriceMouseEnter = async (e: React.MouseEvent, product: ProductItem) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setHoveredProduct(product);

    try {
      const res = await exchangeRateService.convert(
        product.originalAmount,
        product.originalCurrency,
        targetCurrency
      );
      setConversionData({
        converted: res.formattedConverted,
        rate: res.rate
      });
    } catch {
      setConversionData(null);
    }
  };

  const handlePriceMouseLeave = () => {
    setHoveredProduct(null);
    setConversionData(null);
  };

  return (
    <div className="relative glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Live Simulation
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Try Hover-to-Convert Right Here
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Hover over any price tag below to experience the real floating tooltip in action!
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl">
          <span className="text-xs text-slate-400 px-2 font-medium">Your Target Currency:</span>
          <select
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            className="bg-slate-800 text-xs font-semibold text-white px-2.5 py-1.5 rounded-lg border border-slate-700 outline-none cursor-pointer"
          >
            {['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'BRL', 'SGD', 'AED'].map((c) => (
              <option key={c} value={c}>
                {CURRENCIES[c]?.flag} {c} ({CURRENCIES[c]?.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mock Store Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {SAMPLE_PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden hover:border-slate-700 transition-all group flex flex-col justify-between"
          >
            <div className="relative aspect-square overflow-hidden bg-slate-800/50">
              <img
                src={prod.image}
                alt={prod.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-md">
                {prod.category}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <h4 className="text-sm font-semibold text-slate-100 group-hover:text-sky-400 transition-colors line-clamp-2 mb-3">
                {prod.name}
              </h4>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Price</span>
                  {/* Interactive Hover Price Target */}
                  <span
                    onMouseEnter={(e) => handlePriceMouseEnter(e, prod)}
                    onMouseLeave={handlePriceMouseLeave}
                    className="inline-block font-mono text-base font-bold text-white bg-slate-800/80 hover:bg-sky-500/20 hover:text-sky-300 px-2 py-0.5 rounded-lg border border-slate-700 hover:border-sky-500/40 cursor-help transition-all"
                  >
                    {prod.priceRaw}
                  </span>
                </div>

                <button className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Tooltip in Simulation */}
      {hoveredProduct && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full transition-all duration-150 animate-in fade-in zoom-in-95"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="w-64 bg-slate-900/95 backdrop-blur-xl border border-sky-500/30 rounded-xl p-3.5 shadow-2xl text-slate-100 glow-primary">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400 uppercase font-semibold">
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                HoverCurrency Tooltip
              </span>
              <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Instant
              </span>
            </div>

            <div className="text-xs text-slate-400 mb-0.5">Converted to {targetCurrency}</div>
            <div className="text-xl font-extrabold text-sky-400 tracking-tight flex items-baseline gap-1">
              <span>≈ {conversionData?.converted || '...'}</span>
              <span className="text-xs font-semibold text-slate-400">{targetCurrency}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
              <span className="line-through text-slate-500">{hoveredProduct.priceRaw}</span>
              <span>1 {hoveredProduct.originalCurrency} = {conversionData?.rate.toFixed(2)} {targetCurrency}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

