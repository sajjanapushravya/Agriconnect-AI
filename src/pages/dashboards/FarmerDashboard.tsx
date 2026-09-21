import React from 'react';
import {
  Sprout,
  Plus,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Eye,
  Calendar
} from 'lucide-react';
import { Product, Order, User } from '../../types';

interface FarmerDashboardProps {
  currentUser: User | null;
  products: Product[];
  orders: Order[];
  onOpenAddProduct: () => void;
  onViewProductDetails: (product: Product) => void;
  onViewOrderTracking: (order: Order) => void;
  onNavigateToForecast: (product: Product) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  currentUser,
  products,
  orders,
  onOpenAddProduct,
  onViewProductDetails,
  onViewOrderTracking,
  onNavigateToForecast
}) => {
  // Filter products and orders belonging to this farmer
  const farmerProducts = products.filter(
    (p) => p.sellerId === currentUser?.id || p.sellerType === 'farmer'
  );

  const farmerOrders = orders;
  const pendingOrders = farmerOrders.filter((o) => o.status !== 'DELIVERED');
  const totalEarnings = 148500 + farmerOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <Sprout className="w-4 h-4" />
            <span>Verified Farmer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {currentUser?.name || 'Ramesh Patil'}
          </h1>
          <p className="text-xs text-stone-300">
            Farm: <span className="font-semibold text-white">{currentUser?.farmName || 'Patil Organic Farms'}</span> • Location: {currentUser?.location || 'Nashik, Maharashtra'}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenAddProduct}
          className="py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs transition-all shadow-lg flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>List New Harvest Produce</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Listed Produce
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {farmerProducts.length}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold block">Active in Marketplace</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Pending Dispatches
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {pendingOrders.length}
          </span>
          <span className="text-[11px] text-stone-500 block">Orders awaiting delivery</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Total Orders Filled
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {farmerOrders.length + 24}
          </span>
          <span className="text-[11px] text-stone-500 block">Commercial buyer contracts</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Direct Farm Earnings
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
            ₹{totalEarnings.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-800 font-semibold block">92% share retained</span>
        </div>
      </div>

      {/* AI Demand Prediction Alerts for Farmer */}
      <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>AI Regional Demand Alerts (Nashik & Mumbai APMC Corridors)</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold bg-white px-2 py-0.5 rounded border border-emerald-200">
            Live AI Recommendation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-sm space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-stone-900">Tomato (Hybrid Red)</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                +24% Surge Expected
              </span>
            </div>
            <p className="text-stone-600">
              Weekend demand from Mumbai catering & restaurants projected at 4,800 kg. Recommended
              harvest buffer: advance picking by 24 hours.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-sm space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-stone-900">Red Onion (Lasalgaon)</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Stable Wholesale Flow
              </span>
            </div>
            <p className="text-stone-600">
              Wholesale Mandi price rose to ₹35/kg. AgriConnect direct rate at ₹28/kg delivers 20%
              buyer savings with rapid inventory clearance.
            </p>
          </div>
        </div>
      </div>

      {/* My Listed Produce Section */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-stone-900">My Listed Farm Produce</h3>
            <p className="text-xs text-stone-500">Live inventory available for buyer orders</p>
          </div>
          <button
            onClick={onOpenAddProduct}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> List Another Crop
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider bg-stone-50/50">
                <th className="py-3 px-4">Produce</th>
                <th className="py-3 px-4">Available Stock</th>
                <th className="py-3 px-4">Direct Price</th>
                <th className="py-3 px-4">Mandi Wholesale</th>
                <th className="py-3 px-4">Shelf Life</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {farmerProducts.slice(0, 5).map((prod) => (
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
                        <span className="text-[10px] text-emerald-700 font-semibold">{prod.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-800">
                    {prod.quantity.toLocaleString()} {prod.unit}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-stone-900 text-sm">
                    ₹{prod.price}/{prod.unit}
                  </td>
                  <td className="py-3 px-4 text-stone-400 line-through">
                    ₹{prod.marketPrice}/{prod.unit}
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {prod.shelfLifeDays} days
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onViewProductDetails(prod)}
                        className="p-1.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onNavigateToForecast(prod)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]"
                      >
                        AI Forecast
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders Table with Tracking Links */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-stone-900">Incoming Buyer Orders</h3>
            <p className="text-xs text-stone-500">Orders placed by commercial buyers with delivery timelines</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider bg-stone-50/50">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Buyer Entity</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total Realization</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {farmerOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">{order.id}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-stone-800 block">{order.buyerName}</span>
                    <span className="text-[10px] text-stone-400 capitalize">{order.buyerType}</span>
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {order.items.map((it) => `${it.quantity} ${it.unit} ${it.productName}`).join(', ')}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-stone-900">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onViewOrderTracking(order)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                    >
                      Track & Advance
                    </button>
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
