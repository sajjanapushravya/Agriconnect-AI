import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  ShoppingBag,
  Sparkles,
  Sprout,
  TrendingDown
} from 'lucide-react';
import { Product, ProductCategory, User, UserRole } from '../types';
import { ProductCard } from '../components/ProductCard';

interface MarketplacePageProps {
  products: Product[];
  currentUser: User | null;
  currentRole: UserRole;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewProductDetails: (product: Product) => void;
  onOpenAddProduct: () => void;
}

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Spices'
];

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  products,
  currentUser,
  currentRole,
  onAddToCart,
  onViewProductDetails,
  onOpenAddProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sellerFilter, setSellerFilter] = useState<'all' | 'farmer' | 'fpo'>('all');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'savings' | 'price_asc' | 'price_desc' | 'rating'>('savings');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (sellerFilter !== 'all' && p.sellerType !== sellerFilter) return false;
        if (organicOnly && !p.isOrganic) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.sellerName.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'savings') {
          return (b.marketPrice - b.price) - (a.marketPrice - a.price);
        }
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, sellerFilter, organicOnly, searchQuery, sortBy]);

  // Aggregate stats
  const avgSavingsPct = useMemo(() => {
    if (!products.length) return 0;
    const totalMarket = products.reduce((s, p) => s + p.marketPrice, 0);
    const totalPlatform = products.reduce((s, p) => s + p.price, 0);
    return Math.round(((totalMarket - totalPlatform) / totalMarket) * 100);
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Marketplace Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <Sprout className="w-4 h-4" />
            <span>Farm Gate & FPO Direct Sourcing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Direct Agricultural Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
            Compare farm-direct listings with live APMC wholesale benchmark prices. Transparent
            costs, zero hidden commissions, and consolidated logistics.
          </p>
        </div>

        {/* Quick Highlights */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-300 block">
              {products.length}
            </span>
            <span className="text-[11px] font-medium text-stone-300">Live Listings</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-300 block">
              {avgSavingsPct}%
            </span>
            <span className="text-[11px] font-medium text-stone-300">Avg. Mandi Savings</span>
          </div>

          {(currentRole === 'farmer' || currentRole === 'fpo' || currentRole === 'admin') && (
            <button
              onClick={onOpenAddProduct}
              className="py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-all shadow-lg flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>List Produce</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-4">
        {/* Top Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crops, farmers, FPOs, or districts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Sort & Secondary Filters */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end text-xs">
            <div className="flex items-center gap-1 text-stone-600 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-2.5 rounded-lg border border-stone-300 bg-white font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="savings">Highest Savings (₹)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Seller Type Filter */}
            <div className="flex items-center rounded-lg border border-stone-200 p-0.5 bg-stone-100">
              <button
                onClick={() => setSellerFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  sellerFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSellerFilter('farmer')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  sellerFilter === 'farmer'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Farmers
              </button>
              <button
                onClick={() => setSellerFilter('fpo')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  sellerFilter === 'fpo'
                    ? 'bg-white text-purple-800 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                FPOs
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs & Organic Pill */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100">
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Organic toggle */}
          <button
            onClick={() => setOrganicOnly(!organicOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              organicOnly
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-white text-stone-600 border-stone-300 hover:border-amber-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Certified Organic Only</span>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 space-y-3">
          <ShoppingBag className="w-10 h-10 mx-auto text-stone-300" />
          <h3 className="font-bold text-stone-800">No agricultural produce found</h3>
          <p className="text-xs text-stone-500">
            Try adjusting your search criteria, category filters, or organic toggle.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={onAddToCart}
              onViewDetails={onViewProductDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
