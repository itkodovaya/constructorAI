import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit3, X, Image as ImageIcon, 
  FileText, Calendar, User, Eye, Save, Send, Clock,
  Volume2, Play, Pause, Headphones
} from 'lucide-react';
import { api } from '../services/api';
import { DAMManager } from './DAMManager';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  status: 'draft' | 'published';
  createdAt: string;
}

export const BlogManager: React.FC<{ projectId: string, onClose: () => void }> = ({ projectId, onClose }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [showDAM, setShowDAM] = useState(false);

  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const handleGenerateAudio = async (postId: string, content: string) => {
    setIsGeneratingAudio(true);
    try {
      const audioUrl = await api.generateSpeech(content.replace(/[#*]/g, ''));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, audioUrl } : p));
      alert('Audio narration generated!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await api.getPosts(projectId);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [projectId]);

  const handleSave = async () => {
    if (!editingPost?.title || !editingPost.content) return;

    const postData = {
      ...editingPost,
      slug: editingPost.slug || editingPost.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      author: editingPost.author || 'Admin'
    };

    try {
      if (editingPost.id) {
        await api.updatePost(editingPost.id, postData);
      } else {
        await api.createPost(projectId, postData);
      }
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.deletePost(id);
      fetchPosts();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Blog Engine</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Articles & Content</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setEditingPost({ title: '', content: '', status: 'draft', image: '', excerpt: '' })} className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-amber-100 hover:bg-amber-600 transition-all">
              <Plus className="w-4 h-4" /> New Article
            </button>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400 font-bold">Loading articles...</div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {posts.map(p => (
                <div key={p.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex gap-8 group hover:border-amber-200 transition-all shadow-sm">
                  <div className="w-40 h-28 bg-white rounded-2xl overflow-hidden border border-slate-100 shrink-0 relative">
                    {p.image ? <img src={p.image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon className="w-10 h-10" /></div>}
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${p.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'}`}>
                      {p.status}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">{p.title}</h3>
                      <p className="text-slate-400 text-xs font-medium line-clamp-2 max-w-2xl">{p.excerpt || 'No excerpt provided.'}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(p.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {p.author}</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingPost(p)} className="p-2.5 bg-white text-slate-400 hover:text-amber-600 rounded-xl shadow-sm border border-slate-100 transition-all"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2.5 bg-white text-slate-400 hover:text-rose-500 rounded-xl shadow-sm border border-slate-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <FileText className="w-16 h-16 text-slate-100 mb-4" />
              <h3 className="text-xl font-black text-slate-900 mb-2">No articles yet</h3>
              <p className="text-slate-400 max-w-xs font-medium">Start writing content to boost your SEO and engage your visitors.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editingPost && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl h-[95vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
                <h3 className="text-2xl font-black text-slate-900">{editingPost.id ? 'Edit Article' : 'New Article'}</h3>
                <div className="flex items-center gap-3">
                  <select 
                    value={editingPost.status} 
                    onChange={(e) => setEditingPost({...editingPost, status: e.target.value as any})}
                    className="p-3 bg-slate-50 rounded-xl text-xs font-black uppercase tracking-widest outline-none border-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  <button onClick={() => setEditingPost(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X className="w-6 h-6 text-slate-400" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <div className="grid grid-cols-3 gap-10">
                  <div className="col-span-2 space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                      <input 
                        className="w-full p-6 bg-slate-50 border-none rounded-[24px] text-xl font-black focus:ring-2 ring-amber-500/20" 
                        value={editingPost.title} 
                        onChange={(e) => setEditingPost({...editingPost, title: e.target.value})} 
                        placeholder="Article Headline..." 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Content (Markdown)</label>
                      <textarea 
                        className="w-full p-6 bg-slate-50 border-none rounded-[32px] text-sm font-medium focus:ring-2 ring-amber-500/20 h-[400px] resize-none custom-scrollbar" 
                        value={editingPost.content} 
                        onChange={(e) => setEditingPost({...editingPost, content: e.target.value})} 
                        placeholder="Start writing your story..." 
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cover Image</label>
                      <button onClick={() => setShowDAM(true)} className="w-full aspect-video bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 overflow-hidden group relative">
                        {editingPost.image ? (
                          <img src={editingPost.image} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-slate-300">
                            <ImageIcon className="w-10 h-10 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black uppercase">Choose Image</span>
                          </div>
                        )}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Excerpt</label>
                      <textarea 
                        className="w-full p-5 bg-slate-50 border-none rounded-[24px] text-xs font-medium focus:ring-2 ring-amber-500/20 h-32 resize-none" 
                        value={editingPost.excerpt} 
                        onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})} 
                        placeholder="Short summary for preview..." 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SEO Slug</label>
                      <input 
                        className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-500" 
                        value={editingPost.slug || ''} 
                        onChange={(e) => setEditingPost({...editingPost, slug: e.target.value})} 
                        placeholder="article-url-slug" 
                      />
                    </div>

                    <div className="pt-6 border-t border-slate-50 space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Headphones className="w-3.5 h-3.5" /> Audio Narration</label>
                      <button 
                        onClick={() => handleGenerateAudio(editingPost.id, editingPost.content)}
                        disabled={isGeneratingAudio || !editingPost.id}
                        className="w-full py-4 bg-amber-50 text-amber-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isGeneratingAudio ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                        {isGeneratingAudio ? 'Generating...' : 'Synthesize Voice'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-50 shrink-0">
                <button onClick={handleSave} className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
                  <Save className="w-5 h-5" /> Save Article
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDAM && (
          <DAMManager onClose={() => setShowDAM(false)} onSelect={(asset) => {
            setEditingPost({...editingPost!, image: asset.url});
            setShowDAM(false);
          }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

