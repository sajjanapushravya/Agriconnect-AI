import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingDown,
  Calculator,
  ArrowUpDown,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Product } from '../types';
import {
  getProductPriceIntelligence,
  calculate_bulk_savings,
  calculate_savings,
  calculate_savings_percentage
} from '../utils/priceIntelligence';

interface PriceIntelligencePageProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onViewProductDetails: (product: Product) => void;
}

export const PriceIntelligencePage: React.FC<PriceIntelligencePageProps> = ({
  products,
  onAddToCart,
  onViewProductDetails
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'prod-1');
  const [calcQuantity, setCalcQuantity] = useState<number>(250);
  const [tableFilter, setTableFilter] = useState<'all' | 'high_savings'>('all');

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || products[0],
    [products, selectedProductId]
  );

  const priceIntel = useMemo(() => {
    if (!selectedProduct) return null;
    return getProductPriceIntelligence(selectedProduct);
  }, [selectedProduct]);

  const bulkCalc = useMemo(() => {
    if (!selectedProduct) return null;
    return calculate_bulk_savings(selectedProduct.marketPrice, selectedProduct.price, calcQuantity);
  }, [selectedProduct, calcQuantity]);

  // Overall comparison statistics
  const summaryStats = useMemo(() => {
    const totalMarket = products.reduce((s, p) => s + p.marketPrice, 0);
    const totalAgri = products.reduce((s, p) => s + p.price, 0);
    const totalSavings = totalMarket - totalAgri;
    const avgSavingsPct = Math.round((totalSavings / totalMarket) * 100);
    return { totalMarket, totalAgri, totalSavings, avgSavingsPct };
  }, [products]);

  const displayedProducts = useMemo(() => {
    if (tableFilter === 'high_savings') {
      return [...products].filter((p) => calculate_savings_percentage(p.marketPrice, p.price) >= 20);
    }
    return products;
  }, [products, tableFilter]);

  if (!selectedProduct || !priceIntel || !bulkCalc) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <BarChart3 className="w-4 h-4" />
            <span>APMC Mandi Wholesale Benchmark Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Smart Price Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
            Real-time wholesale price comparison between local APMC Mandis and direct AgriConnect
            farm gate listings. Complete transparency with zero intermediary markups.
          </p>
        </div>

        {/* Global Average Savings Badge */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center">
          <span className="text-3xl font-extrabold text-amber-300 block">
            {summaryStats.avgSavingsPct}%
          </span>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Average Sourcing Savings
          </span>
          <span className="text-[11px] text-stone-300 block mt-1">Across 30+ tracked crops</span>
        </div>
      </div>

      {/* Interactive Bulk Savings Calculator & Historical Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dynamic Order Calculator */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">Bulk Savings Calculator</h3>
                  <p className="text-xs text-stone-500">Simulate wholesale orders for restaurants & retailers</p>
                </div>
              </div>
            </div>

            {/* Produce Selector */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Select Crop</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Market: ₹{p.marketPrice} | Direct: ₹{p.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Input & Preset Buttons */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-stone-800">Order Quantity ({selectedProduct.unit})</label>
                  <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {calcQuantity.toLocaleString()} {selectedProduct.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={25}
                  max={2500}
                  step={25}
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex gap-1.5 mt-2">
                  {[50, 100, 250, 500, 1000].map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setCalcQuantity(qty)}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                        calcQuantity === qty
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {qty} kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculation Output Box (Section 15 spec) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white space-y-3 shadow-md">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-emerald-800/80">
                  <span className="text-emerald-200">Wholesale APMC Cost</span>
                  <span className="line-through text-stone-300 font-semibold">
                    ₹{bulkCalc.marketCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pb-2 border-b border-emerald-800/80">
                  <span className="font-bold text-emerald-100">AgriConnect Platform Cost</span>
                  <span className="font-extrabold text-white text-base">
                    ₹{bulkCalc.agriCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <div>
                    <span className="text-[11px] text-emerald-300 font-medium uppercase tracking-wider block">
                      Direct Buyer Savings
                    </span>
                    <span className="text-xl font-extrabold text-amber-300">
                      ₹{bulkCalc.savings.toLocaleString()}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-stone-950 font-extrabold text-xs">
                    {bulkCalc.percentage}% Cheaper
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(selectedProduct, calcQuantity)}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add {calcQuantity} kg to Sourcing Cart (₹{bulkCalc.agriCost.toLocaleString()})</span>
          </button>
        </div>

        {/* Right: 6-Month Mandi vs AgriConnect Price Trend Line Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Historical Price Trend: {selectedProduct.name}
                </h3>
                <p className="text-xs text-stone-500">
                  Comparison with APMC Wholesale Mandi rates over past 6 months (₹/kg)
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  Save ₹{priceIntel.savingsPerUnit}/kg ({priceIntel.savingsPercentage}%)
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceIntel.historicalPrices} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 4', 'dataMax + 4']} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line
                    type="monotone"
                    dataKey="marketPrice"
                    name="APMC Mandi Wholesale (₹/kg)"
                    stroke="#94A3B8"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="agriPrice"
                    name="AgriConnect Direct Price (₹/kg)"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#059669' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Benchmark Source: APMC Vashi & Nashik Wholesale Agricultural Market
            </span>
            <span className="text-[11px] text-stone-400">Refreshed daily</span>
          </div>
        </div>
      </div>

      {/* Comprehensive Price Comparison Table Across Products */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              Live Mandi Benchmark Index ({displayedProducts.length} Crops)
            </h3>
            <p className="text-xs text-stone-500">
              Complete catalog comparison showing exact per-unit savings for commercial buyers
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setTableFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                tableFilter === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Produce
            </button>
            <button
              onClick={() => setTableFilter('high_savings')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                tableFilter === 'high_savings'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              High Savings (&gt;= 20%)
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider bg-stone-50/50">
                <th className="py-3 px-4">Crop Produce</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Origin / Producer</th>
                <th className="py-3 px-4 text-right">APMC Mandi Rate</th>
                <th className="py-3 px-4 text-right">AgriConnect Rate</th>
                <th className="py-3 px-4 text-right">Per-Unit Saving</th>
                <th className="py-3 px-4 text-center">Savings %</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {displayedProducts.map((prod) => {
                const savings = calculate_savings(prod.marketPrice, prod.price);
                const savingsPct = calculate_savings_percentage(prod.marketPrice, prod.price);
                return (
                  <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-9 h-9 rounded-lg object-cover bg-stone-100"
                        />
                        <div>
                          <span className="font-bold text-stone-900 block">{prod.name}</span>
                          <span className="text-[10px] text-stone-400">Stock: {prod.quantity} {prod.unit}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-medium">{prod.category}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-800 block truncate max-w-[140px]">
                        {prod.sellerName}
                      </span>
                      <span className="text-[10px] text-stone-400 truncate block max-w-[140px]">
                        {prod.location}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-stone-500 line-through">
                      ₹{prod.marketPrice}/{prod.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-stone-900 text-sm">
                      ₹{prod.price}/{prod.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-800">
                      ₹{savings}/{prod.unit}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {savingsPct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewProductDetails(prod)}
                          className="px-2.5 py-1 rounded-lg border border-stone-300 text-stone-700 font-semibold hover:bg-stone-100"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onAddToCart(prod, prod.minOrderQuantity || 10)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          Add
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
