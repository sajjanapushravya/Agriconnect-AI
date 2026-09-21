import React, { useState } from 'react';
import { X, Sprout, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Product, ProductCategory, User } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onProductAdded: (newProd: Product) => void;
}

const PRESET_IMAGES: Record<ProductCategory, string[]> = {
  Vegetables: [
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', // Tomato
    'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80', // Onion
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', // Potato
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80' // Carrot
  ],
  Fruits: [
    'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80', // Mango
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80', // Banana
    'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80', // Orange
    'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80' // Grapes
  ],
  Grains: [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', // Rice
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80', // Wheat
    'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80' // Corn
  ],
  Pulses: [
    'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80', // Chickpea
    'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&w=600&q=80', // Moong
    'https://images.unsplash.com/photo-1505253758473-96b4d5d140ee?auto=format&fit=crop&w=600&q=80' // Toor
  ],
  Spices: [
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', // Chilli
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', // Turmeric
    'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80' // Coriander
  ],
  Oilseeds: [
    'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80', // Sunflower / Sesame
    'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=600&q=80' // Groundnut
  ],
  'Plantation Crops': [
    'https://images.unsplash.com/photo-1544476915-ed1370594142?auto=format&fit=crop&w=600&q=80', // Coconut
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80' // Jaggery / Sugarcane
  ],
  Other: [
    'https://images.unsplash.com/photo-1592417817098-8f3d6eb22513?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  ]
};

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProductAdded
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Vegetables');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(30);
  const [marketPrice, setMarketPrice] = useState<number>(38);
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState('kg');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES['Vegetables'][0]);
  const [location, setLocation] = useState(currentUser?.location || 'Nashik, Maharashtra');
  const [shelfLifeDays, setShelfLifeDays] = useState(7);
  const [isOrganic, setIsOrganic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategoryChange = (newCat: ProductCategory) => {
    setCategory(newCat);
    setImageUrl(PRESET_IMAGES[newCat][0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        category,
        description: description.trim() || `Fresh farm harvest of ${name} directly from verified growers.`,
        price: Number(price),
        marketPrice: Number(marketPrice),
        quantity: Number(quantity),
        unit,
        imageUrl,
        location,
        sellerId: currentUser?.id || 'user-farmer-1',
        sellerName: currentUser?.name || 'Ramesh Patil (Patil Organic Farms)',
        sellerType: currentUser?.role === 'fpo' ? 'fpo' : 'farmer',
        shelfLifeDays: Number(shelfLifeDays),
        isOrganic
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to create product');
      const created: Product = await res.json();
      onProductAdded(created);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">List Agricultural Produce</h3>
              <p className="text-xs text-stone-500">Add fresh crops directly to AgriConnect Marketplace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="font-bold text-stone-800 block mb-1">Produce Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vine-Ripened Hybrid Red Tomato"
                className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains</option>
                <option value="Pulses">Pulses</option>
                <option value="Spices">Spices</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Origin Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                AgriConnect Price (₹/kg) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPrice(val);
                  if (marketPrice <= val) setMarketPrice(Math.round(val * 1.25));
                }}
                className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Benchmark Wholesale Mandi Price (₹/kg)
              </label>
              <input
                type="number"
                min={price}
                value={marketPrice}
                onChange={(e) => setMarketPrice(Number(e.target.value))}
                className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                Buyer Savings: ₹{Math.max(0, marketPrice - price)}/kg ({Math.round(((marketPrice - price) / marketPrice) * 100)}%)
              </span>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Available Stock ({unit}) *
              </label>
              <input
                type="number"
                required
                min={10}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Shelf Life (Days)</label>
              <input
                type="number"
                min={1}
                value={shelfLifeDays}
                onChange={(e) => setShelfLifeDays(Number(e.target.value))}
                className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Preset Image Selection */}
          <div>
            <label className="font-bold text-stone-800 block mb-1.5 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-700" /> Select Product Image
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_IMAGES[category].map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setImageUrl(img)}
                  className={`relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    imageUrl === img
                      ? 'border-emerald-600 ring-2 ring-emerald-200'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="preset" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Description & Harvest Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Freshly harvested, graded, and packed in ventilated agro crates."
              className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <input
              type="checkbox"
              id="isOrganic"
              checked={isOrganic}
              onChange={(e) => setIsOrganic(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
            <label htmlFor="isOrganic" className="text-xs font-semibold text-stone-800 cursor-pointer flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Mark as Certified Organic Harvest
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-75 text-white font-bold text-xs transition-all shadow-md shadow-emerald-700/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish to Marketplace'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
