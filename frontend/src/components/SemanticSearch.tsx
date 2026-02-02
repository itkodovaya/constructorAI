import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, Sparkles, Layout, Image as ImageIcon, FileText, X, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { VoiceInputField } from './VoiceInputField';

interface SearchResult {
  id: string;
  type: 'template' | 'block' | 'asset' | 'slide';
  title: string;
  description: string;
  score: number;
  metadata?: any;
}

interface SemanticSearchProps {
  onSelect?: (result: SearchResult) => void;
  onClose?: () => void;
  placeholder?: string;
}

export const SemanticSearch: React.FC<SemanticSearchProps> = ({
  onSelect,
  onClose,
  placeholder
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<'template' | 'block' | 'asset' | 'slide' | undefined>();

  useEffect(() => {
    if (query.trim().length > 2) {
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 300); // Debounce

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [query, selectedType]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const searchResults = await api.semanticSearch(query, selectedType);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    if (onSelect) {
      onSelect(result);
    }
    setQuery('');
    setResults([]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'template':
        return <Layout className="w-4 h-4" />;
      case 'block':
        return <FileText className="w-4 h-4" />;
      case 'asset':
        return <ImageIcon className="w-4 h-4" />;
      case 'slide':
        return <FileText className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'template':
        return 'Шаблон';
      case 'block':
        return 'Блок';
      case 'asset':
        return 'Ассет';
      case 'slide':
        return 'Слайд';
      default:
        return type;
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || t('search.placeholder')}
          className="w-full pl-12 pr-12 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900 placeholder-slate-400 font-medium"
        />
        
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Type filter */}
      {query && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 uppercase">Фильтр:</span>
          <button
            onClick={() => setSelectedType(undefined)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              !selectedType
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Все
          </button>
          {['template', 'block', 'asset', 'slide'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as any)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                selectedType === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {getTypeIcon(type)}
              {getTypeLabel(type)}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {(results.length > 0 || isLoading) && query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 bg-white border-2 border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                <span className="ml-3 text-slate-600 font-medium">Поиск...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">{t('search.noResults')}</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {results.map((result) => (
                  <motion.button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className="w-full p-4 text-left hover:bg-slate-50 transition-colors group"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900 truncate">{result.title}</h4>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">
                            {getTypeLabel(result.type)}
                          </span>
                          <span className="ml-auto text-xs font-bold text-indigo-600">
                            {Math.round(result.score * 100)}%
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">{result.description}</p>
                        {result.metadata?.category && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-slate-400">
                              {result.metadata.category}
                              {result.metadata.style && ` • ${result.metadata.style}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      {query && results.length > 0 && (
        <div className="mt-3 text-xs text-slate-400 text-center">
          {t('search.results')}: {results.length} • {t('search.semantic')}
        </div>
      )}
    </div>
  );
};

