import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Plus, Code, Upload, X, Search, Filter, 
  Download, Star, Eye, Edit, Trash2, CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';

interface CustomComponent {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  tags: string[];
  isPublic: boolean;
  downloads: number;
  rating: number;
}

export const CustomComponentsManager: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'my' | 'marketplace'>('my');
  const [myComponents, setMyComponents] = useState<CustomComponent[]>([]);
  const [publicComponents, setPublicComponents] = useState<CustomComponent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadComponents();
  }, [activeTab]);

  const loadComponents = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'my') {
        const components = await api.getMyComponents('user-1');
        setMyComponents(components);
      } else {
        const components = await api.getPublicComponents({ search: searchQuery });
        setPublicComponents(components);
      }
    } catch (error) {
      console.error('Failed to load components:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstall = async (componentId: string) => {
    try {
      await api.installComponent(componentId, 'user-1');
      alert('Component installed successfully');
    } catch (error) {
      console.error('Install error:', error);
      alert('Failed to install component');
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
        className="bg-white w-full max-w-6xl h-[90vh] rounded-[40px] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Custom Components</h2>
              <p className="text-slate-500 text-sm font-medium">Управление пользовательскими компонентами</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/60 rounded-xl transition-all"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 px-6 py-4 font-bold transition-all ${
              activeTab === 'my'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Мои компоненты
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex-1 px-6 py-4 font-bold transition-all ${
              activeTab === 'marketplace'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Маркетплейс
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'my' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Мои компоненты</h3>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Создать компонент
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : myComponents.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium mb-4">У вас пока нет компонентов</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                  >
                    Создать первый компонент
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myComponents.map((component) => (
                    <motion.div
                      key={component.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-indigo-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 mb-1">{component.name}</h4>
                          <p className="text-sm text-slate-500 line-clamp-2">{component.description}</p>
                        </div>
                        <button className="p-2 hover:bg-slate-50 rounded-xl">
                          <Edit className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded">
                          {component.category}
                        </span>
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded">
                          v{component.version}
                        </span>
                        {component.isPublic && (
                          <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Публичный
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {component.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {component.rating}
                          </span>
                        </div>
                        <button className="p-2 hover:bg-red-50 rounded-xl">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      loadComponents();
                    }}
                    placeholder="Поиск компонентов..."
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Фильтры
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : publicComponents.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Компоненты не найдены</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publicComponents.map((component) => (
                    <motion.div
                      key={component.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-indigo-300 transition-all"
                    >
                      <div className="mb-4">
                        <h4 className="font-bold text-slate-900 mb-1">{component.name}</h4>
                        <p className="text-sm text-slate-500 line-clamp-2">{component.description}</p>
                      </div>
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {component.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {component.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {component.rating}
                          </span>
                        </div>
                        <button
                          onClick={() => handleInstall(component.id)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all"
                        >
                          Установить
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

