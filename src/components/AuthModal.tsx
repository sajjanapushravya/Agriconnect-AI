import React, { useState } from 'react';
import { X, Sprout, UserCheck, ShieldCheck, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { User, UserRole, BuyerType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<UserRole>('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 98200 45678');
  const [location, setLocation] = useState('Nashik, Maharashtra');
  const [farmName, setFarmName] = useState('');
  const [fpoName, setFpoName] = useState('');
  const [buyerType, setBuyerType] = useState<BuyerType>('restaurant');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDemoLogin = async (demoEmail: string) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'password123' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        onLoginSuccess(data.user, data.token);
        onClose();
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            phone,
            role,
            location,
            farmName: role === 'farmer' ? farmName : undefined,
            fpoName: role === 'fpo' ? fpoName : undefined,
            buyerType: role === 'buyer' ? buyerType : undefined
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        onLoginSuccess(data.user, data.token);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">
                {mode === 'login' ? 'Welcome Back' : 'Create AgriConnect Account'}
              </h3>
              <p className="text-xs text-stone-500">
                Direct Farmer & FPO Digital Marketplace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Role Logins */}
        <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 text-xs">
          <span className="font-bold text-emerald-950 block mb-1.5">
            Instant Demo Logins (1-Click Test):
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleDemoLogin('farmer@demo.com')}
              className="p-2 rounded-lg bg-white border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 text-left font-semibold text-emerald-900 text-[11px] transition-colors"
            >
              🌾 Farmer: Ramesh Patil
            </button>
            <button
              onClick={() => handleDemoLogin('fpo@demo.com')}
              className="p-2 rounded-lg bg-white border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 text-left font-semibold text-emerald-900 text-[11px] transition-colors"
            >
              🏢 FPO: Sahyadri Farmers
            </button>
            <button
              onClick={() => handleDemoLogin('buyer@demo.com')}
              className="p-2 rounded-lg bg-white border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 text-left font-semibold text-emerald-900 text-[11px] transition-colors"
            >
              🍽️ Buyer: Green Bowl Cafe
            </button>
            <button
              onClick={() => handleDemoLogin('admin@demo.com')}
              className="p-2 rounded-lg bg-white border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 text-left font-semibold text-emerald-900 text-[11px] transition-colors"
            >
              ⚙️ System Admin
            </button>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex border-b border-stone-200 text-xs font-bold">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800 bg-stone-50/50'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800 bg-stone-50/50'
            }`}
          >
            Register New Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMessage}
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="font-bold text-stone-800 block mb-1">Select Your Role</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['farmer', 'fpo', 'buyer'] as UserRole[]).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold capitalize transition-all border ${
                        role === r
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Shinde"
                  className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {role === 'farmer' && (
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Farm / Holding Name</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Shinde Organic Farm"
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              {role === 'fpo' && (
                <div>
                  <label className="font-bold text-stone-800 block mb-1">FPO Organization Name</label>
                  <input
                    type="text"
                    value={fpoName}
                    onChange={(e) => setFpoName(e.target.value)}
                    placeholder="e.g. Nashik Agro Producer Co."
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              {role === 'buyer' && (
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
                    <option value="bulk_buyer">Wholesale Bulk Buyer</option>
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-stone-800 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" /> Location / District
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" /> Mobile Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="font-bold text-stone-800 block mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-stone-400" /> Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-stone-400" /> Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-75 text-white font-bold text-sm transition-all shadow-md shadow-emerald-700/20 active:scale-95"
          >
            {isSubmitting
              ? 'Authenticating...'
              : mode === 'login'
              ? 'Sign In to Account'
              : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};
