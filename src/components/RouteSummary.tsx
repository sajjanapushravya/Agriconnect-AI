import React from 'react';
import { MapPin, Navigation, Clock, Package, CheckCircle2, ShieldCheck, ArrowDown } from 'lucide-react';
import { OptimizedRouteApiResponse } from '../types';

interface RouteSummaryProps {
  routeData: OptimizedRouteApiResponse;
  onViewMap?: () => void;
  onMarkDelivered?: (orderId: string | number) => void;
  showViewRouteButton?: boolean;
}

export const RouteSummary: React.FC<RouteSummaryProps> = ({
  routeData,
  onViewMap,
  onMarkDelivered,
  showViewRouteButton = true
}) => {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} mins`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
  };

  const getCircledNumber = (num: number) => {
    const circled = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳'];
    return circled[num] || `${num}`;
  };

  return (
    <div className="bg-white rounded-3xl p-5 border-2 border-emerald-300 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wide">
            <span>✓</span>
            <span>Optimized Sequence</span>
          </div>
          <h3 className="text-xl font-black text-stone-900 flex items-center gap-2">
            <span>🚚</span>
            <span>Optimized Delivery Route</span>
          </h3>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl border border-emerald-200">
          🗺️
        </div>
      </div>

      {/* Metrics Row: Distance, Est. Time, Stops, Payload */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-500 uppercase block tracking-wider">
            Distance
          </span>
          <span className="text-base sm:text-lg font-black text-stone-900 mt-0.5 block">
            {routeData.total_distance_km} km
          </span>
          <span className="text-[9px] text-stone-400 font-medium block">
            Est. road dist.
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="text-[10px] font-bold text-emerald-800 uppercase block tracking-wider">
            Est. Time
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-950 mt-0.5 block">
            {formatTime(routeData.estimated_time_minutes)}
          </span>
          <span className="text-[9px] text-emerald-700 font-medium block">
            Transit + handling
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] font-bold text-stone-500 uppercase block tracking-wider">
            Stops
          </span>
          <span className="text-base sm:text-lg font-black text-stone-900 mt-0.5 block">
            {routeData.number_of_stops}
          </span>
          <span className="text-[9px] text-stone-400 font-medium block">
            {routeData.total_quantity} kg total
          </span>
        </div>
      </div>

      {/* Route Flow Sequence: Start -> Buyer 1 -> Buyer 2 ... */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-black text-stone-600 uppercase tracking-wider block">
          Delivery Flow Order
        </span>

        {/* Start Point */}
        <div className="p-3 rounded-2xl bg-emerald-900 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center font-black text-sm">
              🏠
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                Origin / Start
              </span>
              <h4 className="font-black text-xs sm:text-sm text-white">
                {routeData.start_location?.address || 'Farmer Farm / Aggregation Hub'}
              </h4>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-emerald-800 text-emerald-100">
            DEPOT
          </span>
        </div>

        {/* Stops in exact sequence */}
        {routeData.route.map((stop, index) => (
          <React.Fragment key={stop.order_id || index}>
            {/* Arrow Divider */}
            <div className="flex items-center justify-center py-0.5 text-stone-400">
              <ArrowDown className="w-4 h-4 text-emerald-600 animate-bounce" />
            </div>

            {/* Stop Card */}
            <div className="p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100/70 border border-stone-200 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                    {getCircledNumber(stop.sequence)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-stone-900 text-sm">
                        📍 {stop.buyer_name || `Buyer ${stop.sequence}`}
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-200/80 text-stone-700">
                        #{stop.order_id}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="line-clamp-1">{stop.address || 'Customer Delivery Address'}</span>
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px]">
                      <span className="font-black text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        📦 {stop.quantity} kg
                      </span>
                      {stop.distance_from_prev_km !== undefined && (
                        <span className="text-stone-500 font-semibold">
                          +{stop.distance_from_prev_km} km
                        </span>
                      )}
                      {stop.estimated_arrival_time && (
                        <span className="text-stone-600 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {stop.estimated_arrival_time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {onMarkDelivered && (
                  <button
                    onClick={() => onMarkDelivered(stop.order_id)}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                    title="Mark order delivered"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Delivered</span>
                  </button>
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* VIEW ROUTE Button */}
      {showViewRouteButton && onViewMap && (
        <button
          onClick={onViewMap}
          className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
        >
          <Navigation className="w-4 h-4 text-emerald-200" />
          <span>🗺️ VIEW ROUTE ON MAP</span>
        </button>
      )}

      {/* Sustainability and algorithm disclosure */}
      <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-1">
        <p className="flex items-start gap-1.5">
          <span className="text-emerald-700 font-black text-xs shrink-0">🌱</span>
          <span>
            {routeData.explanation ||
              'Route optimization helps organize deliveries efficiently and may reduce unnecessary travel when compared with an unplanned delivery sequence.'}
          </span>
        </p>
        <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-200">
          <span>Engine: {routeData.algorithm_used || 'Google OR-Tools VRP'}</span>
          <span>Road factor: 1.28x tortuosity</span>
        </div>
      </div>
    </div>
  );
};
