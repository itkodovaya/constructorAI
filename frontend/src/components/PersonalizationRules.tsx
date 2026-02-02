import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Trash2, 
  Settings, Sparkles, Filter,
  Globe, Linkedin, Facebook, Mail
} from 'lucide-react';
import { api } from '../services/api';

export const PersonalizationRules: React.FC<{ projectId: string; initialRules?: any[] }> = ({ projectId, initialRules = [] }) => {
  const [rules, setRules] = useState<any[]>(initialRules);
  const [isSaving, setIsSaving] = useState(false);

  const addRule = () => {
    const newRule = {
      id: Math.random().toString(36).substr(2, 9),
      condition: 'source',
      value: 'linkedin',
      action: 'show_block',
      target: 'hero-enterprise'
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const saveRules = async () => {
    setIsSaving(true);
    try {
      await api.updatePersonalizationRules(projectId, rules);
      alert('Правила персонализации сохранены!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[400px] lg:h-[650px]">
      <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-indigo-600">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">Neural Personalization</h2>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Dynamic content rules based on visitor profile</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={addRule} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all"><Plus className="w-5 h-5" /></button>
          <button 
            onClick={saveRules}
            disabled={isSaving}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {isSaving ? 'Сохранение...' : 'Сохранить правила'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-4 sm:space-y-6 custom-scrollbar">
        {rules.length > 0 ? (
          <div className="space-y-4">
            {rules.map((rule, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={rule.id}
                className="p-4 sm:p-6 lg:p-8 bg-slate-50 rounded-[24px] sm:rounded-[32px] border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">If visitor</div>
                  <select 
                    value={rule.condition}
                    onChange={e => {
                      const newRules = [...rules];
                      newRules[i].condition = e.target.value;
                      setRules(newRules);
                    }}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="source">Traffic Source</option>
                    <option value="location">Location</option>
                    <option value="device">Device Type</option>
                  </select>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">is</div>
                  <input 
                    value={rule.value}
                    onChange={e => {
                      const newRules = [...rules];
                      newRules[i].value = e.target.value;
                      setRules(newRules);
                    }}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none w-32"
                    placeholder="e.g. linkedin"
                  />
                </div>

                <div className="w-px h-10 bg-slate-200" />

                <div className="flex items-center gap-4 flex-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Then</div>
                  <select 
                    value={rule.action}
                    onChange={e => {
                      const newRules = [...rules];
                      newRules[i].action = e.target.value;
                      setRules(newRules);
                    }}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="show_block">Show Block</option>
                    <option value="hide_block">Hide Block</option>
                    <option value="swap_text">Swap Text</option>
                  </select>
                  <input 
                    value={rule.target}
                    onChange={e => {
                      const newRules = [...rules];
                      newRules[i].target = e.target.value;
                      setRules(newRules);
                    }}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none w-40"
                    placeholder="Target Block ID"
                  />
                </div>

                <button onClick={() => removeRule(rule.id)} className="p-3 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
            <Filter className="w-20 h-20 text-slate-200" />
            <div>
              <h3 className="text-xl font-black text-slate-900">No Rules Defined</h3>
              <p className="text-sm font-medium text-slate-400">Create rules to personalize the visitor experience based on their context.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



