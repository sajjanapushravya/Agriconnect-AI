import React, { useState } from 'react';
import { ArrowLeft, Sparkles, TrendingUp, Package, Volume2 } from 'lucide-react';
import { speakText } from '../../utils/i18n';
import { Product, Order } from '../../types';

interface FarmerAdviceViewProps {
  onBack: () => void;
  onSellProduce: () => void;
  products?: Product[];
  orders?: Order[];
}

const CROPS = [
  {
    name: 'Tomato',
    emoji: '🍅',
    statement: 'Tomato demand may increase next week due to local market supply shortages.',
    expectedDemand: 'HIGH',
    demandColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    recommendation: 'Consider keeping around 300 kg available.',
    marketPrice: 30,
    directPrice: 25,
    unit: 'kg'
  },
  {
    name: 'Onion',
    emoji: '🧅',
    statement: 'Steady restaurant and household demand expected through the month.',
    expectedDemand: 'STABLE',
    demandColor: 'bg-amber-100 text-amber-800 border-amber-300',
    recommendation: 'Good time to harvest 200–250 kg for direct dispatch.',
    marketPrice: 35,
    directPrice: 30,
    unit: 'kg'
  },
  {
    name: 'Chilli',
    emoji: '🌶️',
    statement: 'High regional buyer inquiries for fresh green chillies.',
    expectedDemand: 'HIGH',
    demandColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    recommendation: 'Consider keeping 80–100 kg ready for quick sale.',
    marketPrice: 65,
    directPrice: 55,
    unit: 'kg'
  },
  {
    name: 'Potato',
    emoji: '🥔',
    statement: 'Continuous retail buying observed across nearby city clusters.',
    expectedDemand: 'STABLE',
    demandColor: 'bg-amber-100 text-amber-800 border-amber-300',
    recommendation: 'Pack in 25 kg bags for faster buyer pickup.',
    marketPrice: 28,
    directPrice: 24,
    unit: 'kg'
  },
  {
    name: 'Mango',
    emoji: '🥭',
    statement: 'Early seasonal demand peaking with buyers looking for direct orchard harvest.',
    expectedDemand: 'HIGH',
    demandColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    recommendation: 'Graded A-quality boxes will sell out within 24 hours.',
    marketPrice: 95,
    directPrice: 80,
    unit: 'kg'
  },
  {
    name: 'Tamarind',
    emoji: '🟤',
    statement: 'Wholesale and consumer bulk buying demand is growing steadily.',
    expectedDemand: 'GROWING',
    demandColor: 'bg-blue-100 text-blue-800 border-blue-300',
    recommendation: 'Consider keeping 100 kg clean seedless lots ready.',
    marketPrice: 140,
    directPrice: 120,
    unit: 'kg'
  }
];

export const FarmerAdviceView: React.FC<FarmerAdviceViewProps> = ({
  onBack,
  onSellProduce
}) => {
  const [selectedCrop, setSelectedCrop] = useState(CROPS[0]);

  const handleListen = () => {
    const text = `${selectedCrop.name}. ${selectedCrop.statement} Expected demand is ${selectedCrop.expectedDemand}. ${selectedCrop.recommendation}`;
    speakText(text);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-black text-stone-900 flex items-center gap-1.5">
          <span>🤖</span>
          <span>AI Advice</span>
        </h2>
        <button
          onClick={handleListen}
          title="Listen to advice"
          className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200 active:scale-95"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Select Crop Pills */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
          Select Crop
        </span>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CROPS.map((crop) => {
            const isSelected = crop.name === selectedCrop.name;
            return (
              <button
                key={crop.name}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3.5 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span>{crop.emoji}</span>
                <span>{crop.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main AI Advice Card per exact requirement */}
      <div className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{selectedCrop.emoji}</span>
            <div>
              <h3 className="text-xl font-black text-stone-900 leading-tight">
                {selectedCrop.name}
              </h3>
              <p className="text-xs text-stone-500 font-semibold">
                Weekly AI Market Forecast
              </p>
            </div>
          </div>
          <button
            onClick={handleListen}
            className="flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen</span>
          </button>
        </div>

        {/* The Exact AI Statement */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <p className="text-base sm:text-lg font-black text-stone-900 leading-snug">
              “{selectedCrop.statement}”
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-bold text-stone-600">Expected Demand:</span>
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${selectedCrop.demandColor}`}>
                {selectedCrop.expectedDemand}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider mb-1">
              Recommendation for Farmer
            </span>
            <p className="text-sm font-black text-emerald-950">
              👉 “{selectedCrop.recommendation}”
            </p>
          </div>
        </div>

        {/* Simple Price Benchmark (No ML Terminology) */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 block uppercase">
              Market Price
            </span>
            <span className="text-lg font-black text-stone-700">
              ₹{selectedCrop.marketPrice} / {selectedCrop.unit}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-800 block uppercase">
              Recommended Price
            </span>
            <span className="text-lg font-black text-emerald-950">
              ₹{selectedCrop.directPrice} / {selectedCrop.unit}
            </span>
          </div>
        </div>

        {/* Sell Button */}
        <button
          onClick={onSellProduce}
          className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
        >
          <span>🌾</span>
          <span>Sell {selectedCrop.name} Now</span>
        </button>
      </div>
    </div>
  );
};
