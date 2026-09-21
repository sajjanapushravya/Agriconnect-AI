import React, { useState } from 'react';
import { Bot, X, Send, Volume2, Mic } from 'lucide-react';
import { speakText } from '../utils/i18n';

interface AgriSaathiModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
}

export const AgriSaathiModal: React.FC<AgriSaathiModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'saathi',
      text: 'Namaste! I am Agri Saathi, your farming assistant. What would you like to know today?'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    {
      en: 'What should I sell this week?',
      replyEn:
        'Tomatoes and Red Onions have very high demand this week. Current Mandi benchmark is ₹30/kg. Listing directly at ₹25-28/kg will clear your stock quickly.'
    },
    {
      en: "What is today's tomato price?",
      replyEn:
        "Today's Wholesale Mandi price for Tomato is ₹30/kg. On AgriConnect, farmers are selling directly at ₹25/kg and earning higher profit while buyers save ₹5/kg."
    },
    {
      en: 'How much tomato is needed next week?',
      replyEn:
        'Demand is expected to rise by 24% due to restaurant demand in city hotels. Consider keeping 300 to 500 kg available.'
    },
    {
      en: 'Where is my order?',
      replyEn:
        'Your produce order is currently on the delivery vehicle and arriving on schedule.'
    }
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: Message = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: q
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Generate response
    setTimeout(() => {
      let reply =
        'AgriConnect AI connects you directly with verified buyers for fresh produce with instant bank payouts.';
      const lower = q.toLowerCase();

      if (lower.includes('price') || lower.includes('rate')) {
        reply =
          "Tomato market price is ₹30/kg. Recommended direct selling price is ₹25/kg. Onion is ₹35/kg, Chilli is ₹65/kg.";
      } else if (lower.includes('demand') || lower.includes('sell') || lower.includes('harvest')) {
        reply =
          "High demand forecasted for Tomato and Red Onion. You can expect quick sales if listed at competitive farm-gate rates.";
      } else if (lower.includes('order') || lower.includes('delivery') || lower.includes('track')) {
        reply =
          "Your orders are dispatched in temperature-safe transport with direct delivery to buyers.";
      }

      const botMsg: Message = {
        id: 's_' + Date.now(),
        sender: 'saathi',
        text: reply
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.');
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;

      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 border-2 border-stone-200">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h3 className="font-black text-base leading-tight">Agri Saathi</h3>
              <p className="text-[11px] text-emerald-200">Smart Farming Voice Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FBFDF9]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-xs'
                    : 'bg-white border border-stone-200 text-stone-900 shadow-xs rounded-tl-xs'
                }`}
              >
                <p>{m.text}</p>
                {m.sender === 'saathi' && (
                  <button
                    onClick={() => speakText(m.text)}
                    className="mt-2 text-[10px] font-black text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Question Chips */}
        <div className="p-2.5 bg-stone-50 border-t border-stone-100 overflow-x-auto no-scrollbar flex gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.en)}
              className="text-[11px] font-bold text-stone-700 bg-white border border-stone-200 px-3 py-1.5 rounded-xl shrink-0 hover:bg-emerald-50 hover:text-emerald-900 transition-all active:scale-95"
            >
              {q.en}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
            title="Voice input"
          >
            <Mic className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about crops or prices..."
            className="flex-1 px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-emerald-600"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputQuery.trim()}
            className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
