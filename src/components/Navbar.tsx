import React from 'react';
import {
  Sprout,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Truck,
  Leaf,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { User, UserRole } from '../types';

interface NavbarProps {
  currentUser: User | null;
  currentRole: UserRole;
  activeTab: string;
  cartCount: number;
  onSelectTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenCart: () => void;
  onSwitchDemoRole: (role: UserRole) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  activeTab,
  cartCount,
  onSelectTab,
  onOpenAuth,
  onOpenCart,
  onSwitchDemoRole,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Demo Bar for easy evaluator role switching */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">AgriConnect AI Live Platform</span>
            <span className="hidden md:inline text-emerald-300/80">|</span>
            <span className="hidden md:inline text-emerald-200">
              Role Switcher (Evaluator Mode):
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-emerald-300 text-[11px] hidden sm:inline">Active Role:</span>
            {(['farmer', 'fpo', 'buyer', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => onSwitchDemoRole(r)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                  currentRole === r
                    ? 'bg-emerald-500 text-white shadow-sm ring-1 ring-white/50'
                    : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl font-bold tracking-tight text-stone-900">
                AgriConnect
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                AI
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">Farmer–FPO Digital Marketplace</p>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onSelectTab('marketplace')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'marketplace'
                ? 'bg-emerald-50 text-emerald-800 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            Marketplace
          </button>

          <button
            onClick={() => onSelectTab('forecast')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'forecast'
                ? 'bg-emerald-50 text-emerald-800 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            AI Demand Forecast
          </button>

          <button
            onClick={() => onSelectTab('pricing')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'pricing'
                ? 'bg-emerald-50 text-emerald-800 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            Price Intelligence
          </button>

          <button
            onClick={() => onSelectTab('logistics')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'logistics'
                ? 'bg-emerald-50 text-emerald-800 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Truck className="w-4 h-4 text-emerald-600" />
            Route Optimizer
          </button>

          <button
            onClick={() => onSelectTab('sustainability')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'sustainability'
                ? 'bg-emerald-50 text-emerald-800 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Leaf className="w-4 h-4 text-emerald-600" />
            Sustainability
          </button>
        </nav>

        {/* Right Actions (Dashboard, Cart, Profile) */}
        <div className="flex items-center gap-2.5">
          {/* Dashboard shortcut */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline capitalize">{currentRole} Dashboard</span>
            <span className="sm:hidden">Dash</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
            title="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-stone-200">
              <div className="hidden xl:block text-right text-xs">
                <p className="font-semibold text-stone-800 leading-tight truncate max-w-[140px]">
                  {currentUser.name}
                </p>
                <p className="text-emerald-700 font-medium capitalize text-[11px]">
                  {currentUser.role}
                </p>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-2 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <UserIcon className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile sub-bar navigation */}
      <div className="lg:hidden border-t border-stone-100 bg-stone-50 px-4 py-2 overflow-x-auto flex items-center gap-2 text-xs">
        <button
          onClick={() => onSelectTab('marketplace')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'marketplace' ? 'bg-emerald-600 text-white' : 'text-stone-600'
          }`}
        >
          Marketplace
        </button>
        <button
          onClick={() => onSelectTab('forecast')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'forecast' ? 'bg-emerald-600 text-white' : 'text-stone-600'
          }`}
        >
          Demand AI
        </button>
        <button
          onClick={() => onSelectTab('pricing')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'pricing' ? 'bg-emerald-600 text-white' : 'text-stone-600'
          }`}
        >
          Price Intel
        </button>
        <button
          onClick={() => onSelectTab('logistics')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'logistics' ? 'bg-emerald-600 text-white' : 'text-stone-600'
          }`}
        >
          Route VRP
        </button>
        <button
          onClick={() => onSelectTab('sustainability')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'sustainability' ? 'bg-emerald-600 text-white' : 'text-stone-600'
          }`}
        >
          Sustainability
        </button>
      </div>
    </header>
  );
};
