import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Loader2, Download, ArrowRight, Filter, X, ZoomIn } from 'lucide-react';
import { LogoGenerator } from '../services/LogoGenerator';
import type { LogoVariant } from '../services/LogoGenerator';
import type { GeneratedDesign } from '../utils/DesignParameters';

interface LogoSelectorProps {
  brandName: string;
  selectedDesign: GeneratedDesign;
  onSelect: (logo: LogoVariant) => void;
  onBack: () => void;
}

export const LogoSelector: React.FC<LogoSelectorProps> = ({
  brandName,
  selectedDesign,
  onSelect,
  onBack,
}) => {
  const [logos, setLogos] = useState<LogoVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLogo, setSelectedLogo] = useState<LogoVariant | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [layoutFilter, setLayoutFilter] = useState<string>('all');
  const [previewLogo, setPreviewLogo] = useState<LogoVariant | null>(null);

  useEffect(() => {
    generateLogos();
  }, []);

  const generateLogos = async () => {
    setLoading(true);
    try {
      const generator = LogoGenerator.getInstance();
      const generatedLogos = await generator.generateLogos(brandName, selectedDesign, 12, 'diverse');
      setLogos(generatedLogos);
      
      // Auto-select first logo for better UX
      if (generatedLogos.length > 0) {
        setSelectedLogo(generatedLogos[0]);
      }
    } catch (error) {
      console.error('Error generating logos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (logo: LogoVariant) => {
    setSelectedLogo(logo);
  };

  const handleConfirm = () => {
    if (selectedLogo) {
      onSelect(selectedLogo);
    }
  };

  // Фильтрация логотипов по макету
  const filteredLogos = useMemo(() => {
    if (layoutFilter === 'all') {
      return logos;
    }
    return logos.filter(logo => 
      logo.name.toLowerCase().includes(layoutFilter.toLowerCase())
    );
  }, [logos, layoutFilter]);

  // Получение уникальных макетов
  const layoutTypes = useMemo(() => {
    const layouts = new Set<string>();
    logos.forEach(logo => {
      const layout = logo.name.split(' ').pop() || 'Unknown';
      layouts.add(layout);
    });
    return Array.from(layouts);
  }, [logos]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
              Выберите логотип для {brandName}
            </h1>
            <p className="text-slate-600 text-lg">
              Логотипы созданы на основе выбранного стиля: {selectedDesign.parameters.style.name}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-semibold hover:border-indigo-300 transition-all"
          >
            <Filter className="w-5 h-5" />
            Фильтры
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 bg-white rounded-2xl p-4 border-2 border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Фильтр по макету</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLayoutFilter('all')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  layoutFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Все
              </button>
              {layoutTypes.map(layout => (
                <button
                  key={layout}
                  onClick={() => setLayoutFilter(layout)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    layoutFilter === layout
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {layout}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-slate-800 text-xl mb-2 font-semibold">Генерируем логотипы...</p>
              <p className="text-slate-500 text-sm">Применяем стиль и цветовую палитру</p>
            </div>
          </div>
        ) : (
          <>
            {/* Logo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              <AnimatePresence>
                {filteredLogos.map((logo, index) => (
                  <motion.div
                    key={logo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSelect(logo)}
                    className={`group relative bg-white rounded-3xl p-6 cursor-pointer border-2 transition-all shadow-sm ${
                      selectedLogo?.id === logo.id
                        ? 'border-indigo-500 ring-4 ring-indigo-100 scale-105 shadow-xl'
                        : 'border-slate-200 hover:border-indigo-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="aspect-square bg-slate-50 rounded-2xl p-4 mb-4 flex items-center justify-center overflow-hidden border border-slate-200 group-hover:bg-white transition-colors">
                      <motion.img
                        src={logo.preview}
                        alt={logo.name}
                        className="w-full h-full object-contain"
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg mb-1">{logo.name}</h3>
                    <p className="text-slate-500 text-sm">{logo.parameters.colorPalette.name}</p>
                    <div className="absolute top-4 right-4 flex gap-2">
                      {selectedLogo?.id === logo.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-indigo-500 rounded-full p-2 shadow-lg"
                        >
                          <Check className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewLogo(logo);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                        title="Увеличить"
                      >
                        <ZoomIn className="w-4 h-4 text-slate-700" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Preview Modal */}
            {previewLogo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPreviewLogo(null)}
                className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-3xl p-8 max-w-2xl w-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-slate-900">{previewLogo.name}</h3>
                    <button
                      onClick={() => setPreviewLogo(null)}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <X className="w-6 h-6 text-slate-500" />
                    </button>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-8 flex items-center justify-center mb-6">
                    <img
                      src={previewLogo.preview}
                      alt={previewLogo.name}
                      className="max-w-full max-h-96 object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 mb-1">Цветовая палитра: {previewLogo.parameters.colorPalette.name}</p>
                      <p className="text-slate-500 text-sm">Стиль: {previewLogo.parameters.style.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedLogo(previewLogo);
                        setPreviewLogo(null);
                      }}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                    >
                      Выбрать
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Selected Logo Preview */}
            {selectedLogo && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl p-6"
              >
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-slate-50 rounded-2xl p-4 flex items-center justify-center border-2 border-indigo-500 shadow-lg">
                      <img
                        src={selectedLogo.preview}
                        alt="Selected Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-bold text-xl mb-1">{selectedLogo.name}</h3>
                      <p className="text-slate-500">Готов к использованию</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={onBack}
                      className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
                    >
                      Назад
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
                    >
                      <Sparkles className="w-5 h-5" />
                      Использовать этот логотип
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

