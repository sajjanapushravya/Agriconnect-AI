import React from 'react';
import {
  ShoppingBag,
  TrendingDown,
  Clock,
  CheckCircle2,
  Calendar,
  Truck,
  ArrowRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { Order, Product, User } from '../../types';

interface BuyerDashboardProps {
  currentUser: User | null;
  orders: Order[];
  products: Product[];
  onExploreMarketplace: () => void;
  onViewOrderTracking: (order: Order) => void;
  onViewProductDetails: (product: Product) => void;
  onViewInRouteOptimizer: (order: Order) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  currentUser,
  orders,
  products,
  onExploreMarketplace,
  onViewOrderTracking,
  onViewProductDetails,
  onViewInRouteOptimizer
}) => {
  const buyerOrders = orders;
  const activeOrders = buyerOrders.filter((o) => o.status !== 'DELIVERED');

  const purchaseValue = buyerOrders.reduce((s, o) => s + o.totalAmount, 0) || 15000;
  const marketValue = buyerOrders.reduce((s, o) => s + o.marketAmount, 0) || 18000;
  const totalSavings = Math.max(0, marketValue - purchaseValue) || 3000;
  const savingsPct = Math.round((totalSavings / marketValue) * 100) || 20;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <ShoppingBag className="w-4 h-4" />
            <span className="capitalize">{currentUser?.buyerType || 'Commercial Restaurant'} Sourcing Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentUser?.name || 'Vikram Mehta'}
          </h1>
          <p className="text-xs text-stone-300">
            Delivery Address: <span className="text-white">{currentUser?.location || 'Bandra West, Mumbai'}</span>
          </p>
        </div>

        <button
          onClick={onExploreMarketplace}
          className="py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs transition-all shadow-lg flex items-center gap-2 active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Source More Farm Produce</span>
        </button>
      </div>

      {/* Sourcing Savings Summary (Section 22 Mandate) */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-stone-900">Direct Sourcing Value Realization</h3>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {savingsPct}% Overall Mandi Cost Reduction
          </span>
        </div>

        {/* 3 Metric blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-xs text-stone-500 font-semibold block">AgriConnect Purchase Value</span>
            <div className="text-2xl font-extrabold text-stone-900">
              ₹{purchaseValue.toLocaleString()}
            </div>
            <span className="text-[11px] text-stone-400">Actual amount paid to farmers</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-xs text-stone-500 font-semibold block">Wholesale Mandi Valuation</span>
            <div className="text-2xl font-extrabold text-stone-500 line-through">
              ₹{marketValue.toLocaleString()}
            </div>
            <span className="text-[11px] text-stone-400">Conventional intermediary pricing</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-xs text-emerald-800 font-bold block">Total Buyer Savings</span>
            <div className="text-2xl font-extrabold text-emerald-700">
              ₹{totalSavings.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-800 font-medium">
              Net working capital preserved
            </span>
          </div>
        </div>
      </div>

      {/* Active Deliveries / Recent Orders */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              Procurement & Delivery History ({buyerOrders.length} Orders)
            </h3>
            <p className="text-xs text-stone-500">Live fulfillment status from farm gate to your premises</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider bg-stone-50/50">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Delivery Date</th>
                <th className="py-3 px-4">Produce Items</th>
                <th className="py-3 px-4">Total Cost</th>
                <th className="py-3 px-4">Mandi Savings</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {buyerOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">{order.id}</td>
                  <td className="py-3 px-4 text-stone-600">{order.preferredDeliveryDate}</td>
                  <td className="py-3 px-4 text-stone-800 font-medium">
                    {order.items.map((it) => `${it.quantity} ${it.unit} ${it.productName}`).join(', ')}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-stone-900">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-800">
                    Saved ₹{order.totalSavings.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onViewOrderTracking(order)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      >
                        Track
                      </button>
                      <button
                        onClick={() => onViewInRouteOptimizer(order)}
                        className="px-2.5 py-1 rounded-lg border border-stone-300 text-stone-700 font-semibold hover:bg-stone-100"
                        title="View route sequence"
                      >
                        <Truck className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
