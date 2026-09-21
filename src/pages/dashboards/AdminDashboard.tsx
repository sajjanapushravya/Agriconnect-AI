import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  Server,
  Activity,
  Trash2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Product, Order, User, UserRole, SustainabilityMetrics } from '../../types';

interface AdminDashboardProps {
  users: User[];
  products: Product[];
  orders: Order[];
  metrics: SustainabilityMetrics;
  onDeleteProduct: (productId: string) => void;
  onViewProductDetails: (product: Product) => void;
  onViewOrderTracking: (order: Order) => void;
  currentRole?: UserRole;
  onReturnHome?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  products,
  orders,
  metrics,
  onDeleteProduct,
  onViewProductDetails,
  onViewOrderTracking,
  currentRole,
  onReturnHome
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'orders'>('overview');

  // Role-based Access Enforcement: Prevent unauthorized role bypass
  if (currentRole && currentRole !== 'admin') {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-3xl p-8 border-2 border-rose-200 shadow-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-3xl mx-auto">
            🛡️
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-stone-900">
              Access Restricted: Administrator Only
            </h2>
            <p className="text-sm font-medium text-stone-600">
              Your account is signed in as a <span className="font-extrabold uppercase text-emerald-800">{currentRole}</span>. You do not have permissions to access the platform Superadmin console.
            </p>
          </div>
          {onReturnHome && (
            <button
              onClick={onReturnHome}
              className="py-3 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md active:scale-95 transition-all"
            >
              ← Return to Your Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  const farmerCount = users.filter((u) => u.role === 'farmer').length;
  const fpoCount = users.filter((u) => u.role === 'fpo').length;
  const buyerCount = users.filter((u) => u.role === 'buyer').length;

  const totalGMV = orders.reduce((s, o) => s + o.totalAmount, 0) + 1420000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>AgriConnect Superadmin Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            System Operations & Governance
          </h1>
          <p className="text-xs text-stone-300">
            Real-time monitoring across multi-tenant farmer nodes, FPO aggregates, and buyer settlements.
          </p>
        </div>

        {/* System Health Indicators */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FastAPI ML Engine</span>
            </div>
            <span className="text-[10px] text-stone-300">RandomForest v1.2 Active</span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>VRP Optimizer</span>
            </div>
            <span className="text-[10px] text-stone-300">2-Opt Heuristic 28ms</span>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Total Users
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">{users.length}</span>
          <span className="text-[11px] text-stone-500 block">
            {farmerCount} Farmers • {fpoCount} FPOs • {buyerCount} Buyers
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Active Produce Listings
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {products.length}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold block">Across 5 crop categories</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Total Fulfilled Orders
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {orders.length + 84}
          </span>
          <span className="text-[11px] text-stone-500 block">Direct supply-chain loops</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Gross Traded Value (GMV)
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
            ₹{(totalGMV / 100000).toFixed(1)} L
          </span>
          <span className="text-[11px] text-emerald-800 font-semibold block">Zero middleman commission</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-stone-200 text-xs font-bold gap-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          All Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'products'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          Product Catalog & Moderation ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'orders'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          Fulfillment Orders ({orders.length})
        </button>
      </div>

      {/* Tab 1: Users List */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-stone-900">Registered Platform Users</h3>
            <span className="text-xs text-stone-500">Farmers, FPOs, Commercial Buyers, Admins</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider bg-stone-50/50">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Entity Details</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-stone-900">{u.name}</td>
                    <td className="py-3 px-4 text-stone-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'farmer'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.role === 'fpo'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'buyer'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-medium">
                      {u.farmName || u.fpoName || u.buyerType || 'System Administrator'}
                    </td>
                    <td className="py-3 px-4 text-stone-500">{u.location}</td>
                    <td className="py-3 px-4 text-stone-400">{u.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Products Moderation */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-stone-900">Product Catalog Moderation</h3>
            <span className="text-xs text-stone-500">Live prices & inventory audit</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider bg-stone-50/50">
                  <th className="py-3 px-4">Produce</th>
                  <th className="py-3 px-4">Seller</th>
                  <th className="py-3 px-4 text-right">Direct Rate</th>
                  <th className="py-3 px-4 text-right">Mandi Benchmark</th>
                  <th className="py-3 px-4 text-right">Stock</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img src={prod.imageUrl} alt="" className="w-8 h-8 rounded object-cover" />
                        <div>
                          <span className="font-bold text-stone-900 block">{prod.name}</span>
                          <span className="text-[10px] text-stone-400">{prod.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-600">{prod.sellerName}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-stone-900">
                      ₹{prod.price}/{prod.unit}
                    </td>
                    <td className="py-3 px-4 text-right text-stone-400 line-through">
                      ₹{prod.marketPrice}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-stone-800">
                      {prod.quantity} {prod.unit}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewProductDetails(prod)}
                          className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onDeleteProduct(prod.id)}
                          className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Orders Monitoring */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-stone-900">All Marketplace Orders</h3>
            <span className="text-xs text-stone-500">Live order pipelines and statuses</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider bg-stone-50/50">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Buyer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4 text-right">Value</th>
                  <th className="py-3 px-4 text-right">Buyer Saved</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{order.id}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-800 block">{order.buyerName}</span>
                      <span className="text-[10px] text-stone-400 capitalize">{order.buyerType}</span>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {order.items.map((it) => `${it.quantity} ${it.unit} ${it.productName}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-stone-900">
                      ₹{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-800">
                      ₹{order.totalSavings.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onViewOrderTracking(order)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
