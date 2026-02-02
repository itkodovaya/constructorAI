import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, Play, Download, Layers, 
  Smartphone, Monitor, Music, Clock,
  Plus, Trash2, ChevronLeft, ChevronRight,
  Sparkles, Video, Share2, Wand2
} from 'lucide-react';

export const VideoAdsStudio: React.FC<{ projectId: string, onClose: () => void }> = ({ projectId, onClose }) => {
  const [format, setFormat] = useState<'vertical' | 'horizontal'>('vertical');
  const [scenes, setScenes] = useState<any[]>([
    { id: '1', type: 'Intro', text: 'Ваш идеальный бренд', duration: 3, anim: 'Zoom' },
    { id: '2', type: 'Feature', text: 'Генерация за 60 секунд', duration: 4, anim: 'Slide' },
    { id: '3', type: 'CTA', text: 'Попробуйте сейчас', duration: 3, anim: 'Kinetic' }
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-[300] bg-slate-900 flex overflow-hidden">
      {/* Левая панель - Редактор сцен */}
      <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold">
            <Film className="w-5 h-5 text-indigo-400" />
            Сценарий
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><ChevronLeft className="w-6 h-6" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {scenes.map((scene, idx) => (
            <motion.div 
              key={scene.id}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${currentSceneIndex === idx ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-700/50 border-slate-600'}`}
              onClick={() => setCurrentSceneIndex(idx)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black uppercase text-indigo-300">{scene.type}</span>
                <span className="text-[10px] text-slate-400">{scene.duration}s</span>
              </div>
              <p className="text-sm text-white font-medium line-clamp-2">{scene.text}</p>
            </motion.div>
          ))}
          <button className="w-full py-4 border-2 border-dashed border-slate-600 rounded-2xl text-slate-500 font-bold text-xs hover:border-indigo-500 hover:text-indigo-400 transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Добавить сцену
          </button>
        </div>

        <div className="p-6 border-t border-slate-700 space-y-4">
          <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-900/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> AI Режиссер
          </button>
        </div>
      </div>

      {/* Центральная часть - Preview */}
      <div className="flex-1 flex flex-col bg-slate-950">
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-10">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button 
              onClick={() => setFormat('vertical')}
              className={`p-2 rounded-lg transition-all ${format === 'vertical' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setFormat('horizontal')}
              className={`p-2 rounded-lg transition-all ${format === 'horizontal' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Music className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Lo-fi Beat v1</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">00:10 / 00:15</span>
            </div>
          </div>

          <button className="bg-white text-slate-900 px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Экспорт MP4
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-12 overflow-hidden">
          <div className={`relative bg-slate-900 shadow-2xl overflow-hidden transition-all duration-500 border-4 border-slate-800 ${format === 'vertical' ? 'w-[320px] aspect-[9/16]' : 'w-[640px] aspect-[16/9]'}`}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSceneIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-950" />
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative z-10"
                >
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 mx-auto">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white leading-tight mb-4 uppercase italic tracking-tighter">
                    {scenes[currentSceneIndex].text}
                  </h3>
                  <div className="h-1 bg-indigo-500 w-12 mx-auto" />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Прогресс-бар сцены */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
              <motion.div 
                key={`progress-${currentSceneIndex}`}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: scenes[currentSceneIndex].duration, ease: 'linear' }}
                className="h-full bg-indigo-500"
                onAnimationComplete={() => {
                  if (currentSceneIndex < scenes.length - 1) setCurrentSceneIndex(c => c + 1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="h-24 bg-slate-900 border-t border-slate-800 flex items-center px-10 gap-4 overflow-x-auto">
          {scenes.map((scene, idx) => (
            <div 
              key={scene.id} 
              className={`h-12 border-2 rounded-xl flex-shrink-0 flex items-center justify-center px-4 transition-all ${currentSceneIndex === idx ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-800/50 border-slate-700'}`}
              style={{ width: scene.duration * 40 }}
            >
              <span className="text-[10px] font-black text-white/40">{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

