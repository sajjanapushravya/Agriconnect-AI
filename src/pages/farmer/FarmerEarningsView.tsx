import React from 'react';
import { ArrowLeft, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

interface FarmerEarningsViewProps {
  onBack: () => void;
  language?: string;
}

export const FarmerEarningsView: React.FC<FarmerEarningsViewProps> = ({ onBack }) => {
  const transactions = [
    {
      id: 'tx-1',
      buyer: 'Green Bowl Cafe (Mumbai)',
      crop: 'Tomato (Hybrid Red)',
      amount: 1250,
      quantity: '50 kg',
      status: 'Paid directly to Bank'
    },
    {
      id: 'tx-2',
      buyer: 'Sahyadri Retailers',
      crop: 'Red Onion',
      amount: 2800,
      quantity: '100 kg',
      status: 'Paid directly to Bank'
    },
    {
      id: 'tx-3',
      buyer: 'Grand Central Hotel',
      crop: 'Carrot (Ooty)',
      amount: 8400,
      quantity: '200 kg',
      status: 'Paid directly to Bank'
    }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-black text-stone-900 flex items-center gap-1.5">
          <span>💰</span>
          <span>My Earnings</span>
        </h2>
        <div className="w-9" />
      </div>

      {/* Hero Earnings Card */}
      <div className="bg-emerald-800 text-white rounded-3xl p-6 text-center space-y-2 shadow-sm border-2 border-emerald-700">
        <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
          Total Earnings This Month
        </span>
        <div className="text-4xl font-black tracking-tight">₹12,450</div>
        <p className="text-xs text-emerald-100 font-medium">
          100% direct bank transfers • No middleman commissions deducted
        </p>
      </div>

      {/* Direct Payment Receipts List */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
          Recent Payouts
        </span>
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-black text-stone-900 leading-tight">
                  {tx.crop}
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Buyer: {tx.buyer} • {tx.quantity}
                </p>
              </div>
              <span className="text-lg font-black text-emerald-950">
                ₹{tx.amount.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {tx.status}
              </span>
              <span className="text-stone-400 font-semibold">Today</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
