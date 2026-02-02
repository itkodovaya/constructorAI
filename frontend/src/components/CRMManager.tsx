import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Mail, Phone, Tag, 
  Search, Filter, Plus, MoreVertical,
  CheckCircle2, Clock, AlertCircle, XCircle,
  ArrowRight, Download, BarChart2, MessageSquare, Trash2, Save, X
} from 'lucide-react';
import { api } from '../services/api';

export const CRMManager: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await api.getLeads(projectId);
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [projectId]);

  const handleUpdateLead = async (id: string, updates: any) => {
    try {
      await api.updateLead(id, updates);
      fetchLeads();
      if (selectedLead?.id === id) {
        setSelectedLead({ ...selectedLead, ...updates });
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.deleteLead(leadId);
      fetchLeads();
      if (selectedLead?.id === leadId) setSelectedLead(null);
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'contacting': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'qualified': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'closed': return 'bg-slate-50 text-slate-600 border-slate-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredLeads = leads.filter(l => 
    (l.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (l.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (l.tags?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Simple stats for chart
  const statsByStatus = {
    new: leads.filter(l => l.status === 'new').length,
    contacting: leads.filter(l => l.status === 'contacting').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    closed: leads.filter(l => l.status === 'closed').length,
  };
  const maxStat = Math.max(...Object.values(statsByStatus), 1);

  return (
    <div className="space-y-8 p-2 flex flex-col h-full">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-3xl font-black text-slate-900">Lead CRM</h3>
          <p className="text-slate-500 font-medium text-sm">Convert your visitors into loyal customers</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchLeads} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
            <Clock className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs hover:border-indigo-600 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 shrink-0">
        <div className="lg:col-span-3 grid grid-cols-3 gap-6">
          <StatCard label="Total Leads" value={leads.length} trend={`${statsByStatus.new} new`} color="indigo" />
          <StatCard label="Qualified" value={statsByStatus.qualified} trend="High value" color="emerald" />
          <StatCard label="Conversion" value={leads.length > 0 ? `${((statsByStatus.qualified / leads.length) * 100).toFixed(0)}%` : '0%'} trend="Overall rate" color="rose" />
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Funnel Visual</div>
          <div className="flex items-end justify-between gap-2 h-16">
            {Object.entries(statsByStatus).map(([status, count]) => (
              <div key={status} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className={`w-full rounded-t-lg transition-all duration-500 ${getStatusColor(status).split(' ')[0]}`} style={{ height: `${(count / maxStat) * 100}%`, minHeight: '4px' }} />
                <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">{status}: {count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        <div className="flex-1 bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30 shrink-0">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, email or tag..." 
                value={searchTerm}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-none rounded-2xl pl-11 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Customer</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Tags</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-bold">Loading leads...</td></tr>
                ) : filteredLeads.length > 0 ? filteredLeads.map(lead => (
                  <tr key={lead.id} onClick={() => setSelectedLead(lead)} className={`hover:bg-indigo-50/30 transition-all cursor-pointer group ${selectedLead?.id === lead.id ? 'bg-indigo-50/50' : ''}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 font-black shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                          {(lead.name || lead.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-sm leading-tight">{lead.name || 'Anonymous'}</div>
                          <div className="text-xs text-slate-400 font-bold">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {lead.tags ? lead.tags.split(',').map((tag: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[9px] font-black uppercase tracking-tighter border border-slate-200">{tag.trim()}</span>
                        )) : <span className="text-[10px] text-slate-200 font-bold italic">No tags</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="px-8 py-20 text-center flex flex-col items-center">
                    <Users className="w-16 h-16 text-slate-100 mb-4" />
                    <p className="text-slate-400 font-bold">No leads found yet.</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedLead ? (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="w-96 bg-white border border-slate-100 rounded-[40px] shadow-2xl p-8 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-black text-slate-900">Lead Profile</h4>
                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-100">
                  {(selectedLead.name || selectedLead.email || '?')[0].toUpperCase()}
                </div>
                <div>
                  <h5 className="text-2xl font-black text-slate-900 leading-tight">{selectedLead.name || 'Anonymous'}</h5>
                  <p className="text-slate-400 font-bold">{selectedLead.email}</p>
                </div>
              </div>

              <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-1">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</label>
                  <select 
                    value={selectedLead.status}
                    onChange={(e) => handleUpdateLead(selectedLead.id, { status: e.target.value })}
                    className={`w-full p-4 rounded-2xl text-xs font-black border-2 transition-all outline-none ${getStatusColor(selectedLead.status)}`}
                  >
                    <option value="new">NEW</option>
                    <option value="contacting">CONTACTING</option>
                    <option value="qualified">QUALIFIED</option>
                    <option value="closed">CLOSED</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Tags (comma separated)</label>
                  <input 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 ring-indigo-500/20" 
                    value={selectedLead.tags || ''} 
                    onChange={(e) => handleUpdateLead(selectedLead.id, { tags: e.target.value })}
                    onBlur={(e) => handleUpdateLead(selectedLead.id, { tags: e.target.value })}
                    placeholder="e.g. VIP, Hot, Enterprise"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Internal Notes</label>
                  <textarea 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-medium focus:ring-2 ring-indigo-500/20 h-40 resize-none" 
                    value={selectedLead.notes || ''} 
                    onChange={(e) => handleUpdateLead(selectedLead.id, { notes: e.target.value })}
                    onBlur={(e) => handleUpdateLead(selectedLead.id, { notes: e.target.value })}
                    placeholder="Add notes about this customer..."
                  />
                </div>
                
                {selectedLead.message && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Original Message</label>
                    <div className="p-4 bg-slate-50 rounded-2xl text-xs font-medium text-slate-500 leading-relaxed italic border-l-4 border-indigo-500">
                      "{selectedLead.message}"
                    </div>
                  </div>
                )}

                {selectedLead.data && Object.keys(selectedLead.data).length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Additional Data</label>
                    <div className="space-y-2">
                      {Object.entries(selectedLead.data).map(([key, value]: [string, any]) => (
                        <div key={key} className="p-4 bg-slate-50 rounded-2xl flex flex-col gap-1 border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{key}</span>
                          <span className="text-xs font-bold text-slate-700">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-50 flex gap-3">
                <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" /> Email Customer
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="w-96 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
              <Users className="w-20 h-20 text-slate-100 mb-6" />
              <h4 className="text-lg font-black text-slate-300 uppercase tracking-widest leading-tight">Select a lead<br/>to view details</h4>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, trend, color }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-100 group">
    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 group-hover:text-indigo-600 transition-colors">{label}</div>
    <div className="text-3xl font-black text-slate-900 mb-2">{value}</div>
    <div className={`text-[10px] font-black uppercase tracking-tighter text-${color}-500 bg-${color}-50 px-2 py-0.5 rounded-full w-fit`}>{trend}</div>
  </div>
);
