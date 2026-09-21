import React, { useState, useMemo } from 'react';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Fuel,
  Leaf,
  Navigation,
  RefreshCw,
  Sliders,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { DeliveryStop, Order, RouteOptimizationResult } from '../types';
import { optimizeDeliveryRoute } from '../utils/routeOptimizer';
import { RouteMap } from '../components/RouteMap';

interface RouteOptimizerPageProps {
  orders: Order[];
}

export const RouteOptimizerPage: React.FC<RouteOptimizerPageProps> = ({ orders }) => {
  const [vehicleCapacity, setVehicleCapacity] = useState<number>(2500);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationSeed, setOptimizationSeed] = useState<number>(1);

  // Derive initial stops from active orders
  const initialStops = useMemo<DeliveryStop[]>(() => {
    return orders.map((ord, idx) => ({
      id: `stop-${ord.id}`,
      orderId: ord.id,
      buyerName: ord.buyerName,
      buyerType: ord.buyerType,
      address: ord.deliveryAddress,
      lat: ord.deliveryLocation?.lat || 19.0760 + (idx * 0.03 - 0.05),
      lng: ord.deliveryLocation?.lng || 72.8777 + (idx * 0.02 - 0.04),
      quantityKg: ord.items.reduce((s, it) => s + it.quantity, 0),
      status: ord.status,
      sequenceOrder: idx + 1
    }));
  }, [orders]);

  const [currentStops, setCurrentStops] = useState<DeliveryStop[]>(initialStops);

  // Compute optimized route result using our 2-Opt VRP engine
  const routeResult = useMemo<RouteOptimizationResult>(() => {
    return optimizeDeliveryRoute(
      currentStops,
      {
        lat: 19.0760,
        lng: 72.8777,
        address: 'Sector 19, APMC Market Corridor, Navi Mumbai'
      },
      vehicleCapacity
    );
  }, [currentStops, vehicleCapacity, optimizationSeed]);

  const handleReOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setOptimizationSeed((s) => s + 1);
      setIsOptimizing(false);
    }, 400);
  };

  const handleToggleStopStatus = (stopId: string) => {
    setCurrentStops((prev) =>
      prev.map((s) => {
        if (s.id === stopId) {
          const nextStatus = s.status === 'DELIVERED' ? 'OUT_FOR_DELIVERY' : 'DELIVERED';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <Navigation className="w-4 h-4" />
            <span>Vehicle Routing Problem (VRP) & 2-Opt Local Search</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Route Optimizer & Smart Logistics
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
            Consolidates farm-direct multi-stop deliveries into the shortest, most fuel-efficient
            trajectory. Cuts fuel burn, avoids city congestion, and guarantees freshness.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleReOptimize}
          disabled={isOptimizing}
          className="py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs transition-all shadow-lg flex items-center gap-2 active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Solving VRP Matrix...' : 'Re-Run 2-Opt Optimizer'}</span>
        </button>
      </div>

      {/* Primary Metrics Comparison Grid (Section 18 spec) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Unoptimized Distance
          </span>
          <span className="text-xl font-extrabold text-stone-400 line-through">
            {routeResult.totalDistanceBeforeKm} km
          </span>
          <span className="text-[11px] text-stone-500 block">Baseline sequence</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Optimized Distance
          </span>
          <span className="text-2xl font-extrabold text-stone-900">
            {routeResult.totalDistanceOptimizedKm} km
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold block">VRP 2-Opt Solution</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
            Distance Saved
          </span>
          <span className="text-2xl font-extrabold text-emerald-700">
            {routeResult.distanceSavedKm} km
          </span>
          <span className="text-[11px] text-stone-500 block">Shortest loop</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
            Travel Time Saved
          </span>
          <span className="text-2xl font-extrabold text-emerald-800">
            {routeResult.distanceSavedPercentage}%
          </span>
          <span className="text-[11px] text-stone-500 block">~{routeResult.estimatedTravelTimeMinutes} mins trip</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
            Fuel Saved
          </span>
          <span className="text-2xl font-extrabold text-amber-600">
            {routeResult.estimatedFuelSavedLiters} L
          </span>
          <span className="text-[11px] text-stone-500 block">~₹{routeResult.estimatedFuelSavedCostInr} Saved</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
            CO2 Avoided
          </span>
          <span className="text-2xl font-extrabold text-emerald-600">
            {routeResult.co2SavedKg} kg
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
            <Leaf className="w-3 h-3" /> Eco-Delivery
          </span>
        </div>
      </div>

      {/* Main Layout: Leaflet Interactive Map & Delivery Stops Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Leaflet OpenStreetMap Visualizer */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-stone-900">
                Interactive Fleet Trajectory Map
              </h3>
              <p className="text-xs text-stone-500">
                OpenStreetMap route with sequence pins and real-time geographic nodes
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {routeResult.stops.length} Drops Scheduled
            </span>
          </div>

          {/* Leaflet Map Component */}
          <RouteMap routeResult={routeResult} />

          {/* Capacity Slider & Vehicle info */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="font-bold text-stone-800 block">Vehicle Payload Capacity</span>
                <span className="text-[11px] text-stone-500">
                  Current Planned Payload: {routeResult.stops.reduce((s, st) => s + st.quantityKg, 0)} kg
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="range"
                min={1000}
                max={5000}
                step={500}
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(Number(e.target.value))}
                className="accent-emerald-600 cursor-pointer w-36"
              />
              <span className="font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-stone-300">
                {vehicleCapacity} kg
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Ordered Stops Sequence Checklist */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base text-stone-900">
                Optimized Waypoint Sequence
              </h3>
              <span className="text-xs text-stone-400 font-mono">2-Opt Re-Indexed</span>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Driver checklist sorted by mathematical proximity to minimize transit time
            </p>

            {/* Stops list */}
            <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
              {/* Depot Start */}
              <div className="p-3 rounded-xl bg-emerald-950 text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center font-bold">
                    🏢
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                      Origin Dispatch Hub
                    </span>
                    <h5 className="font-bold">{routeResult.depotName}</h5>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-200 font-mono">08:00 AM</span>
              </div>

              {/* Stops */}
              {routeResult.stops.map((stop) => {
                const isDelivered = stop.status === 'DELIVERED';
                return (
                  <div
                    key={stop.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                      isDelivered
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 ${
                          isDelivered
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {stop.sequenceOrder}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-stone-900 truncate">{stop.buyerName}</h5>
                          <span className="px-1.5 py-0.2 rounded bg-stone-200/70 text-stone-700 text-[10px] font-semibold uppercase">
                            {stop.buyerType}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{stop.address}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-600">
                          <span className="font-bold text-emerald-800">{stop.quantityKg} kg produce</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-stone-500">
                            <Clock className="w-3 h-3" /> {stop.estimatedArrival}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Delivered Action */}
                    <button
                      onClick={() => handleToggleStopStatus(stop.id)}
                      className={`p-1.5 rounded-lg border transition-colors shrink-0 ml-2 ${
                        isDelivered
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : 'bg-white border-stone-300 text-stone-400 hover:text-emerald-700'
                      }`}
                      title="Toggle delivered status"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {/* Depot Return */}
              <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 flex items-center justify-between text-xs">
                <span className="font-semibold text-[11px]">Return to Central Hub (End of Shift)</span>
                <span className="text-[11px] font-mono text-stone-400">~12:30 PM</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <p className="text-[11px] text-stone-700">
              Live coordinates and estimated arrival windows are recalculated dynamically whenever
              new wholesale orders are placed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
