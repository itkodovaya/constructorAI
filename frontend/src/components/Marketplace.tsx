import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Search, Filter, Star, Download, 
  DollarSign, Tag, X, ChevronRight, CheckCircle2,
  TrendingUp, Sparkles, Package, Code, Layout
} from 'lucide-react';
import { api } from '../services/api';

interface MarketplaceItem {
  id: string;
  type: 'template' | 'plugin' | 'component';
  title: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  price: number;
  currency: string;
  preview?: string;
  rating: number;
  reviewsCount: number;
  downloads: number;
  isFeatured: boolean;
  isVerified: boolean;
}

interface MarketplaceProps {
  onClose: () => void;
  onSelect?: (item: MarketplaceItem) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onClose, onSelect }) => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'template' | 'plugin' | 'component' | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price' | 'newest'>('popular');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadItems();
    loadCategories();
  }, [selectedType, selectedCategory, sortBy, showFreeOnly, searchQuery]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const response = await api.getMarketplaceItems({
        type: selectedType === 'all' ? undefined : selectedType,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        isFree: showFreeOnly ? true : undefined,
        sortBy,
        limit: 50
      });
      setItems(response.items);
    } catch (error) {
      console.error('Failed to load marketplace items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesList = await api.getMarketplaceCategories();
      setCategories(categoriesList);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handlePurchase = async (item: MarketplaceItem) => {
    try {
      if (item.price === 0) {
        // Бесплатный товар
        await api.purchaseItem('user-1', item.id);
        alert('Товар успешно добавлен в вашу библиотеку!');
      } else {
        // Платный товар - в реальном приложении здесь была бы интеграция с платежной системой
        const confirmed = confirm(`Купить "${item.title}" за ${item.price} ${item.currency}?`);
        if (confirmed) {
          const purchase = await api.purchaseItem('user-1', item.id, {
            paymentMethod: 'demo',
            transactionId: `demo-${Date.now()}`
          });
          await api.confirmPurchase(purchase.id, purchase.transactionId || '');
          alert('Покупка успешно завершена!');
        }
      }
    } catch (error: any) {
      alert(`Ошибка: ${error.message || 'Не удалось совершить покупку'}`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'template':
        return <Layout className="w-5 h-5" />;
      case 'plugin':
        return <Code className="w-5 h-5" />;
      case 'component':
        return <Package className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'template':
        return 'Шаблон';
      case 'plugin':
        return 'Плагин';
      case 'component':
        return 'Компонент';
      default:
        return type;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-7xl h-[90vh] rounded-[40px] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Маркетплейс</h2>
              <p className="text-slate-500 text-sm font-medium">Шаблоны, плагины и компоненты</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/60 rounded-xl transition-all"
            aria-label="Закрыть"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="all">Все типы</option>
              <option value="template">Шаблоны</option>
              <option value="plugin">Плагины</option>
              <option value="component">Компоненты</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="all">Все категории</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="popular">Популярные</option>
              <option value="rating">По рейтингу</option>
              <option value="price">По цене</option>
              <option value="newest">Новинки</option>
            </select>

            {/* Free Only */}
            <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={showFreeOnly}
                onChange={(e) => setShowFreeOnly(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-700">Только бесплатные</span>
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Товары не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-300 transition-all group"
                >
                  {/* Preview */}
                  <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
                    {item.preview ? (
                      <img src={item.preview} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                    )}
                    {item.isFeatured && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">
                        ⭐ Избранное
                      </div>
                    )}
                    {item.isVerified && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 text-white text-xs font-bold rounded backdrop-blur-sm">
                      {getTypeLabel(item.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{item.description}</p>

                    {/* Meta */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-slate-700">{item.rating.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">({item.reviewsCount})</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Download className="w-4 h-4" />
                        <span>{item.downloads}</span>
                      </div>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-2 mb-4">
                      {item.author.avatar && (
                        <img src={item.author.avatar} alt={item.author.name} className="w-6 h-6 rounded-full" />
                      )}
                      <span className="text-xs text-slate-500">{item.author.name}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        {item.price === 0 ? (
                          <span className="text-lg font-black text-green-600">Бесплатно</span>
                        ) : (
                          <>
                            <DollarSign className="w-5 h-5 text-indigo-600" />
                            <span className="text-lg font-black text-slate-900">{item.price}</span>
                            <span className="text-sm text-slate-500">{item.currency}</span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => handlePurchase(item)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
                      >
                        {item.price === 0 ? 'Получить' : 'Купить'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

