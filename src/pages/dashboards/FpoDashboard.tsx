import React from 'react';
import {
  Users,
  Package,
  Plus,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Truck,
  Eye
} from 'lucide-react';
import { Product, Order, User } from '../../types';

interface FpoDashboardProps {
  currentUser: User | null;
  products: Product[];
  orders: Order[];
  onOpenAddProduct: () => void;
  onViewProductDetails: (product: Product) => void;
  onViewOrderTracking: (order: Order) => void;
  onNavigateToForecast: (product: Product) => void;
}

export const FpoDashboard: React.FC<FpoDashboardProps> = ({
  currentUser,
  products,
  orders,
  onOpenAddProduct,
  onViewProductDetails,
  onViewOrderTracking,
  onNavigateToForecast
}) => {
  const fpoProducts = products.filter((p) => p.sellerType === 'fpo');
  const totalStockKg = fpoProducts.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold">
            <Users className="w-4 h-4" />
            <span>Farmer Producer Organization (FPO) Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentUser?.fpoName || 'Sahyadri Farmers Producer Co.'}
          </h1>
          <p className="text-xs text-stone-300">
            Federating <span className="font-bold text-white">142 Member Smallholder Farmers</span> • District: {currentUser?.location || 'Nashik, Maharashtra'}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenAddProduct}
          className="py-3 px-5 rounded-2xl bg-purple-500 hover:bg-purple-400 text-stone-950 font-extrabold text-xs transition-all shadow-lg flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Aggregate Member Produce</span>
        </button>
      </div>

      {/* 4 Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Associated Smallholders
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">142</span>
          <span className="text-[11px] text-purple-700 font-semibold block">Active member growers</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Aggregated Inventory
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-purple-900">
            {(totalStockKg / 1000).toFixed(1)} Tons
          </span>
          <span className="text-[11px] text-stone-500 block">Warehoused & graded</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Commercial Bulk Orders
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {orders.length + 38}
          </span>
          <span className="text-[11px] text-stone-500 block">Direct institutional supply</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Aggregated Gross Revenue
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
            ₹4,95,000
          </span>
          <span className="text-[11px] text-emerald-800 font-semibold block">Disbursed to farmers</span>
        </div>
      </div>

      {/* Aggregated Inventory Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              Aggregated Collective Inventory ({fpoProducts.length} Crops)
            </h3>
            <p className="text-xs text-stone-500">
              Graded lots available for bulk restaurant and supermarket procurement
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider bg-stone-50/50">
                <th className="py-3 px-4">Crop Produce</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Aggregated Quantity</th>
                <th className="py-3 px-4 text-right">FPO Direct Rate</th>
                <th className="py-3 px-4 text-right">Mandi Benchmark</th>
                <th className="py-3 px-4 text-center">Buyer Savings</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {fpoProducts.map((prod) => {
                const savingsPct = Math.round(((prod.marketPrice - prod.price) / prod.marketPrice) * 100);
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
                          <span className="text-[10px] text-stone-400">Harvest: {prod.harvestDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-600">{prod.category}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-stone-900">
                      {prod.quantity.toLocaleString()} {prod.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-800">
                      ₹{prod.price}/{prod.unit}
                    </td>
                    <td className="py-3 px-4 text-right text-stone-400 line-through">
                      ₹{prod.marketPrice}/{prod.unit}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {savingsPct}% Cheaper
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewProductDetails(prod)}
                          className="p-1.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onNavigateToForecast(prod)}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 font-semibold text-[11px]"
                        >
                          Demand AI
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
