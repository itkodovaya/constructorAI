import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Palette, Layout, Rocket, ChevronRight, 
  Settings, User, Bell, Search, Plus, Trash2, 
  ExternalLink, Share2, History, Smartphone, 
  Calendar, ShoppingBag, Grid, HelpCircle, 
  MessageSquare, Smartphone as MobileIcon, Globe,
  CreditCard, ChevronLeft, LogOut, Box, ImageIcon,   Users, BarChart3, Download, Package, Accessibility, TestTube, CheckSquare,
  Brain, Target, Shield, Video as VideoIcon, Zap, Eye, TrendingUp, Wand2, Database, X, Menu
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Components
import { BrandPanel } from './components/BrandPanel';
import { SiteBuilder } from './components/SiteBuilder';
import { PresentationBuilder } from './components/PresentationBuilder';
import { GraphicsEditor } from './components/GraphicsEditor';
import { AIAssistant } from './components/AIAssistant';
import { PricingModal } from './components/PricingModal';
import { ShareModal } from './components/ShareModal';
import { HistorySidebar } from './components/HistorySidebar';
import { DevicePreview } from './components/DevicePreview';
import { ContentPlanner } from './components/ContentPlanner';
import { TemplateStore } from './components/TemplateStore';
import { Integrations } from './components/Integrations';
import { HelpCenter } from './components/HelpCenter';
import { NotificationCenter } from './components/NotificationCenter';
import { CommandPalette } from './components/CommandPalette';
import { FeedbackModal } from './components/FeedbackModal';
import { MobileAppPromo } from './components/MobileAppPromo';
import { SocialMediaIntegration } from './components/SocialMediaIntegration';
import { WizardForm } from './components/WizardForm';

// Services
import { api } from './services/api';

import { PlanLimits } from './components/PlanLimits';
import { SocialContentGenerator } from './components/SocialContentGenerator';
import { PreviewModal } from './components/PreviewModal';
import { BrandShowcase } from './components/BrandShowcase';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { KnowledgeBaseManager } from './components/KnowledgeBaseManager';
import { AIGovernance } from './components/AIGovernance';
import { ComplianceAuditor } from './components/ComplianceAuditor';
import { PersonalizationRules } from './components/PersonalizationRules';
import { MarketingWarRoom } from './components/MarketingWarRoom';
import { GrowthSimulator } from './components/GrowthSimulator';
import { AgentSkillFactory } from './components/AgentSkillFactory';
import { OmniSearch } from './components/OmniSearch';
import { AdaptiveUI } from './components/AdaptiveUI';
import { AgentOrchestrator } from './components/AgentOrchestrator';
import { VisionAuditor } from './components/VisionAuditor';
import { AIVisualEvolution } from './components/AIVisualEvolution';
import { AssetLibrary } from './components/AssetLibrary';
import { TeamManagement } from './components/TeamManagement';
import { ProjectSettings } from './components/ProjectSettings';
import { HelpWidget } from './components/HelpWidget';
import { AIAssistantChat } from './components/AIAssistantChat';
import { CollaborationIndicator } from './components/CollaborationIndicator';
import { SemanticSearch } from './components/SemanticSearch';
import { CustomComponentsManager } from './components/CustomComponentsManager';
import { AccessibilityChecker } from './components/AccessibilityChecker';
import { EdgeAILaboratory } from './components/EdgeAILaboratory';
import { AvatarStudio } from './components/AvatarStudio';
import { AutopilotDashboard } from './components/AutopilotDashboard';
import { PersonalizationManager } from './components/PersonalizationManager';
import { AccessibilityHub } from './components/AccessibilityHub';
import { FeedbackWidget } from './components/FeedbackWidget';
import { CRMManager } from './components/CRMManager';
import { TaskManager } from './components/TaskManager';
import { VideoAdsStudio } from './components/VideoAdsStudio';
import { CampaignBuilder } from './components/CampaignBuilder';
import { CommunityHub } from './components/CommunityHub';
import { DeveloperPortal } from './components/DeveloperPortal';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { SecurityDashboard } from './components/SecurityDashboard';
import { IntegrationManager } from './components/IntegrationManager';
import { AISettings } from './components/AISettings';
import { ProductManager, BlogManager } from './components/ProductModules';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { GlobalSearch } from './components/GlobalSearch';
import { CommentOverlay } from './components/CommentOverlay';
import { CollaborationCursors } from './components/CollaborationCursors';
import { ABTestManager } from './components/ABTestManager';
import { Marketplace } from './components/Marketplace';
import { DAMManager } from './components/DAMManager';
import { RoleManager } from './components/RoleManager';
import { FineTuningDashboard } from './components/FineTuningDashboard';
import { ReferralDashboard } from './components/ReferralDashboard';
import { Moon, Sun } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MobileNav } from './components/MobileNav';
import { useIsMobile } from './hooks/useMediaQuery';

function App() {
  const [view, setView] = useState<'onboarding' | 'dashboard' | 'project'>('onboarding');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'brand' | 'showcase' | 'assets' | 'team' | 'settings' | 'referrals' | 'intelligence'>('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLanguage] = useState<'RU' | 'EN'>('RU');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [showSiteBuilder, setShowSiteBuilder] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [showGraphics, setShowGraphics] = useState(false);
  const [showCRM, setShowCRM] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showContentPlanner, setShowContentPlanner] = useState(false);
  const [showTemplateStore, setShowTemplateStore] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showMobileApp, setShowMobileApp] = useState(false);
  const [showSocialMedia, setShowSocialMedia] = useState(false);
  const [showSocialGenerator, setShowSocialGenerator] = useState(false);
  const [showCustomComponents, setShowCustomComponents] = useState(false);
  const [showAccessibilityChecker, setShowAccessibilityChecker] = useState(false);
  const [showABTests, setShowABTests] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showDAM, setShowDAM] = useState(false); // Added
  const [showRoles, setShowRoles] = useState(false); // Added
  const [showFineTuning, setShowFineTuning] = useState(false);
  const [showReferrals, setShowReferrals] = useState(false);
  const [showAutopilot, setShowAutopilot] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [showVideoAds, setShowVideoAds] = useState(false);
  const [showInternalCRM, setShowInternalCRM] = useState(false);
  const [showInternalTasks, setShowInternalTasks] = useState(false);
  const [showA11yHub, setShowA11yHub] = useState(false);
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);
  const [showEdgeAILab, setShowEdgeAILab] = useState(false);
  const [showAvatarStudio, setShowAvatarStudio] = useState(false);
  const [showCommunityHub, setShowCommunityHub] = useState(false);
  const [showDeveloperPortal, setShowDeveloperPortal] = useState(false);
  const [showPerformanceHub, setShowPerformanceHub] = useState(false);
  const [showSecurityCenter, setShowSecurityCenter] = useState(false);
  const [showIntegrationHub, setShowIntegrationHub] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [showProductModules, setShowProductModules] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'brandkit'>('free');
  const [activeModule, setActiveModule] = useState<'ecommerce' | 'blog'>('ecommerce');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchProjects();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { label: 'Открыть конструктор сайтов', category: 'Редактор', icon: <Layout />, onClick: () => setShowSiteBuilder(true) },
    { label: 'Изменить бренд-кит', category: 'Дизайн', icon: <Palette />, onClick: () => setShowEditor(true) },
    { label: 'Экспортировать в HTML', category: 'Экспорт', icon: <Download />, onClick: () => profile && api.exportProject(profile.id) },
    { label: 'Поделиться проектом', category: 'Совместная работа', icon: <Share2 />, onClick: () => setShowShare(true) },
    { label: 'Настройки SEO', category: 'Маркетинг', icon: <Globe />, onClick: () => setShowSiteBuilder(true) },
    { label: 'Мобильное приложение', category: 'Платформа', icon: <Smartphone />, onClick: () => setShowMobileApp(true) },
    { label: 'Оставить отзыв', category: 'Система', icon: <MessageSquare />, onClick: () => setShowFeedback(true) },
  ];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (wizardData: any) => {
    setLoading(true);
    try {
      const newProject = await api.createProject(wizardData);
      if (!newProject || !newProject.id) {
        throw new Error('Не удалось создать проект: Неверный ответ от сервера');
      }
      setProfile(newProject);
      await fetchProjects();
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#9333ea', '#db2777']
      });

      setTimeout(() => {
        if (newProject && newProject.id) {
          setView('project');
        }
        setLoading(false);
      }, 1500);
    } catch (error: any) {
      console.error('Error creating project:', error);
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Ошибка при создании проекта. Попробуйте еще раз.';
      alert(errorMessage);
      setLoading(false);
      setView('onboarding');
    }
  };

  const deleteProject = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Удалить этот проект?')) return;
    try {
      await api.deleteProject(id);
      fetchProjects();
      if (profile?.id === id) {
        setView('dashboard');
        setProfile(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const updateBrandAssets = async (newAssets: any) => {
    if (!profile) return;
    try {
      const updated = await api.updateProject(profile.id, {
        brandAssets: { ...profile.brandAssets, ...newAssets }
      });
      setProfile(updated);
    } catch (error) {
      console.error('Error updating assets:', error);
    }
  };

  const updateProjectSEO = async (newSEO: any) => {
    if (!profile) return;
    try {
      const updated = await api.updateProject(profile.id, { seo: newSEO });
      setProfile(updated);
    } catch (error) {
      console.error('Error updating SEO:', error);
    }
  };

  const handleAIAction = (action: string) => {
    console.log('AI Action triggered:', action);
    if (action === 'update_palette') {
      const brightPalette = ['#F43F5E', '#FB923C', '#FACC15', '#2DD4BF'];
      updateBrandAssets({ palette: brightPalette });
      alert('AI обновил палитру!');
    }
  };

  if (view === 'dashboard') {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-12">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
                  <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Мои проекты</h1>
                  <p className="text-sm sm:text-base text-slate-500 font-medium">Все ваши сгенерированные бренды</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <button onClick={() => setShowPricing(true)} className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl sm:rounded-2xl transition-all">Шаблоны</button>
                <button onClick={() => setView('onboarding')} className="bg-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"><Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Создать проект</button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {projects.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => { setProfile(p); setView('project'); }}
                  className="bg-white p-4 sm:p-6 lg:p-8 rounded-[24px] sm:rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {p.brandName[0]}
                    </div>
                    <button 
                      onClick={(e) => deleteProject(p.id, e)}
                      className="p-1.5 sm:p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">{p.brandName}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6 capitalize">{p.style} • {p.niche}</p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-600 group-hover:gap-3 transition-all">
                    Открыть проект <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </ErrorBoundary>
    );
  }

  if (view === 'project') {
    if (!profile) {
      return (
        <ErrorBoundary>
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[32px] border border-slate-200 shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Box className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Проект не найден</h2>
              <p className="text-sm text-slate-500 font-medium mb-6">Проект не был загружен. Попробуйте создать новый проект.</p>
              <button
                onClick={() => setView('onboarding')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
              >
                Создать проект
              </button>
            </div>
          </div>
        </ErrorBoundary>
      );
    }
    
    return (
    <ErrorBoundary>
    <div className="min-h-screen bg-white flex overflow-hidden">
      <AnimatePresence>
        {showEdgeAILab && profile && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="fixed inset-0 z-[250] bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white sticky top-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowEdgeAILab(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h2 className="text-xl font-bold">Edge AI Laboratory</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-amber-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  Running on Client GPU/CPU
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 custom-scrollbar bg-slate-50/50">
              <EdgeAILaboratory />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAvatarStudio && profile && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[240] bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white sticky top-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowAvatarStudio(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h2 className="text-xl font-bold">AI Media Studio</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  Neural Video Engine v2.0
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 custom-scrollbar bg-slate-50/50">
              <AvatarStudio projectId={profile.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAutopilot && profile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[260] bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white sticky top-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowAutopilot(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h2 className="text-xl font-bold">AI Autopilot Center</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-indigo-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse">
                  Growth Engine Active
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 custom-scrollbar bg-slate-50/50">
              <AutopilotDashboard projectId={profile.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPersonalization && profile && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed inset-0 z-[255] bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white sticky top-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowPersonalization(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h2 className="text-xl font-bold">Smart Personalization Center</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse">
                  Rules Engine Active
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 custom-scrollbar bg-slate-50/50">
              <PersonalizationManager projectId={profile.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCampaignBuilder && profile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[230] bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white sticky top-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowCampaignBuilder(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h2 className="text-xl font-bold">Campaign Builder</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  AI Agents Activated
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 custom-scrollbar bg-slate-50/50">
              <CampaignBuilder projectId={profile.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCommunityHub && profile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[220] bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white sticky top-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowCommunityHub(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h2 className="text-xl font-bold">Community Hub</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">
                  Global Ecosystem
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 custom-scrollbar bg-slate-50/50">
              <CommunityHub />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeveloperPortal && profile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[210] bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white sticky top-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowDeveloperPortal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h2 className="text-xl font-bold">Developer Portal</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  Open API v1.0
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 custom-scrollbar">
              <DeveloperPortal />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPerformanceHub && profile && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white sticky top-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowPerformanceHub(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <h2 className="text-xl font-bold">Infrastructure & Performance</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  Global Edge Network Active
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 custom-scrollbar bg-slate-50/50">
              <PerformanceDashboard />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSecurityCenter && profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[190] bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white sticky top-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowSecurityCenter(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h2 className="text-xl font-bold">Центр безопасности</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  GDPR & FZ-152 Compliant
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 custom-scrollbar">
              <SecurityDashboard userId={profile.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIntegrationHub && profile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed inset-0 z-[180] bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white sticky top-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowIntegrationHub(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h2 className="text-xl font-bold">Центр интеграций</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  Automation Engine Active
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 custom-scrollbar">
              <div className="max-w-6xl mx-auto">
                <IntegrationManager projectId={profile.id} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAISettings && profile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[170] bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white sticky top-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowAISettings(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h2 className="text-xl font-bold">AI Лаборатория</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400">Лимиты: 85% свободно</span>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 custom-scrollbar">
              <div className="max-w-5xl mx-auto px-4 sm:px-0">
                <AISettings />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProductModules && profile && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 z-[160] bg-white flex flex-col overflow-y-auto"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-6">
                <button onClick={() => setShowProductModules(false)} className="bg-white p-3 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => setActiveModule('ecommerce')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeModule === 'ecommerce' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Товары (E-commerce)
                  </button>
                  <button 
                    onClick={() => setActiveModule('blog')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeModule === 'blog' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Блог и Контент
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                  Business Suite
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 custom-scrollbar">
              <div className="max-w-5xl mx-auto px-4 sm:px-0">
                {activeModule === 'ecommerce' ? <ProductManager projectId={profile.id} /> : <BlogManager projectId={profile.id} />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdvancedAnalytics && profile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[150] bg-white overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowAdvancedAnalytics(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h2 className="text-xl font-bold">Аналитический центр</h2>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-bold text-indigo-600">AI Мониторинг активен</span>
              </div>
            </div>
            <AdvancedAnalytics projectId={profile.id} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}
      </AnimatePresence>

      {profile && <CollaborationCursors 
        projectId={profile.id} 
        userId={profile.id} // В реальном приложении это ID текущего пользователя
        userName={profile.brandName} 
      />}
      <AdaptiveUI />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(!mobileNavOpen)}>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setView('dashboard'); setMobileNavOpen(false); }}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">Constructor</span>
            </div>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-slate-900" />
            </button>
          </div>

            <nav className="space-y-1">
              <NavItem icon={<Grid className="w-5 h-5" />} label="Главная" active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); setMobileNavOpen(false); }} />
              <NavItem icon={<Box className="w-5 h-5" />} label="Витрина" active={activeTab === 'showcase'} onClick={() => { setActiveTab('showcase'); setMobileNavOpen(false); }} />
              <NavItem icon={<ImageIcon className="w-5 h-5" />} label="Медиа" active={activeTab === 'assets'} onClick={() => { setActiveTab('assets'); setMobileNavOpen(false); }} />
              <NavItem icon={<Users className="w-5 h-5" />} label="CRM и лиды" onClick={() => { setShowInternalCRM(true); setMobileNavOpen(false); }} />
              <NavItem icon={<CheckSquare className="w-5 h-5" />} label="Задачи" onClick={() => { setShowInternalTasks(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Users className="w-5 h-5" />} label="Команда" active={activeTab === 'team'} onClick={() => { setActiveTab('team'); setMobileNavOpen(false); }} />
              <NavItem icon={<BarChart3 className="w-5 h-5" />} label="Аналитика" active={activeTab === 'analytics'} onClick={() => { setActiveTab('analytics'); setMobileNavOpen(false); }} />
              <NavItem icon={<Brain className="w-5 h-5" />} label="Интеллект" active={activeTab === 'intelligence'} onClick={() => { setActiveTab('intelligence'); setMobileNavOpen(false); }} />
              <NavItem icon={<Palette className="w-5 h-5" />} label="Бренд-кит" onClick={() => { setShowEditor(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Layout className="w-5 h-5" />} label="Конструктор сайтов" onClick={() => { setShowSiteBuilder(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Smartphone className="w-5 h-5" />} label="Редактор презентаций" onClick={() => { setShowPresentation(true); setMobileNavOpen(false); }} />
              <NavItem icon={<ImageIcon className="w-5 h-5" />} label="Graphics Editor" onClick={() => { setShowGraphics(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Calendar className="w-5 h-5" />} label="Контент-план" onClick={() => { setShowContentPlanner(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Share2 className="w-5 h-5" />} label="Соцсети" onClick={() => { setShowSocialMedia(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Sparkles className="w-5 h-5" />} label="Генератор постов" onClick={() => { setShowSocialGenerator(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Brain className="w-5 h-5" />} label="Edge AI Lab" onClick={() => { setShowEdgeAILab(true); setMobileNavOpen(false); }} />
              <NavItem icon={<VideoIcon className="w-5 h-5" />} label="Video Ads Studio" onClick={() => { setShowVideoAds(true); setMobileNavOpen(false); }} />
              <NavItem icon={<VideoIcon className="w-5 h-5" />} label="AI Media Studio" onClick={() => { setShowAvatarStudio(true); setMobileNavOpen(false); }} />
              <NavItem icon={<History className="w-5 h-5" />} label="История" onClick={() => { setShowHistory(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Brain className="w-5 h-5" />} label="AI Autopilot" onClick={() => { setShowAutopilot(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Target className="w-5 h-5" />} label="Personalization" onClick={() => { setShowPersonalization(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Rocket className="w-5 h-5" />} label="Campaigns" onClick={() => { setShowCampaignBuilder(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Users className="w-5 h-5" />} label="Community" onClick={() => { setShowCommunityHub(true); setMobileNavOpen(false); }} />
              <NavItem icon={<MessageSquare className="w-5 h-5" />} label="Отзыв" onClick={() => { setShowFeedback(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Settings className="w-5 h-5" />} label="Настройки" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setMobileNavOpen(false); }} />
              <NavItem icon={<Package className="w-5 h-5" />} label="Компоненты" onClick={() => { setShowCustomComponents(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Accessibility className="w-5 h-5" />} label="Доступность" onClick={() => { setShowAccessibilityChecker(true); setMobileNavOpen(false); }} />
              <NavItem icon={<TestTube className="w-5 h-5" />} label="A/B Тесты" onClick={() => { setShowABTests(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Accessibility className="w-5 h-5" />} label="Accessibility" onClick={() => { setShowA11yHub(true); setMobileNavOpen(false); }} />
              <NavItem icon={<ShoppingBag className="w-5 h-5" />} label="Маркетплейс" onClick={() => { setShowMarketplace(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Package className="w-5 h-5" />} label="Developer Portal" onClick={() => { setShowDeveloperPortal(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Shield className="w-5 h-5" />} label="Security" onClick={() => { setShowSecurityCenter(true); setMobileNavOpen(false); }} />
              <NavItem icon={<Zap className="w-5 h-5" />} label="Performance" onClick={() => { setShowPerformanceHub(true); setMobileNavOpen(false); }} />
            </nav>
          </div>

          <div className="mt-auto p-4 sm:p-6 border-t border-slate-100">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">AI</div>
                <div className="text-xs font-bold text-slate-800">Constructor Pro</div>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
                <div className="w-3/4 h-full bg-indigo-600" />
              </div>
              <button onClick={() => { setShowPricing(true); setMobileNavOpen(false); }} className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors">Улучшить план</button>
            </div>
          </div>
      </MobileNav>
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-slate-100 flex-col bg-slate-50/50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">Constructor</span>
          </div>

          <nav className="space-y-1">
            <NavItem icon={<Grid className="w-5 h-5" />} label="Главная" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <NavItem icon={<Box className="w-5 h-5" />} label="Витрина" active={activeTab === 'showcase'} onClick={() => setActiveTab('showcase')} />
            <NavItem icon={<ImageIcon className="w-5 h-5" />} label="Медиа" active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} />
            <NavItem icon={<Users className="w-5 h-5" />} label="CRM и лиды" onClick={() => setShowInternalCRM(true)} />
            <NavItem icon={<CheckSquare className="w-5 h-5" />} label="Задачи" onClick={() => setShowInternalTasks(true)} />
            <NavItem icon={<Users className="w-5 h-5" />} label="Команда" active={activeTab === 'team'} onClick={() => setActiveTab('team')} />
            <NavItem icon={<BarChart3 className="w-5 h-5" />} label="Аналитика" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            <NavItem icon={<Brain className="w-5 h-5" />} label="Интеллект" active={activeTab === 'intelligence'} onClick={() => setActiveTab('intelligence')} />
            <NavItem icon={<Palette className="w-5 h-5" />} label="Бренд-кит" onClick={() => setShowEditor(true)} />
            <NavItem icon={<Layout className="w-5 h-5" />} label="Конструктор сайтов" onClick={() => setShowSiteBuilder(true)} />
            <NavItem icon={<Smartphone className="w-5 h-5" />} label="Редактор презентаций" onClick={() => setShowPresentation(true)} />
            <NavItem icon={<ImageIcon className="w-5 h-5" />} label="Graphics Editor" onClick={() => setShowGraphics(true)} />
            <NavItem icon={<Calendar className="w-5 h-5" />} label="Контент-план" onClick={() => setShowContentPlanner(true)} />
            <NavItem icon={<Share2 className="w-5 h-5" />} label="Соцсети" onClick={() => setShowSocialMedia(true)} />
            <NavItem icon={<Sparkles className="w-5 h-5" />} label="Генератор постов" onClick={() => setShowSocialGenerator(true)} />
            <NavItem icon={<Brain className="w-5 h-5" />} label="Edge AI Lab" onClick={() => setShowEdgeAILab(true)} />
            <NavItem icon={<VideoIcon className="w-5 h-5" />} label="Video Ads Studio" onClick={() => setShowVideoAds(true)} />
            <NavItem icon={<VideoIcon className="w-5 h-5" />} label="AI Media Studio" onClick={() => setShowAvatarStudio(true)} />
            <NavItem icon={<History className="w-5 h-5" />} label="История" onClick={() => setShowHistory(true)} />
            <NavItem icon={<Brain className="w-5 h-5" />} label="AI Autopilot" onClick={() => setShowAutopilot(true)} />
            <NavItem icon={<Target className="w-5 h-5" />} label="Personalization" onClick={() => setShowPersonalization(true)} />
            <NavItem icon={<Rocket className="w-5 h-5" />} label="Campaigns" onClick={() => setShowCampaignBuilder(true)} />
            <NavItem icon={<Users className="w-5 h-5" />} label="Community" onClick={() => setShowCommunityHub(true)} />
            <NavItem icon={<MessageSquare className="w-5 h-5" />} label="Отзыв" onClick={() => setShowFeedback(true)} />
            <NavItem icon={<Settings className="w-5 h-5" />} label="Настройки" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            <NavItem icon={<Package className="w-5 h-5" />} label="Компоненты" onClick={() => setShowCustomComponents(true)} />
            <NavItem icon={<Accessibility className="w-5 h-5" />} label="Доступность" onClick={() => setShowAccessibilityChecker(true)} />
            <NavItem icon={<TestTube className="w-5 h-5" />} label="A/B Тесты" onClick={() => setShowABTests(true)} />
            <NavItem icon={<Accessibility className="w-5 h-5" />} label="Accessibility" onClick={() => setShowA11yHub(true)} />
            <NavItem icon={<ShoppingBag className="w-5 h-5" />} label="Маркетплейс" onClick={() => setShowMarketplace(true)} />
            <NavItem icon={<Package className="w-5 h-5" />} label="Developer Portal" onClick={() => setShowDeveloperPortal(true)} />
            <NavItem icon={<Shield className="w-5 h-5" />} label="Security" onClick={() => setShowSecurityCenter(true)} />
            <NavItem icon={<Zap className="w-5 h-5" />} label="Performance" onClick={() => setShowPerformanceHub(true)} />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">AI</div>
              <div className="text-xs font-bold text-slate-800">Constructor Pro</div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
              <div className="w-3/4 h-full bg-indigo-600" />
            </div>
            <button onClick={() => setShowPricing(true)} className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors">Улучшить план</button>
          </div>
        </div>
      </aside>

        {/* Main Content */}
        <main id="main-content" className="flex-1 flex flex-col overflow-hidden">
          {profile && <CollaborationIndicator projectId={profile.id} userId="user-1" userName="Вы" />}
          <header id="navigation" className="h-16 sm:h-20 border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 lg:px-10 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-2 sm:gap-4">
              {isMobile && (
                <button
                  onClick={() => setMobileNavOpen(true)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <Menu className="w-5 h-5 text-slate-900" />
                </button>
              )}
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 truncate">{profile.brandName}</h2>
              <span className="hidden sm:inline px-2 sm:px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full">Активен</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {profile && <OmniSearch projectId={profile.id} />}
              <SemanticSearch onSelect={(result) => {
                console.log('Selected:', result);
                // Здесь можно добавить логику применения результата
              }} />
              <button onClick={() => setShowCommandPalette(true)} className="flex items-center gap-3 px-4 py-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all text-sm font-medium border border-slate-100"><Search className="w-4 h-4" /> <span>Ctrl + K</span></button>
              <button onClick={() => setShowNotifications(true)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors relative"><Bell className="w-5 h-5" /><div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" /></button>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200"><img src="https://i.pravatar.cc/100?img=33" alt="avatar" /></button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-slate-50/30">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-6xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    <MagicCard title="Генератор сайта" description="AI создал структуру вашего лендинга. Настройте блоки и контент." icon={<Layout className="w-8 h-8 text-indigo-600" />} badge="Готово" onClick={() => setShowSiteBuilder(true)} />
                    <MagicCard title="Бренд-бук" description="Логотип, палитра и шрифты, подобранные специально для вас." icon={<Palette className="w-8 h-8 text-pink-600" />} badge="Готово" onClick={() => setShowEditor(true)} />
                  </div>

                  <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                      <Sparkles className="w-64 h-64 text-indigo-600" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><Sparkles className="w-6 h-6 text-indigo-600" /> AI Помощник</h3>
                      <AIAssistant onAction={handleAIAction} brandName={profile.brandName} />
                      <button
                        onClick={() => setShowAIChat(true)}
                        className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-5 h-5" />
                        Открыть AI Чат-Ассистент
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div 
                  key="analytics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-6xl mx-auto"
                >
                  <div className="mb-10">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Аналитика сайта</h2>
                    <p className="text-slate-500 font-medium">Следите за ростом вашего бизнеса в реальном времени</p>
                  </div>
                  {profileId && <AnalyticsDashboard projectId={profileId} />}
                </motion.div>
              )}

              {activeTab === 'intelligence' && (
                <motion.div 
                  key="intelligence"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-6xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10"
                >
                  <div className="mb-6 sm:mb-8 lg:mb-10">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Центр AI интеллекта</h2>
                    <p className="text-sm sm:text-base text-slate-500 font-medium">Обучите ваш AI знаниям о бренде и контексту RAG.</p>
                  </div>
                  
                  <div className="space-y-6 sm:space-y-8 lg:space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Brain className="w-4 h-4" /> Оркестратор агентов
                      </h3>
                      {profile && <AgentOrchestrator projectId={profile.id} />}
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Когнитивный центр зрения
                      </h3>
                      {profile && <VisionAuditor projectId={profile.id} />}
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Визуальный AI и идентичность
                      </h3>
                      {profile && <AIVisualEvolution brandName={profile.brandName} />}
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Управление AI и этические ограничения
                      </h3>
                      <AIGovernance projectId={profile?.id} />
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Аудитор соответствия
                      </h3>
                      <ComplianceAuditor projectId={profile?.id} />
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-4 h-4" /> Нейронная персонализация и динамический контент
                      </h3>
                      {profile && <PersonalizationRules projectId={profile.id} initialRules={profile.personalizationRules ? JSON.parse(profile.personalizationRules) : []} />}
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Rocket className="w-4 h-4" /> Маркетинговая комната
                      </h3>
                      {profile && <MarketingWarRoom projectId={profile.id} />}
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Симулятор роста и цифровой двойник
                      </h3>
                      <GrowthSimulator />
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Wand2 className="w-4 h-4" /> Фабрика навыков агентов
                      </h3>
                      <AgentSkillFactory />
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Database className="w-4 h-4" /> Центр знаний (RAG)
                      </h3>
                      {profile && profile.organizationId ? (
                        <KnowledgeBaseManager organizationId={profile.organizationId} />
                      ) : (
                        <div className="p-20 bg-slate-50 rounded-[48px] text-center border-2 border-dashed border-slate-200">
                          <Brain className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                          <h3 className="text-xl font-black text-slate-900">Требуется организация</h3>
                          <p className="text-slate-400 max-w-sm mx-auto mt-2">Подключите этот проект к организации, чтобы включить центр знаний RAG.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'showcase' && (
                <motion.div 
                  key="showcase"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-6xl mx-auto"
                >
                  <div className="mb-10">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Витрина бренда</h2>
                    <p className="text-slate-500 font-medium">Посмотрите, как ваш бренд выглядит на реальных носителях</p>
                  </div>
                  <BrandShowcase brandName={profile.brandName} assets={profile.brandAssets} />
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-6xl mx-auto space-y-8"
                >
                  <div className="mb-10">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Настройки проекта</h2>
                    <p className="text-slate-500 font-medium">Управление доменом и параметрами бренда</p>
                  </div>
                  <PlanLimits 
                    currentPlan={userPlan} 
                    projectsCount={projects.length}
                    onUpgrade={(plan) => {
                      setShowPricing(true);
                      setUserPlan(plan);
                    }}
                  />
                  <ProjectSettings project={profile} onUpdate={(data) => updateBrandAssets(data)} onDelete={() => deleteProject(profile.id)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Modals & Overlays */}
        {showEditor && <BrandPanel brandName={profile.brandName} assets={profile.brandAssets} onClose={() => setShowEditor(false)} onUpdate={updateBrandAssets} />}
            {showSiteBuilder && <SiteBuilder brandName={profile.brandName} assets={profile.brandAssets} seo={profile.seo} onUpdateSEO={updateProjectSEO} projectId={profile.id} onPreview={() => setShowPreview(true)} onClose={() => setShowSiteBuilder(false)} />}
            {showPreview && <PreviewModal projectId={profile.id} brandName={profile.brandName} onClose={() => setShowPreview(false)} />}
            {showPricing && <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />}
            {showShare && <ShareModal onClose={() => setShowShare(false)} brandName={profile.brandName} projectId={profile.id} />}
            {showHistory && <HistorySidebar history={profile.history || []} onClose={() => setShowHistory(false)} onRestore={(assets) => updateBrandAssets(assets)} />}
            {showPreview && <DevicePreview onClose={() => setShowPreview(false)} />}
            {showContentPlanner && <ContentPlanner onClose={() => setShowContentPlanner(false)} brandName={profile.brandName} logoUrl={profile.brandAssets?.logo || ''} />}
            {showTemplateStore && <TemplateStore onClose={() => setShowTemplateStore(false)} />}
            {showIntegrations && <Integrations />}
        {showHelp && <HelpCenter onClose={() => setShowHelp(false)} />}
        {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
        {showCommandPalette && <CommandPalette actions={commands} onClose={() => setShowCommandPalette(false)} />}
        {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
        {showMobileApp && <MobileAppPromo onClose={() => setShowMobileApp(false)} />}
        {showSocialMedia && <SocialMediaIntegration onClose={() => setShowSocialMedia(false)} />}
        {showCustomComponents && <CustomComponentsManager onClose={() => setShowCustomComponents(false)} />}
        {showAccessibilityChecker && <AccessibilityChecker onClose={() => setShowAccessibilityChecker(false)} />}
        {showABTests && profile && <ABTestManager projectId={profile.id} onClose={() => setShowABTests(false)} />}
        {showMarketplace && <Marketplace onClose={() => setShowMarketplace(false)} />}
        {showCustomComponents && <CustomComponentsManager onClose={() => setShowCustomComponents(false)} />}
        {showSocialGenerator && profile && <SocialContentGenerator brandName={profile.brandName} assets={profile.brandAssets} projectId={profile.id} onClose={() => setShowSocialGenerator(false)} />}
        {showAIChat && <AIAssistantChat projectId={profile?.id} onClose={() => setShowAIChat(false)} onApplySuggestion={(type, data) => {
          console.log('Apply AI suggestion:', type, data);
          // Здесь можно добавить логику применения предложений AI
        }} />}
        {showPersonalization && profile && <PersonalizationManager projectId={profile.id} />}
        {showVideoAds && profile && <VideoAdsStudio projectId={profile.id} onClose={() => setShowVideoAds(false)} />}
        {showAdvancedAnalytics && profile && <AdvancedAnalytics projectId={profile.id} />}
        {showAutopilot && profile && <AutopilotDashboard projectId={profile.id} />}
        {showCampaignBuilder && profile && <CampaignBuilder projectId={profile.id} />}
        {showEdgeAILab && <EdgeAILaboratory onClose={() => setShowEdgeAILab(false)} />}
        {showAvatarStudio && profile && <AvatarStudio projectId={profile.id} onClose={() => setShowAvatarStudio(false)} />}
        {showCommunityHub && <CommunityHub onClose={() => setShowCommunityHub(false)} />}
        {showDeveloperPortal && <DeveloperPortal onClose={() => setShowDeveloperPortal(false)} />}
        {showPerformanceHub && <PerformanceDashboard onClose={() => setShowPerformanceHub(false)} />}
        {showSecurityCenter && profile && <SecurityDashboard userId={profile.id} onClose={() => setShowSecurityCenter(false)} />}
        {showIntegrationHub && <IntegrationManager onClose={() => setShowIntegrationHub(false)} />}
        {showPresentation && profile && (
          <PresentationBuilder 
            brandName={profile.brandName} 
            assets={profile.brandAssets} 
            slides={profile.presentation?.slides || []} 
            onClose={() => setShowPresentation(false)} 
          />
        )}
        {showGraphics && profile && (
          <GraphicsEditor 
            brandName={profile.brandName} 
            assets={profile.brandAssets} 
            onClose={() => setShowGraphics(false)} 
          />
        )}
        {showInternalCRM && profile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[280] bg-white flex flex-col overflow-y-auto">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowInternalCRM(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronLeft className="w-6 h-6 text-slate-900" /></button>
                <h2 className="text-xl font-bold italic">Internal CRM</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
              <CRMManager projectId={profile.id} />
            </div>
          </motion.div>
        )}
        {showInternalTasks && profile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[280] bg-white flex flex-col overflow-y-auto">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowInternalTasks(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronLeft className="w-6 h-6 text-slate-900" /></button>
                <h2 className="text-xl font-bold italic">Team Tasks</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
              <TaskManager projectId={profile.id} />
            </div>
          </motion.div>
        )}
        {showAISettings && <AISettings onClose={() => setShowAISettings(false)} />}
        {showDAM && profile && <DAMManager projectId={profile.id} onClose={() => setShowDAM(false)} />}
        {showRoles && profile && <RoleManager projectId={profile.id} onClose={() => setShowRoles(false)} />}
        {showFineTuning && profile && <FineTuningDashboard projectId={profile.id} onClose={() => setShowFineTuning(false)} />}
        {showReferrals && profile && <ReferralDashboard projectId={profile.id} onClose={() => setShowReferrals(false)} />}
        {showA11yHub && <AccessibilityHub onClose={() => setShowA11yHub(false)} />}
        <FeedbackWidget />
        {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}
      </div>
    </ErrorBoundary>
    );
  }

  if (view === 'onboarding') {
    return (
      <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-bold text-slate-800">Создаем магию вашего бренда...</p>
          </div>
        )}
        <WizardForm onComplete={handleSubmit} />
        <div className="mt-10 flex flex-col items-center gap-6 opacity-40">
          <div className="flex justify-center gap-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Payments</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Privacy First</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">24/7 AI Support</span>
          </div>
          <div className="text-[9px] font-medium text-slate-400 max-w-xs text-center leading-relaxed">
            Используя сервис, вы соглашаетесь с Политикой обработки персональных данных и Условиями использования (согласно законодательству РФ).
          </div>
        </div>
      </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Загрузка...</h1>
        <p className="text-slate-500">Инициализация приложения</p>
      </div>
    </div>
    </ErrorBoundary>
  );
}

function NavItem({ icon, label, onClick, active = false }: { icon: React.ReactNode, label: string, onClick: () => void, active?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      active ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    }`}>
      {icon}
      <span>{label}</span>
        </button>
  );
}

function MagicCard({ title, description, icon, badge, onClick }: { title: string, description: string, icon: React.ReactNode, badge: string, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
          badge.includes('...') ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {badge}
        </span>
      </div>
      <h4 className="text-xl font-bold text-slate-800 mb-2">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">{description}</p>
      <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
        Открыть редактор <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
}

export default App;
