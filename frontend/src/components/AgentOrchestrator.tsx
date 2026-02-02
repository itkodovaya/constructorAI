import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, Plus, Search, ChevronRight, 
  Clock, CheckCircle2, AlertCircle, Sparkles,
  User, MessageSquare, Terminal, Zap, Shield, Target,
  Users
} from 'lucide-react';
import { api } from '../services/api';

export const AgentOrchestrator: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', agentId: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [agentsData, tasksData] = await Promise.all([
        api.getAgents(),
        api.getProjectTasks(projectId)
      ]);
      setAgents(agentsData || []);
      setTasks(tasksData || []);
      if (tasksData.length > 0 && !activeTaskId) setActiveTaskId(tasksData[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.agentId) return;
    try {
      const task = await api.createAgentTask(projectId, {
        title: newTask.title,
        description: newTask.description,
        assignedAgentId: newTask.agentId
      });
      setTasks([task, ...tasks]);
      setActiveTaskId(task.id);
      setShowNewTask(false);
      setNewTask({ title: '', description: '', agentId: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (!message || !activeTaskId) return;
    try {
      const msg = await api.addTaskMessage(activeTaskId, 'user', message);
      setTasks(tasks.map(t => t.id === activeTaskId ? { ...t, messages: [...(t.messages || []), msg] } : t));
      setMessage('');
      
      // Simulate Agent Thinking
      setTimeout(async () => {
        const reply = await api.addTaskMessage(activeTaskId, 'agent', `I am processing your request: "${message}". I will apply my domain expertise to analyze the project data and brand context.`);
        setTasks(prev => prev.map(t => t.id === activeTaskId ? { ...t, messages: [...(t.messages || []), reply] } : t));
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);

  const handleInitiateSwarm = async () => {
    if (!activeTaskId) return;
    try {
      await api.initiateSwarm(activeTaskId);
      // Refresh tasks to get swarm messages
      const tasksData = await api.getProjectTasks(projectId);
      setTasks(tasksData || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-[700px] bg-slate-900 rounded-[48px] overflow-hidden border border-white/10 shadow-2xl">
      {/* Sidebar: Tasks */}
      <aside className="w-80 border-r border-white/5 flex flex-col bg-slate-900/50">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Active Tasks</h3>
          <button onClick={() => setShowNewTask(true)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-blue-400 transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {tasks.map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTaskId(t.id)}
              className={`w-full p-5 rounded-[32px] text-left transition-all relative group ${activeTaskId === t.id ? 'bg-white/10 shadow-xl' : 'hover:bg-white/5'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t.agent?.name || 'Unassigned'}</span>
                {t.status === 'completed' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-amber-400" />}
              </div>
              <div className={`font-bold truncate text-sm ${activeTaskId === t.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{t.title}</div>
            </button>
          ))}
          {tasks.length === 0 && !loading && (
            <div className="py-20 text-center px-6">
              <Terminal className="w-10 h-10 text-slate-800 mx-auto mb-4" />
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-relaxed">System Idle. Create a task to activate neural agents.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main: Chat/Execution */}
      <main className="flex-1 flex flex-col relative">
        {activeTask ? (
          <>
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                  <Bot className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{activeTask.title}</h2>
                  <p className="text-xs text-slate-500 font-medium">{activeTask.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleInitiateSwarm}
                  className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                >
                  <Users className="w-3 h-3" /> Activate Swarm
                </button>
                <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">Neural Link Active</div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              {activeTask.messages?.map((m: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  key={i} 
                  className={`flex gap-4 ${m.senderId === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    m.type === 'swarm' ? 'bg-amber-500/20 text-amber-400' :
                    m.senderId === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400'
                  }`}>
                    {m.type === 'swarm' ? <Zap className="w-5 h-5" /> : m.senderId === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`max-w-[70%] p-6 rounded-3xl text-sm font-medium leading-relaxed ${
                    m.type === 'swarm' ? 'bg-amber-500/10 text-amber-200 border border-amber-500/20' :
                    m.senderId === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800/50 text-slate-300 border border-white/5'
                  }`}>
                    {m.type === 'swarm' && <span className="block text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">Agent Collaboration</span>}
                    {m.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-8 bg-slate-900 border-t border-white/5">
              <div className="relative">
                <input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask agent to perform optimization, design edits or research..." 
                  className="w-full bg-white/5 border border-white/10 rounded-[24px] p-6 pr-20 text-white text-sm focus:ring-2 ring-blue-500/50 transition-all outline-none"
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center text-slate-700 animate-pulse">
              <Sparkles className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">Select a Task</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">Initialize a neural agent to begin project automation and strategic optimization.</p>
            </div>
          </div>
        )}
      </main>

      {/* New Task Modal */}
      <AnimatePresence>
        {showNewTask && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 w-full max-w-lg rounded-[48px] border border-white/10 shadow-2xl p-12 space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">Initialize Agent Task</h3>
                <button onClick={() => setShowNewTask(false)} className="p-2 hover:bg-white/10 rounded-xl"><X className="w-6 h-6 text-slate-500" /></button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Task Title</label>
                  <input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold" placeholder="e.g. SEO Audit v1" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Assigned Agent</label>
                  <div className="grid grid-cols-1 gap-2">
                    {agents.map(a => (
                      <button 
                        key={a.id}
                        onClick={() => setNewTask({...newTask, agentId: a.id})}
                        className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${newTask.agentId === a.id ? 'bg-blue-600/20 border-blue-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${newTask.agentId === a.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          {a.type === 'design' ? <Zap className="w-5 h-5" /> : a.type === 'marketing' ? <Target className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{a.name}</div>
                          <div className="text-[10px] text-slate-500 uppercase">{a.capabilities.split(',')[0]}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleCreateTask} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-900/40 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                  <Zap className="w-5 h-5" /> Start Task
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

