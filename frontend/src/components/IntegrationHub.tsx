import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Zap, Globe, Plus, Trash2, Check,
  Link as LinkIcon, Settings, Bell,
  Webhook, Shield, Code, Play
} from 'lucide-react';
import { api } from '../services/api';

export const IntegrationHub: React.FC<{ 
  projectId: string;
  onClose: () => void;
}> = ({ projectId, onClose }) => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ name: 'My Webhook', url: '', events: ['lead.created'] });

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const data = await api.getIntegrations(projectId);
      setIntegrations(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, [projectId]);

  const handleCreate = async () => {
    if (!newWebhook.url) return;
    try {
      await api.createIntegration(projectId, {
        name: newWebhook.name,
        type: 'webhook',
        config: { url: newWebhook.url },
        events: newWebhook.events
      });
      setShowAdd(false);
      fetchIntegrations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete integration?')) return;
    try {
      await api.deleteIntegration(id);
      fetchIntegrations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-4xl h-[80vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Integration Hub</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Automate your workflow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Existing Integrations */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Links ({integrations.length})</h3>
                <button onClick={() => setShowAdd(true)} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"><Plus className="w-4 h-4" /></button>
              </div>
              
              <div className="space-y-4">
                {integrations.map((it) => (
                  <div key={it.id} className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <Webhook className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">{it.name}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{it.events}</div>
                    </div>
                    <button onClick={() => handleDelete(it.id)} className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                
                {integrations.length === 0 && (
                  <div className="py-12 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
                    <LinkIcon className="w-10 h-10 text-slate-100 mx-auto mb-3" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active integrations</p>
                  </div>
                )}
              </div>
            </div>

            {/* Marketplace/Presets */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recommended Presets</h3>
              <div className="grid gap-4">
                {[
                  { name: 'Google Sheets', desc: 'Sync leads to a spreadsheet', icon: <FileText className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50' },
                  { name: 'Slack Notifications', desc: 'Alert team on new leads', icon: <Bell className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50' },
                  { name: 'Custom CRM', desc: 'Connect your own backend', icon: <Shield className="w-5 h-5 text-slate-500" />, bg: 'bg-slate-50' }
                ].map((p, i) => (
                  <div key={i} className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-all cursor-pointer group">
                    <div className={`w-12 h-12 ${p.bg} rounded-2xl flex items-center justify-center`}>{p.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-400 font-medium">{p.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-10">
              <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900">New Webhook</h3>
                  <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-slate-50 rounded-xl"><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target URL</label>
                    <input 
                      value={newWebhook.url}
                      onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
                      placeholder="https://your-api.com/webhook" 
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-blue-500/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Events</label>
                    <div className="flex flex-wrap gap-2">
                      {['lead.created', 'order.created', 'post.published'].map(ev => (
                        <button 
                          key={ev} 
                          onClick={() => {
                            const events = newWebhook.events.includes(ev) 
                              ? newWebhook.events.filter(e => e !== ev)
                              : [...newWebhook.events, ev];
                            setNewWebhook({...newWebhook, events});
                          }}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${newWebhook.events.includes(ev) ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                          {ev}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={handleCreate} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all">Create Integration</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

