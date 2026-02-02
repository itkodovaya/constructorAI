import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Zap, Info, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const AdaptiveUI: React.FC = () => {
  const [vibe, setVibe] = useState<{ vibe: string; score: number; suggestion: string } | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      setEvents(prev => [...prev, { type: 'click', timestamp: Date.now() }].slice(-50));
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (events.length > 0 && events.length % 10 === 0) {
      api.analyzeVibe(events).then(setVibe).catch(console.error);
    }
  }, [events]);

  if (!vibe) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`p-6 rounded-[32px] shadow-2xl border flex items-center gap-4 backdrop-blur-xl ${
            vibe.vibe === 'frustrated' ? 'bg-rose-50/90 border-rose-100 text-rose-600' :
            vibe.vibe === 'focused' ? 'bg-emerald-50/90 border-emerald-100 text-emerald-600' :
            'bg-white/90 border-slate-100 text-slate-600'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            vibe.vibe === 'frustrated' ? 'bg-rose-100' :
            vibe.vibe === 'focused' ? 'bg-emerald-100' :
            'bg-slate-100'
          }`}>
            {vibe.vibe === 'frustrated' ? <Frown className="w-6 h-6" /> :
             vibe.vibe === 'focused' ? <Zap className="w-6 h-6" /> :
             <Smile className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">AI Vibe Detection</div>
            <div className="text-sm font-black leading-tight">{vibe.suggestion}</div>
          </div>
          {vibe.vibe === 'frustrated' && (
            <button className="ml-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200">Get Help</button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};





