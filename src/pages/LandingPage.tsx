import React from 'react';
import {
  Sprout,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Truck,
  Leaf,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Sparkles
} from 'lucide-react';
import { Product, UserRole } from '../types';
import { ProductCard } from '../components/ProductCard';

interface LandingPageProps {
  featuredProducts: Product[];
  onExploreMarketplace: () => void;
  onJoinRole: (role: UserRole) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewProductDetails: (product: Product) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  featuredProducts,
  onExploreMarketplace,
  onJoinRole,
  onAddToCart,
  onViewProductDetails
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-white pt-16 pb-20 px-4 sm:px-6">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Next-Gen Agricultural Intelligence & Direct Trade</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Connecting Farmers to a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-300">
                  Sustainable Future
                </span>
              </h1>

              <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
                Buy fresh agricultural products directly from farmers and FPOs with AI-powered
                pricing, demand forecasting and smart route-optimized logistics. Bypass unnecessary
                intermediaries and enjoy 15–30% lower prices.
              </p>

              {/* Call to action buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={onExploreMarketplace}
                  className="py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onJoinRole('farmer')}
                  className="py-3.5 px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  <Sprout className="w-4 h-4 text-emerald-300" />
                  <span>Join as Farmer / FPO</span>
                </button>

                <button
                  onClick={() => onJoinRole('buyer')}
                  className="py-3.5 px-5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/50 text-emerald-200 font-bold text-sm transition-all flex items-center gap-2"
                >
                  <span>Join as Buyer</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-emerald-800/60 flex flex-wrap items-center gap-6 text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Direct Farm Sourcing
                </span>
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-emerald-400" /> Live APMC Mandi Benchmarks
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-400" /> 2-Opt VRP Route Optimized
                </span>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-stone-900/90 border border-emerald-500/30 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs text-stone-400 font-mono ml-2">AgriConnect Live Engine</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                    ONLINE
                  </span>
                </div>

                <div className="mt-5 space-y-4 text-xs">
                  {/* Price comparison mini widget */}
                  <div className="p-3.5 rounded-2xl bg-stone-800/70 border border-stone-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-stone-400">Wholesale Tomato (500 kg)</span>
                      <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
                        Save ₹3,500
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-stone-400">Mandi: ₹14,000</span>
                      <span className="text-base font-extrabold text-white">
                        AgriConnect: ₹10,500
                      </span>
                    </div>
                  </div>

                  {/* AI Demand Prediction mini widget */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/60">
                    <div className="flex items-center justify-between text-emerald-300 font-bold mb-1">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        AI Demand Forecast (Nashik District)
                      </span>
                      <span>+18.4% Surge</span>
                    </div>
                    <p className="text-[11px] text-stone-300">
                      Recommendation: Advance harvest by 36 hours. Predicted 7-day buyer volume: 4,800 kg.
                    </p>
                  </div>

                  {/* Route Optimization mini widget */}
                  <div className="p-3.5 rounded-2xl bg-stone-800/70 border border-stone-700">
                    <div className="flex items-center justify-between text-stone-300 font-bold mb-1">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-emerald-400" />
                        VRP Smart Route Optimization
                      </span>
                      <span className="text-emerald-400">14.3 km Saved</span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Transit reduced by 33.6% • 31.8 kg CO2 emissions avoided.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Metrics Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center sm:text-left sm:border-r border-stone-100 pr-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 block">
              1,450+
            </span>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Farmers & FPOs
            </span>
          </div>
          <div className="text-center sm:text-left sm:border-r border-stone-100 pr-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 block">
              1,840 T
            </span>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Fresh Produce Traded
            </span>
          </div>
          <div className="text-center sm:text-left sm:border-r border-stone-100 pr-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 block">
              21.4%
            </span>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Avg. Buyer Mandi Savings
            </span>
          </div>
          <div className="text-center sm:text-left">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 block">
              31,200 km
            </span>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Transit Optimized
            </span>
          </div>
        </div>
      </div>

      {/* How It Works Section (5 Specific Steps from Specification) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            End-to-End Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
            How AgriConnect AI Works
          </h2>
          <p className="text-sm text-stone-600">
            A software-only platform harmonizing production, demand prediction, price comparison,
            and logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'List Produce',
              desc: 'Farmers and FPOs list harvested crops with transparent wholesale rates and available quantities.',
              icon: Sprout
            },
            {
              step: '02',
              title: 'Buyers Place Orders',
              desc: 'Restaurants, supermarkets, and hotels browse farm listings and place orders with instant savings.',
              icon: ShoppingBag
            },
            {
              step: '03',
              title: 'AI Predicts Demand',
              desc: 'Machine learning forecasts 7-day and 30-day demand surges to prevent stockouts and food loss.',
              icon: TrendingUp
            },
            {
              step: '04',
              title: 'AI Optimizes Routes',
              desc: 'Heuristic VRP calculates the shortest multi-stop path for maximum fuel efficiency and lowest cost.',
              icon: Truck
            },
            {
              step: '05',
              title: 'Direct Delivery',
              desc: 'Produce is dispatched with real-time milestone tracking from farm gate to buyer doorstep.',
              icon: CheckCircle2
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500/50 hover:shadow-lg transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Triad: Farmers, Buyers, Environment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Multilateral Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Engineered for Every Stakeholder
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Farmers */}
            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">For Farmers & FPOs</h3>
              <ul className="space-y-2.5 text-xs text-stone-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Direct market access to commercial buyers without cartelized intermediaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Better price realization — keep up to 92% of produce transaction value</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>AI demand insights to align harvest cycles with projected consumer spikes</span>
                </li>
              </ul>
            </div>

            {/* For Buyers */}
            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">For Buyers & Commercial Kitchens</h3>
              <ul className="space-y-2.5 text-xs text-stone-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>15–30% lower cost compared to conventional multi-tier wholesale mandis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Verified harvest fresh quality with traceability to specific farm plots</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Bulk ordering with automated scheduled dispatch & volume discounts</span>
                </li>
              </ul>
            </div>

            {/* For Environment */}
            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">For the Environment</h3>
              <ul className="space-y-2.5 text-xs text-stone-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <span>Optimized delivery routing reduces superfluous transit distance by ~33%</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <span>Drastically reduced fuel consumption and vehicle carbon emissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <span>Demand matching mitigates post-harvest storage spoilage and food waste</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Farm Direct Produce */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Top Seasonal Listings
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
              Direct from Verified Farmers & FPOs
            </h2>
          </div>
          <button
            onClick={onExploreMarketplace}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 py-2 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <span>View All 30+ Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={onAddToCart}
              onViewDetails={onViewProductDetails}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
