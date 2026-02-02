import React, { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { 
  Plus, Settings, Save, Smartphone, Tablet, Monitor, 
  Trash2, ChevronUp, ChevronDown, Edit3, X, Eye, Code,
  Globe, Search, Share2, Image as ImageIcon, Languages, Sparkles,
  ChevronLeft, ChevronRight, Palette, Check, MessageSquare,
  BarChart3, Shield, Zap, Heart, Star, Layout, Box, HelpCircle,
  Type, Menu, User, Clock, Mic, Video as VideoIcon, Bookmark, ShoppingBag, FileText, RefreshCw,
  Calendar, ArrowRight, TrendingUp
} from 'lucide-react';

import { api } from '../services/api';
import { PreviewModal } from './PreviewModal';
import { DAMManager } from './DAMManager';
import { ProductManager } from './ProductManager';
import { BlogManager } from './BlogManager';
import { SocialFactory } from './SocialFactory';
import { TemplateHub } from './TemplateHub';
import { IntegrationHub } from './IntegrationHub';
import { VoiceCommander } from './VoiceCommander';
import { getRealtimeSyncClient } from '../services/realtimeSync';
import type { Presence } from '../services/realtimeSync';
import { ParallaxHero } from './AdvancedBlocks/ParallaxHero';
import { VideoBackgroundHero } from './AdvancedBlocks/VideoBackgroundHero';
import { ParticleEffects } from './AdvancedBlocks/ParticleEffects';
import { InteractiveTimeline } from './AdvancedBlocks/InteractiveTimeline';
import { ScrollAnimations } from './AdvancedBlocks/ScrollAnimations';
import { CountdownTimer } from './AdvancedBlocks/CountdownTimer';
import { ProductShowcase } from './AdvancedBlocks/ProductShowcase';
import { PricingCalculator } from './AdvancedBlocks/PricingCalculator';
import { BookingSystem } from './AdvancedBlocks/BookingSystem';
import { LiveChatWidget } from './AdvancedBlocks/LiveChatWidget';
import { SocialProof } from './AdvancedBlocks/SocialProof';
import { ProgressTracker } from './AdvancedBlocks/ProgressTracker';
import { ImageGallery } from './AdvancedBlocks/ImageGallery';
import { BeforeAfterSlider } from './AdvancedBlocks/BeforeAfterSlider';
import { ThreeDShowcase } from './AdvancedBlocks/ThreeDShowcase';
import { InteractiveMap } from './AdvancedBlocks/InteractiveMap';
import { FormBuilder } from './AdvancedBlocks/FormBuilder';
import { ChartBuilder } from './AdvancedBlocks/ChartBuilder';
import { ShoppingCartBlock } from './AdvancedBlocks/ShoppingCart';
import { RealTimeCursors } from './Collaboration/RealTimeCursors';
import { ChangeTracker } from './Collaboration/ChangeTracker';
import { CommentsSystem } from './Collaboration/CommentsSystem';
import { ApprovalWorkflow } from './Collaboration/ApprovalWorkflow';
import { ADVANCED_BLOCK_TYPES, BUSINESS_BLOCK_TYPES, MEDIA_BLOCK_TYPES } from '../utils/blockTypes';
import { ParallaxHeroEditor } from './BlockEditors/ParallaxHeroEditor';
import { VideoHeroEditor } from './BlockEditors/VideoHeroEditor';
import { ParticleEffectsEditor } from './BlockEditors/ParticleEffectsEditor';
import { TimelineEditor } from './BlockEditors/TimelineEditor';
import { ProductShowcaseEditor } from './BlockEditors/ProductShowcaseEditor';
import { PricingCalculatorEditor } from './BlockEditors/PricingCalculatorEditor';
import { BookingSystemEditor } from './BlockEditors/BookingSystemEditor';
import { ImageGalleryEditor } from './BlockEditors/ImageGalleryEditor';
import { ContentEditable } from './ContentEditable';
import { StyleInspector } from './StyleInspector';
import { GridOverlay } from './GridOverlay';
import { VirtualScroll } from '../utils/virtual-scroll';
import { LazyLoader } from '../utils/lazy-loader';
import { DragPreview, DropZone } from './DragDropEnhancements';
import { MobileEditor } from './MobileEditor';

interface Block {
  id: string;
  type: string;
  content: any;
}

interface SiteBuilderProps {
  brandName: string;
  assets: any;
  onClose: () => void;
  seo?: any;
  onUpdateSEO?: (seo: any) => void;
  projectId?: string;
  onPreview?: () => void;
}

// Icon Map for Features
const ICON_MAP: Record<string, any> = {
  Zap, Shield, Heart, Star, Layout, Box, Sparkles, BarChart3, MessageSquare, Globe
};

interface Page {
  id: string;
  title: string;
  blocks: Block[];
}

export const SiteBuilder: React.FC<SiteBuilderProps> = ({ brandName, assets: initialAssets, onClose, seo: initialSEO, onUpdateSEO, projectId, onPreview }) => {
  const profileId = projectId;
  const [pages, setPages] = useState<Page[]>([
    { id: '1', title: 'Главная', blocks: [] }
  ]);
  const [activePageId, setActivePageId] = useState<string>('1');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [showSEOSettings, setShowSEOSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'blocks' | 'styles' | 'ai' | 'conversion'>('blocks');
  const [assets, setAssets] = useState({
    ...initialAssets,
    conversion: initialAssets?.conversion || {
      popup: { enabled: false, title: 'Wait!', text: 'Before you go, check out our special offer!' },
      fab: { enabled: false, type: 'WhatsApp', value: '' }
    }
  });
  const [showProductManager, setShowProductManager] = useState(false);
  const [showBlogManager, setShowBlogManager] = useState(false);
  const [showSocialFactory, setShowSocialFactory] = useState(false);
  const [showTemplateHub, setShowTemplateHub] = useState(false);
  const [showIntegrationHub, setShowIntegrationHub] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<Presence[]>([]);
  const [lockedBlocks, setLockedBlocks] = useState<Record<string, string>>({}); // blockId -> userId
  const [activityLog, setActivityLog] = useState<{id: string, user: string, action: string, time: Date}[]>([]);
  const [comments, setComments] = useState<Array<{id: string, userId: string, userName: string, text: string, timestamp: Date, blockId: string}>>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [synthesisPrompt, setSynthesisPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  const [seoData, setSeoData] = useState(initialSEO || {
    title: brandName,
    description: 'Создано в Constructor AI',
    keywords: 'ai, web, design',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    lang: 'ru'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDAMSelector, setShowDAMSelector] = useState<{ blockId: string, field: string, index?: number } | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [blockStyles, setBlockStyles] = useState<Record<string, Record<string, string>>>({});
  const [dragState, setDragState] = useState<{ isDragging: boolean; blockType: string; blockName: string; x: number; y: number } | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<{ blockId: string; position: 'top' | 'bottom' | 'inside' } | null>(null);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set());
  const [cursors, setCursors] = useState<any[]>([]);
  const [changes, setChanges] = useState<any[]>([]);
  const [approvalRequests, setApprovalRequests] = useState<any[]>([]);
  const [showMobileEditor, setShowMobileEditor] = useState(false);

  // Helper to safely render text from potential objects
  const renderText = (value: any, fallback = '') => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (value && typeof value === 'object') {
      return value.title || value.text || value.name || value.content || fallback;
    }
    return fallback;
  };

  const renderEditableText = (
    blockId: string,
    field: string,
    value: any,
    fallback: string = '',
    tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' = 'p',
    className: string = ''
  ) => {
    const textValue = renderText(value, fallback);
    return (
      <ContentEditable
        value={textValue}
        onChange={(newValue) => updateBlockContent(blockId, { [field]: newValue })}
        tag={tag}
        className={className}
        disabled={editingBlock !== null}
      />
    );
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Delete' && editingBlock) {
        deleteBlock(editingBlock);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingBlock]);

  // Load project
  useEffect(() => {
    const loadProject = async () => {
      if (!profileId) {
        const defaultBlocks: Block[] = [
          {
            id: 'header-1',
            type: 'header',
            content: { links: ['Главная', 'О нас', 'Контакты'], logo: brandName }
          },
          {
            id: 'hero-1',
            type: 'hero',
            content: { title: `Добро пожаловать в ${brandName}`, subtitle: 'Ваш слоган здесь', padding: 'py-20' }
          },
          {
            id: 'features-1',
            type: 'features',
            content: { title: 'Наши возможности', items: [
              { title: 'Быстро', description: 'Молниеносная скорость.', icon: 'Zap' },
              { title: 'Безопасно', description: 'Ваши данные в безопасности.', icon: 'Shield' },
              { title: 'Надёжно', description: 'Всегда рядом, когда нужно.', icon: 'Star' }
            ], padding: 'py-20' }
          },
          {
            id: 'footer-1',
            type: 'footer',
            content: { text: `© 2026 ${brandName}`, padding: 'py-10' }
          }
        ];
        setPages([{ id: '1', title: 'Главная', blocks: defaultBlocks }]);
        setBlocks(defaultBlocks);
        setIsLoading(false);
        return;
      }

      try {
        const project = await api.getProject(profileId);
        if (project.brandAssets) setAssets(project.brandAssets);
        // Fetch products
        const productsData = await api.getProducts(profileId);
        setProducts(productsData.products || []);

        // Fetch posts
        const postsData = await api.getPosts(profileId);
        setPosts(postsData.posts || []);

        if (project.pages && project.pages.length > 0) {
          setPages(project.pages);
          const homePage = project.pages.find((p: any) => p.id === activePageId) || project.pages[0];
          setActivePageId(homePage.id);
          setBlocks(homePage.blocks);
        } else {
          const defaultBlocks: Block[] = [
            {
              id: 'header-1',
              type: 'header',
              content: { links: ['Главная', 'О нас', 'Контакты'], logo: brandName }
            },
            {
              id: 'hero-1',
              type: 'hero',
              content: { title: `Добро пожаловать в ${brandName}`, subtitle: 'Ваш слоган здесь', padding: 'py-20' }
            }
          ];
          const initialPages = [{ id: '1', title: 'Главная', blocks: defaultBlocks }];
          setPages(initialPages);
          setBlocks(defaultBlocks);
        }
      } catch (error) {
        console.error('Failed to load project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [profileId, brandName]);

  // Realtime Sync
  useEffect(() => {
    if (!profileId) return;
    const client = getRealtimeSyncClient();
    const currentUserId = localStorage.getItem('userId') || `user-${Math.random().toString(36).substr(2, 9)}`;
    const currentUserName = localStorage.getItem('userName') || 'Designer';
    
    client.connect(profileId, currentUserId, currentUserName);

    client.on('presence_update', (msg: any) => {
      setActiveUsers(msg.presence || []);
    });

    client.on('lock', (msg: any) => {
      setLockedBlocks(prev => ({ ...prev, [msg.data.elementId]: msg.userId }));
      setActivityLog(prev => [{
        id: Date.now().toString(),
        user: msg.userName || 'Кто-то',
        action: `started editing block ${msg.data.elementId}`,
        time: new Date()
      }, ...prev].slice(0, 50));
    });

    client.on('unlock', (msg: any) => {
      setLockedBlocks(prev => {
        const next = { ...prev };
        delete next[msg.data.elementId];
        return next;
      });
    });

    client.on('edit', (msg: any) => {
      // Local sync if another user edited
      if (msg.userId !== currentUserId) {
        // In a real app we'd merge changes, here we'll just log it
        setActivityLog(prev => [{
          id: Date.now().toString(),
          user: msg.userName || 'Кто-то',
          action: `updated block ${msg.data.elementId}`,
          time: new Date()
        }, ...prev].slice(0, 50));
      }
    });

    // Periodic presence update
    const interval = setInterval(() => {
      client.updatePresence();
    }, 5000);

    return () => {
      client.disconnect();
      clearInterval(interval);
    };
  }, [profileId]);

  // Sync blocks to current page
  useEffect(() => {
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, blocks } : p));
  }, [blocks, activePageId]);

  const handlePageSwitch = (pageId: string) => {
    // First save current blocks to pages state (already handled by useEffect, but let's be explicit)
    const updatedPages = pages.map(p => p.id === activePageId ? { ...p, blocks } : p);
    setPages(updatedPages);
    
    const targetPage = updatedPages.find(p => p.id === pageId);
    if (targetPage) {
      setActivePageId(pageId);
      setBlocks(targetPage.blocks);
    }
  };

  const addNewPage = () => {
    const newPageId = Date.now().toString();
    const newPage: Page = {
      id: newPageId,
      title: 'Новая страница',
      blocks: [
        { id: `header-${newPageId}`, type: 'header', content: { links: pages.map(p => p.title), logo: brandName } },
        { id: `hero-${newPageId}`, type: 'hero', content: { title: 'Новая страница', subtitle: 'Опишите вашу страницу здесь', padding: 'py-20' } },
        { id: `footer-${newPageId}`, type: 'footer', content: { text: `© 2026 ${brandName}`, padding: 'py-10' } }
      ]
    };
    setPages([...pages, newPage]);
    handlePageSwitch(newPageId);
  };

  const deletePage = (pageId: string) => {
    if (pages.length <= 1) return;
    const newPages = pages.filter(p => p.id !== pageId);
    setPages(newPages);
    if (activePageId === pageId) {
      handlePageSwitch(newPages[0].id);
    }
  };

  const handleTranslate = async () => {
    if (!profileId) return;
    setIsGenerating(true);
    try {
      const data = await api.translateProject(profileId, 'en');
      setPages(data.pages || []);
      const current = data.pages.find((p: any) => p.id === activePageId) || data.pages[0];
      setBlocks(current.blocks);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMagicGenerate = async () => {
    if (!profileId) return;
    setIsGenerating(true);
    try {
      const updatedProject = await api.generateFullContent(profileId);
      if (updatedProject.pages) {
        setPages(updatedProject.pages);
        const current = updatedProject.pages.find((p: any) => p.id === activePageId) || updatedProject.pages[0];
        setBlocks(current.blocks);
        alert('AI переписал все страницы сайта!');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Ошибка при генерации контента.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBlockRewrite = async (blockId: string, blockType: string) => {
    if (!profileId) return;
    setIsGenerating(true);
    try {
      const result = await api.generateBlockContent(profileId, blockType);
      if (result.content) {
        const updatedBlocks = blocks.map(b => b.id === blockId ? { ...b, content: { ...b.content, ...result.content } } : b);
        setBlocks(updatedBlocks);
        saveBlocks(updatedBlocks);
      }
    } catch (error) {
      console.error('Block rewrite failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSEO = () => {
    if (onUpdateSEO) onUpdateSEO(seoData);
    setShowSEOSettings(false);
  };

  const deleteBlock = (id: string) => {
    const updatedBlocks = blocks.filter(b => b.id !== id);
    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);
  };

  const updateBlockContent = (id: string, newContent: any) => {
    const updatedBlocks = blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...newContent } } : b);
    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);
  };

  const saveBlocks = async (blocksToSave: Block[] = blocks) => {
    if (!profileId) return;
    try {
      const updatedPages = pages.map(p => p.id === activePageId ? { ...p, blocks: blocksToSave } : p);
      await api.updateProject(profileId, {
        pages: updatedPages,
        brandAssets: assets
      });
    } catch (error) {
      console.error('Failed to save blocks:', error);
    }
  };

  const handleSave = async () => {
    if (!profileId) return;
    try {
      await saveBlocks();
      alert('Изменения сохранены!');
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleExport = async () => {
    if (!profileId) return;
    try {
      await api.exportProject(profileId);
      alert('Сайт успешно экспортирован!');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  useEffect(() => {
    if (editingBlock) {
      getRealtimeSyncClient().lockElement(editingBlock);
    } else {
      // Need to find which block was previously edited to unlock it
      // For simplicity, we'll unlock everything when modal closes, or handle it via a ref
    }
  }, [editingBlock]);

  const closeEditModal = () => {
    if (editingBlock) {
      getRealtimeSyncClient().unlockElement(editingBlock);
    }
    setEditingBlock(null);
  };

  const renderBlockContent = (block: Block, isLockedByOther: boolean) => {
    return (
      <>
        <CommentsSystem
          blockId={block.id}
          comments={comments}
          onAddComment={(text) => {
            const newComment = {
              id: Date.now().toString(),
              userId: localStorage.getItem('userId') || 'current-user',
              userName: localStorage.getItem('userName') || 'User',
              text,
              timestamp: new Date(),
              blockId: block.id,
            };
            setComments(prev => [...prev, newComment]);
          }}
          onDeleteComment={(commentId) => {
            setComments(prev => prev.filter(c => c.id !== commentId));
          }}
        />
        {activeDropZone?.blockId === block.id && (
          <DropZone
            isActive={true}
            position={activeDropZone.position}
            onDrop={() => {}}
          />
        )}
        <motion.div
          style={{ 
            ...(blockStyles[block.id] || {}),
            backgroundColor: block.content.bgColor || 'transparent', 
            textAlign: (block.content.align || 'center') as any, 
            fontFamily: assets.fonts?.[0] 
          }}
          initial={block.content.motion?.type === 'fade-up' ? { opacity: 0, y: 20 } : block.content.motion?.type === 'fade-in' ? { opacity: 0 } : block.content.motion?.type === 'zoom-in' ? { opacity: 0, scale: 0.95 } : false}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: block.content.motion?.duration || 0.5 }}
          className={`relative border-b border-transparent hover:border-blue-400/50 transition-colors ${editingBlock === block.id ? 'border-blue-500 ring-4 ring-blue-500/5' : ''} ${block.content.padding || (block.type === 'header' ? 'py-4' : 'py-20')} px-16 ${isLockedByOther ? 'pointer-events-none opacity-50 grayscale select-none' : ''}`}
        >
          {isLockedByOther && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/5 backdrop-blur-[2px]">
              <div className="px-4 py-2 bg-white rounded-full shadow-2xl border border-slate-100 flex items-center gap-2 animate-bounce">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  {activeUsers.find(u => u.userId === lockedBlocks[block.id])?.userName || 'Кто-то'} редактирует...
                </span>
              </div>
            </div>
          )}

          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button 
              onClick={async () => {
                if (!profileId) return;
                try {
                  await api.autoEvolve(profileId, block.id, block.type);
                  alert('AI запустил автономный A/B тест для этого блока!');
                } catch (err) { console.error(err); }
              }}
              className="p-2.5 bg-white shadow-xl border border-slate-100 rounded-xl text-emerald-500 hover:text-emerald-600 transition-all hover:scale-110"
              title="Авто-эволюция (A/B тест)"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button 
              onClick={async () => {
                const name = prompt('Введите название блока для шаблонов:');
                if (!name) return;
                try {
                  await api.saveTemplate({
                    projectId: profileId,
                    name,
                    type: 'block',
                    category: block.type,
                    content: { type: block.type, content: block.content }
                  });
                  alert('Блок сохранён в шаблоны!');
                } catch (err) {
                  console.error(err);
                }
              }}
              className="p-2.5 bg-white shadow-xl border border-slate-100 rounded-xl text-indigo-500 hover:text-indigo-600 transition-all hover:scale-110"
              title="Сохранить как шаблон"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleBlockRewrite(block.id, block.type)}
              disabled={isGenerating}
              className="p-2.5 bg-white shadow-xl border border-slate-100 rounded-xl text-amber-500 hover:text-amber-600 disabled:opacity-50 transition-all hover:scale-110"
              title="AI переписать"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
            </button>
            <button onClick={() => setEditingBlock(block.id === editingBlock ? null : block.id)} className="p-2.5 bg-white shadow-xl border border-slate-100 rounded-xl text-slate-600 hover:text-blue-600 transition-all hover:scale-110"><Edit3 className="w-4 h-4" /></button>
            <button onClick={() => deleteBlock(block.id)} className="p-2.5 bg-white shadow-xl border border-slate-100 rounded-xl text-slate-600 hover:text-red-500 transition-all hover:scale-110"><Trash2 className="w-4 h-4" /></button>
          </div>

          {block.type === 'header' && (
            <div className="flex items-center justify-between w-full">
              <div className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white"><Box className="w-4 h-4" /></div>
                {renderText(block.content.logo, brandName)}
              </div>
              <div className="hidden md:flex items-center gap-8 font-black text-[10px] uppercase tracking-widest text-slate-400">
                {pages.map((page) => (
                  <button key={page.id} onClick={() => handlePageSwitch(page.id)} className={`hover:text-slate-900 transition-colors ${activePageId === page.id ? 'text-slate-900' : ''}`}>{page.title}</button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <Search className="w-4 h-4 text-slate-400" />
                <User className="w-4 h-4 text-slate-400" />
                <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-slate-200 transition-transform active:scale-95">Начать</button>
              </div>
            </div>
          )}

          {block.type === 'hero' && (
            <div className="max-w-3xl mx-auto text-center space-y-8">
              {renderEditableText(block.id, 'title', block.content.title, `Добро пожаловать в ${brandName}`, 'h1', 'text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]')}
              {renderEditableText(block.id, 'subtitle', block.content.subtitle, 'Ваш слоган здесь', 'p', 'text-xl text-slate-500 font-medium max-w-2xl mx-auto')}
              <div className="flex items-center justify-center gap-4 pt-4">
                <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all">Начать сейчас</button>
                <button className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black hover:bg-slate-50 transition-all">Узнать больше</button>
              </div>
            </div>
          )}

          {block.type === 'features' && (
            <div className="space-y-16">
              <div className="text-center space-y-4">
                {renderEditableText(block.id, 'title', block.content.title, 'Наши возможности', 'h2', 'text-4xl font-black text-slate-900')}
                <p className="text-slate-500 font-medium">Узнайте, что делает нас уникальными</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(block.content.items || []).map((item: any, i: number) => {
                  const Icon = ICON_MAP[item.icon] || Zap;
                  return (
                    <div key={i} className="p-10 bg-slate-50 rounded-[40px] hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all group/card border border-transparent hover:border-slate-100">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-slate-200 group-hover/card:scale-110 group-hover/card:bg-blue-600 group-hover/card:text-white transition-all">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-4">{renderText(item.title, 'Возможность')}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">{renderText(item.description, 'Описание здесь')}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {block.type === 'about' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                {renderEditableText(block.id, 'title', block.content.title, 'О нас', 'h2', 'text-4xl font-black text-slate-900')}
                {renderEditableText(block.id, 'text', block.content.text, 'Мы команда увлечённых людей, посвятивших себя созданию удивительных впечатлений.', 'p', 'text-lg text-slate-500 font-medium leading-relaxed')}
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div>
                    <div className="text-4xl font-black text-blue-600 mb-2">10k+</div>
                    <div className="text-sm font-black text-slate-400 uppercase tracking-widest">Пользователей</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-blue-600 mb-2">99%</div>
                    <div className="text-sm font-black text-slate-400 uppercase tracking-widest">Удовлетворённость</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-slate-100 rounded-[60px] overflow-hidden">
                  <img src={block.content.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover" alt="About" />
                </div>
                <div className="absolute -bottom-8 -left-8 p-8 bg-white rounded-3xl shadow-2xl border border-slate-50 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Check className="w-6 h-6" /></div>
                    <div>
                      <div className="font-black text-slate-900">Проверено</div>
                      <div className="text-xs font-bold text-slate-400">Лидер отрасли</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {block.type === 'pricing' && (
            <div className="space-y-16">
              <div className="text-center space-y-4">
                {renderEditableText(block.id, 'title', block.content.title, 'Простое ценообразование', 'h2', 'text-4xl font-black text-slate-900')}
                <p className="text-slate-500 font-medium">Выберите план, который подходит вам</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(block.content.plans || [
                  { name: 'Базовый', price: '0₽', features: ['Возможность 1', 'Возможность 2'] },
                  { name: 'Про', price: '2900₽', features: ['Все из Базового', 'Возможность 3', 'Возможность 4'], popular: true },
                  { name: 'Корпоративный', price: 'Индивидуально', features: ['Все из Про', 'Возможность 5', 'Поддержка 24/7'] }
                ]).map((plan: any, i: number) => (
                  <div key={i} className={`p-10 rounded-[48px] border-2 transition-all ${plan.popular ? 'border-blue-600 bg-white shadow-2xl shadow-blue-100 scale-105 z-10' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200'}`}>
                    {plan.popular && <div className="inline-block px-4 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">Популярный</div>}
                    <h3 className="text-xl font-black text-slate-900 mb-2">{plan.name}</h3>
                    <div className="text-4xl font-black text-slate-900 mb-8">{plan.price}<span className="text-sm text-slate-400 font-bold">/мес</span></div>
                    <div className="space-y-4 mb-10">
                      {plan.features.map((f: string, fi: number) => (
                        <div key={fi} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                          <Check className="w-4 h-4 text-emerald-500" /> {f}
                        </div>
                      ))}
                    </div>
                    <button className={`w-full py-4 rounded-2xl font-black transition-all ${plan.popular ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50'}`}>Начать</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {block.type === 'faq' && (
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                {renderEditableText(block.id, 'title', block.content.title, 'Частые вопросы', 'h2', 'text-4xl font-black text-slate-900')}
                <p className="text-slate-500 font-medium">Всё что нужно знать</p>
              </div>
              <div className="space-y-4">
                {(block.content.items || [
                  { q: 'Как это работает?', a: 'Наша платформа использует продвинутый AI для автоматизации вашего рабочего процесса.' },
                  { q: 'Есть ли бесплатный пробный период?', a: 'Да, вы можете начать с 14-дневного бесплатного пробного периода, без кредитной карты.' },
                  { q: 'Могу ли я отменить в любое время?', a: 'Абсолютно. Вы можете отменить подписку в любое время в настройках.' }
                ]).map((faq: any, i: number) => (
                  <div key={i} className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100">
                    <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full p-8 flex items-center justify-between hover:bg-white transition-all">
                      <span className="text-lg font-black text-slate-900 text-left">{renderText(faq.question || faq.q, 'Вопрос здесь...')}</span>
                      <div className={`p-2 rounded-xl transition-all ${activeFaq === i ? 'bg-blue-600 text-white rotate-180' : 'bg-white text-slate-400'}`}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </button>
                    <AnimatePresence>
                      {activeFaq === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="p-8 pt-0 text-slate-500 font-medium leading-relaxed border-t border-slate-50 mt-2">
                            {renderText(faq.answer || faq.a, 'Ответ здесь...')}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          )}

          {block.type === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-8">
                {renderEditableText(block.id, 'title', block.content.title, 'Связаться с нами', 'h2', 'text-4xl font-black text-slate-900')}
                <p className="text-lg text-slate-500 font-medium leading-relaxed">Есть вопросы? Мы будем рады услышать от вас. Отправьте нам сообщение, и мы ответим как можно скорее.</p>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><MessageSquare className="w-6 h-6" /></div>
                    <div>
                      <div className="text-sm font-black text-slate-400 uppercase tracking-widest">Напишите нам</div>
                      <div className="font-black text-slate-900">hello@example.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><Smartphone className="w-6 h-6" /></div>
                    <div>
                      <div className="text-sm font-black text-slate-400 uppercase tracking-widest">Позвоните нам</div>
                      <div className="font-black text-slate-900">+7 (999) 000-00-00</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-10 bg-white rounded-[48px] shadow-2xl shadow-slate-200 border border-slate-100 space-y-6">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Имя</label><input className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" placeholder="Ваше имя" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label><input className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" placeholder="your@email.com" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Сообщение</label><textarea className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold h-32 resize-none" placeholder="Чем мы можем помочь?" /></div>
                <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all">Отправить сообщение</button>
              </div>
            </div>
          )}

          {block.type === 'footer' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="h-px bg-slate-100 w-full" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-sm font-bold tracking-tight">
                <div className="flex items-center gap-3"><div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white"><Box className="w-4 h-4" /></div> {brandName}</div>
                <div>{renderText(block.content.text, `© 2026 ${brandName}. Все права защищены.`)}</div>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-blue-600 transition-colors">Конфиденциальность</a>
                  <a href="#" className="hover:text-blue-600 transition-colors">Условия</a>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {editingBlock === block.id && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md z-30 p-12 flex flex-col items-center justify-center">
              <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-slate-100 w-full max-w-xl max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col">
                <div className="flex items-center justify-between mb-10 shrink-0">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Настройки блока</div>
                    <h4 className="text-2xl font-black text-slate-900 capitalize">{block.type}</h4>
                  </div>
                  <button onClick={closeEditModal} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"><X className="w-6 h-6 text-slate-400" /></button>
                </div>
                
                <div className="space-y-8 flex-1">
                  {/* Advanced Block Editors */}
                  {block.type === 'parallax-hero' && (
                    <ParallaxHeroEditor
                      content={block.content}
                      onUpdate={(content) => updateBlockContent(block.id, content)}
                    />
                  )}
                  
                  {block.type === 'video-hero' && (
                    <VideoHeroEditor
                      content={block.content}
                      onUpdate={(content) => updateBlockContent(block.id, content)}
                    />
                  )}
                  
                  {block.type === 'particle-effects' && (
                    <ParticleEffectsEditor
                      content={block.content}
                      onUpdate={(content) => updateBlockContent(block.id, content)}
                    />
                  )}
                  
                  {block.type === 'interactive-timeline' && (
                    <TimelineEditor
                      content={block.content}
                      onUpdate={(content) => updateBlockContent(block.id, content)}
                    />
                  )}
                  
                  {block.type === 'product-showcase' && (
                    <ProductShowcaseEditor
                      content={block.content}
                      onUpdate={(content) => updateBlockContent(block.id, content)}
                    />
                  )}
                  
                  {block.type === 'pricing-calculator' && (
                    <PricingCalculatorEditor
                      content={block.content}
                      onUpdate={(content) => updateBlockContent(block.id, content)}
                    />
                  )}
                  
                  {block.type === 'booking-system' && (
                    <BookingSystemEditor
                      content={block.content}
                      onUpdate={(content) => updateBlockContent(block.id, content)}
                    />
                  )}
                  
                  {block.type === 'image-gallery' && (
                    <ImageGalleryEditor
                      content={block.content}
                      onUpdate={(content) => updateBlockContent(block.id, content)}
                    />
                  )}
                  
                  {/* Basic Content Controls */}
                  {!['parallax-hero', 'video-hero', 'particle-effects', 'interactive-timeline', 'product-showcase', 'pricing-calculator', 'booking-system', 'image-gallery'].includes(block.type) && (
                  <div className="space-y-6">
                    {block.type === 'header' && (
                      <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Текст логотипа</label>
                        <input className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" value={block.content.logo} onChange={(e) => updateBlockContent(block.id, { logo: e.target.value })} />
                      </div>
                    )}
                    {block.type === 'hero' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Заголовок</label>
                          <input className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" value={block.content.title} onChange={(e) => updateBlockContent(block.id, { title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Подзаголовок</label>
                          <textarea className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold h-32 resize-none" value={block.content.subtitle} onChange={(e) => updateBlockContent(block.id, { subtitle: e.target.value })} />
                        </div>
                      </div>
                    )}
                  </div>
                  )}

                  <div className="space-y-8 pt-10 border-t border-slate-100">
                    <StyleInspector 
                      blockId={block.id}
                      blockType={block.type}
                      currentStyles={blockStyles[block.id] || {}}
                      onUpdate={(newStyles) => setBlockStyles(prev => ({ ...prev, [block.id]: newStyles }))}
                    />
                    
                    <div className="space-y-6">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Макет и стиль блока</label>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><ChevronLeft className="w-3 h-3" /> Выравнивание <ChevronRight className="w-3 h-3" /></span>
                          <div className="flex bg-slate-100 p-1.5 rounded-[20px] shadow-inner">
                            {(['left', 'center', 'right'] as const).map((align) => {
                              const alignLabels: Record<string, string> = { left: 'Слева', center: 'По центру', right: 'Справа' };
                              return (
                                <button key={align} onClick={() => updateBlockContent(block.id, { align })} className={`flex-1 py-2.5 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${ (block.content.align || 'center') === align ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                                  {alignLabels[align]}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><ChevronUp className="w-3 h-3" /> Отступы <ChevronDown className="w-3 h-3" /></span>
                          <div className="flex bg-slate-100 p-1.5 rounded-[20px] shadow-inner">
                            {(['py-10', 'py-20', 'py-32'] as const).map((padding) => (
                              <button key={padding} onClick={() => updateBlockContent(block.id, { padding })} className={`flex-1 py-2.5 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${ (block.content.padding || (block.type === 'header' ? 'py-4' : 'py-20')) === padding ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                                {padding === 'py-10' ? 'S' : padding === 'py-20' ? 'M' : 'L'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Palette className="w-3 h-3" /> Цвет фона</span>
                        <div className="flex flex-wrap gap-3">
                          {['#ffffff', '#f8fafc', '#f1f5f9', ...(assets.palette || [])].slice(0, 10).map((color) => (
                            <button key={color} onClick={() => updateBlockContent(block.id, { bgColor: color })} className={`w-10 h-10 rounded-full border-4 transition-all shadow-sm ${ (block.content.bgColor || '#ffffff') === color ? 'border-blue-500 scale-110' : 'border-white hover:scale-105'}`} style={{ backgroundColor: color }} title={color} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-10 border-t border-slate-100">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-3 h-3 text-amber-500" /> Анимация блока</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'none', label: 'Нет' },
                        { id: 'fade-up', label: 'Появление снизу' },
                        { id: 'fade-in', label: 'Появление' },
                        { id: 'slide-in', label: 'Скольжение' },
                        { id: 'zoom-in', label: 'Увеличение' }
                      ].map((m) => (
                        <button 
                          key={m.id} 
                          onClick={() => updateBlockContent(block.id, { motion: { ...(block.content.motion || {}), type: m.id } })}
                          className={`p-4 rounded-2xl border-2 text-xs font-bold transition-all ${ (block.content.motion?.type || 'none') === m.id ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 bg-white hover:border-slate-200 text-slate-500'}`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                    {(block.content.motion?.type || 'none') !== 'none' && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Длительность: {block.content.motion?.duration || 0.5}с</span>
                        </div>
                        <input 
                          type="range" min="0.1" max="2" step="0.1" 
                          className="w-full accent-amber-500" 
                          value={block.content.motion?.duration || 0.5} 
                          onChange={(e) => updateBlockContent(block.id, { motion: { ...(block.content.motion || {}), duration: parseFloat(e.target.value) } })} 
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-slate-100 shrink-0">
                  <button onClick={closeEditModal} className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Применить изменения</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  const renderBlockWithReorder = (block: Block, index: number, isLockedByOther: boolean) => {
    return (
      <Reorder.Item 
        key={block.id} 
        value={block} 
        className="relative group"
        onDragStart={() => {
          const blockType = ADVANCED_BLOCK_TYPES.find(b => b.id === block.type) || 
                           BUSINESS_BLOCK_TYPES.find(b => b.id === block.type) ||
                           MEDIA_BLOCK_TYPES.find(b => b.id === block.type);
          setDragState({
            isDragging: true,
            blockType: block.type,
            blockName: blockType?.name || block.type,
            x: 0,
            y: 0,
          });
        }}
        onDrag={(e: any) => {
          if (dragState) {
            setDragState({
              ...dragState,
              x: e.clientX || 0,
              y: e.clientY || 0,
            });
          }
        }}
        onDragEnd={() => {
          setDragState(null);
          setActiveDropZone(null);
        }}
      >
        <LazyLoader>
          {renderBlockContent(block, isLockedByOther)}
        </LazyLoader>
      </Reorder.Item>
    );
  };

  const renderBlock = (block: Block, isLockedByOther: boolean) => {
    return renderBlockContent(block, isLockedByOther);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col overflow-hidden font-sans">
      {/* Top Toolbar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <Layout className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 uppercase tracking-tight leading-none">Редактор сайта</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{brandName}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Presence Avatars */}
          <div className="flex -space-x-3 group relative cursor-help">
            {activeUsers.slice(0, 5).map((user, i) => (
              <div key={user.userId} className="w-8 h-8 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-[8px] font-black shadow-sm" style={{ color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5], backgroundColor: ['#eff6ff', '#ecfdf5', '#fffbeb', '#fef2f2', '#f5f3ff'][i % 5] }}>
                {user.userName.charAt(0).toUpperCase()}
              </div>
            ))}
            {activeUsers.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-500">
                +{activeUsers.length - 5}
              </div>
            )}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-[200] shadow-xl pointer-events-none">
              {activeUsers.length} Users Online
            </div>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          {(['mobile', 'tablet', 'desktop'] as const).map((mode) => (
            <button 
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`p-2 rounded-lg transition-all ${viewMode === mode ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
              {mode === 'mobile' ? <Smartphone className="w-4 h-4" /> : mode === 'tablet' ? <Tablet className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowPreview(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-all"><Eye className="w-4 h-4" /> Превью</button>
          <button onClick={() => setShowMobileEditor(true)} className="md:hidden flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Smartphone className="w-4 h-4" /> Мобильный редактор</button>
          <button onClick={handleTranslate} disabled={isGenerating} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-all"><Languages className="w-4 h-4" /> EN</button>
          <button onClick={handleMagicGenerate} disabled={isGenerating} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${isGenerating ? 'bg-amber-50 text-amber-500 animate-pulse' : 'text-amber-600 hover:bg-amber-50'}`}><Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} /> {isGenerating ? 'Генерация...' : 'Волшебное заполнение'}</button>
          <button onClick={() => setShowSEOSettings(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-all"><Globe className="w-4 h-4" /> SEO</button>
          <button 
            onClick={async () => {
              const name = prompt('Введите название страницы для снимка:');
              if (!name) return;
              try {
                await api.saveTemplate({
                  projectId: profileId,
                  name,
                  type: 'page',
                  content: { blocks }
                });
                alert('Снимок страницы сохранён!');
              } catch (err) {
                console.error(err);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
          >
            <Bookmark className="w-4 h-4" /> Снимок
          </button>
          <div className="w-px h-8 bg-slate-100 mx-2" />
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-black rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"><Save className="w-4 h-4" /> Сохранить</button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"><X className="w-5 h-5" /></button>
        </div>
      </div>
      </header>

      {/* Main Editor Area */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center"><div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-slate-600 font-medium">Загрузка проекта...</p></div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Страницы</h3>
                <button onClick={addNewPage} className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {pages.map(page => (
                  <div key={page.id} className={`flex items-center group px-3 py-2 rounded-xl transition-all ${activePageId === page.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600'}`}>
                    <button onClick={() => handlePageSwitch(page.id)} className="flex-1 text-left text-sm font-bold truncate">
                      {page.title}
                    </button>
                    {pages.length > 1 && (
                      <button onClick={() => deletePage(page.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex border-b border-slate-100">
              <button onClick={() => setActiveTab('blocks')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'blocks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Блоки</button>
              <button onClick={() => setActiveTab('styles')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'styles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Стили</button>
              <button onClick={() => setActiveTab('ai')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ai' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400 hover:text-slate-600'}`}>AI</button>
              <button onClick={() => setActiveTab('conversion')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'conversion' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-400 hover:text-slate-600'}`}>Продажи</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {activeTab === 'blocks' ? (
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Элементы контента</h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { type: 'Шапка', icon: <Menu className="w-4 h-4" /> },
                      { type: 'Hero', icon: <Layout className="w-4 h-4" /> },
                      { type: 'Возможности', icon: <Plus className="w-4 h-4" /> },
                      { type: 'Галерея', icon: <ImageIcon className="w-4 h-4" /> },
                      { type: 'Цены', icon: <Zap className="w-4 h-4" /> },
                      { type: 'Отзывы', icon: <MessageSquare className="w-4 h-4" /> },
                      { type: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
                      { type: 'Контакты', icon: <Globe className="w-4 h-4" /> },
                      { type: 'Статистика', icon: <BarChart3 className="w-4 h-4" /> },
                      { type: 'Магазин', icon: <ShoppingBag className="w-4 h-4" /> },
                      { type: 'Блог', icon: <FileText className="w-4 h-4" /> },
                      { type: 'HTML', icon: <Code className="w-4 h-4" /> },
                      { type: 'Обратный отсчёт', icon: <Clock className="w-4 h-4" /> },
                      { type: 'Подвал', icon: <ChevronDown className="w-4 h-4" /> }
                    ].map(({ type, icon }) => (
                      <button key={type} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:border-blue-200 hover:bg-blue-50/50 transition-all group flex items-center gap-3 shadow-sm hover:shadow-md" onClick={() => {
                        const typeMap: Record<string, string> = {
                          'Шапка': 'Header',
                          'Hero': 'Hero',
                          'Возможности': 'Features',
                          'Галерея': 'Gallery',
                          'Цены': 'Pricing',
                          'Отзывы': 'Testimonials',
                          'FAQ': 'FAQ',
                          'Контакты': 'Contact',
                          'Статистика': 'Stats',
                          'Магазин': 'Store',
                          'Блог': 'Blog',
                          'HTML': 'HTML',
                          'Обратный отсчёт': 'Countdown',
                          'Подвал': 'Footer'
                        };
                        const defaultContent: any = { 
                          Header: { links: ['Главная', 'Товары', 'О нас'], logo: brandName, padding: 'py-4' },
                          Hero: { title: 'Добро пожаловать в наш бренд', subtitle: 'Создаём будущее вместе', padding: 'py-20' }, 
                          Features: { title: 'Ключевые преимущества', items: [{title: 'Быстро', description: 'Молниеносная скорость', icon: 'Zap'}, {title: 'Безопасно', description: 'Корпоративная безопасность', icon: 'Shield'}], padding: 'py-20' }, 
                          Gallery: { title: 'Наши работы', images: [], padding: 'py-20' },
                          Pricing: { title: 'Простое ценообразование', plans: [{name: 'Бесплатно', price: '0', features: ['Базовый доступ']}, {name: 'Про', price: '2900', features: ['Полный доступ'], popular: true}], padding: 'py-20' },
                          Testimonials: { title: 'Что говорят клиенты', items: [{text: 'Потрясающе!', author: 'Иван Иванов', role: 'Генеральный директор'}], padding: 'py-20' },
                          FAQ: { title: 'Частые вопросы', items: [{question: 'Как это работает?', answer: 'Работает отлично!'}], padding: 'py-20' },
                          Stats: { items: [{label: 'Пользователей', value: '10k+'}, {label: 'Лет', value: '5+'}], padding: 'py-20' },
                          Contact: { 
                            title: 'Связаться с нами', 
                            subtitle: 'Мы здесь для вас', 
                            fields: [
                              { id: 'name', label: 'Ваше имя', type: 'text', required: true, placeholder: 'Введите ваше имя' },
                              { id: 'email', label: 'Ваш Email', type: 'email', required: true, placeholder: 'Введите ваш email' },
                              { id: 'message', label: 'Сообщение', type: 'textarea', required: true, placeholder: 'Чем мы можем помочь?' }
                            ],
                            padding: 'py-20' 
                          },
                          Store: { title: 'Наш магазин', subtitle: 'Премиум продукты специально для вас', columns: 3, padding: 'py-20' },
                          Blog: { title: 'Последние истории', subtitle: 'Будьте в курсе наших новостей', count: 3, padding: 'py-20' },
                          HTML: { html: '<div class="p-10 bg-slate-50 rounded-3xl text-center font-bold">Пользовательский HTML блок</div>', padding: 'py-10' },
                          Countdown: { title: 'Ограниченное предложение!', subtitle: 'Акция заканчивается через:', targetDate: new Date(Date.now() + 86400000).toISOString(), padding: 'py-20' },
                          Footer: { text: `© 2026 ${brandName}`, padding: 'py-10' } 
                        };
                        const contentKey = typeMap[type] || type;
                        const newBlock = { id: Date.now().toString(), type: contentKey.toLowerCase(), content: defaultContent[contentKey] || { title: 'Новый ' + type, padding: 'py-20' } };
                        setBlocks([...blocks, newBlock]);
                      }}>
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 shadow-sm border border-slate-100 transition-colors">{icon}</div>
                        <div className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{type}</div>
                      </button>
                    ))}
                  </div>

                  {/* Advanced Interactive Blocks */}
                  <div className="mt-8">
                    <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Продвинутые блоки</h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {ADVANCED_BLOCK_TYPES.map((blockType) => (
                        <button
                          key={blockType.id}
                          className="w-full p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl text-left hover:border-indigo-300 hover:from-indigo-100 hover:to-purple-100 transition-all group flex items-center gap-3 shadow-sm hover:shadow-md"
                          onClick={() => {
                            const newBlock = {
                              id: Date.now().toString(),
                              type: blockType.id,
                              content: { ...blockType.defaultContent },
                            };
                            setBlocks([...blocks, newBlock]);
                          }}
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 group-hover:text-purple-600 shadow-sm border border-indigo-100 transition-colors text-xl">
                            {blockType.icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                              {blockType.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {blockType.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Business Blocks */}
                  <div className="mt-8">
                    <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Бизнес-блоки</h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {BUSINESS_BLOCK_TYPES.map((blockType) => (
                        <button
                          key={blockType.id}
                          className="w-full p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl text-left hover:border-emerald-300 hover:from-emerald-100 hover:to-teal-100 transition-all group flex items-center gap-3 shadow-sm hover:shadow-md"
                          onClick={() => {
                            const newBlock = {
                              id: Date.now().toString(),
                              type: blockType.id,
                              content: { ...blockType.defaultContent },
                            };
                            setBlocks([...blocks, newBlock]);
                          }}
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 group-hover:text-teal-600 shadow-sm border border-emerald-100 transition-colors text-xl">
                            {blockType.icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                              {blockType.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {blockType.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Media Blocks */}
                  <div className="mt-8">
                    <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Медиа-блоки</h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {MEDIA_BLOCK_TYPES.map((blockType) => (
                        <button
                          key={blockType.id}
                          className="w-full p-4 bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100 rounded-2xl text-left hover:border-rose-300 hover:from-rose-100 hover:to-orange-100 transition-all group flex items-center gap-3 shadow-sm hover:shadow-md"
                          onClick={() => {
                            const newBlock = {
                              id: Date.now().toString(),
                              type: blockType.id,
                              content: { ...blockType.defaultContent },
                            };
                            setBlocks([...blocks, newBlock]);
                          }}
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-600 group-hover:text-orange-600 shadow-sm border border-rose-100 transition-colors text-xl">
                            {blockType.icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-slate-700 group-hover:text-rose-600 transition-colors">
                              {blockType.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {blockType.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeTab === 'styles' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-left duration-500">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Palette className="w-3.5 h-3.5" /> Палитра бренда</label>
                    <div className="grid grid-cols-5 gap-3">
                      {assets.palette?.map((color: string, i: number) => (
                        <div key={i} className="group relative">
                          <div className="aspect-square rounded-xl shadow-sm border border-slate-100 cursor-pointer transition-transform hover:scale-110 active:scale-95" style={{ backgroundColor: color }} />
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[8px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">{color}</div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-3 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-400 hover:text-blue-500 transition-all">Сгенерировать новую палитру</button>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Type className="w-3.5 h-3.5" /> Типографика</label>
                    <div className="space-y-2">
                      {assets.fonts?.map((font: string, i: number) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                          <span className="text-sm font-bold text-slate-700" style={{ fontFamily: font }}>{font}</span>
                          <Check className="w-4 h-4 text-blue-500" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] text-white space-y-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Sparkles className="w-5 h-5 text-blue-400" /></div>
                      <h4 className="font-black uppercase tracking-tight">AI Style Sync</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">Автоматически выровнять все блоки с визуальной идентичностью и эмоциональным тоном вашего бренда.</p>
                    <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20">Применить глобальные стили</button>
                  </div>
                </div>
              ) : activeTab === 'ai' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                  <ChangeTracker changes={changes} />
                  <ApprovalWorkflow 
                    requests={approvalRequests}
                    onApprove={(id) => setApprovalRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r))}
                    onReject={(id) => setApprovalRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r))}
                  />
                  <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] text-white space-y-6 shadow-2xl shadow-blue-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner"><Sparkles className="w-8 h-8" /></div>
                      <div>
                        <h4 className="text-xl font-black uppercase tracking-tight">AI Архитектор сайта</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Нейронный движок активен</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-blue-50 leading-relaxed font-medium">Позвольте нашему AI проанализировать вашу нишу и цели, чтобы построить идеальную структуру с высокой конверсией.</p>
                    <button onClick={handleMagicGenerate} className="w-full py-5 bg-white text-blue-600 rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95">Перестроить с AI</button>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Mic className="w-3.5 h-3.5" /> Голосовое управление</label>
                    <VoiceCommander onCommand={(cmd) => console.log('Voice command:', cmd)} />
                  </div>

                  <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Автономный рост</h5>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">Прогнозирующее A/B тестирование</span>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">Эмоциональная адаптация UX</span>
                      <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'conversion' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setShowProductManager(true)} className="p-6 bg-white border border-slate-100 rounded-[32px] text-center hover:border-blue-200 hover:shadow-xl transition-all group">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform"><ShoppingBag className="w-6 h-6" /></div>
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Товары</span>
                    </button>
                    <button onClick={() => setShowBlogManager(true)} className="p-6 bg-white border border-slate-100 rounded-[32px] text-center hover:border-indigo-200 hover:shadow-xl transition-all group">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4 group-hover:scale-110 transition-transform"><FileText className="w-6 h-6" /></div>
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Блог</span>
                    </button>
                    <button onClick={() => setShowSocialFactory(true)} className="p-6 bg-white border border-slate-100 rounded-[32px] text-center hover:border-rose-200 hover:shadow-xl transition-all group">
                      <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mx-auto mb-4 group-hover:scale-110 transition-transform"><Share2 className="w-6 h-6" /></div>
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Соцсети</span>
                    </button>
                    <button onClick={() => setShowTemplateHub(true)} className="p-6 bg-white border border-slate-100 rounded-[32px] text-center hover:border-amber-200 hover:shadow-xl transition-all group">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-4 group-hover:scale-110 transition-transform"><Bookmark className="w-6 h-6" /></div>
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Шаблоны</span>
                    </button>
                  </div>

                  <div className="p-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-[40px] text-white space-y-6 shadow-2xl shadow-rose-200">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner"><TrendingUp className="w-8 h-8" /></div>
                      <h4 className="text-xl font-black uppercase tracking-tight">Усилитель продаж</h4>
                    </div>
                    <p className="text-sm text-rose-50 leading-relaxed font-medium">Активируйте виджеты с высокой конверсией и автоматизированные воронки продаж.</p>
                    <div className="space-y-3">
                      <button className="w-full py-4 bg-white text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all shadow-lg">Настроить всплывающее окно при уходе</button>
                      <button className="w-full py-4 bg-rose-400/30 hover:bg-rose-400/40 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/20">Добавить социальное доказательство FAB</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>

          <main className="flex-1 bg-slate-100 overflow-y-auto p-12 flex justify-center custom-scrollbar relative">
            <GridOverlay enabled={gridEnabled} size={20} />
            <AnimatePresence>
              {dragState && (
                <DragPreview
                  blockType={dragState.blockType}
                  blockName={dragState.blockName}
                  x={dragState.x}
                  y={dragState.y}
                />
              )}
            </AnimatePresence>
            <div className={`transition-all duration-500 bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col ${viewMode === 'mobile' ? 'w-[375px]' : viewMode === 'tablet' ? 'w-[768px]' : 'w-full max-w-5xl'}`}>
              <RealTimeCursors cursors={cursors} />
              <Reorder.Group axis="y" values={blocks} onReorder={setBlocks}>
                {blocks.length > 20 ? (
                  <VirtualScroll
                    items={blocks}
                    itemHeight={400}
                    containerHeight={800}
                    renderItem={(block, index) => {
                      const isLockedByOther = lockedBlocks[block.id] && lockedBlocks[block.id] !== (localStorage.getItem('userId'));
                      return renderBlockWithReorder(block, index, isLockedByOther);
                    }}
                  />
                ) : (
                  blocks.map((block, index) => {
                    const isLockedByOther = lockedBlocks[block.id] && lockedBlocks[block.id] !== (localStorage.getItem('userId'));
                    return renderBlockWithReorder(block, index, isLockedByOther);
                  })
                )}
              </Reorder.Group>
            </div>
          </main>
        </div>
      )}

      {showPreview && profileId && <PreviewModal projectId={profileId} brandName={brandName} onClose={() => setShowPreview(false)} />}
      
      {showMobileEditor && (
        <MobileEditor 
          blocks={blocks} 
          onUpdateBlocks={setBlocks} 
          onClose={() => setShowMobileEditor(false)} 
        />
      )}

      {showProductManager && profileId && (
        <ProductManager projectId={profileId} onClose={() => {
          setShowProductManager(false);
          // Refresh products when closing manager
          api.getProducts(profileId).then(data => setProducts(data.products || []));
        }} />
      )}

      {showBlogManager && profileId && (
        <BlogManager projectId={profileId} onClose={() => {
          setShowBlogManager(false);
          // Refresh posts when closing manager
          api.getPosts(profileId).then(data => setPosts(data.posts || []));
        }} />
      )}

      {showSocialFactory && profileId && (
        <SocialFactory 
          projectId={profileId} 
          brandName={brandName} 
          brandAssets={assets} 
          onClose={() => setShowSocialFactory(false)} 
        />
      )}

      {showTemplateHub && profileId && (
        <TemplateHub 
          projectId={profileId} 
          onSelect={(content, type) => {
            if (type === 'block') {
              setBlocks([...blocks, { id: Date.now().toString(), type: content.type, content: content.content }]);
            } else {
              setBlocks(content.blocks || []);
            }
            setShowTemplateHub(false);
          }} 
          onClose={() => setShowTemplateHub(false)} 
        />
      )}

      {showIntegrationHub && profileId && (
        <IntegrationHub 
          projectId={profileId} 
          onClose={() => setShowIntegrationHub(false)} 
        />
      )}

      {showDAMSelector && (
        <DAMManager
          projectId={profileId || ''}
          onSelect={(url) => {
            if (showDAMSelector.index !== undefined) {
              const newImages = [...(blocks.find(b => b.id === showDAMSelector.blockId)?.content.images || [])];
              newImages[showDAMSelector.index] = url;
              updateBlockContent(showDAMSelector.blockId, { [showDAMSelector.field]: newImages });
            } else {
              updateBlockContent(showDAMSelector.blockId, { [showDAMSelector.field]: url });
            }
            setShowDAMSelector(null);
          }}
          onClose={() => setShowDAMSelector(null)}
        />
      )}
    </div>
  );
};

