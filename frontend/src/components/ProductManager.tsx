import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit3, X, Image as ImageIcon, 
  Tag, ShoppingBag, Package, DollarSign, Save
} from 'lucide-react';
import { api } from '../services/api';
import { DAMManager } from './DAMManager';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId?: string;
  isActive: boolean;
}

export const ProductManager: React.FC<{ projectId: string, onClose: () => void }> = ({ projectId, onClose }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [showDAM, setShowDAM] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts(projectId);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [projectId]);

  const handleSave = async () => {
    if (!editingProduct?.name || !editingProduct.price) return;

    try {
      if (editingProduct.id) {
        await api.updateProduct(editingProduct.id, editingProduct);
      } else {
        await api.createProduct(projectId, editingProduct);
      }
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Manager</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Inventory & Pricing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setEditingProduct({ name: '', price: 0, isActive: true, image: '' })} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400 font-bold">Loading products...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map(p => (
                <div key={p.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex gap-6 group hover:border-indigo-200 transition-all shadow-sm">
                  <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                    {p.image ? <img src={p.image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon className="w-8 h-8" /></div>}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-black text-slate-900">{p.name}</h3>
                        <span className="text-indigo-600 font-black">${p.price}</span>
                      </div>
                      <p className="text-slate-400 text-xs font-medium line-clamp-2">{p.description}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingProduct(p)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Package className="w-16 h-16 text-slate-100 mb-4" />
              <h3 className="text-xl font-black text-slate-900 mb-2">No products yet</h3>
              <p className="text-slate-400 max-w-xs font-medium">Add products to your store to display them on your site.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editingProduct && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl p-10 space-y-8 overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">{editingProduct.id ? 'Edit Product' : 'New Product'}</h3>
                <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6 text-slate-400" /></button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</label>
                  <input className="w-full p-5 bg-slate-50 border-none rounded-[24px] text-sm font-bold focus:ring-2 ring-indigo-500/20" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} placeholder="e.g. Premium Sneaker" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price ($)</label>
                    <input className="w-full p-5 bg-slate-50 border-none rounded-[24px] text-sm font-bold focus:ring-2 ring-indigo-500/20" type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image</label>
                    <button onClick={() => setShowDAM(true)} className="w-full p-5 bg-slate-50 rounded-[24px] text-xs font-bold text-slate-500 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors border-2 border-dashed border-slate-200">
                      <ImageIcon className="w-4 h-4" /> {editingProduct.image ? 'Change Image' : 'Choose Image'}
                    </button>
                  </div>
                </div>

                {editingProduct.image && (
                  <div className="relative aspect-video rounded-[32px] overflow-hidden group">
                    <img src={editingProduct.image} className="w-full h-full object-cover" alt="" />
                    <button onClick={() => setEditingProduct({...editingProduct, image: ''})} className="absolute top-4 right-4 p-2 bg-white/90 rounded-xl text-rose-500 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                  <textarea className="w-full p-5 bg-slate-50 border-none rounded-[24px] text-sm font-bold focus:ring-2 ring-indigo-500/20 h-32 resize-none" value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} placeholder="Describe your product..." />
                </div>
              </div>

              <button onClick={handleSave} className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                <Save className="w-5 h-5" /> Save Product
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDAM && (
          <DAMManager onClose={() => setShowDAM(false)} onSelect={(asset) => {
            setEditingProduct({...editingProduct!, image: asset.url});
            setShowDAM(false);
          }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

