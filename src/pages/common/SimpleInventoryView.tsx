import React, { useState } from 'react';
import {
  Package,
  Plus,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  Search,
  Filter,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Product, User, UserRole } from '../../types';
import { Language, translations } from '../../utils/i18n';

interface SimpleInventoryViewProps {
  products: Product[];
  currentUser: User | null;
  currentRole: UserRole;
  language: Language;
  onUpdateStock: (productId: string, newQuantity: number) => void;
  onAddNewProduce: () => void;
  onBack: () => void;
}

export const SimpleInventoryView: React.FC<SimpleInventoryViewProps> = ({
  products,
  currentUser,
  currentRole,
  language,
  onUpdateStock,
  onAddNewProduce,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editQtyValue, setEditQtyValue] = useState<number>(0);

  // Filter products relevant to the user:
  // For individual farmers: show products belonging to currentUser, or all if demo
  // For FPO: show all FPO aggregated products or member products
  const userProducts = products.filter((p) => {
    if (currentRole === 'farmer') {
      return p.sellerId === currentUser?.id || p.sellerType === 'farmer';
    }
    if (currentRole === 'fpo') {
      return p.sellerType === 'fpo' || p.sellerId === currentUser?.id;
    }
    return true;
  });

  const filteredProducts = userProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'in_stock') return p.quantity > 0;
    if (filterMode === 'out_of_stock') return p.quantity <= 0;
    return true;
  });

  const totalStockKg = userProducts.reduce((sum, p) => sum + (p.unit === 'kg' ? p.quantity : 0), 0);
  const outOfStockCount = userProducts.filter((p) => p.quantity <= 0).length;
  const inStockCount = userProducts.filter((p) => p.quantity > 0).length;

  const handleStartEdit = (p: Product) => {
    setEditingStockId(p.id);
    setEditQtyValue(p.quantity);
  };

  const handleSaveEdit = (productId: string) => {
    onUpdateStock(productId, Math.max(0, editQtyValue));
    setEditingStockId(null);
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-black text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 px-3.5 py-2 rounded-2xl active:scale-95 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-stone-500" />
          <span>{language === 'te' ? '← వెనుకకు' : '← Back'}</span>
        </button>

        <button
          onClick={onAddNewProduce}
          className="flex items-center gap-1.5 text-xs font-black text-white bg-emerald-700 hover:bg-emerald-800 px-3.5 py-2 rounded-2xl shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'te' ? '+ పంటను చేర్చండి' : '+ Add Produce'}</span>
        </button>
      </div>

      {/* Screen Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
          <Package className="w-3.5 h-3.5" />
          <span>{language === 'te' ? 'స్టాక్ లభ్యత' : 'Inventory Management'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
          {language === 'te' ? 'పంట నిల్వలు & స్టాక్' : 'Produce Stock & Inventory'}
        </h1>
        <p className="text-xs text-stone-500 font-medium">
          {language === 'te'
            ? 'ఆర్డర్ రాగానే నిల్వలు స్వయంచాలకంగా తగ్గుతాయి. సున్నా అయితే "అవుట్ ఆఫ్ స్టాక్" గా మారుతుంది.'
            : 'Stock auto-reduces upon buyer orders. When zero, marked Out of Stock.'}
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs text-center space-y-0.5">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block">
            {language === 'te' ? 'మొత్తం పంటలు' : 'Listed Crops'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-stone-900 block">
            {userProducts.length}
          </span>
          <span className="text-[10px] text-stone-500 font-medium block">
            {language === 'te' ? 'రకాలు' : 'varieties'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-emerald-200 shadow-xs text-center space-y-0.5 bg-emerald-50/40">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block">
            {language === 'te' ? 'అందుబాటులో' : 'In Stock'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 block">
            {inStockCount}
          </span>
          <span className="text-[10px] text-emerald-800 font-medium block">
            {(totalStockKg / 1000).toFixed(1)} {language === 'te' ? 'టన్నులు' : 'Tons'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs text-center space-y-0.5">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block">
            {language === 'te' ? 'స్టాక్ అయిపోయింది' : 'Out of Stock'}
          </span>
          <span
            className={`text-xl sm:text-2xl font-black block ${
              outOfStockCount > 0 ? 'text-amber-600' : 'text-stone-400'
            }`}
          >
            {outOfStockCount}
          </span>
          <span className="text-[10px] text-stone-500 font-medium block">
            {language === 'te' ? 'నిల్వ సున్నా' : 'Zero qty'}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              language === 'te' ? 'పంట పేరుతో వెతకండి...' : 'Search by crop name (Tomato, Onion, Tamarind...)'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
              filterMode === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {language === 'te' ? 'అన్నీ' : 'All'} ({userProducts.length})
          </button>
          <button
            onClick={() => setFilterMode('in_stock')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
              filterMode === 'in_stock'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            🟢 {language === 'te' ? 'స్టాక్ ఉంది' : 'In Stock'} ({inStockCount})
          </button>
          <button
            onClick={() => setFilterMode('out_of_stock')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
              filterMode === 'out_of_stock'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            🔴 {language === 'te' ? 'స్టాక్ అయిపోయింది' : 'Out of Stock'} ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Inventory Cards List */}
      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-6 space-y-3">
            <span className="text-4xl block">🌾</span>
            <h3 className="font-bold text-stone-800">
              {language === 'te' ? 'పంటలు కనుగొనబడలేదు' : 'No produce matching this filter'}
            </h3>
            <p className="text-xs text-stone-500">
              {language === 'te' ? 'కొత్త పంటను నమోదు చేయడానికి కింద బటన్ నొక్కండి.' : 'Tap below to list a new harvest.'}
            </p>
            <button
              onClick={onAddNewProduce}
              className="py-2.5 px-4 rounded-xl bg-emerald-700 text-white font-black text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'పంటను జోడించండి' : 'Add New Produce'}</span>
            </button>
          </div>
        ) : (
          filteredProducts.map((prod) => {
            const isOutOfStock = prod.quantity <= 0;
            const isEditing = editingStockId === prod.id;

            return (
              <div
                key={prod.id}
                className={`bg-white rounded-3xl p-4 sm:p-5 border-2 transition-all shadow-xs space-y-3 ${
                  isOutOfStock ? 'border-amber-200 bg-amber-50/20' : 'border-stone-200 hover:border-emerald-200'
                }`}
              >
                {/* Product Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-14 h-14 rounded-2xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-black text-stone-900 text-base leading-tight truncate">
                          {prod.name}
                        </h3>
                        {prod.is_custom_product && (
                          <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md shrink-0">
                            {language === 'te' ? 'రైతు పంట' : 'Farm Direct'}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-500 font-medium block">
                        {prod.category} • ₹{prod.price}/{prod.unit}
                      </span>
                    </div>
                  </div>

                  {/* Stock Status Badge */}
                  {isOutOfStock ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 shrink-0 border border-rose-200">
                      🔴 {language === 'te' ? 'స్టాక్ ముగిసింది' : 'Out of Stock'}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 shrink-0 border border-emerald-200">
                      🟢 {language === 'te' ? 'స్టాక్ అందుబాటులో ఉంది' : 'In Stock'}
                    </span>
                  )}
                </div>

                {/* Stock Quantity Display & Controls */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      {language === 'te' ? 'అందుబాటులో ఉన్న నిల్వ' : 'Available Stock'}
                    </span>
                    {isEditing ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          min="0"
                          value={editQtyValue}
                          onChange={(e) => setEditQtyValue(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-24 px-2 py-1 bg-white border border-emerald-500 rounded-lg text-sm font-black text-stone-900"
                        />
                        <span className="text-xs font-bold text-stone-600">{prod.unit}</span>
                      </div>
                    ) : (
                      <span
                        className={`text-xl font-black leading-none block ${
                          isOutOfStock ? 'text-rose-600' : 'text-stone-900'
                        }`}
                      >
                        {prod.quantity.toLocaleString()} {prod.unit}
                      </span>
                    )}
                  </div>

                  {/* Quick Adjust Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(prod.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs"
                        >
                          {language === 'te' ? 'సేవ్' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingStockId(null)}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-200 text-stone-700 font-bold text-xs"
                        >
                          {language === 'te' ? 'రద్దు' : 'Cancel'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onUpdateStock(prod.id, Math.max(0, prod.quantity - 50))}
                          disabled={prod.quantity <= 0}
                          title="-50"
                          className="w-8 h-8 rounded-xl bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-700 border border-stone-300 font-black text-sm flex items-center justify-center active:scale-95 shadow-xs"
                        >
                          -50
                        </button>
                        <button
                          onClick={() => onUpdateStock(prod.id, prod.quantity + 50)}
                          title="+50"
                          className="w-8 h-8 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-black text-sm flex items-center justify-center active:scale-95 shadow-xs"
                        >
                          +50
                        </button>
                        <button
                          onClick={() => handleStartEdit(prod)}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-bold text-xs shadow-xs"
                        >
                          {language === 'te' ? 'సవరించు' : 'Edit'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
