import React from 'react';
import { ArrowLeft, Check, CheckCircle2 } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface SimpleOrdersViewProps {
  orders: Order[];
  onBack?: () => void;
  onNavigateToDelivery?: () => void;
}

export const SimpleOrdersView: React.FC<SimpleOrdersViewProps> = ({
  orders,
  onBack,
  onNavigateToDelivery
}) => {
  const getStepStatus = (orderStatus: OrderStatus, stepIndex: number) => {
    // 0: Placed, 1: Confirmed, 2: On the Way, 3: Delivered
    let current = 1;
    if (orderStatus === 'PLACED') current = 0;
    else if (orderStatus === 'CONFIRMED' || orderStatus === 'PROCESSING') current = 1;
    else if (orderStatus === 'OUT_FOR_DELIVERY' || orderStatus === 'READY_FOR_DISPATCH') current = 2;
    else if (orderStatus === 'DELIVERED') current = 3;

    if (stepIndex < current) return 'done';
    if (stepIndex === current) return 'active';
    return 'pending';
  };

  const renderStep = (label: string, status: 'done' | 'active' | 'pending') => {
    if (status === 'done') {
      return (
        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
            ✓
          </span>
          <span>{label}</span>
        </div>
      );
    }
    if (status === 'active') {
      return (
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
          <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-sm font-black">
            ●
          </span>
          <span className="underline decoration-amber-400">{label}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-400">
        <span className="w-5 h-5 rounded-full border border-stone-300 flex items-center justify-center text-xs text-stone-300">
          ○
        </span>
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-9" />
        )}
        <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
          <span>📦</span>
          <span>My Orders</span>
        </h2>
        <div className="w-9" />
      </div>

      {onNavigateToDelivery && (
        <button
          onClick={onNavigateToDelivery}
          className="w-full p-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm flex items-center justify-between shadow-xs active:scale-98 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🚚</span>
            <div className="text-left">
              <span className="block font-black text-sm">Plan Delivery Route</span>
              <span className="block text-[10px] text-emerald-200 font-semibold">
                Google OR-Tools Route Optimizer
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-white/20 text-white text-[11px] font-black uppercase">
            OPTIMIZE →
          </span>
        </button>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-stone-200 text-center space-y-2">
          <span className="text-4xl block">📦</span>
          <h3 className="text-base font-black text-stone-900">No Orders Yet</h3>
          <p className="text-xs text-stone-500">
            Orders placed or received will appear here as simple cards.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((order, index) => {
            const firstItem = order.items[0];
            const orderNum = order.id.replace(/[^0-9]/g, '').slice(-4) || String(1020 + index);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-4 hover:border-emerald-200 transition-all"
              >
                {/* Header: Order #1024 and Total */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-black text-stone-900">
                      Order #{orderNum}
                    </h3>
                    <p className="text-sm font-extrabold text-stone-700 mt-0.5">
                      🍅 {firstItem?.productName || 'Farm Produce'} — {firstItem?.quantity || 20} {firstItem?.unit || 'kg'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-stone-900 block">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800">
                      Saved ₹{order.totalSavings || 50}
                    </span>
                  </div>
                </div>

                {/* Simple 4-Step Progress Indicator per exact requirement */}
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {renderStep('Order Placed', getStepStatus(order.status, 0))}
                    {renderStep('Confirmed', getStepStatus(order.status, 1))}
                    {renderStep('On the Way', getStepStatus(order.status, 2))}
                    {renderStep('Delivered', getStepStatus(order.status, 3))}
                  </div>
                </div>

                {/* Destination / Details */}
                <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                  <span>📍 {order.deliveryAddress || 'Farm to Direct Buyer'}</span>
                  <span className="font-semibold text-stone-700">
                    {order.status === 'DELIVERED' ? '🟢 Completed' : '🚚 Active'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
