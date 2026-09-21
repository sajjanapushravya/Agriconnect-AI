import React from 'react';
import { ArrowLeft, Users, ShoppingBag, Truck, DollarSign, Leaf } from 'lucide-react';

interface SimpleSustainabilityViewProps {
  onBack?: () => void;
  language?: string;
}

export const SimpleSustainabilityView: React.FC<SimpleSustainabilityViewProps> = ({ onBack }) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-9" />
        )}

        <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
          <span>🌱</span>
          <span>Our Impact</span>
        </h2>

        <div className="w-9" />
      </div>

      {/* Hero statement */}
      <div className="bg-emerald-800 text-white rounded-3xl p-6 text-center space-y-2 shadow-sm border-2 border-emerald-700">
        <Leaf className="w-9 h-9 text-emerald-300 mx-auto" />
        <h3 className="text-lg sm:text-xl font-black leading-snug">
          “Fair prices for farmers. Honest savings for buyers.”
        </h3>
        <p className="text-xs text-emerald-100 font-medium">
          Connecting growers directly to consumers without middleman markups.
        </p>
      </div>

      {/* Simple 4 Impact Cards */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Farmers Connected */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-1 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl">
            🌾
          </div>
          <span className="text-2xl font-black text-stone-900 block">125+</span>
          <span className="text-xs font-bold text-stone-500">Farmers Connected</span>
        </div>

        {/* Direct Orders */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-1 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <span className="text-2xl font-black text-stone-900 block">1,480</span>
          <span className="text-xs font-bold text-stone-500">Direct Orders</span>
        </div>

        {/* Distance Saved */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-1 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl">
            🚚
          </div>
          <span className="text-2xl font-black text-stone-900 block">3,420 km</span>
          <span className="text-xs font-bold text-stone-500">Transport Saved</span>
        </div>

        {/* Buyer Savings */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-1 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl">
            💰
          </div>
          <span className="text-2xl font-black text-stone-900 block">₹1.85 L</span>
          <span className="text-xs font-bold text-stone-500">Buyer Savings</span>
        </div>
      </div>
    </div>
  );
};
