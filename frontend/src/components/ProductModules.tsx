import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThreeDViewer } from './ThreeDViewer';
import { 
  ShoppingBag, Package, Plus, Trash2, 
  Settings, ExternalLink, Image as ImageIcon, 
  DollarSign, Tag, FileText, Sparkles, Box
} from 'lucide-react';

export const ProductManager: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | '3d'>('list');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '' });

  const addProduct = () => {
    const prod = { ...newProduct, id: Date.now().toString() };
    setProducts([...products, prod]);
    setNewProduct({ name: '', price: '', description: '', category: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h3 className="text-xl font-bold text-slate-900">Управление товарами</h3>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('list')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
            >
              Список
            </button>
            <button 
              onClick={() => setActiveTab('3d')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === '3d' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
            >
              3D Витрина
            </button>
          </div>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Добавить товар
        </button>
      </div>

      {activeTab === '3d' ? (
        <div className="space-y-6">
          <ThreeDViewer />
          <div className="grid grid-cols-3 gap-4">
            {['Dynamic Sphere', 'Product Box', 'Custom Model'].map(m => (
              <button key={m} className="p-4 bg-white border border-slate-100 rounded-3xl hover:border-indigo-600 transition-all text-left group">
                <Box className="w-6 h-6 text-slate-300 mb-2 group-hover:text-indigo-600" />
                <div className="text-xs font-bold text-slate-900">{m}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white border border-slate-100 p-4 rounded-3xl flex gap-4 hover:shadow-lg transition-all">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center">
                <Package className="w-10 h-10 text-slate-200" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900">{p.name}</h4>
                  <span className="text-indigo-600 font-black">${p.price}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-50 text-slate-400 rounded-full">{p.category}</span>
                </div>
              </div>
              <button 
                onClick={() => setProducts(products.filter(item => item.id !== p.id))}
                className="text-rose-500 p-2 hover:bg-rose-50 rounded-xl self-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
            <h4 className="text-xl font-bold mb-6">Новый товар</h4>
            <div className="space-y-4">
              <input 
                placeholder="Название" 
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600"
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
              />
              <div className="flex gap-4">
                <input 
                  placeholder="Цена" 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600"
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                />
                <input 
                  placeholder="Категория" 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600"
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                />
              </div>
              <textarea 
                placeholder="Описание" 
                className="w-full h-32 bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600"
                value={newProduct.description}
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
              />
              <button 
                onClick={addProduct}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
              >
                Сохранить
              </button>
              <button onClick={() => setShowAdd(false)} className="w-full text-slate-400 font-bold py-2">Отмена</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export const BlogManager: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWithAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newArt = {
        id: Date.now().toString(),
        title: 'Тренды индустрии 2026',
        excerpt: 'Как искусственный интеллект меняет подход к дизайну...',
        status: 'draft'
      };
      setArticles([newArt, ...articles]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">Блог и статьи</h3>
        <button 
          onClick={generateWithAI}
          disabled={isGenerating}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-50"
        >
          {isGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Sparkles className="w-4 h-4" />}
          AI Генерация статьи
        </button>
      </div>

      <div className="space-y-4">
        {articles.map(art => (
          <div key={art.id} className="bg-white border border-slate-100 p-6 rounded-[32px] hover:shadow-xl hover:shadow-slate-50 transition-all flex items-center justify-between group">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-indigo-200" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{art.title}</h4>
                <p className="text-sm text-slate-400 mt-1">{art.excerpt}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[10px] font-black uppercase px-3 py-1 bg-amber-50 text-amber-600 rounded-full">{art.status}</span>
                  <span className="text-xs text-slate-300 font-medium">Создано только что</span>
                </div>
              </div>
            </div>
            <button className="bg-slate-50 p-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        ))}
        {articles.length === 0 && (
          <div className="text-center p-20 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FileText className="w-8 h-8 text-slate-200" />
            </div>
            <h4 className="font-bold text-slate-400">У вас пока нет статей</h4>
            <p className="text-xs text-slate-400 mt-2">Используйте AI для создания первой публикации</p>
          </div>
        )}
      </div>
    </div>
  );
};
