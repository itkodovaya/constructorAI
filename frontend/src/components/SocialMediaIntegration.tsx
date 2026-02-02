import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Instagram, Facebook,
  CheckCircle2, X, Link2, Calendar, BarChart3, Settings,
  Plus, Trash2, Clock, Send, MessageCircle, Users
} from 'lucide-react';

interface SocialMediaIntegrationProps {
  onClose: () => void;
}

interface ConnectedAccount {
  id: string;
  platform: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  lastSync?: string;
}

export const SocialMediaIntegration: React.FC<SocialMediaIntegrationProps> = ({ onClose }) => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    { id: '1', platform: 'instagram', name: '@mybrand', icon: <Instagram className="w-5 h-5" />, connected: true, lastSync: '2 часа назад' },
    { id: '2', platform: 'vk', name: 'Моя группа', icon: <Users className="w-5 h-5" />, connected: true, lastSync: '5 минут назад' },
    { id: '3', platform: 'telegram', name: '@mybrand_channel', icon: <MessageCircle className="w-5 h-5" />, connected: false },
    { id: '4', platform: 'facebook', name: 'My Brand Page', icon: <Facebook className="w-5 h-5" />, connected: false },
  ]);

  const [scheduledPosts, setScheduledPosts] = useState([
    { id: '1', platform: 'instagram', content: 'Новый пост о продукте', date: '2026-01-29 10:00', status: 'scheduled' },
    { id: '2', platform: 'vk', content: 'Обновление в группе', date: '2026-01-29 14:00', status: 'scheduled' },
  ]);

  const connectAccount = (platform: string) => {
    setAccounts(accounts.map(acc => 
      acc.platform === platform ? { ...acc, connected: true, lastSync: 'только что' } : acc
    ));
  };

  const disconnectAccount = (platform: string) => {
    setAccounts(accounts.map(acc => 
      acc.platform === platform ? { ...acc, connected: false, lastSync: undefined } : acc
    ));
  };

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Интеграция с соцсетями</h2>
            <p className="text-slate-500">Подключите аккаунты и публикуйте контент автоматически</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Connected Accounts */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Подключенные аккаунты</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                  <Plus className="w-4 h-4" /> Добавить
                </button>
              </div>

              <div className="space-y-3">
                {accounts.map(account => (
                  <div
                    key={account.id}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      account.connected 
                        ? 'border-emerald-200 bg-emerald-50' 
                        : 'border-slate-100 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          account.connected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {account.icon}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{account.name}</div>
                          {account.connected && account.lastSync && (
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Синхронизировано {account.lastSync}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.connected ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <button
                              onClick={() => disconnectAccount(account.platform)}
                              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => connectAccount(account.platform)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all"
                          >
                            Подключить
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Analytics */}
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-bold text-slate-900">Аналитика публикаций</h4>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-indigo-600 mb-1">127</div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest">Постов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-purple-600 mb-1">8.2K</div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest">Просмотров</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-emerald-600 mb-1">342</div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest">Лайков</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Scheduled Posts */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Запланированные публикации</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                  <Calendar className="w-4 h-4" /> Календарь
                </button>
              </div>

              <div className="space-y-3">
                {scheduledPosts.map(post => (
                  <div
                    key={post.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          {accounts.find(a => a.platform === post.platform)?.icon}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{post.content}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" /> {post.date}
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold uppercase">
                        Запланировано
                      </span>
                      <button className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all">
                        <Send className="w-3 h-3" /> Опубликовать сейчас
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Быстрые действия</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 transition-all">
                    <span className="text-sm font-bold text-slate-700">Публиковать во все соцсети</span>
                    <Send className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 transition-all">
                    <span className="text-sm font-bold text-slate-700">Создать кампанию</span>
                    <Link2 className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 transition-all">
                    <span className="text-sm font-bold text-slate-700">Настроить автопостинг</span>
                    <Settings className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

