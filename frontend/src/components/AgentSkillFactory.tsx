import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, Settings, Plus, Trash2, 
  Smile, Shield, Zap, Target,
  Sliders, Brain, Check, X,
  MessageSquare, Star, Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export const AgentSkillFactory: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [newSkill, setNewSkill] = useState('');

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await api.getAgents();
      setAgents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleUpdateAgent = async () => {
    if (!editingAgent) return;
    try {
      await api.updateAgent(editingAgent.id, {
        personality: editingAgent.personality,
        skills: editingAgent.skills
      });
      fetchAgents();
      setEditingAgent(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[650px]">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Agent Skill Factory</h2>
            <p className="text-xs text-slate-400 font-medium">Train specialized neural agents with custom skills & personality</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Agent List */}
        <aside className="w-72 border-r border-slate-50 flex flex-col bg-slate-50/30">
          <div className="p-6 border-b border-slate-50">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Registry</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {agents.map(a => (
              <button 
                key={a.id} 
                onClick={() => setEditingAgent({
                  ...a,
                  personality: a.personality ? JSON.parse(a.personality) : { tone: 0.5, humor: 0.5, strictness: 0.5 },
                  skills: a.skills ? JSON.parse(a.skills) : []
                })}
                className={`w-full p-5 rounded-[32px] text-left transition-all ${editingAgent?.id === a.id ? 'bg-white shadow-xl text-blue-600 font-black' : 'text-slate-400 font-bold hover:bg-white/50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${editingAgent?.id === a.id ? 'bg-blue-50' : 'bg-slate-100'}`}>
                    {a.type === 'design' ? <Zap className="w-4 h-4" /> : a.type === 'marketing' ? <Target className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </div>
                  <span className="truncate text-sm">{a.name}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Editor Area */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-white">
          {editingAgent ? (
            <div className="max-w-2xl mx-auto space-y-12">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">Training: {editingAgent.name}</h3>
                <button onClick={handleUpdateAgent} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Save Training</button>
              </div>

              {/* Personality Matrix */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><Sliders className="w-5 h-5" /></div>
                  <h4 className="font-black text-slate-900">Personality Matrix</h4>
                </div>
                <div className="grid grid-cols-1 gap-8 p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                  {[
                    { key: 'tone', label: 'Professional Tone', left: 'Casual', right: 'Formal' },
                    { key: 'humor', label: 'Neural Humor', left: 'Serious', right: 'Witty' },
                    { key: 'strictness', label: 'Guideline Strictness', left: 'Creative', right: 'Rigid' }
                  ].map(p => (
                    <div key={p.key} className="space-y-3">
                      <div className="flex justify-between items-center px-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">{p.label}</span>
                        <span className="text-[10px] font-black text-indigo-600 uppercase">{(editingAgent.personality[p.key] * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[8px] font-black text-slate-300 uppercase w-12 text-right">{p.left}</span>
                        <input 
                          type="range" min="0" max="1" step="0.1" 
                          className="flex-1 accent-indigo-600 h-1.5 bg-slate-200 rounded-full appearance-none"
                          value={editingAgent.personality[p.key]} 
                          onChange={(e) => setEditingAgent({...editingAgent, personality: {...editingAgent.personality, [p.key]: parseFloat(e.target.value)}})}
                        />
                        <span className="text-[8px] font-black text-slate-300 uppercase w-12">{p.right}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Injection */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600"><Sparkles className="w-5 h-5" /></div>
                  <h4 className="font-black text-slate-900">Skill Injection</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input 
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (editingAgent.skills.push(newSkill), setNewSkill(''))}
                      className="flex-1 p-5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-amber-500/20" 
                      placeholder="Inject new specialized skill (e.g. 'Write like a lawyer')" 
                    />
                    <button 
                      onClick={() => { if (newSkill) { setEditingAgent({...editingAgent, skills: [...editingAgent.skills, newSkill]}); setNewSkill(''); } }}
                      className="p-5 bg-amber-500 text-white rounded-2xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-100"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editingAgent.skills.map((skill: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm group">
                        <span className="text-xs font-bold text-slate-600">{skill}</span>
                        <button 
                          onClick={() => setEditingAgent({...editingAgent, skills: editingAgent.skills.filter((_: any, idx: number) => idx !== i)})}
                          className="text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <Wand2 className="w-20 h-20 text-slate-200" />
              <div>
                <h3 className="text-xl font-black text-slate-900">Neural Factory Idle</h3>
                <p className="text-sm font-medium text-slate-400">Select an agent from the registry to begin neural training.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

