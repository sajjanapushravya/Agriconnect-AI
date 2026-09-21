import React from 'react';
import { ArrowRight, Sparkles, TrendingUp, Package, Wallet, ShoppingCart, Sprout } from 'lucide-react';
import { User, UserRole } from '../../types';

interface SimpleHomeScreenProps {
  currentRole: UserRole;
  currentUser?: User | null;
  onNavigate: (view: string) => void;
}

export const SimpleHomeScreen: React.FC<SimpleHomeScreenProps> = ({
  currentRole,
  currentUser,
  onNavigate
}) => {
  const isFarmer = currentRole === 'farmer' || currentRole === 'fpo';

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-5 shadow-sm space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-bold">
          <span>🌱</span>
          <span>{isFarmer ? 'Farmer Portal' : 'Customer Marketplace'}</span>
        </div>
        <h2 className="text-xl font-black tracking-tight">
          Hello, {currentUser?.name || (isFarmer ? 'Farmer Ramesh' : 'Customer')} 👋
        </h2>
        <p className="text-xs text-emerald-100 font-medium">
          {isFarmer
            ? 'Connect directly with buyers and get better prices for your produce.'
            : 'Get farm-fresh produce delivered directly to your doorstep.'}
        </p>
      </div>

      {/* FARMER HOME CARDS */}
      {isFarmer ? (
        <div className="space-y-3.5">
          {/* Card 1: 🌾 SELL PRODUCE */}
          <div
            onClick={() => onNavigate('sell')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-3xl p-5 shadow-md cursor-pointer transition-all active:scale-98 flex items-center justify-between group border-2 border-emerald-600"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shrink-0">
                🌾
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">
                  SELL PRODUCE
                </h3>
                <p className="text-xs text-emerald-100 font-medium mt-0.5">
                  List your harvest in 3 simple steps
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Card 2: 📦 MY ORDERS */}
          <div
            onClick={() => onNavigate('orders')}
            className="bg-white hover:bg-stone-50 text-stone-900 rounded-3xl p-5 border-2 border-stone-200 shadow-xs cursor-pointer transition-all active:scale-98 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center text-3xl shrink-0 border border-amber-200/60">
                📦
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">
                  MY ORDERS
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  View and manage customer shipments
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-stone-600" />
            </div>
          </div>

          {/* Card 3: 🚚 DELIVERY PLAN */}
          <div
            onClick={() => onNavigate('delivery')}
            className="bg-emerald-50 hover:bg-emerald-100/70 text-stone-900 rounded-3xl p-5 border-2 border-emerald-300 shadow-xs cursor-pointer transition-all active:scale-98 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-3xl shrink-0 shadow-xs">
                🚚
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xl font-black tracking-tight text-emerald-950">
                    DELIVERY PLAN
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 uppercase">
                    OR-Tools
                  </span>
                </div>
                <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                  Plan optimal routes for customer deliveries
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center group-hover:translate-x-1 transition-transform border border-emerald-200">
              <ArrowRight className="w-5 h-5 text-emerald-700" />
            </div>
          </div>

          {/* Card 4: 💰 MY EARNINGS */}
          <div
            onClick={() => onNavigate('earnings')}
            className="bg-white hover:bg-stone-50 text-stone-900 rounded-3xl p-5 border-2 border-stone-200 shadow-xs cursor-pointer transition-all active:scale-98 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-3xl shrink-0 border border-emerald-200/60">
                💰
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">
                  MY EARNINGS
                </h3>
                <p className="text-xs text-emerald-700 font-bold mt-0.5">
                  ₹12,450 earned this month
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-stone-600" />
            </div>
          </div>

          {/* Card 4: 🤖 AI ADVICE */}
          <div
            onClick={() => onNavigate('advice')}
            className="bg-white hover:bg-stone-50 text-stone-900 rounded-3xl p-5 border-2 border-emerald-200 shadow-xs cursor-pointer transition-all active:scale-98 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center text-3xl shrink-0">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xl font-black tracking-tight">
                    AI ADVICE
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                    High Demand
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-medium mt-0.5">
                  Tomato demand may increase next week
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-stone-600" />
            </div>
          </div>
        </div>
      ) : (
        /* CUSTOMER HOME CARDS */
        <div className="space-y-3.5">
          {/* Card 1: 🛒 BUY PRODUCE */}
          <div
            onClick={() => onNavigate('buy')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-3xl p-5 shadow-md cursor-pointer transition-all active:scale-98 flex items-center justify-between group border-2 border-emerald-600"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shrink-0">
                🛒
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">
                  BUY PRODUCE
                </h3>
                <p className="text-xs text-emerald-100 font-medium mt-0.5">
                  Farm-fresh vegetables, fruits & grains
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Card 2: 📦 MY ORDERS */}
          <div
            onClick={() => onNavigate('orders')}
            className="bg-white hover:bg-stone-50 text-stone-900 rounded-3xl p-5 border-2 border-stone-200 shadow-xs cursor-pointer transition-all active:scale-98 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center text-3xl shrink-0 border border-amber-200/60">
                📦
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">
                  MY ORDERS
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Track orders & view live delivery progress
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-stone-600" />
            </div>
          </div>

          {/* Card 3: 💰 MY SAVINGS */}
          <div
            onClick={() => onNavigate('impact')}
            className="bg-white hover:bg-stone-50 text-stone-900 rounded-3xl p-5 border-2 border-stone-200 shadow-xs cursor-pointer transition-all active:scale-98 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-3xl shrink-0 border border-emerald-200/60">
                💰
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">
                  MY SAVINGS
                </h3>
                <p className="text-xs text-emerald-700 font-bold mt-0.5">
                  ₹4,500 saved compared to retail mandi
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-stone-600" />
            </div>
          </div>

          {/* Card 4: 🌾 RECOMMENDED */}
          <div
            onClick={() => onNavigate('buy')}
            className="bg-white hover:bg-stone-50 text-stone-900 rounded-3xl p-5 border-2 border-stone-200 shadow-xs cursor-pointer transition-all active:scale-98 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center text-3xl shrink-0">
                🌾
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xl font-black tracking-tight">
                    RECOMMENDED
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Fresh Harvest
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Tomatoes, Onions & Mangoes directly from farmers
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-stone-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
