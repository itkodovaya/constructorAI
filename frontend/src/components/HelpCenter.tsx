import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, BookOpen, PlayCircle, MessageCircle, 
  ChevronRight, HelpCircle, FileText, Zap, Sparkles,
  LifeBuoy, Lightbulb, Video
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  duration: string;
}

export const HelpCenter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [search, setSearch] = useState('');

  const articles: Article[] = [
    { id: '1', title: 'Как создать логотип за 30 секунд', category: 'Основы', duration: '3 мин' },
    { id: '2', title: 'Настройка SEO для вашего сайта', category: 'Сайты', duration: '5 мин' },
    { id: '3', title: 'Использование AI-ассистента для правок', category: 'ИИ', duration: '4 мин' },
    { id: '4', title: 'Экспорт проекта в HTML/CSS', category: 'Продвинутое', duration: '6 мин' },
    { id: '5', title: 'Коллективная работа над брендом', category: 'Команда', duration: '4 мин' },
  ];

  return (
    <div className="fixed inset-0 z-[600] bg-white flex flex-col overflow-hidden">
      {/* Top Banner */}
      <header className="bg-indigo-600 p-12 text-white relative overflow-hidden flex-shrink-0">
        <div className="max-w-4xl mx-auto relative z-10">
          <button 
            onClick={onClose}
            className="absolute -top-6 -right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Центр поддержки и обучения
            </div>
            <h1 className="text-4xl font-black">Чем мы можем вам помочь?</h1>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
              <input 
                type="text" 
                placeholder="Поиск по базе знаний (например: как изменить шрифт)" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-16 pr-6 py-5 text-lg outline-none focus:bg-white focus:text-slate-900 transition-all placeholder:text-indigo-200"
              />
            </div>
          </div>
        </div>
        <Sparkles className="absolute -left-12 -bottom-12 w-64 h-64 text-white/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/30 blur-[100px] rounded-full" />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 bg-slate-50/50">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HelpCard 
              icon={<BookOpen className="w-8 h-8 text-blue-500" />}
              title="Документация"
              desc="Подробные руководства по всем функциям платформы."
            />
            <HelpCard 
              icon={<Video className="w-8 h-8 text-purple-500" />}
              title="Видеоуроки"
              desc="Посмотрите, как профессионалы создают бренды с AI."
            />
            <HelpCard 
              icon={<MessageCircle className="w-8 h-8 text-emerald-500" />}
              title="Живой чат"
              desc="Наша поддержка ответит на любой вопрос за 5 минут."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Articles List */}
            <div className="lg:col-span-2 space-y-8">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-amber-500" /> Популярные статьи
              </h3>
              <div className="space-y-4">
                {articles.map((article) => (
                  <button 
                    key={article.id}
                    className="w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-6 text-left">
                       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                          <FileText className="w-6 h-6" />
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{article.category}</div>
                          <h4 className="font-bold text-slate-800">{article.title}</h4>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-xs text-slate-400">{article.duration}</span>
                       <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Support Sidebar */}
            <div className="space-y-8">
               <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                  <h3 className="text-xl font-bold mb-4 relative z-10">Нужна помощь специалиста?</h3>
                  <p className="text-slate-400 text-sm mb-8 relative z-10 leading-relaxed">
                    Если вы не нашли ответ на свой вопрос, наша команда готова помочь вам в любое время.
                  </p>
                  <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 relative z-10">
                    Написать в поддержку
                  </button>
                  <LifeBuoy className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5" />
               </div>

               <div className="p-8 bg-white rounded-[40px] border border-slate-100 space-y-4 shadow-sm">
                  <h4 className="font-bold text-slate-800">Сообщество дизайнеров</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Присоединяйтесь к нашему чату в Telegram, чтобы делиться опытом и получать советы.</p>
                  <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700">
                    Перейти в Telegram <ExternalLink className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 bg-white border-t border-slate-100 px-12 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex-shrink-0">
         Constructor AI © 2026 • Обучающие материалы • Все права защищены
      </footer>
    </div>
  );
};

const HelpCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer text-center">
    <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <h4 className="text-xl font-bold text-slate-900 mb-2">{title}</h4>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

