import React from 'react';
import { Sprout, ShieldCheck, Truck, BarChart2, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-stone-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">AgriConnect AI</span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Empowering farmers and Farmer Producer Organizations with direct market reach,
              transparent APMC benchmark pricing, AI-driven demand forecasting, and route-optimized logistics.
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Direct Farm Sourcing
              </span>
              <span className="flex items-center gap-1">
                <BarChart2 className="w-4 h-4 text-emerald-400" /> APMC Transparent
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-emerald-400" /> VRP Optimized
              </span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">AI Platforms</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><span className="hover:text-white cursor-pointer transition-colors">Direct Marketplace</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">AI Demand Intelligence</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Smart Price Intelligence</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Logistics & Route VRP</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Sustainability Carbon Audit</span></li>
            </ul>
          </div>

          {/* User Hubs */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Stakeholders</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><span className="hover:text-white cursor-pointer transition-colors">Farmer Registration</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">FPO Aggregation Portal</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Bulk Buyer Sourcing</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Hotels & Supermarkets</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Logistics Partners</span></li>
            </ul>
          </div>

          {/* Contact & Mandi Coverage */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Agricultural Hubs</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Nashik & APMC Vashi Corridors, Maharashtra</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@agriconnect.ai</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1800-AGRI-CONNECT</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© 2026 AgriConnect AI Marketplace. Software-only digital agricultural platform.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Mandi Fair Price Policy</span>
            <span>•</span>
            <span>Logistics SLAs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
