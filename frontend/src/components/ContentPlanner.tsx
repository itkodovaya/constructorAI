import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Instagram, 
  Send, 
  Twitter, 
  Facebook,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Post {
  id: string;
  platform: 'instagram' | 'telegram' | 'vk' | 'twitter';
  content: string;
  image: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'failed';
}

interface ContentPlannerProps {
  onClose: () => void;
  brandName: string;
  logoUrl: string;
}

export const ContentPlanner: React.FC<ContentPlannerProps> = ({ onClose, brandName, logoUrl }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  
  const platforms = {
    instagram: { icon: <Instagram className="w-4 h-4" />, color: 'bg-rose-500', label: 'Instagram' },
    telegram: { icon: <Send className="w-4 h-4" />, color: 'bg-blue-500', label: 'Telegram' },
    vk: { icon: <div className="text-[10px] font-black">VK</div>, color: 'bg-indigo-600', label: 'VK' },
    twitter: { icon: <Twitter className="w-4 h-4" />, color: 'bg-sky-400', label: 'Twitter' },
  };

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      platform: 'instagram',
      content: 'Наш новый бренд официально запущен! 🚀 #дизайн #будущее',
      image: logoUrl,
      scheduledTime: '18:00',
      status: 'scheduled'
    },
    {
      id: '2',
      platform: 'telegram',
      content: 'Привет, мир! Мы создали нечто потрясающее с помощью AI.',
      image: logoUrl,
      scheduledTime: '12:00',
      status: 'published'
    }
  ]);

  return (
    <div className="fixed inset-0 z-[350] bg-white flex flex-col">
      {/* Header */}
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Планировщик контента</h2>
            <p className="text-sm text-slate-500">Управляйте присутствием {brandName} в соцсетях</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Статистика
          </button>
          <button className="premium-button text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-indigo-100">
            <Plus className="w-4 h-4" /> Создать пост
          </button>
          <div className="w-px h-8 bg-slate-100 mx-2" />
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Calendar Sidebar */}
        <aside className="w-80 border-r border-slate-100 p-8 overflow-y-auto bg-slate-50/30">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 text-lg">Январь 2026</h3>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-white rounded-lg border border-slate-200"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-white rounded-lg border border-slate-200"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-8">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
              <div key={d} className="text-[10px] font-bold text-slate-400 text-center uppercase">{d}</div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const hasPost = [28, 29, 30].includes(day);
              return (
                <button 
                  key={i}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-bold relative transition-all ${
                    day === selectedDay ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white text-slate-600'
                  }`}
                >
                  {day}
                  {hasPost && day !== selectedDay && (
                    <div className="absolute bottom-1.5 w-1 h-1 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Платформы</h4>
            {Object.entries(platforms).map(([id, p]) => (
              <label key={id} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${p.color} text-white flex items-center justify-center shadow-sm`}>
                    {p.icon}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{p.label}</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </label>
            ))}
          </div>
        </aside>

        {/* Timeline Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">Расписание на {selectedDay} января</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Все посты проверены ИИ
                </div>
              </div>
            </div>

            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
              {posts.map((post) => (
                <div key={post.id} className="relative pl-12">
                  <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-white ${platforms[post.platform].color}`}>
                    {platforms[post.platform].icon}
                  </div>
                  
                  <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <Clock className="w-3 h-3" /> {post.scheduledTime}
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          post.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {post.status === 'published' ? 'Опубликовано' : 'Запланировано'}
                        </span>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex gap-6">
                      <div className="w-32 aspect-square rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                        <img src={post.image} alt="Post content" className="w-full h-full object-contain p-2" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <p className="text-slate-700 font-medium leading-relaxed">{post.content}</p>
                        <div className="flex gap-3">
                           <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Редактировать</button>
                           <button className="text-xs font-bold text-slate-400 hover:text-rose-500">Удалить</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty slot example */}
              <div className="relative pl-12 group">
                 <div className="absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center bg-slate-100 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                    <Plus className="w-5 h-5" />
                 </div>
                 <div className="py-3 px-6 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 text-sm font-bold group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all cursor-pointer">
                   Добавить пост на {selectedDay} января
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

