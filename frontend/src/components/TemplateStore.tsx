import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Filter, Star, Zap, X, ChevronRight, Globe, Layout, Palette, Download, Heart, TrendingUp } from 'lucide-react';
import { api } from '../services/api';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'website' | 'presentation' | 'social' | 'brandkit';
  thumbnail: string;
  previewImages: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  price: number;
  rating: number;
  reviewsCount: number;
  downloadsCount: number;
  tags: string[];
  featured: boolean;
}

export const TemplateStore: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory, searchQuery]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (selectedCategory && selectedCategory !== 'All') {
        filters.category = selectedCategory.toLowerCase();
      }
      if (searchQuery) {
        filters.search = searchQuery;
      }
      
      const response = await api.getTemplates(filters);
      setTemplates(response.templates || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (templateId: string) => {
    try {
      await api.downloadTemplate(templateId);
      alert('Шаблон скачан!');
      loadTemplates(); // Обновляем счетчик скачиваний
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при скачивании шаблона');
    }
  };

  const categories = [
    { id: 'All', name: 'Все', icon: <Globe className="w-5 h-5" /> },
    { id: 'Website', name: 'Сайты', icon: <Layout className="w-5 h-5" /> },
    { id: 'Social', name: 'Соцсети', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'Presentation', name: 'Презентации', icon: <Zap className="w-5 h-5" /> },
    { id: 'Brandkit', name: 'Бренд-киты', icon: <Palette className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden">
      <header className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Marketplace</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Templates & Add-ons</p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-12 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по шаблонам..."
            className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-blue-500/20 transition-all"
          />
        </div>

        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r border-slate-100 p-8 space-y-8 shrink-0 overflow-y-auto">
          <div>
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Категории</h3>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setFilter(cat.id);
                    setSelectedCategory(cat.id);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    filter === cat.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Фильтры</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl">
                <Star className="w-4 h-4 inline mr-2 text-yellow-500" />
                Только бесплатные
              </button>
              <button className="w-full text-left px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl">
                <TrendingUp className="w-4 h-4 inline mr-2 text-green-500" />
                Популярные
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-10">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                    <img
                      src={template.thumbnail || `https://via.placeholder.com/400x300?text=${encodeURIComponent(template.name)}`}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {template.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-white text-xs font-black rounded-full">
                        Популярный
                      </div>
                    )}
                    {template.price === 0 && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-black rounded-full">
                        Бесплатно
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-black text-slate-900">{template.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-slate-600">{template.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{template.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-black">
                          {template.author.name.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-slate-600">{template.author.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {template.price > 0 && (
                          <span className="text-sm font-black text-slate-900">${template.price}</span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(template.id);
                          }}
                          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Скачать
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-50 text-xs font-bold text-slate-600 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              {templates.length === 0 && !loading && (
                <div className="col-span-full text-center py-20">
                  <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold">Шаблоны не найдены</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
