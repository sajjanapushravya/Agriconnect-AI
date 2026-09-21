import React from 'react';
import { Star, MapPin, Plus, Sparkles, UserCheck } from 'lucide-react';
import { Product } from '../types';
import { calculate_savings, calculate_savings_percentage } from '../utils/priceIntelligence';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails
}) => {
  const savings = calculate_savings(product.marketPrice, product.price);
  const savingsPct = calculate_savings_percentage(product.marketPrice, product.price);

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image & Badges */}
      <div
        onClick={() => onViewDetails(product)}
        className="relative h-48 w-full overflow-hidden bg-stone-100 cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-sm tracking-wide">
            Save ₹{savings}/{product.unit} ({savingsPct}%)
          </span>
          {product.isOrganic && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Certified Organic
            </span>
          )}
        </div>

        {/* Seller Type Badge */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-sm ${
              product.sellerType === 'fpo'
                ? 'bg-purple-900/80 text-purple-100'
                : 'bg-emerald-900/80 text-emerald-100'
            }`}
          >
            {product.sellerType.toUpperCase()}
          </span>
        </div>

        {/* Rating overlay */}
        <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded bg-stone-900/70 backdrop-blur-sm text-white text-xs flex items-center gap-1 font-semibold">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{product.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Origin */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold text-emerald-700">{product.category}</span>
            <span className="flex items-center gap-0.5 text-stone-500 truncate max-w-[130px]">
              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
              <span className="truncate">{product.location}</span>
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(product)}
            className="font-bold text-stone-900 text-base leading-snug group-hover:text-emerald-700 cursor-pointer line-clamp-1 transition-colors"
          >
            {product.name}
          </h3>

          {/* Seller name */}
          <p className="text-xs text-stone-600 mt-1 flex items-center gap-1 line-clamp-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate font-medium">{product.sellerName}</span>
          </p>
        </div>

        {/* Pricing Block */}
        <div className="mt-3 pt-3 border-t border-stone-100">
          <div className="flex items-baseline justify-between gap-1">
            <div>
              <p className="text-[11px] text-stone-500 line-through">
                Mandi Wholesale: ₹{product.marketPrice}/{product.unit}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-stone-900">
                  ₹{product.price}
                </span>
                <span className="text-xs font-semibold text-stone-600">
                  /{product.unit}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-stone-500 block">Stock Available</span>
              <span
                className={`text-xs font-bold ${
                  product.quantity < 200 ? 'text-amber-600' : 'text-emerald-700'
                }`}
              >
                {product.quantity.toLocaleString()} {product.unit}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onViewDetails(product)}
              className="flex-1 py-2 px-3 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors text-center"
            >
              Details & Intel
            </button>
            <button
              onClick={() => onAddToCart(product, product.minOrderQuantity || 10)}
              className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm hover:shadow-md hover:shadow-emerald-700/20 active:scale-95"
              title={`Add ${product.minOrderQuantity || 10} kg to cart`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
