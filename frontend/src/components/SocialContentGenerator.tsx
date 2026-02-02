import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Image as ImageIcon, Download, X, CheckCircle2, Package } from 'lucide-react';
import { SOCIAL_FORMATS, getFormatsByPlatform } from '../utils/socialFormats';
import { SocialPostGenerator } from '../services/socialPostGenerator';
import { api } from '../services/api';

interface SocialContentGeneratorProps {
  brandName: string;
  assets: any;
  onClose: () => void;
}

export const SocialContentGenerator: React.FC<SocialContentGeneratorProps> = ({ brandName, assets, onClose, projectId }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'vk']);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = [
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-500' },
    { id: 'vk', name: 'VK', color: 'bg-blue-500' },
    { id: 'telegram', name: 'Telegram', color: 'bg-sky-500' },
    { id: 'youtube', name: 'YouTube', color: 'bg-red-500' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Получаем форматы для выбранных платформ
      const formats = selectedPlatforms.flatMap(platform => 
        getFormatsByPlatform(platform.charAt(0).toUpperCase() + platform.slice(1))
      );
      
      // Генерируем посты
      const content = {
        title: `Добро пожаловать в ${brandName}!`,
        subtitle: 'Инновационные решения для вашего бизнеса',
        cta: 'Узнать больше',
        logoUrl: assets.logoUrl,
        backgroundColor: assets.palette?.[0] || '#2563eb'
      };
      
      const posts = await SocialPostGenerator.generatePostSeries(
        formats.slice(0, 4), // Ограничиваем для производительности
        content,
        assets
      );
      
      setGeneratedPosts(posts.map((post, i) => ({
        id: Date.now() + i,
        platform: formats[i]?.platform || 'Unknown',
        content: post.imageData,
        format: `${post.width}x${post.height}`,
        postData: post
      })));
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Ошибка при генерации постов');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownloadAll = () => {
    generatedPosts.forEach((post, i) => {
      if (post.postData) {
        setTimeout(() => {
          SocialPostGenerator.downloadImage(post.postData, `${post.platform}_${i + 1}.png`);
        }, i * 200);
      }
    });
  };
  
  const handleGenerateBatch = async () => {
    if (!projectId) {
      alert('ID проекта не найден');
      return;
    }
    
    setIsGenerating(true);
    try {
      const formats = selectedPlatforms.flatMap(platform => 
        getFormatsByPlatform(platform.charAt(0).toUpperCase() + platform.slice(1))
      );
      
      const content = {
        title: `Добро пожаловать в ${brandName}!`,
        subtitle: 'Инновационные решения для вашего бизнеса',
        cta: 'Узнать больше',
        backgroundColor: assets.palette?.[0] || '#2563eb'
      };
      
      await api.generateBatchSocialPosts(projectId, formats, content);
      alert('Пакетная генерация завершена! ZIP файл скачан.');
    } catch (error) {
      console.error('Batch generation failed:', error);
      alert('Ошибка при пакетной генерации');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl"
      >
        <div className="p-10 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Генератор контента</h2>
              <p className="text-slate-500 font-medium">Создайте посты для всех платформ одновременно</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div>
            <label className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4 block">Выберите платформы</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => {
                    setSelectedPlatforms(prev => 
                      prev.includes(platform.id) 
                        ? prev.filter(p => p !== platform.id)
                        : [...prev, platform.id]
                    );
                  }}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md'
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 ${platform.color} rounded-xl mx-auto mb-3 flex items-center justify-center text-white`}>
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">{platform.name}</div>
                  {selectedPlatforms.includes(platform.id) && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mx-auto mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || selectedPlatforms.length === 0}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Генерация контента...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Сгенерировать {selectedPlatforms.length} постов
              </>
            )}
          </button>

          {generatedPosts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-lg font-bold text-slate-800">Сгенерированные посты ({generatedPosts.length})</h3>
                <div className="flex items-center gap-3">
                  {projectId && (
                    <button
                      onClick={handleGenerateBatch}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all disabled:opacity-50"
                    >
                      <Package className="w-4 h-4" /> Пакетная генерация (ZIP)
                    </button>
                  )}
                  <button
                    onClick={handleDownloadAll}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all"
                  >
                    <Download className="w-4 h-4" /> Скачать все
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedPosts.map(post => (
                  <div key={post.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase">{post.platform}</span>
                      <span className="text-xs font-mono text-slate-300">{post.format}</span>
                    </div>
                    <div className="bg-white rounded-xl mb-4 overflow-hidden border border-slate-200" style={{
                      aspectRatio: `${post.postData?.width || 1} / ${post.postData?.height || 1}`,
                      maxHeight: '300px'
                    }}>
                      <img 
                        src={post.content} 
                        alt={`${post.platform} post`} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button 
                      onClick={() => post.postData && SocialPostGenerator.downloadImage(post.postData, `${post.platform}_${post.id}.png`)}
                      className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Скачать
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

