import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  ShoppingBag,
  TrendingDown,
  Sparkles,
  Award,
  ChevronRight
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
import { getProductPriceIntelligence, calculate_bulk_savings } from '../utils/priceIntelligence';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onNavigateToForecast?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onNavigateToForecast
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState<number>(product.minOrderQuantity || 25);
  const priceIntel = getProductPriceIntelligence(product);
  const bulkCalc = calculate_bulk_savings(product.marketPrice, product.price, quantity);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-stone-700 hover:bg-stone-100 hover:text-stone-900 shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Farm Origin */}
          <div className="relative bg-stone-100 p-6 flex flex-col justify-between">
            <div>
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold shadow-md">
                    Direct Farm Source
                  </span>
                  {product.isOrganic && (
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-md flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Certified Organic
                    </span>
                  )}
                </div>
              </div>

              {/* Harvest & Shelf Life Details */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-stone-500 block">Harvest Date</span>
                    <span className="font-bold text-stone-800">{product.harvestDate}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-stone-500 block">Shelf Life</span>
                    <span className="font-bold text-stone-800">{product.shelfLifeDays} Days</span>
                  </div>
                </div>
              </div>

              {/* Seller details */}
              <div className="mt-4 p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                      {product.sellerType === 'fpo' ? 'Producer Organization' : 'Verified Farmer'}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900">{product.sellerName}</h4>
                  </div>
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-xs text-stone-600 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" /> {product.location}
                </p>
              </div>
            </div>

            {/* AI Demand Shortcut */}
            {onNavigateToForecast && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToForecast(product);
                }}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-emerald-100/70 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center justify-between"
              >
                <span>View AI Demand Forecast for {product.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Column: Pricing Intelligence, Bulk Calc, Chart, Add to Cart */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h2 className="text-2xl font-bold text-stone-900 mt-0.5">{product.name}</h2>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-900 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {product.description}
              </p>

              {/* Price Intelligence Box (Matching user spec exactly) */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-stone-50 to-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 mb-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-emerald-600" /> Price Intelligence
                  </span>
                  <span className="text-[11px] text-stone-500">{priceIntel.wholesaleMandi}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Current Market Price</span>
                    <span className="font-semibold text-stone-500 line-through">
                      ₹{product.marketPrice}/{product.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-800">AgriConnect Price</span>
                    <span className="font-extrabold text-stone-900 text-base">
                      ₹{product.price}/{product.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-emerald-200/60 text-emerald-800 font-bold">
                    <span>Your Saving</span>
                    <span>₹{priceIntel.savingsPerUnit}/{product.unit} ({priceIntel.savingsPercentage}% Cheaper)</span>
                  </div>
                </div>
              </div>

              {/* Historical Price Trend Chart */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-stone-800">6-Month Price Trend (APMC vs AgriConnect)</h4>
                  <span className="text-[11px] text-stone-500">₹ per {product.unit}</span>
                </div>
                <div className="h-32 w-full bg-white rounded-xl border border-stone-200 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceIntel.historicalPrices} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} domain={['dataMin - 5', 'dataMax + 5']} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Line
                        type="monotone"
                        dataKey="marketPrice"
                        name="Wholesale Mandi"
                        stroke="#94A3B8"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="agriPrice"
                        name="AgriConnect Price"
                        stroke="#059669"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bulk Quantity Selector & Savings Calculator */}
              <div className="mt-4 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-800">Order Quantity ({product.unit})</label>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {quantity} {product.unit}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={product.minOrderQuantity || 5}
                    max={Math.min(product.quantity, 1000)}
                    step={5}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="flex-1 accent-emerald-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    min={product.minOrderQuantity || 5}
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-2 py-1 text-xs font-bold text-center border border-stone-300 rounded-lg bg-white"
                  />
                </div>

                {/* Bulk Savings Calculation Banner */}
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-600 text-white flex items-center justify-between text-xs">
                  <div>
                    <span className="text-emerald-100 block text-[11px]">
                      Market Cost: ₹{bulkCalc.marketCost.toLocaleString()}
                    </span>
                    <span className="font-extrabold text-sm">
                      AgriConnect Total: ₹{bulkCalc.agriCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="bg-white text-emerald-800 px-2 py-0.5 rounded font-extrabold text-xs block">
                      Save ₹{bulkCalc.savings.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-200 font-medium">
                      ({bulkCalc.percentage}% savings)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Footer */}
            <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
              <div className="text-xs">
                <span className="text-stone-500 block">Stock Available</span>
                <span className="font-bold text-stone-800">
                  {product.quantity.toLocaleString()} {product.unit}
                </span>
              </div>
              <button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add {quantity} {product.unit} to Cart (₹{bulkCalc.agriCost.toLocaleString()})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
