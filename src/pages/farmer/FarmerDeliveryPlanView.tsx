import React, { useState, useEffect } from 'react';
import { ArrowLeft, Truck, MapPin, CheckCircle2, Navigation, Clock, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { Order, OptimizedRouteApiResponse } from '../../types';
import { logisticsService } from '../../services/logisticsService';
import { RouteMap } from '../../components/RouteMap';
import { RouteSummary } from '../../components/RouteSummary';

interface FarmerDeliveryPlanViewProps {
  onBack: () => void;
  language?: string;
}

export const FarmerDeliveryPlanView: React.FC<FarmerDeliveryPlanViewProps> = ({ onBack }) => {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Vehicle capacity state
  const [capacityOption, setCapacityOption] = useState<number>(1000);
  const [customCapacity, setCustomCapacity] = useState<string>('');
  const [isCustomCapacity, setIsCustomCapacity] = useState(false);

  // Optimized Route Result
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRouteApiResponse | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Load active orders on mount
  const loadOrders = async () => {
    setLoadingOrders(true);
    setErrorMsg(null);
    try {
      const orders = await logisticsService.getActiveDeliveries();
      setActiveOrders(orders);
    } catch (err: any) {
      setErrorMsg('Failed to load active orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Compute total active weight from confirmed orders
  const totalOrdersWeight = activeOrders.reduce((sum, ord) => {
    const orderQty = ord.items.reduce((itemSum, item) => itemSum + (Number(item.quantity) || 0), 0);
    return sum + orderQty;
  }, 0);

  const effectiveCapacity = isCustomCapacity
    ? Math.max(1, Number(customCapacity) || 0)
    : capacityOption;

  // Optimize route action
  const handleOptimizeRoute = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (activeOrders.length === 0) {
      setErrorMsg('No active deliveries available.');
      return;
    }

    if (effectiveCapacity <= 0) {
      setErrorMsg('Please select or enter a valid vehicle capacity.');
      return;
    }

    // Client-side quick check matching backend constraint
    if (totalOrdersWeight > effectiveCapacity) {
      setErrorMsg('Vehicle capacity exceeded. Please split the delivery into multiple trips/vehicles.');
      return;
    }

    setOptimizing(true);
    try {
      const result = await logisticsService.optimizeRoute({
        vehicle_capacity: effectiveCapacity
      });
      setOptimizedRoute(result);
      setSuccessMsg('Route optimized successfully with Google OR-Tools routing engine!');
      // Scroll smoothly to results
      setTimeout(() => {
        const el = document.getElementById('route-results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || 'Route calculation failure');
    } finally {
      setOptimizing(false);
    }
  };

  // Mark order as delivered action
  const handleMarkDelivered = async (orderId: string | number) => {
    try {
      await logisticsService.markDelivered(String(orderId));
      setSuccessMsg(`Order #${orderId} marked as Delivered!`);
      // Refresh orders list
      const refreshedOrders = await logisticsService.getActiveDeliveries();
      setActiveOrders(refreshedOrders);

      // If route was previously computed, re-calculate for remaining active deliveries
      if (refreshedOrders.length > 0) {
        const updatedRoute = await logisticsService.optimizeRoute({
          vehicle_capacity: effectiveCapacity
        });
        setOptimizedRoute(updatedRoute);
      } else {
        setOptimizedRoute(null);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update order delivery status');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-16">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center active:scale-95 transition-all shadow-2xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
          <span>🚚</span>
          <span>Delivery Plan</span>
        </h2>
        <button
          onClick={loadOrders}
          className="w-10 h-10 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center active:scale-95 transition-all"
          title="Refresh orders"
        >
          <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 flex items-start gap-3 text-xs sm:text-sm font-bold animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{errorMsg}</p>
            {errorMsg.includes('capacity exceeded') && (
              <p className="text-[11px] text-rose-700 font-medium mt-1">
                Tip: Increase vehicle capacity below or deliver fewer orders in this batch.
              </p>
            )}
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Delivery Plan Setup Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-300 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
              Active Shipments
            </span>
            <h3 className="text-2xl font-black text-stone-900 mt-0.5">
              🚚 Delivery Plan
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl">
            📦
          </div>
        </div>

        {/* Orders & Total Quantity Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
              Pending Orders
            </span>
            <span className="text-xl font-black text-stone-900 mt-0.5 block">
              {loadingOrders ? '...' : `${activeOrders.length} Orders`}
            </span>
            <span className="text-[10px] text-stone-400 font-medium">
              Ready for dispatch
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Total Quantity
            </span>
            <span className="text-xl font-black text-emerald-950 mt-0.5 block">
              {totalOrdersWeight} kg
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">
              Harvest payload
            </span>
          </div>
        </div>

        {/* Vehicle Capacity Selector */}
        <div className="space-y-2">
          <label className="text-xs font-black text-stone-800 uppercase tracking-wider block">
            Vehicle Capacity
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[500, 1000, 2000].map((cap) => (
              <button
                key={cap}
                type="button"
                onClick={() => {
                  setCapacityOption(cap);
                  setIsCustomCapacity(false);
                }}
                className={`py-2.5 px-2 rounded-2xl font-black text-xs transition-all border-2 ${
                  !isCustomCapacity && capacityOption === cap
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {cap} kg
              </button>
            ))}
          </div>

          {/* Custom Capacity Option */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsCustomCapacity(!isCustomCapacity)}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 underline flex items-center gap-1"
            >
              <span>{isCustomCapacity ? 'Use standard vehicle capacity' : '+ Enter custom vehicle capacity'}</span>
            </button>
            {isCustomCapacity && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={customCapacity}
                  onChange={(e) => setCustomCapacity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold focus:border-emerald-600 focus:outline-hidden"
                />
                <span className="text-xs font-bold text-stone-500 shrink-0">kg</span>
              </div>
            )}
          </div>

          {/* Capacity utilization indicator */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-stone-600">Vehicle Utilization</span>
              <span className={totalOrdersWeight > effectiveCapacity ? 'text-rose-600 font-black' : 'text-emerald-800'}>
                {Math.round((totalOrdersWeight / (effectiveCapacity || 1)) * 100)}% ({totalOrdersWeight} / {effectiveCapacity} kg)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  totalOrdersWeight > effectiveCapacity ? 'bg-rose-500' : 'bg-emerald-600'
                }`}
                style={{
                  width: `${Math.min(100, Math.round((totalOrdersWeight / (effectiveCapacity || 1)) * 100))}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* MAIN OPTIMIZE ROUTE BUTTON */}
        <button
          onClick={handleOptimizeRoute}
          disabled={optimizing || loadingOrders || activeOrders.length === 0}
          className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md active:scale-98 transition-all"
        >
          <Truck className={`w-5 h-5 text-emerald-200 ${optimizing ? 'animate-bounce' : ''}`} />
          <span>{optimizing ? 'CALCULATING OR-TOOLS ROUTE...' : '🚚 OPTIMIZE ROUTE'}</span>
        </button>

        {/* Active Orders List Preview */}
        {activeOrders.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <span className="text-xs font-black text-stone-600 uppercase tracking-wider block">
              Orders Ready For Delivery ({activeOrders.length})
            </span>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {activeOrders.map((ord) => {
                const qty = ord.items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
                return (
                  <div
                    key={ord.id}
                    className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-black text-stone-900">
                        <span>📍</span>
                        <span>{ord.buyerName}</span>
                        <span className="text-[10px] font-bold text-stone-400">#{ord.id}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 truncate max-w-[200px]">
                        {ord.deliveryAddress || ord.deliveryLocation?.city}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-emerald-800 block">{qty} kg</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-200/80 text-stone-700">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Optimized Route Results Section */}
      {optimizedRoute && (
        <div id="route-results-section" className="space-y-5 animate-in fade-in duration-300">
          <RouteSummary
            routeData={optimizedRoute}
            onViewMap={() => setShowMap(!showMap)}
            onMarkDelivered={handleMarkDelivered}
            showViewRouteButton={true}
          />

          {/* Interactive Leaflet OpenStreetMap */}
          {showMap && (
            <div className="space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                  <span>🗺️</span>
                  <span>Interactive Delivery Route Map</span>
                </h4>
                <button
                  onClick={() => setShowMap(false)}
                  className="text-xs font-bold text-stone-500 hover:text-stone-700"
                >
                  Hide Map
                </button>
              </div>

              <RouteMap routeData={optimizedRoute} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
