import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Sparkles, Filter, Check, Loader2 } from 'lucide-react';
import { DesignGenerator } from '../services/DesignGenerator';
import type { GeneratedDesign } from '../utils/DesignParameters';
import { InfiniteDesignGrid } from './InfiniteDesignGrid';

interface FullscreenDesignSelectorProps {
  brandName: string;
  niche: string;
  onSelect: (design: GeneratedDesign) => void;
  onBack: () => void;
}

export const FullscreenDesignSelector: React.FC<FullscreenDesignSelectorProps> = ({
  brandName,
  niche,
  onSelect,
  onBack,
}) => {
  const [selectedDesign, setSelectedDesign] = useState<GeneratedDesign | null>(null);
  const [designs, setDesigns] = useState<GeneratedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState({
    color: 'all',
    style: 'all',
    mood: 'all',
  });

  const generator = useMemo(() => DesignGenerator.getInstance(), []);

  // Загрузка начального батча
  useEffect(() => {
    loadDesigns(0, true);
  }, [niche]);

  const loadDesigns = useCallback(async (startOffset: number, isInitial: boolean = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    // Симуляция асинхронной загрузки
    await new Promise(resolve => setTimeout(resolve, 300));

    const batch = generator.generateBatch(20, niche, startOffset);
    
    if (isInitial) {
      setDesigns(batch);
      setLoading(false);
    } else {
      setDesigns(prev => [...prev, ...batch]);
      setLoadingMore(false);
    }
    
    setOffset(startOffset + batch.length);
    setHasMore(batch.length === 20);
  }, [generator, niche]);

  // Обработка прокрутки для бесконечной загрузки
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollTop + windowHeight >= documentHeight - 500) {
        loadDesigns(offset);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset, loadingMore, hasMore, loadDesigns]);

  // Обработка ESC для закрытия
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onBack]);

  const handleSelect = (design: GeneratedDesign) => {
    setSelectedDesign(design);
  };

  const handleConfirm = () => {
    if (selectedDesign) {
      onSelect(selectedDesign);
    }
  };

  // Фильтрация дизайнов
  const filteredDesigns = useMemo(() => {
    return designs.filter(design => {
      if (filters.color !== 'all' && design.parameters.colorPalette.id !== filters.color) return false;
      if (filters.style !== 'all' && design.parameters.style.id !== filters.style) return false;
      if (filters.mood !== 'all' && design.parameters.mood.id !== filters.mood) return false;
      return true;
    });
  }, [designs, filters]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-slate-700" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
                  Выберите дизайн для {brandName}
                </h1>
                <p className="text-sm sm:text-base text-slate-500 mt-1">
                  Более 1 миллиарда уникальных вариантов
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-6 h-6 text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-[73px] sm:top-[89px] z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-slate-600">
              <Filter className="w-5 h-5" />
              <span className="font-semibold">Фильтры:</span>
            </div>
            <select
              value={filters.color}
              onChange={(e) => setFilters({ ...filters, color: e.target.value })}
              className="px-4 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="all">Все цвета</option>
              <option value="palette_1">Indigo Purple</option>
              <option value="palette_2">Ocean Blue</option>
              <option value="palette_3">Warm Sunset</option>
            </select>
            <select
              value={filters.style}
              onChange={(e) => setFilters({ ...filters, style: e.target.value })}
              className="px-4 py-2 rounded-xl bg-white border-2 border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="all">Все стили</option>
              <option value="style_minimalist">Минимализм</option>
              <option value="style_tech">Техно</option>
              <option value="style_premium">Премиум</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-slate-800 text-lg font-semibold mb-2">Генерируем варианты...</p>
              <p className="text-slate-500 text-sm">Более 1 миллиарда уникальных комбинаций</p>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-250px)]">
            <InfiniteDesignGrid
              designs={filteredDesigns}
              selectedDesign={selectedDesign}
              onSelect={handleSelect}
              onLoadMore={() => loadDesigns(offset)}
              loading={loadingMore}
              hasMore={hasMore}
            />
          </div>
        )}
      </div>

      {/* Selected design preview */}
      {selectedDesign && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl p-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-lg">
                <img
                  src={selectedDesign.preview}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-lg">{selectedDesign.parameters.style.name}</h3>
                <p className="text-slate-500 text-sm">{selectedDesign.parameters.colorPalette.name}</p>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
            >
              <Sparkles className="w-5 h-5" />
              Продолжить
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

