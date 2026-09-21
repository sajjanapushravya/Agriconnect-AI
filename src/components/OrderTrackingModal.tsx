import React, { useState } from 'react';
import {
  X,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Order, OrderStatus, UserRole } from '../types';

interface OrderTrackingModalProps {
  order: Order | null;
  currentRole: UserRole;
  onClose: () => void;
  onStatusUpdated?: (updatedOrder: Order) => void;
  onViewInRouteOptimizer?: (order: Order) => void;
}

const ORDER_STEPS: OrderStatus[] = [
  'PLACED',
  'CONFIRMED',
  'PROCESSING',
  'READY_FOR_DISPATCH',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  currentRole,
  onClose,
  onStatusUpdated,
  onViewInRouteOptimizer
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const currentStepIdx = ORDER_STEPS.indexOf(order.status);

  const handleUpdateStatus = async (nextStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          note: `Updated by ${currentRole.toUpperCase()}`
        })
      });
      if (!res.ok) throw new Error('Status update failed');
      const updated: Order = await res.json();
      if (onStatusUpdated) onStatusUpdated(updated);
    } catch (err: any) {
      alert(err.message || 'Error updating order status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Live Order & Logistics Tracking
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="text-lg font-extrabold text-stone-900">{order.id}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {order.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Timeline Visualizer */}
          <div>
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-4">
              Dispatch & Delivery Milestones
            </h4>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {ORDER_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                const update = order.statusUpdates?.find((u) => u.status === step);

                return (
                  <div key={step} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 border-white ring-4 ring-emerald-100'
                          : isPassed
                          ? 'bg-emerald-500 border-white'
                          : 'bg-stone-200 border-white'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-emerald-800 font-extrabold'
                              : isPassed
                              ? 'text-stone-900'
                              : 'text-stone-400'
                          }`}
                        >
                          {step.replace(/_/g, ' ')}
                        </span>
                        {update && (
                          <span className="text-[11px] text-stone-400 font-medium">
                            {update.timestamp}
                          </span>
                        )}
                      </div>
                      {update?.note && (
                        <p className="text-[11px] text-stone-500 mt-0.5">{update.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role Status Action Toolbar */}
          {(currentRole === 'farmer' || currentRole === 'fpo' || currentRole === 'admin') && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-emerald-900 block">
                  Update Delivery Status (Role: {currentRole.toUpperCase()})
                </span>
                <span className="text-stone-600 text-[11px]">Advance this order through the fulfillment pipeline</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentStepIdx < ORDER_STEPS.length - 1 && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(ORDER_STEPS[currentStepIdx + 1])}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <RefreshCw className={`w-3 h-3 ${isUpdating ? 'animate-spin' : ''}`} />
                    <span>Advance to {ORDER_STEPS[currentStepIdx + 1].replace(/_/g, ' ')}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Order Details & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <span className="font-bold text-stone-800 block mb-1">Destination & Buyer</span>
              <p className="text-stone-700 font-semibold">{order.buyerName}</p>
              <p className="text-stone-500 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>{order.deliveryAddress}</span>
              </p>
              <p className="text-stone-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Delivery Date: {order.preferredDeliveryDate}</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <span className="font-bold text-stone-800 block mb-1">Price Realization</span>
              <div className="flex justify-between text-stone-600">
                <span>Platform Total:</span>
                <span className="font-bold text-stone-900">₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Wholesale Mandi Cost:</span>
                <span className="line-through">₹{order.marketAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-stone-200">
                <span>Buyer Savings:</span>
                <span>₹{order.totalSavings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div>
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Sourced Produce Items ({order.items.length})
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                    />
                    <div>
                      <h5 className="font-bold text-stone-900">{item.productName}</h5>
                      <span className="text-stone-500">
                        {item.quantity} {item.unit} @ ₹{item.price}/{item.unit}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-stone-900 block">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Saved ₹{item.savings.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Route Optimizer Navigation */}
          {onViewInRouteOptimizer && (
            <button
              onClick={() => {
                onClose();
                onViewInRouteOptimizer(order);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Inspect Vehicle Routing in AI Route Optimizer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
