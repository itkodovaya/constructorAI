import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link as LinkIcon, 
  Settings2, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Database, 
  Globe, 
  Mail, 
  MessageSquare,
  Check,
  ChevronRight,
  Plus,
  Instagram,
  Share2,
  Send,
  X,
  Lock
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: 'crm' | 'analytics' | 'mailing' | 'chat';
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
  color: string;
}

interface IntegrationsProps {
  onOpenSocialMedia?: () => void;
  onUpdateIntegration?: (id: string, data: any) => void;
}

export const Integrations: React.FC<IntegrationsProps> = ({ onOpenSocialMedia, onUpdateIntegration }) => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'amo',
      name: 'amoCRM',
      category: 'crm',
      description: 'Автоматическая передача заявок с вашего сайта прямо в воронку продаж.',
      icon: <Database className="w-5 h-5" />,
      isConnected: true,
      color: 'bg-blue-600'
    },
    {
      id: 'metrica',
      name: 'Яндекс.Метрика',
      category: 'analytics',
      description: 'Детальная аналитика посещений, тепловые карты и отслеживание целей.',
      icon: <Globe className="w-5 h-5" />,
      isConnected: false,
      color: 'bg-yellow-500'
    },
    {
      id: 'telegram',
      name: 'Telegram Bot',
      category: 'chat',
      description: 'Мгновенные уведомления о новых заказах и формах в ваш Telegram.',
      icon: <Send className="w-5 h-5" />,
      isConnected: false,
      color: 'bg-sky-500'
    },
    {
      id: 'unisender',
      name: 'UniSender',
      category: 'mailing',
      description: 'Email-рассылки по вашей базе клиентов с высокой доставляемостью.',
      icon: <Mail className="w-5 h-5" />,
      isConnected: false,
      color: 'bg-green-600'
    }
  ]);

  const [showConfig, setShowConfig] = useState<string | null>(null);
  const [tgToken, setTgToken] = useState('');

  const handleConnect = (id: string) => {
    if (id === 'telegram') {
      setShowConfig('telegram');
    } else {
      setIntegrations(prev => prev.map(item => 
        item.id === id ? { ...item, isConnected: !item.isConnected } : item
      ));
    }
  };

  const saveTelegram = () => {
    setIntegrations(prev => prev.map(item => 
      item.id === 'telegram' ? { ...item, isConnected: true } : item
    ));
    setShowConfig(null);
    if (onUpdateIntegration) onUpdateIntegration('telegram', { token: tgToken });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Интеграции</h2>
          <p className="text-slate-500 font-medium">Подключите внешние сервисы для роста вашего бизнеса</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
            API Docs
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Добавить свою
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => (
          <div 
            key={item.id}
            className={`p-6 bg-white rounded-[32px] border-2 transition-all group ${
              item.isConnected ? 'border-blue-100 shadow-md' : 'border-slate-50 hover:border-slate-200'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${item.color}`}>
                {item.icon}
              </div>
              <div className="flex flex-col items-end gap-2">
                {item.isConnected ? (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Активно
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                    Не подключено
                  </span>
                )}
                <button 
                  onClick={() => handleConnect(item.id)}
                  className={`text-xs font-bold transition-all ${
                    item.isConnected ? 'text-red-400 hover:text-red-500' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  {item.isConnected ? 'Отключить' : 'Подключить'}
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{item.name}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" />
                ))}
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Settings2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showConfig === 'telegram' && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white">
                    <Send className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Настройка Telegram</h3>
                </div>
                <button onClick={() => setShowConfig(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <div className="p-10 space-y-8">
                <div className="p-6 bg-blue-50 rounded-3xl space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 font-bold">
                    <Zap className="w-5 h-5" />
                    <span>Как получить токен?</span>
                  </div>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    1. Найдите @BotFather в Telegram<br/>
                    2. Создайте нового бота через /newbot<br/>
                    3. Скопируйте API Token и вставьте его ниже
                  </p>
                </div>
                
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Bot API Token
                  </label>
                  <input 
                    type="password"
                    placeholder="0000000000:AAAbbbCCC..."
                    className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-sky-500 focus:bg-white rounded-2xl outline-none transition-all font-mono text-sm"
                    value={tgToken}
                    onChange={(e) => setTgToken(e.target.value)}
                  />
                </div>

                <button 
                  onClick={saveTelegram}
                  className="w-full py-5 bg-sky-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all"
                >
                  Подключить бота
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
