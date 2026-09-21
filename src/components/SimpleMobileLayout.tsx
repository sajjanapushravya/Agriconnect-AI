import React from 'react';
import { Sprout, LogOut, Sparkles } from 'lucide-react';
import { User, UserRole } from '../types';

interface SimpleMobileLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentRole: UserRole;
  currentUser?: User | null;
  onLogout?: () => void;
}

export const SimpleMobileLayout: React.FC<SimpleMobileLayoutProps> = ({
  children,
  activeTab,
  onSelectTab,
  currentRole,
  currentUser,
  onLogout
}) => {
  // Navigation items strictly per requirements:
  // Farmer: Home | Sell | Orders | Profile
  // Customer: Home | Buy | Orders | Profile
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠'
    },
    ...(currentRole === 'farmer' || currentRole === 'fpo'
      ? [
          {
            id: 'sell',
            label: 'Sell',
            icon: '🌾'
          }
        ]
      : [
          {
            id: 'buy',
            label: 'Buy',
            icon: '🛒'
          }
        ]),
    {
      id: 'orders',
      label: 'Orders',
      icon: '📦'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤'
    }
  ];

  const roleLabel =
    currentRole === 'farmer' || currentRole === 'fpo' ? '🌾 Farmer' : '🛒 Customer';

  return (
    <div className="min-h-screen bg-stone-100 flex justify-center text-stone-900 font-sans antialiased">
      {/* Mobile App Canvas Container */}
      <div className="w-full max-w-md min-h-screen bg-[#FBFDF9] flex flex-col relative shadow-xl sm:border-x border-stone-200">
        
        {/* Top Header - Clean, Agricultural & Mobile Native */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3 shadow-xs">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 cursor-pointer active:scale-98 transition-transform"
            >
              <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-sm">
                <Sprout className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h1 className="font-black text-lg tracking-tight text-emerald-950 flex items-center gap-1 leading-none">
                  AgriConnect <span className="text-emerald-600 font-extrabold text-sm">AI</span>
                </h1>
                <p className="text-[11px] font-semibold text-stone-500 mt-0.5">
                  Direct Agricultural Marketplace
                </p>
              </div>
            </div>

            {/* Right: Role indicator badge and optional logout */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {roleLabel}
              </span>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Logout"
                  className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 flex items-center justify-center transition-colors active:scale-95 border border-stone-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Main Viewport */}
        <main className="flex-1 pb-24 px-4 pt-4 overflow-y-auto">
          {children}
        </main>

        {/* Fixed Bottom Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg">
          <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex-1 py-1 px-2 flex flex-col items-center justify-center rounded-2xl transition-all active:scale-95 ${
                    isActive
                      ? 'text-emerald-800 font-black'
                      : 'text-stone-400 hover:text-stone-700 font-semibold'
                  }`}
                >
                  <div
                    className={`w-10 h-7 rounded-xl flex items-center justify-center text-xl transition-all ${
                      isActive ? 'bg-emerald-100 scale-105' : ''
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className={`text-[11px] mt-0.5 ${isActive ? 'font-black text-emerald-900' : 'font-semibold'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

      </div>
    </div>
  );
};
