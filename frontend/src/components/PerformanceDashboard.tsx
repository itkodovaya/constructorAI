import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Server, Globe, Cpu, 
  BarChart2, Clock, Cloud, Database,
  ArrowUpRight, Activity, HardDrive, RefreshCw
} from 'lucide-react';

export const PerformanceDashboard: React.FC = () => {
  const [latency, setLatency] = useState(42);
  const [exportJobs, setExportJobs] = useState([
    { id: 'job_1', name: 'Presentation PDF', status: 'completed', time: '12s' },
    { id: 'job_2', name: 'Site Archive (ZIP)', status: 'processing', time: '8s' }
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Производительность и Масштабирование</h3>
          <p className="text-slate-500 font-medium">Мониторинг Edge-функций и Serverless вычислений</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl flex items-center gap-2 border border-indigo-100">
            <Cloud className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Edge Active</span>
          </div>
        </div>
      </div>

      {/* Основные показатели */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard label="Latency (Edge)" value={`${latency}ms`} trend={-12} icon={<Zap className="w-5 h-5 text-amber-500" />} />
        <MetricCard label="Serverless Jobs" value={exportJobs.length} trend={+20} icon={<Cpu className="w-5 h-5 text-indigo-500" />} />
        <MetricCard label="Cache Hit Rate" value="94.2%" trend={+2.4} icon={<Database className="w-5 h-5 text-emerald-500" />} />
        <MetricCard label="Global Regions" value="12" trend={0} icon={<Globe className="w-5 h-5 text-violet-500" />} />
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Очередь экспорта */}
        <div className="col-span-2 bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-600" /> Serverless Export Queue
            </h4>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lambda Functions</span>
          </div>
          <div className="space-y-4">
            {exportJobs.map(job => (
              <div key={job.id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${job.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600 animate-pulse'}`}>
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{job.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">ID: {job.id} • {job.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                    job.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Статус инфраструктуры */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white">
          <h4 className="text-xl font-bold mb-8">Infrastructure Status</h4>
          <div className="space-y-6">
            <StatusItem label="Edge Nodes" status="Healthy" color="emerald" />
            <StatusItem label="Vector DB" status="Optimized" color="indigo" />
            <StatusItem label="Media CDN" status="Active" color="emerald" />
            <StatusItem label="API Gateway" status="Scaling" color="amber" />
          </div>
          <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-bold">Real-time Load</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '45%' }}
                className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              />
            </div>
            <div className="mt-2 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">45% Capacity</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, trend, icon }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div className={`text-xs font-bold ${trend <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend <= 0 ? trend : `+${trend}`}%
      </div>
    </div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-black text-slate-900">{value}</div>
  </div>
);

const StatusItem = ({ label, status, color }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-slate-400">{label}</span>
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
      <span className={`text-xs font-bold text-${color}-400`}>{status}</span>
    </div>
  </div>
);

