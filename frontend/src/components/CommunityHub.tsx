import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, MessageSquare, Book,
  ExternalLink, HelpCircle, Star, LifeBuoy,
  FileText, PlayCircle, Globe, Zap
} from 'lucide-react';

export const CommunityHub: React.FC = () => {
  const categories = [
    { id: 'templates', name: 'Шаблоны', count: 124, icon: <Globe className="w-5 h-5" /> },
    { id: 'plugins', name: 'Плагины', count: 45, icon: <Zap className="w-5 h-5" /> },
    { id: 'showcase', name: 'Showcase', count: 89, icon: <Star className="w-5 h-5" /> }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Сообщество ConstructorAI</h3>
          <p className="text-slate-500 font-medium">Обменивайтесь опытом, находите лучшие плагины и вдохновляйтесь</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-[#5865F2] text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-100">
            <MessageSquare className="w-4 h-4" /> Discord Server
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              {cat.icon}
            </div>
            <h4 className="font-bold text-slate-900 text-lg mb-1">{cat.name}</h4>
            <p className="text-xs text-slate-400 font-medium">{cat.count} новых материалов на этой неделе</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Форум / Обсуждения */}
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
          <h4 className="text-xl font-bold text-slate-900 mb-8">Последние обсуждения</h4>
          <div className="space-y-6">
            {[
              { title: 'Как интегрировать Stability AI в блок галереи?', author: 'DesignPro', replies: 12 },
              { title: 'Лучшие промпты для SEO-копирайтинга', author: 'AI_Master', replies: 8 },
              { title: 'Проблема с экспортом PDF на мобильных', author: 'User_441', replies: 3 }
            ].map((topic, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-slate-400">
                    {topic.author[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{topic.title}</h5>
                    <p className="text-[10px] text-slate-400 font-medium">{topic.author} • 2 часа назад</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <MessageSquare className="w-3.5 h-3.5" /> {topic.replies}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Обучение и База знаний */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Book className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h4 className="text-xl font-bold mb-6">База знаний</h4>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-sm text-slate-300">Видео-уроки для профи</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm text-slate-300">Документация Plugin SDK</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group">
                <div className="flex items-center gap-3">
                  <LifeBuoy className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-sm text-slate-300">Центр поддержки</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

