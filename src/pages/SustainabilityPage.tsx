import React from 'react';
import {
  Leaf,
  TrendingDown,
  Truck,
  DollarSign,
  Award,
  ShieldCheck,
  CheckCircle2,
  TreePine,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { SustainabilityMetrics } from '../types';

interface SustainabilityPageProps {
  metrics: SustainabilityMetrics;
}

const MONTHLY_IMPACT_DATA = [
  { month: 'Apr', co2AvoidedKg: 340, transitSavedKm: 3100, farmerEarningsLakh: 18 },
  { month: 'May', co2AvoidedKg: 490, transitSavedKm: 4400, farmerEarningsLakh: 24 },
  { month: 'Jun', co2AvoidedKg: 620, transitSavedKm: 5800, farmerEarningsLakh: 31 },
  { month: 'Jul', co2AvoidedKg: 780, transitSavedKm: 7100, farmerEarningsLakh: 39 },
  { month: 'Aug', co2AvoidedKg: 890, transitSavedKm: 8300, farmerEarningsLakh: 47 },
  { month: 'Sep', co2AvoidedKg: 1080, transitSavedKm: 9900, farmerEarningsLakh: 58 }
];

export const SustainabilityPage: React.FC<SustainabilityPageProps> = ({ metrics }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <Leaf className="w-4 h-4" />
            <span>Environmental & Economic Impact Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sustainability & ESG Metrics
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
            Quantifying real-world ecological savings achieved by shortening the agricultural
            supply chain, eliminating redundant middleman transport, and minimizing harvest waste.
          </p>
        </div>

        {/* Highlight Score */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center">
          <div className="flex items-center justify-center gap-1.5 text-emerald-300 mb-1">
            <TreePine className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Carbon Offset</span>
          </div>
          <span className="text-3xl font-extrabold text-white block">
            {metrics.co2EmissionsAvoidedKg.toLocaleString()} kg
          </span>
          <span className="text-[11px] text-emerald-200 block mt-0.5">CO2 avoided to date</span>
        </div>
      </div>

      {/* Core Metrics 6-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Direct Transactions */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Direct Farm Transactions</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-stone-900">
            {metrics.directTransactionsCount.toLocaleString()}
          </div>
          <p className="text-xs text-stone-500">
            Directly connecting smallholder farmers with commercial buyers without cartels.
          </p>
        </div>

        {/* Food Wastage Avoided */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Food Spoilage Avoided</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">
            {(metrics.estimatedFoodWasteAvoidedKg / 1000).toFixed(1)} Tons
          </div>
          <p className="text-xs text-stone-500">
            Saved through predictive demand scheduling and cold-chain route consolidation.
          </p>
        </div>

        {/* Transit Distance Optimized */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Transit Miles Saved</span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-stone-900">
            {metrics.deliveryDistanceOptimizedKm.toLocaleString()} km
          </div>
          <p className="text-xs text-stone-500">
            ~{metrics.estimatedTransportReductionPercentage}% reduction in vehicle travel distances.
          </p>
        </div>

        {/* Direct Farmer Earnings */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Direct Farmer Realization</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-800">
            ₹{(metrics.totalFarmerEarnings / 100000).toFixed(1)} Lakhs
          </div>
          <p className="text-xs text-stone-500">
            Retained directly by farmers instead of commission agents and mandi middlemen.
          </p>
        </div>

        {/* Buyer Savings */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Buyer Capital Saved</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">
            ₹{(metrics.totalBuyerSavings / 100000).toFixed(1)} Lakhs
          </div>
          <p className="text-xs text-stone-500">
            Saved by commercial restaurants, hotels, and supermarkets compared to APMC wholesale.
          </p>
        </div>

        {/* Local Fresh Produce Sold */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span>Hyper-Local Produce Traded</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-stone-900">
            {metrics.localProduceSoldTons} Tons
          </div>
          <p className="text-xs text-stone-500">
            Sourced within a 120 km radius of delivery zones for peak nutritional freshness.
          </p>
        </div>
      </div>

      {/* Visual Analytics: Carbon Reduction & Economic Realization Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly CO2 Avoided */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              Monthly Carbon Emissions Avoided (kg CO2)
            </h3>
            <p className="text-xs text-stone-500">
              Cumulative reduction achieved by AI Route Optimization and multi-stop consolidation
            </p>
          </div>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_IMPACT_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar
                  dataKey="co2AvoidedKg"
                  name="CO2 Avoided (kg)"
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Farmer Earnings vs Intermediary Leakage Area Chart */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              Farmer Direct Revenue Growth (₹ Lakhs)
            </h3>
            <p className="text-xs text-stone-500">
              Direct market payouts disbursed without customary 18-24% commission cuts
            </p>
          </div>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_IMPACT_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="farmerEarningsLakh"
                  name="Farmer Payouts (₹ Lakhs)"
                  stroke="#047857"
                  fill="#A7F3D0"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sustainable Development Goals (SDG) Alignment */}
      <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200">
        <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider mb-4">
          United Nations Sustainable Development Goals (SDG) Alignment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="font-bold text-emerald-800 block">SDG 12: Responsible Consumption</span>
            <p className="text-stone-600">
              Reduces post-harvest loss through predictive demand forecasting and direct farm-to-table links.
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="font-bold text-emerald-800 block">SDG 13: Climate Action</span>
            <p className="text-stone-600">
              Optimizes vehicle routing, lowering fleet mileage and cutting greenhouse gas emissions by ~33%.
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="font-bold text-emerald-800 block">SDG 8: Decent Work & Economic Growth</span>
            <p className="text-stone-600">
              Boosts rural household income by ensuring farmers retain the major share of retail market value.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
