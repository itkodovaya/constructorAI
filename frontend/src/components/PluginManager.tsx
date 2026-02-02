import React, { useState } from 'react';
import { Package, Download, Trash2, CheckCircle2, Globe, Shield, Zap } from 'lucide-react';

interface PluginInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  installed: boolean;
  category: 'marketing' | 'ecommerce' | 'design' | 'utility';
}

export const PluginManager: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginInfo[]>([
    { id: 'seo-pro', name: 'SEO Master Pro', description: 'Advanced SEO optimization and keyword analysis.', version: '1.2.0', author: 'ConstructorAI', installed: true, category: 'marketing' },
    { id: 'cart-plus', name: 'Smart Cart', description: 'Enhanced shopping cart with dynamic discounts.', version: '2.0.1', author: 'EcomTools', installed: false, category: 'ecommerce' },
    { id: 'dark-mode', name: 'Auto Dark Mode', description: 'Automatically switch themes based on user preference.', version: '1.0.5', author: 'ThemeLabs', installed: true, category: 'design' },
    { id: 'analytics-hub', name: 'Analytics Hub', description: 'Integrate multiple analytics providers easily.', version: '1.1.0', author: 'DataFlow', installed: false, category: 'utility' },
  ]);

  const toggleInstall = (id: string) => {
    setPlugins(prev => prev.map(p => p.id === id ? { ...p, installed: !p.installed } : p));
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Plugin Marketplace</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expand your constructor capabilities</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">All</button>
          <button className="px-4 py-2 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">Installed</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plugins.map(plugin => (
          <div key={plugin.id} className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                {plugin.category === 'marketing' ? <Globe className="w-7 h-7 text-blue-500" /> :
                 plugin.category === 'ecommerce' ? <Zap className="w-7 h-7 text-amber-500" /> :
                 plugin.category === 'design' ? <Shield className="w-7 h-7 text-purple-500" /> :
                 <Package className="w-7 h-7 text-slate-400" />}
              </div>
              <button
                onClick={() => toggleInstall(plugin.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  plugin.installed ? 'bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'
                }`}
              >
                {plugin.installed ? 'Uninstall' : 'Install'}
              </button>
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-1">{plugin.name}</h4>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">v{plugin.version}</span>
              <span className="w-1 h-1 bg-slate-200 rounded-full" />
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">by {plugin.author}</span>
            </div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">{plugin.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
