import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Minus,
  ShoppingCart,
  MapPin,
  Phone,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Order, Product, User } from '../../types';

interface BuyerSimpleMarketplaceProps {
  products: Product[];
  currentUser: User | null;
  onPlaceOrder: (order: Order) => void;
}

export const BuyerSimpleMarketplace: React.FC<BuyerSimpleMarketplaceProps> = ({
  products,
  currentUser,
  onPlaceOrder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Single item buy modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(10);
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    currentUser?.location || 'MG Road, Bengaluru'
  );
  const [contactPhone, setContactPhone] = useState<string>(
    currentUser?.phone || '+91 98765 43210'
  );
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  const categories = [
    'All',
    'Vegetables',
    'Fruits',
    'Grains',
    'Pulses',
    'Spices',
    'Other'
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleOpenBuy = (prod: Product) => {
    setSelectedProduct(prod);
    setOrderQuantity(Math.min(prod.quantity, prod.minOrderQuantity || 10));
    setOrderSuccess(null);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const unitPrice = selectedProduct.price;
    const mPrice = selectedProduct.marketPrice || unitPrice;
    const totalAmount = unitPrice * orderQuantity;
    const totalSavings = Math.max(0, (mPrice - unitPrice) * orderQuantity);

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      buyerId: currentUser?.id || 'buyer_1',
      buyerName: currentUser?.name || 'Priya Sharma',
      buyerType: 'consumer',
      sellerId: selectedProduct.sellerId,
      sellerName: selectedProduct.sellerName,
      status: 'CONFIRMED',
      totalAmount: totalAmount,
      marketAmount: mPrice * orderQuantity,
      totalSavings: totalSavings,
      deliveryAddress: deliveryAddress,
      deliveryLocation: {
        lat: 12.9716,
        lng: 77.5946,
        city: deliveryAddress
      },
      items: [
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity: orderQuantity,
          unit: selectedProduct.unit,
          price: selectedProduct.price,
          marketPrice: mPrice,
          savings: totalSavings,
          imageUrl: selectedProduct.imageUrl
        }
      ],
      statusUpdates: [
        {
          status: 'CONFIRMED',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString().split('T')[0],
      preferredDeliveryDate: 'Tomorrow Morning'
    };

    onPlaceOrder(newOrder);
    setOrderSuccess(newOrder);
  };

  // Order Confirmed Screen
  if (orderSuccess) {
    return (
      <div className="space-y-6 text-center animate-in fade-in pb-12">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-4 border-emerald-500 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-stone-900">
            Order Placed Successfully!
          </h2>
          <p className="text-xs text-stone-600">
            Your produce is being packed directly at the farm.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-500 shadow-sm text-left space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="font-bold text-stone-500 text-xs">Order Summary</span>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Confirmed
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-black text-stone-900">
              {orderSuccess.items[0]?.productName} ({orderSuccess.items[0]?.quantity} {orderSuccess.items[0]?.unit})
            </span>
            <span className="font-black text-stone-900">
              ₹{orderSuccess.totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl flex items-center justify-between text-xs font-black text-emerald-900">
            <span>You Saved</span>
            <span>₹{orderSuccess.totalSavings.toLocaleString()}</span>
          </div>

          <div className="text-[11px] text-stone-500 space-y-0.5 pt-1">
            <p>📍 {orderSuccess.deliveryAddress}</p>
            <p>🚚 Delivery: Tomorrow Morning</p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedProduct(null);
            setOrderSuccess(null);
          }}
          className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base shadow-md active:scale-98 transition-all"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Single Product Checkout Modal
  if (selectedProduct) {
    const hasMarketPrice = Boolean(selectedProduct.marketPrice && selectedProduct.marketPrice > 0);
    const mPrice = selectedProduct.marketPrice || selectedProduct.price;
    const itemTotal = selectedProduct.price * orderQuantity;
    const itemSavings = Math.max(0, (mPrice - selectedProduct.price) * orderQuantity);
    const unitSavings = Math.max(0, mPrice - selectedProduct.price);

    return (
      <div className="space-y-5 animate-in fade-in duration-200 pb-12">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedProduct(null)}
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-black text-stone-900">Buy Produce</h2>
          <div className="w-9" />
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3.5">
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="w-18 h-18 rounded-2xl object-cover border border-stone-200"
            />
            <div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                {selectedProduct.category}
              </span>
              <h3 className="text-xl font-black text-stone-900 leading-tight mt-0.5">
                {selectedProduct.name}
              </h3>
              <p className="text-xs text-stone-500 font-semibold">
                Direct from {selectedProduct.sellerName} • {selectedProduct.location}
              </p>
            </div>
          </div>

          {/* Price Intelligence Card */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                  AgriConnect Price
                </span>
                <span className="text-2xl font-black text-emerald-950">
                  ₹{selectedProduct.price}
                  <span className="text-xs font-semibold text-stone-600">/{selectedProduct.unit}</span>
                </span>
              </div>
              {hasMarketPrice && (
                <div className="text-right">
                  <span className="text-[11px] font-bold text-stone-400 uppercase block">
                    Market Price
                  </span>
                  <span className="text-sm font-bold text-stone-500 line-through">
                    ₹{selectedProduct.marketPrice}/{selectedProduct.unit}
                  </span>
                </div>
              )}
            </div>

            {unitSavings > 0 && (
              <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs font-black text-emerald-900">
                <span>Buyer Saves ₹{unitSavings}/{selectedProduct.unit}</span>
                <span>🟢 Good Price</span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">
              Quantity to Buy ({selectedProduct.unit})
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOrderQuantity((q) => Math.max(5, q - 5))}
                className="w-11 h-11 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-black active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex-1 text-center font-black text-xl text-stone-900 bg-stone-50 py-2.5 rounded-2xl border border-stone-200">
                {orderQuantity} {selectedProduct.unit}
              </div>
              <button
                type="button"
                onClick={() =>
                  setOrderQuantity((q) => Math.min(selectedProduct.quantity, q + 5))
                }
                className="w-11 h-11 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-black active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <form onSubmit={handleConfirmOrder} className="space-y-3.5 pt-2">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Total and Savings */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1 text-xs">
              <div className="flex justify-between font-bold text-stone-600">
                <span>Total Amount:</span>
                <span className="text-base font-black text-stone-900">₹{itemTotal.toLocaleString()}</span>
              </div>
              {itemSavings > 0 && (
                <div className="flex justify-between font-black text-emerald-800 pt-1 border-t border-stone-200">
                  <span>Your Net Savings:</span>
                  <span>₹{itemSavings.toLocaleString()}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base shadow-md active:scale-98 transition-all"
            >
              Confirm & Place Order
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main Marketplace Produce Grid
  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-12">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">
          Buy Fresh Produce
        </h2>
        <p className="text-xs text-stone-500 font-medium">
          Direct from verified farmers at fair prices
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tomato, onion, mango..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border-2 border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-600"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-black shrink-0 transition-all active:scale-95 ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Produce Cards List */}
      <div className="space-y-3.5">
        {filteredProducts.map((prod) => {
          const hasMarketPrice = Boolean(prod.marketPrice && prod.marketPrice > 0);
          const savingsPerUnit = hasMarketPrice ? Math.max(0, prod.marketPrice! - prod.price) : 0;
          const isGoodPrice = hasMarketPrice && prod.price < prod.marketPrice!;

          return (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-4 border-2 border-stone-200 hover:border-emerald-300 shadow-xs transition-all space-y-3"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-18 h-18 rounded-2xl object-cover border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                      {prod.category}
                    </span>
                    {isGoodPrice && (
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        🟢 Good Price
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-stone-900 leading-tight mt-1 truncate">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {prod.sellerName} • {prod.location}
                  </p>
                </div>
              </div>

              {/* Price comparison layout strictly per Section 8 spec:
                  🍅 Tomato
                  Market Price: ₹30/kg
                  Your Price: ₹25/kg
                  Buyer Saves ₹5/kg
                  🟢 Good Price */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">
                    Your Price
                  </span>
                  <span className="text-lg font-black text-emerald-950">
                    ₹{prod.price}
                    <span className="text-xs font-semibold text-stone-500">/{prod.unit}</span>
                  </span>
                </div>

                {hasMarketPrice && (
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">
                      Market Price
                    </span>
                    <span className="text-xs font-bold text-stone-500 line-through">
                      ₹{prod.marketPrice}/{prod.unit}
                    </span>
                  </div>
                )}
              </div>

              {/* Savings strip and Action button */}
              <div className="flex items-center justify-between pt-1">
                {savingsPerUnit > 0 ? (
                  <span className="text-xs font-black text-emerald-800">
                    Buyer Saves ₹{savingsPerUnit}/{prod.unit}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-stone-500">
                    {prod.quantity} {prod.unit} in stock
                  </span>
                )}

                <button
                  onClick={() => handleOpenBuy(prod)}
                  className="py-2 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-sm active:scale-95 transition-all"
                >
                  Buy Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
