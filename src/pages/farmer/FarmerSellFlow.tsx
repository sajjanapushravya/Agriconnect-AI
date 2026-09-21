import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Plus,
  Camera,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { Product, ProductCategory, User } from '../../types';
import { recognizeProduct } from '../../utils/cropClassifier';

interface FarmerSellFlowProps {
  currentUser: User | null;
  onProductListed: (newProduct: Product) => void;
  onCancel: () => void;
}

const POPULAR_CROPS = [
  { id: 'tomato', name: 'Tomato', emoji: '🍅', category: 'Vegetables' as ProductCategory, marketPrice: 30, unit: 'kg', defaultSellingPrice: 25 },
  { id: 'onion', name: 'Onion', emoji: '🧅', category: 'Vegetables' as ProductCategory, marketPrice: 35, unit: 'kg', defaultSellingPrice: 30 },
  { id: 'potato', name: 'Potato', emoji: '🥔', category: 'Vegetables' as ProductCategory, marketPrice: 28, unit: 'kg', defaultSellingPrice: 24 },
  { id: 'mango', name: 'Mango', emoji: '🥭', category: 'Fruits' as ProductCategory, marketPrice: 95, unit: 'kg', defaultSellingPrice: 80 },
  { id: 'banana', name: 'Banana', emoji: '🍌', category: 'Fruits' as ProductCategory, marketPrice: 40, unit: 'dozen', defaultSellingPrice: 35 },
  { id: 'rice', name: 'Rice', emoji: '🌾', category: 'Grains' as ProductCategory, marketPrice: 58, unit: 'kg', defaultSellingPrice: 50 },
  { id: 'chilli', name: 'Chilli', emoji: '🌶️', category: 'Spices' as ProductCategory, marketPrice: 65, unit: 'kg', defaultSellingPrice: 55 },
  { id: 'turmeric', name: 'Turmeric', emoji: '🌿', category: 'Spices' as ProductCategory, marketPrice: 160, unit: 'kg', defaultSellingPrice: 140 }
];

const CATEGORIES: ProductCategory[] = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Spices',
  'Oilseeds',
  'Plantation Crops',
  'Other'
];

export const FarmerSellFlow: React.FC<FarmerSellFlowProps> = ({
  currentUser,
  onProductListed,
  onCancel
}) => {
  // Step 1: 'SELECT_PRODUCE' (What do you want to sell?), Step 2: 'FILL_DETAILS'
  const [step, setStep] = useState<'SELECT_PRODUCE' | 'FILL_DETAILS'>('SELECT_PRODUCE');

  // Produce details state
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Vegetables');
  const [quantity, setQuantity] = useState<number>(100);
  const [unit, setUnit] = useState<string>('kg');
  const [price, setPrice] = useState<number>(25);
  const [marketPrice, setMarketPrice] = useState<number | undefined>(30);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isCustomProduce, setIsCustomProduce] = useState<boolean>(false);

  // Success state
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);

  // Select a popular crop
  const handleSelectPopularCrop = (crop: typeof POPULAR_CROPS[0]) => {
    setProductName(crop.name);
    setCategory(crop.category);
    setMarketPrice(crop.marketPrice);
    setPrice(crop.defaultSellingPrice);
    setUnit(crop.unit);
    setIsCustomProduce(false);
    setPhotoUrl(`https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80`);
    setStep('FILL_DETAILS');
  };

  // Click "➕ ADD YOUR PRODUCE"
  const handleStartCustomProduce = () => {
    setProductName('');
    setCategory('Other');
    setMarketPrice(undefined);
    setPrice(100);
    setQuantity(100);
    setUnit('kg');
    setIsCustomProduce(true);
    setPhotoUrl('');
    setPhotoPreview('');
    setStep('FILL_DETAILS');
  };

  // Name change auto-recognition
  const handleNameChange = (nameVal: string) => {
    setProductName(nameVal);
    if (!nameVal.trim()) return;

    const rec = recognizeProduct(nameVal);
    if (rec.category) {
      setCategory(rec.category);
    }
    if (rec.marketPriceAvailable && rec.marketPrice) {
      setMarketPrice(rec.marketPrice);
      setPrice(Math.round(rec.marketPrice * 0.85));
    }
    if (rec.suggestedUnit) {
      setUnit(rec.suggestedUnit);
    }
  };

  // Handle Photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
      setPhotoUrl(preview);
    }
  };

  // Price calculations
  const hasMarketBenchmark = marketPrice && marketPrice > 0;
  const buyerSavings = hasMarketBenchmark ? Math.max(0, marketPrice - price) : 0;
  const isGoodPrice = hasMarketBenchmark && price < marketPrice;

  // Final Submit
  const handleSellNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || price <= 0 || quantity <= 0) return;

    const newProd: Product = {
      id: 'prod_' + Date.now(),
      sellerId: currentUser?.id || 'farmer_1',
      sellerName: currentUser?.name || 'Farmer Ramesh Patil',
      sellerType: 'farmer',
      name: productName.trim(),
      category: category,
      description: `Fresh farm harvest of ${productName.trim()}`,
      price: price,
      unit: unit,
      quantity: quantity,
      minOrderQuantity: Math.min(10, quantity),
      imageUrl:
        photoPreview ||
        photoUrl ||
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      location: currentUser?.location || 'Nashik, Maharashtra',
      rating: 4.9,
      shelfLifeDays: 7,
      harvestDate: new Date().toISOString().split('T')[0],
      marketPrice: marketPrice,
      marketPriceAvailable: Boolean(hasMarketBenchmark),
      is_custom_product: isCustomProduce,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'AVAILABLE'
    };

    onProductListed(newProd);
    setCreatedProduct(newProd);
  };

  // Success view
  if (createdProduct) {
    return (
      <div className="space-y-6 text-center animate-in fade-in pb-12">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-4 border-emerald-500 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-stone-900">
            Produce Listed Successfully!
          </h2>
          <p className="text-xs text-stone-600">
            Your produce is now visible to buyers with direct farm pricing.
          </p>
        </div>

        {/* Product Card Preview */}
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-500 shadow-sm text-left space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={createdProduct.imageUrl}
              alt={createdProduct.name}
              className="w-16 h-16 rounded-2xl object-cover border border-stone-200"
            />
            <div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                {createdProduct.category}
              </span>
              <h3 className="text-lg font-black text-stone-900 mt-0.5">
                {createdProduct.name}
              </h3>
              <p className="text-xs text-stone-500">
                {createdProduct.quantity} {createdProduct.unit} available
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-400 block">Your Price</span>
              <span className="text-xl font-black text-emerald-900">
                ₹{createdProduct.price}
                <span className="text-xs font-semibold text-stone-500">/{createdProduct.unit}</span>
              </span>
            </div>
            {createdProduct.marketPrice && (
              <div className="text-right">
                <span className="text-xs text-stone-400 block">Market Price</span>
                <span className="text-sm font-bold text-stone-500 line-through">
                  ₹{createdProduct.marketPrice}/{createdProduct.unit}
                </span>
              </div>
            )}
          </div>

          {createdProduct.marketPrice && createdProduct.marketPrice > createdProduct.price && (
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-900 flex items-center justify-between text-xs font-black">
              <span>Buyer Saves ₹{createdProduct.marketPrice - createdProduct.price}/{createdProduct.unit}</span>
              <span className="text-emerald-700">🟢 Good Price</span>
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              setCreatedProduct(null);
              setStep('SELECT_PRODUCE');
            }}
            className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base shadow-md active:scale-98 transition-all"
          >
            Sell More Produce
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3.5 rounded-2xl border-2 border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // STEP 1: What do you want to sell?
  if (step === 'SELECT_PRODUCE') {
    return (
      <div className="space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-black text-stone-900">Sell Produce</h2>
          <div className="w-9" />
        </div>

        <div>
          <h3 className="text-lg font-black text-stone-900 tracking-tight">
            What do you want to sell?
          </h3>
          <p className="text-xs text-stone-500 font-medium">
            Tap a popular crop below or add any custom agricultural harvest
          </p>
        </div>

        {/* ➕ ADD YOUR PRODUCE (Prominent Large Card) */}
        <div
          onClick={handleStartCustomProduce}
          className="bg-emerald-50 hover:bg-emerald-100/80 border-2 border-dashed border-emerald-600 rounded-3xl p-5 cursor-pointer transition-all active:scale-98 flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-2xl shadow-sm">
              <Plus className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-black text-emerald-950">
                ADD YOUR PRODUCE
              </h4>
              <p className="text-xs text-emerald-800 font-medium mt-0.5">
                Enter any crop (e.g. Tamarind, Custard Apple, Jaggery...)
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-xs">
            Tap to Add
          </span>
        </div>

        {/* Popular Crops Grid - Large Cards */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            Popular Crops
          </span>
          <div className="grid grid-cols-2 gap-3">
            {POPULAR_CROPS.map((crop) => (
              <div
                key={crop.id}
                onClick={() => handleSelectPopularCrop(crop)}
                className="bg-white hover:bg-emerald-50/50 border-2 border-stone-200 hover:border-emerald-600 rounded-3xl p-4 cursor-pointer transition-all active:scale-95 shadow-xs text-left space-y-2 group"
              >
                <div className="text-3xl">{crop.emoji}</div>
                <div>
                  <h4 className="text-base font-black text-stone-900 group-hover:text-emerald-950">
                    {crop.name}
                  </h4>
                  <p className="text-[11px] font-bold text-stone-500">
                    Market: ₹{crop.marketPrice}/{crop.unit}
                  </p>
                </div>
                <div className="pt-1 flex items-center justify-between text-[11px] font-black text-emerald-800">
                  <span>Direct: ₹{crop.defaultSellingPrice}</span>
                  <span className="text-emerald-600">Select →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Configure & Price Details
  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep('SELECT_PRODUCE')}
          className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-black text-stone-900">Produce Details</h2>
        <div className="w-9" />
      </div>

      <form onSubmit={handleSellNow} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Product Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Tamarind, Tomato, Custard Apple..."
            className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-base font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity & Unit */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="col-span-2">
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Quantity Available <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-base font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Unit
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-3 rounded-2xl bg-white border-2 border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
            >
              <option value="kg">kg</option>
              <option value="quintal">quintal</option>
              <option value="tonne">tonne</option>
              <option value="dozen">dozen</option>
              <option value="piece">piece</option>
            </select>
          </div>
        </div>

        {/* Selling Price */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Your Selling Price (₹ per {unit}) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-black text-lg">
              ₹
            </span>
            <input
              type="number"
              min="1"
              value={price}
              onChange={(e) => setPrice(Math.max(1, Number(e.target.value)))}
              className="w-full pl-8 pr-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-xl font-black text-stone-900 focus:outline-none focus:border-emerald-600"
              required
            />
          </div>
        </div>

        {/* Section 8: Visual Price Comparison Card */}
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-300 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍅</span>
              <div>
                <h4 className="font-black text-stone-900 text-base">
                  {productName || 'Produce'}
                </h4>
                <span className="text-[11px] text-stone-500 font-semibold">
                  Price Intelligence
                </span>
              </div>
            </div>
            {isGoodPrice && (
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                🟢 Good Price
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100">
            <div className="p-3 bg-stone-50 rounded-2xl">
              <span className="text-[11px] font-bold text-stone-400 block uppercase">
                Market Price
              </span>
              <span className="text-base font-black text-stone-600">
                {hasMarketBenchmark ? `₹${marketPrice}/${unit}` : 'Not Available'}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <span className="text-[11px] font-bold text-emerald-800 block uppercase">
                Your Price
              </span>
              <span className="text-base font-black text-emerald-950">
                ₹{price}/{unit}
              </span>
            </div>
          </div>

          {buyerSavings > 0 && (
            <div className="p-3 rounded-2xl bg-emerald-100/70 text-emerald-900 flex items-center justify-between text-xs font-black">
              <span>Buyer Saves ₹{buyerSavings}/{unit}</span>
              <span>Fast Selling ⚡</span>
            </div>
          )}
        </div>

        {/* Photo: Optional */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Photo (Optional)
          </label>
          <div className="flex items-center gap-3">
            <label className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 hover:bg-stone-100 cursor-pointer text-stone-600 text-xs font-bold transition-all">
              <Camera className="w-4 h-4 text-stone-500" />
              <span>{photoPreview ? 'Change Photo' : 'Upload Produce Photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-12 h-12 rounded-xl object-cover border border-stone-200"
              />
            )}
          </div>
        </div>

        {/* SELL NOW Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg transition-all shadow-lg active:scale-98"
          >
            SELL NOW
          </button>
        </div>
      </form>
    </div>
  );
};
