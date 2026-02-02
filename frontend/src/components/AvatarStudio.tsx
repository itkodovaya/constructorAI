import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Play, Mic, Video, 
  Sparkles, Send, Volume2, 
  Monitor, Smartphone, CheckCircle2,
  ChevronRight, Wand2, Pause
} from 'lucide-react';

export const AvatarStudio: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [selectedAvatar, setSelectedAvatar] = useState('elena');
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const avatars = [
    { id: 'alex', name: 'Alex', role: 'Business' },
    { id: 'elena', name: 'Elena', role: 'Support' },
    { id: 'marcus', name: 'Marcus', role: 'Creative' }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPreviewVideo('mock-url');
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-2 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-slate-900">AI Media Studio</h3>
          <p className="text-slate-500 font-medium">Создавайте видео-аватары для ваших проектов</p>
        </div>
        <div className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl flex items-center gap-3 border border-indigo-100">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-black uppercase tracking-widest">Premium AI Video</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-10">
        {/* Настройки слева */}
        <div className="col-span-2 space-y-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Выберите персонажа</h4>
            <div className="grid grid-cols-3 gap-3">
              {avatars.map(a => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAvatar(a.id)}
                  className={`p-4 rounded-3xl border transition-all text-center ${
                    selectedAvatar === a.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${selectedAvatar === a.id ? 'bg-white/20' : 'bg-slate-50'}`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-[10px] font-black uppercase">{a.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Скрипт озвучки</h4>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Введите текст, который должен произнести аватар..."
              className="w-full h-48 bg-white border border-slate-100 rounded-[32px] p-6 text-sm focus:ring-2 focus:ring-indigo-600 shadow-sm transition-all"
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Настройки голоса</h4>
            <div className="flex gap-2">
              <button className="flex-1 bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Russian Female</span>
              </button>
              <button className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <Mic className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !text}
            className="w-full bg-slate-900 text-white py-6 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl disabled:opacity-50"
          >
            {isGenerating ? <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent" /> : <Wand2 className="w-6 h-6" />}
            {isGenerating ? 'Синтез видео...' : 'Сгенерировать аватар'}
          </button>
        </div>

        {/* Превью справа */}
        <div className="col-span-3">
          <div className="aspect-[9/16] max-w-sm mx-auto bg-slate-900 rounded-[48px] border-[12px] border-slate-800 shadow-2xl relative overflow-hidden flex items-center justify-center">
            {isGenerating ? (
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Video className="w-10 h-10 text-indigo-400" />
                </div>
                <h4 className="text-white font-bold mb-2">Генерируем анимацию</h4>
                <p className="text-slate-500 text-xs">AI просчитывает мимику и артикуляцию...</p>
              </div>
            ) : previewVideo ? (
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </button>
                </div>
                <div className="absolute bottom-12 left-8 right-8 text-white">
                  <div className="text-xs font-bold text-indigo-400 mb-1 uppercase tracking-widest">Preview Mode</div>
                  <h4 className="text-xl font-bold truncate">{text || 'Ваш текст появится здесь'}</h4>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 opacity-20">
                <Video className="w-16 h-16 text-white mx-auto mb-4" />
                <p className="text-white text-xs font-medium">Превью появится после генерации</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 flex justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lip Sync OK</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audio HD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

