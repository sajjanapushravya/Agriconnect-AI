import React, { useState } from 'react';
import { X, Sprout, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { Language, translations } from '../utils/i18n';

interface FarmerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (user: User) => void;
  language: Language;
}

export const FarmerRegistrationModal: React.FC<FarmerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  language
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [farmName, setFarmName] = useState('');

  const t = translations[language];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !location.trim()) {
      alert(language === 'te' ? 'దయచేసి మీ పేరు, ఫోన్ నంబర్ మరియు గ్రామం నమోదు చేయండి.' : 'Please enter your name, mobile number, and village.');
      return;
    }

    const newUser: User = {
      id: `user-farmer-${Date.now()}`,
      name: name.trim(),
      email: `${name.toLowerCase().replace(/\s+/g, '')}@farmer.agriconnect.ai`,
      role: 'farmer',
      location: location.trim(),
      farmName: farmName.trim() || `${name.trim()}'s Farm`,
      phone: mobile.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    onRegisterSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 border border-emerald-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <Sprout className="w-6 h-6 text-emerald-600" />
            <h3 className="font-extrabold text-xl">
              {language === 'te' ? 'రైతు నమోదు' : 'Farmer Registration'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-stone-600">
          {language === 'te'
            ? 'కేవలం మీ పేరు, ఫోన్ నంబర్ ఇవ్వండి. వెంటనే పంట అమ్మకం ప్రారంభించండి.'
            : 'Enter simple details to start selling produce directly to buyers.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-stone-800 mb-1">
              {t.enterName} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'te' ? 'ఉదా: రాముడు పటేల్' : 'e.g. Ramesh Patil'}
              className="w-full p-3.5 text-base rounded-2xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-stone-50 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-800 mb-1">
              {t.mobileNumber} *
            </label>
            <input
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="9876543210"
              className="w-full p-3.5 text-base rounded-2xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-stone-50 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-800 mb-1">
              {t.villageLocation} *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={language === 'te' ? 'ఉదా: నాసిక్ / వరంగల్' : 'e.g. Nashik / Warangal'}
              className="w-full p-3.5 text-base rounded-2xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-stone-50 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1">
              {language === 'te' ? 'పొలం పేరు (ఐచ్ఛికం)' : 'Farm Name (Optional)'}
            </label>
            <input
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder={language === 'te' ? 'ఉదా: పటేల్ ఆర్గానిక్ ఫార్మ్' : 'e.g. Green Valley Agro'}
              className="w-full p-3 text-sm rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-stone-50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg transition-all shadow-md active:scale-95"
          >
            {t.continueBtn}
          </button>
        </form>
      </div>
    </div>
  );
};
