import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Send, Share2, Mail, 
  Globe, Plus, CheckCircle, Clock,
  Zap, BarChart3, Target, Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export const MarketingWarRoom: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [goal, setGoal] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['social', 'email']);
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const channels = [
    { id: 'social', label: 'Social Media', icon: <Share2 className="w-4 h-4" /> },
    { id: 'email', label: 'Email Blast', icon: <Mail className="w-4 h-4" /> },
    { id: 'ads', label: 'Search Ads', icon: <Target className="w-4 h-4" /> },
    { id: 'seo', label: 'Auto SEO', icon: <Globe className="w-4 h-4" /> },
  ];

  const launchCampaign = async () => {
    setLoading(true);
    try {
      const data = await api.createMarketingCampaign(projectId, { goal, channels: selectedChannels });
      setCampaign(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[650px]">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Marketing War Room</h2>
            <p className="text-xs text-slate-400 font-medium">Omni-Channel AI Orchestrator</p>
          </div>
        </div>
        <button 
          onClick={launchCampaign}
          disabled={loading || !goal}
          className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Zap className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Launch AI Campaign
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Strategy Sidebar */}
        <aside className="w-80 border-r border-slate-50 flex flex-col bg-slate-50/30 p-8 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target className="w-3 h-3" /> Campaign Goal</label>
            <textarea 
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="e.g. 'Launch new summer collection to past customers'"
              className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold h-32 resize-none outline-none focus:ring-2 ring-rose-500/10"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Share2 className="w-3 h-3" /> Channels</label>
            <div className="grid grid-cols-1 gap-2">
              {channels.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChannels(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])}
                  className={`p-4 rounded-xl flex items-center justify-between transition-all border ${
                    selectedChannels.includes(c.id) ? 'bg-white border-rose-200 text-rose-600 shadow-sm' : 'bg-transparent border-transparent text-slate-400 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {c.icon}
                    <span className="text-xs font-black uppercase tracking-widest">{c.label}</span>
                  </div>
                  {selectedChannels.includes(c.id) && <CheckCircle className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Campaign Monitor */}
        <main className="flex-1 p-10 bg-white overflow-y-auto custom-scrollbar">
          {campaign ? (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Orchestration</h3>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse">Running</span>
              </div>

              <div className="space-y-4">
                {campaign.channels.map((c: any, i: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i}
                    className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:border-rose-100 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-600 shadow-sm">
                        {channels.find(x => x.id === c.type)?.icon}
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.type}</div>
                        <div className="text-xs font-bold text-slate-900">{c.tasks[0].detail}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock className="w-3 h-3" /> {c.tasks[1].detail}</div>
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-500 shadow-sm"><CheckCircle className="w-4 h-4" /></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-8 bg-slate-900 rounded-[40px] text-white flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projected Reach</div>
                  <div className="text-2xl font-black">{campaign.projectedReach.toLocaleString()} <span className="text-rose-400">Potential Leads</span></div>
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-rose-400">
                  <BarChart3 className="w-8 h-8" />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <Sparkles className="w-20 h-20 text-slate-200" />
              <div>
                <h3 className="text-xl font-black text-slate-900">War Room Idle</h3>
                <p className="text-sm font-medium text-slate-400">Define your goal and select channels to let AI take the lead.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};





