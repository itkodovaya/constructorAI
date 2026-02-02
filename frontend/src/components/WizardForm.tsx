import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Target, Rocket, ChevronRight, ChevronLeft, Palette, 
  Check, AlertCircle, Loader2, Code, Heart,
  GraduationCap, ShoppingCart, Utensils,
  Film, Gamepad2, Home, Car, Shirt, Wallet, Plane
} from 'lucide-react';
import { FullscreenDesignSelector } from './FullscreenDesignSelector';
import { LogoSelector } from './LogoSelector';
import type { GeneratedDesign } from '../utils/DesignParameters';
import type { LogoVariant } from '../services/LogoGenerator';

interface WizardFormProps {
  onComplete: (data: any) => void;
}

interface Niche {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  gradient: string;
}

interface DesignTemplate {
  id: string;
  name: string;
  img: string;
  category: string;
  tags: string[];
}

export const WizardForm: React.FC<WizardFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLogoSelector, setShowLogoSelector] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<GeneratedDesign | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<LogoVariant | null>(null);
  const [formData, setFormData] = useState({
    brandName: '',
    niche: '',
    style: 'minimalist',
    colors: [] as string[],
    goals: ['site', 'social', 'presentation', 'brandkit'],
  });

  const niches: Niche[] = [
    { 
      id: 'tech', 
      name: 'Технологии / IT', 
      icon: <Code className="w-6 h-6" />, 
      description: 'Разработка, SaaS, стартапы',
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'beauty', 
      name: 'Красота и здоровье', 
      icon: <Heart className="w-6 h-6" />, 
      description: 'Косметика, фитнес, wellness',
      color: 'text-pink-600',
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      id: 'education', 
      name: 'Образование', 
      icon: <GraduationCap className="w-6 h-6" />, 
      description: 'Онлайн-курсы, школы, тренинги',
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-violet-500'
    },
    { 
      id: 'ecommerce', 
      name: 'E-commerce', 
      icon: <ShoppingCart className="w-6 h-6" />, 
      description: 'Интернет-магазины, маркетплейсы',
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-amber-500'
    },
    { 
      id: 'food', 
      name: 'Еда и напитки', 
      icon: <Utensils className="w-6 h-6" />, 
      description: 'Рестораны, кафе, доставка',
      color: 'text-red-600',
      gradient: 'from-red-500 to-orange-500'
    },
    { 
      id: 'media', 
      name: 'Медиа', 
      icon: <Film className="w-6 h-6" />, 
      description: 'Видео, подкасты, контент',
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-500'
    },
    { 
      id: 'sport', 
      name: 'Спорт', 
      icon: <Gamepad2 className="w-6 h-6" />, 
      description: 'Фитнес, спорт, активность',
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'realestate', 
      name: 'Недвижимость', 
      icon: <Home className="w-6 h-6" />, 
      description: 'Агентства, строительство',
      color: 'text-teal-600',
      gradient: 'from-teal-500 to-cyan-500'
    },
    { 
      id: 'automotive', 
      name: 'Автомобили', 
      icon: <Car className="w-6 h-6" />, 
      description: 'Автосалоны, сервисы',
      color: 'text-slate-600',
      gradient: 'from-slate-500 to-gray-500'
    },
    { 
      id: 'fashion', 
      name: 'Мода', 
      icon: <Shirt className="w-6 h-6" />, 
      description: 'Одежда, аксессуары, стиль',
      color: 'text-fuchsia-600',
      gradient: 'from-fuchsia-500 to-pink-500'
    },
    { 
      id: 'finance', 
      name: 'Финансы', 
      icon: <Wallet className="w-6 h-6" />, 
      description: 'Банки, инвестиции, финтех',
      color: 'text-emerald-600',
      gradient: 'from-emerald-500 to-green-500'
    },
    { 
      id: 'travel', 
      name: 'Путешествия', 
      icon: <Plane className="w-6 h-6" />, 
      description: 'Туризм, отели, авиакомпании',
      color: 'text-sky-600',
      gradient: 'from-sky-500 to-blue-500'
    },
  ];

  const templates: DesignTemplate[] = [
    { id: 'minimalist', name: 'Минимализм', img: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=90&w=1200', category: 'Минимализм', tags: ['чистый', 'простой', 'элегантный'] },
    { id: 'tech', name: 'Техно', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=90&w=1200', category: 'Техно', tags: ['современный', 'футуристичный'] },
    { id: 'premium', name: 'Премиум', img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=90&w=1200', category: 'Премиум', tags: ['роскошный', 'элитный'] },
    { id: 'vibrant', name: 'Яркий', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=90&w=1200', category: 'Яркий', tags: ['живой', 'энергичный'] },
    { id: 'creative', name: 'Креативный', img: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&q=90&w=1200', category: 'Креативный', tags: ['уникальный', 'артистичный'] },
    { id: 'corporate', name: 'Корпоративный', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=90&w=1200', category: 'Корпоративный', tags: ['профессиональный', 'деловой'] },
    { id: 'modern', name: 'Современный', img: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=90&w=1200', category: 'Современный', tags: ['актуальный', 'трендовый'] },
    { id: 'classic', name: 'Классический', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=90&w=1200', category: 'Классический', tags: ['традиционный', 'вневременной'] },
    { id: 'bold', name: 'Смелый', img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=90&w=1200', category: 'Смелый', tags: ['выразительный', 'дерзкий'] },
    { id: 'elegant', name: 'Элегантный', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=90&w=1200', category: 'Элегантный', tags: ['утонченный', 'изысканный'] },
    { id: 'playful', name: 'Игривый', img: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=90&w=1200', category: 'Игривый', tags: ['веселый', 'динамичный'] },
    { id: 'sophisticated', name: 'Утонченный', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=90&w=1200', category: 'Утонченный', tags: ['изысканный', 'сложный'] },
    { id: 'energetic', name: 'Энергичный', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=90&w=1200', category: 'Энергичный', tags: ['активный', 'мощный'] },
    { id: 'calm', name: 'Спокойный', img: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=90&w=1200', category: 'Спокойный', tags: ['умиротворенный', 'мягкий'] },
    { id: 'dynamic', name: 'Динамичный', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=90&w=1200', category: 'Динамичный', tags: ['быстрый', 'подвижный'] },
    { id: 'refined', name: 'Утонченный', img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=90&w=1200', category: 'Утонченный', tags: ['отполированный', 'совершенный'] },
    { id: 'striking', name: 'Броский', img: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&q=90&w=1200', category: 'Броский', tags: ['запоминающийся', 'яркий'] },
    { id: 'balanced', name: 'Сбалансированный', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=90&w=1200', category: 'Сбалансированный', tags: ['гармоничный', 'пропорциональный'] },
  ];

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    target.src = '';
  };

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (stepIndex === 0) {
      if (formData.brandName.length < 2) {
        newErrors.brandName = 'Название должно содержать минимум 2 символа';
      } else if (formData.brandName.length > 50) {
        newErrors.brandName = 'Название не должно превышать 50 символов';
      }
    }
    
    if (stepIndex === 1) {
      if (!formData.niche) {
        newErrors.niche = 'Пожалуйста, выберите нишу';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(step)) {
      return;
    }

    if (step === 1) {
      // Переход на шаг 3 - открываем полноэкранный режим
      setIsFullscreen(true);
    } else if (step < 2) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        onComplete({
          ...formData,
          selectedDesign: selectedDesign,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDesignSelect = (design: GeneratedDesign) => {
    setSelectedDesign(design);
    setFormData({ ...formData, style: design.parameters.style.type });
    setIsFullscreen(false);
    setShowLogoSelector(true); // Показываем селектор логотипов
  };

  const handleLogoSelect = (logo: LogoVariant) => {
    setSelectedLogo(logo);
    setShowLogoSelector(false);
    // Завершаем wizard с выбранным дизайном и логотипом
    setLoading(true);
    setTimeout(() => {
      // Подготавливаем данные для API - только те поля, которые ожидает схема валидации
      const projectData = {
        brandName: formData.brandName,
        niche: formData.niche,
        style: formData.style || selectedDesign?.parameters?.style?.id || 'minimalist',
        colors: formData.colors,
        goals: formData.goals,
        // Дополнительные данные сохраняем в metadata для будущего использования
        metadata: {
          selectedDesignId: selectedDesign?.id,
          selectedLogoId: logo?.id,
          designPreview: selectedDesign?.preview,
          logoPreview: logo?.preview,
        },
      };
      onComplete(projectData);
      setLoading(false);
    }, 500);
  };

  const handleFullscreenBack = () => {
    setIsFullscreen(false);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setErrors({});
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !loading) {
        handleNext();
      } else if (e.key === 'Escape' && step > 0) {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, loading, formData]);

  const isBrandNameValid = formData.brandName.length >= 2 && formData.brandName.length <= 50;

  const progressPercentage = ((step + 1) / 3) * 100;

  // Показываем селектор логотипов
  if (showLogoSelector && selectedDesign) {
    return (
      <LogoSelector
        brandName={formData.brandName}
        selectedDesign={selectedDesign}
        onSelect={handleLogoSelect}
        onBack={() => {
          setShowLogoSelector(false);
          setIsFullscreen(true);
        }}
      />
    );
  }

  // Показываем полноэкранный селектор на шаге 3
  if (isFullscreen && step === 1) {
    return (
      <FullscreenDesignSelector
        brandName={formData.brandName}
        niche={formData.niche}
        onSelect={handleDesignSelect}
        onBack={handleFullscreenBack}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Улучшенный индикатор прогресса */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 sm:gap-3 flex-1">
            {[0, 1, 2].map((i) => (
              <motion.div
              key={i} 
                initial={{ width: i <= step ? 48 : 12 }}
                animate={{ width: i <= step ? 48 : 12 }}
                transition={{ duration: 0.3 }}
                className={`h-3 rounded-full transition-all ${
                  i < step 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                    : i === step 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                    : 'bg-slate-200'
                }`}
            />
          ))}
          </div>
          <span className="text-slate-500 font-semibold text-sm sm:text-base ml-4">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="text-center">
          <span className="text-slate-400 font-medium text-sm sm:text-base">
            Шаг {step + 1} из 3
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.98 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden"
        >
          {/* Градиентный акцент */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          {/* Шаг 1: Название бренда */}
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                  Как называется ваш бренд?
                </h2>
              </div>
              
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Например: Constructor AI"
                    className={`w-full p-4 sm:p-5 text-lg sm:text-xl border-2 rounded-2xl focus:outline-none transition-all ${
                      errors.brandName
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
                        : isBrandNameValid
                        ? 'border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                    }`}
                    value={formData.brandName}
                    onChange={(e) => {
                      setFormData({ ...formData, brandName: e.target.value });
                      if (errors.brandName) {
                        setErrors({ ...errors, brandName: '' });
                      }
                    }}
                    onBlur={() => validateStep(0)}
                  />
                  {isBrandNameValid && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <Check className="w-6 h-6 text-emerald-500" />
                    </motion.div>
                  )}
                </div>
                {errors.brandName && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-center gap-2 text-rose-600 text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.brandName}</span>
                  </motion.div>
                )}
                {isBrandNameValid && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-emerald-600 text-sm font-medium"
                  >
                    Отлично! Название подходит
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* Шаг 2: Выбор ниши */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                  В какой нише вы работаете?
                </h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <AnimatePresence>
                  {niches.map((niche, index) => (
                    <motion.button
                      key={niche.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setFormData({ ...formData, niche: niche.id });
                        if (errors.niche) {
                          setErrors({ ...errors, niche: '' });
                        }
                      }}
                      className={`group relative p-4 sm:p-5 rounded-2xl border-2 transition-all text-left ${
                        formData.niche === niche.id
                          ? `border-transparent bg-gradient-to-br ${niche.gradient} text-white shadow-xl scale-105`
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
                      }`}
                    >
                      <div className={`mb-3 ${formData.niche === niche.id ? 'text-white' : niche.color}`}>
                        {niche.icon}
                      </div>
                      <h3 className={`font-bold text-sm sm:text-base mb-1 ${
                        formData.niche === niche.id ? 'text-white' : 'text-slate-900'
                      }`}>
                        {niche.name}
                      </h3>
                      <p className={`text-xs sm:text-sm ${
                        formData.niche === niche.id ? 'text-white/90' : 'text-slate-500'
                      }`}>
                        {niche.description}
                      </p>
                      {formData.niche === niche.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
              
              {errors.niche && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 text-rose-600 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.niche}</span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Шаг 3: Дизайн для вдохновения */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg">
                  <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                  Дизайн для вдохновения
                </h2>
              </div>

              {/* Фильтры по категориям */}
              <div className="mb-6 flex flex-wrap gap-2">
                {categories.map((category) => {
                  const count = category === 'all' 
                    ? templates.length 
                    : templates.filter(t => t.category === category).length;
                  return (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`filter-transition px-4 py-2 rounded-xl text-sm font-semibold relative ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg glow-effect'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {category === 'all' ? 'Все' : category}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        selectedCategory === category
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Grid с прокруткой */}
              <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  <AnimatePresence mode="wait">
                    {filteredTemplates.map((template, index) => (
                      <motion.button
                        key={template.id}
                        initial={{ opacity: 0, scale: 0.8, rotateX: 10, y: 30 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotateX: -10, y: -30 }}
                        transition={{ 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }}
                        onClick={() => setFormData({ ...formData, style: template.id })}
                        className={`card-3d group relative overflow-hidden rounded-2xl border-2 card-shadow-hover will-change-transform ${
                          formData.style === template.id
                            ? 'border-indigo-500 card-3d-selected glow-pulse'
                            : 'border-slate-200 hover:border-indigo-300'
                        }`}
                        whileHover={{ 
                          scale: 1.03,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {/* Sparkle эффекты для выбранной карточки */}
                        {formData.style === template.id && (
                          <>
                            <div className="sparkle" />
                            <div className="sparkle" />
                            <div className="sparkle" />
                            <div className="sparkle" />
                          </>
                        )}
                        
                        {/* Shine эффект */}
                        <div className="shine-effect" />
                        
                        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                          <img
                            src={template.img}
                            alt={template.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
                            onError={handleImageError}
                            loading="lazy"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                          />
                          
                          {/* Shimmer overlay при загрузке */}
                          <div className="absolute inset-0 shimmer-image opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          
                          {/* Улучшенный overlay с градиентом */}
                          <motion.div 
                            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4 transition-opacity ${
                              formData.style === template.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                            initial={false}
                            animate={{ opacity: formData.style === template.id ? 1 : 0 }}
                          >
                            <div className="w-full">
                              <motion.h3 
                                className="text-white font-bold text-sm mb-1"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                {template.name}
                              </motion.h3>
                              <motion.p 
                                className="text-white/90 text-xs mb-2"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                              >
                                {template.category}
                              </motion.p>
                              <div className="flex flex-wrap gap-1">
                                {template.tags.slice(0, 2).map((tag, i) => (
                                  <motion.span
                                    key={tag}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 + i * 0.05 }}
                                    className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-[10px] font-medium"
                                  >
                                    {tag}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
          </div>

                        {/* Улучшенный индикатор выбора */}
                        {formData.style === template.id && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-2 shadow-xl glow-effect z-10"
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                        
                        {/* Glow эффект при hover */}
                        <div className={`absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl ${
                          formData.style === template.id 
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 opacity-50'
                            : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                        }`} style={{ zIndex: -1 }} />
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* Кнопки навигации */}
          <div className="flex justify-between gap-4 mt-8 sm:mt-10">
            <button
              disabled={step === 0 || loading}
              onClick={handleBack}
              className={`flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold transition-all ${
                step === 0 || loading
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100 active:scale-95'
              }`}
            >
              <ChevronLeft className="w-5 h-5" /> 
              <span className="hidden sm:inline">Назад</span>
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Генерация...</span>
                </>
              ) : step === 2 ? (
                <>
                  <span>Запустить генерацию</span>
                  <Rocket className="w-5 h-5" />
                </>
              ) : (
                <>
                  <span>Продолжить</span>
              <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
