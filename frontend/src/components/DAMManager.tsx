import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Image as ImageIcon, FileText, Video, Music, Search, 
  Upload, Filter, Tag, Trash2, Download, MoreVertical,
  FolderOpen, Grid, List, CheckCircle2, Clock, HardDrive
} from 'lucide-react';
import { api } from '../services/api';

interface Asset {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  category: string;
  tags: string[];
  createdAt: string;
}

interface DAMManagerProps {
  onClose: () => void;
  onSelect?: (asset: Asset) => void;
}

export const DAMManager: React.FC<DAMManagerProps> = ({ onClose, onSelect }) => {
  const { t } = useTranslation();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchAssets();
    fetchStats();
  }, [activeTab, searchQuery]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await api.getAssets({ 
        type: activeTab === 'all' ? undefined : activeTab,
        q: searchQuery 
      });
      setAssets(data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.getDamStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch DAM stats:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await api.uploadAsset(formData);
      fetchAssets();
      fetchStats();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{t('dam.title', 'Медиатека (DAM)')}</h2>
              <p className="text-slate-500 text-sm font-medium">{t('dam.subtitle', 'Управление всеми активами вашего бренда')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-100">
              <Upload className="w-5 h-5" />
              {t('common.upload', 'Загрузить')}
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
              <MoreVertical className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 border-r border-slate-100 p-6 space-y-8 overflow-y-auto">
            <nav className="space-y-1">
              <SidebarItem 
                icon={<ImageIcon className="w-5 h-5" />} 
                label={t('dam.all', 'Все файлы')} 
                active={activeTab === 'all'} 
                onClick={() => setActiveTab('all')} 
              />
              <SidebarItem 
                icon={<ImageIcon className="w-5 h-5" />} 
                label={t('dam.images', 'Изображения')} 
                active={activeTab === 'image'} 
                onClick={() => setActiveTab('image')} 
              />
              <SidebarItem 
                icon={<Video className="w-5 h-5" />} 
                label={t('dam.videos', 'Видео')} 
                active={activeTab === 'video'} 
                onClick={() => setActiveTab('video')} 
              />
              <SidebarItem 
                icon={<FileText className="w-5 h-5" />} 
                label={t('dam.docs', 'Документы')} 
                active={activeTab === 'document'} 
                onClick={() => setActiveTab('document')} 
              />
            </nav>

            {stats && (
              <div className="bg-slate-50 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>{t('dam.storage', 'Хранилище')}</span>
                  <HardDrive className="w-4 h-4" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500" 
                      style={{ width: `${(stats.totalSize / (1024 * 1024 * 1024)) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {formatSize(stats.totalSize)} из 1 GB использовано
                  </p>
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col bg-white">
            {/* Toolbar */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('dam.search', 'Поиск по файлам и тегам...')}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600" />
                </div>
              ) : assets.length > 0 ? (
                <div className={viewMode === 'grid' ? "grid grid-cols-4 gap-6" : "space-y-3"}>
                  {assets.map((asset) => (
                    <AssetCard 
                      key={asset.id} 
                      asset={asset} 
                      mode={viewMode} 
                      onSelect={onSelect}
                      onDelete={() => {
                        api.deleteAsset(asset.id).then(fetchAssets);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <ImageIcon className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t('dam.empty', 'Файлов пока нет')}</h3>
                  <p className="text-slate-500 max-w-xs">{t('dam.emptyDesc', 'Загрузите изображения, видео или документы в вашу медиатеку')}</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
      active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
    }`}
  >
    {icon}
    {label}
  </button>
);

const AssetCard = ({ asset, mode, onSelect, onDelete }: any) => {
  const isImage = asset.type === 'image';
  
  if (mode === 'list') {
    return (
      <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all group">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100">
            {isImage ? (
              <img src={asset.url} className="w-full h-full object-cover" />
            ) : (
              <FileText className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 line-clamp-1">{asset.name}</h4>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{asset.type} • 2.4 MB</p>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all"><Download className="w-5 h-5" /></button>
          <button onClick={onDelete} className="p-2 text-slate-400 hover:text-rose-600 transition-all"><Trash2 className="w-5 h-5" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all">
      <div className="aspect-square bg-slate-50 relative">
        {isImage ? (
          <img src={asset.url} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-slate-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
          <button onClick={() => onSelect?.(asset)} className="bg-white text-slate-900 p-3 rounded-xl hover:scale-110 transition-all shadow-xl font-bold text-xs uppercase tracking-wider">{onSelect ? 'Выбрать' : 'Просмотр'}</button>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">{asset.name}</h4>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{asset.type}</span>
          <button onClick={onDelete} className="p-1 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

