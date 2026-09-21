import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, BuyerType, User, Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentUser: User | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onOrderPlaced: (newOrder: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentUser,
  onUpdateQuantity,
  onRemoveItem,
  onOrderPlaced
}) => {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [deliveryAddress, setDeliveryAddress] = useState(
    'Green Bowl Cafe, 14th Road, Bandra West, Mumbai 400050'
  );
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [buyerType, setBuyerType] = useState<BuyerType>(
    currentUser?.buyerType || 'restaurant'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalAgri = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalMarket = cartItems.reduce(
    (sum, item) => sum + item.product.marketPrice * item.quantity,
    0
  );
  const totalSavings = Math.max(0, totalMarket - totalAgri);
  const savingsPct =
    totalMarket > 0 ? Number(((totalSavings / totalMarket) * 100).toFixed(1)) : 0;

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        buyerId: currentUser?.id || 'user-buyer-1',
        buyerName: currentUser?.name || 'Vikram Mehta (Green Bowl Cafe)',
        buyerType: buyerType,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          marketPrice: item.product.marketPrice,
          savings: (item.product.marketPrice - item.product.price) * item.quantity,
          unit: item.product.unit,
          imageUrl: item.product.imageUrl
        })),
        deliveryAddress,
        deliveryLocation: {
          lat: 19.0607,
          lng: 72.8362,
          city: 'Mumbai (Bandra)'
        },
        preferredDeliveryDate: deliveryDate
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        throw new Error('Failed to place order');
      }

      const createdOrder: Order = await res.json();

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe confetti fallback
      }

      onOrderPlaced(createdOrder);
      setStep('cart');
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error processing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-base text-stone-900">
              {step === 'cart' ? `Your Sourcing Cart (${cartItems.length})` : 'Delivery & Sourcing Checkout'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center text-stone-500 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-stone-700">Your sourcing cart is empty</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore the farm-direct marketplace to source fresh produce with transparent mandi price savings.
              </p>
            </div>
          ) : step === 'cart' ? (
            <>
              {/* Savings Announcement Banner (as requested in Section 15) */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 text-white shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-200 font-medium uppercase tracking-wider block">
                    Direct Farmer Sourcing
                  </span>
                  <p className="text-xs text-emerald-100 line-through">
                    Mandi Wholesale: ₹{totalMarket.toLocaleString()}
                  </p>
                  <p className="text-base font-extrabold">
                    AgriConnect Total: ₹{totalAgri.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-white font-extrabold text-xs block shadow-sm">
                    You Save: ₹{totalSavings.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-200 mt-0.5 block">
                    ({savingsPct}% cheaper)
                  </span>
                </div>
              </div>

              {/* Itemized list */}
              <div className="space-y-3">
                {cartItems.map(({ product, quantity }) => {
                  const itemSavings = (product.marketPrice - product.price) * quantity;
                  return (
                    <div
                      key={product.id}
                      className="p-3 bg-stone-50/80 rounded-xl border border-stone-200 flex gap-3 items-center"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover bg-white shrink-0 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 truncate">{product.sellerName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-extrabold text-emerald-800">
                            ₹{product.price}/{product.unit}
                          </span>
                          <span className="text-[10px] text-stone-400 line-through">
                            ₹{product.marketPrice}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                            Save ₹{itemSavings.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-lg p-0.5 shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(product.id, Math.max(5, quantity - 10))}
                            className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-stone-800 px-1 min-w-[32px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                product.id,
                                Math.min(product.quantity, quantity + 10)
                              )
                            }
                            className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-[11px] text-red-600 hover:underline flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Step 2: Checkout Form */
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <span className="font-bold flex items-center gap-1 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" /> Transparent Wholesale Sourcing
                </span>
                <p className="text-[11px] mt-0.5 text-emerald-800">
                  Orders are automatically bundled into our AI Vehicle Routing Engine for minimum transit time.
                </p>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Buyer Category</label>
                <select
                  value={buyerType}
                  onChange={(e) => setBuyerType(e.target.value as BuyerType)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="restaurant">Restaurant / Commercial Kitchen</option>
                  <option value="supermarket">Supermarket / Retail Chain</option>
                  <option value="hotel">Hotel / Hospitality Catering</option>
                  <option value="retailer">Local Grocery Retailer</option>
                  <option value="consumer">Individual Direct Consumer</option>
                  <option value="bulk_buyer">Bulk Wholesale Buyer</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Delivery Address & Drop Location
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Street address, landmark, PIN code"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" /> Preferred Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Simulated Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl border-2 border-emerald-600 bg-emerald-50/50 flex items-center gap-2 font-semibold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>UPI / NetBanking (Test)</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-stone-300 bg-white flex items-center gap-2 text-stone-600 font-medium">
                    <span>Pay on Farm Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Wholesale Mandi Valuation:</span>
                <span className="line-through">₹{totalMarket.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>AgriConnect Platform Savings:</span>
                <span>- ₹{totalSavings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-900 font-extrabold text-sm pt-1 border-t border-stone-200">
                <span>Final Payable:</span>
                <span>₹{totalAgri.toLocaleString()}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('cart')}
                  className="py-3 px-4 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-100"
                >
                  Back
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={handleCheckout}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-75 text-white font-bold text-sm transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>{isSubmitting ? 'Optimizing Route & Placing...' : `Confirm Order (₹${totalAgri.toLocaleString()})`}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
