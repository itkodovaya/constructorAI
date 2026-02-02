/**
 * Константы для платформы
 */

export const PLATFORM_CONFIG = {
  name: 'Constructor AI',
  version: '1.0.1',
  description: 'Платформа для создания брендов будущего',
  supportEmail: 'support@constructor.ai',
  website: 'https://constructor.ai',
};

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: {
      projects: 1,
      aiGenerations: 10,
      exports: 5,
      teamMembers: 1,
    },
  },
  pro: {
    name: 'Pro',
    price: 20,
    period: 'month',
    features: {
      projects: Infinity,
      aiGenerations: Infinity,
      exports: Infinity,
      teamMembers: 5,
    },
  },
  brandkit: {
    name: 'Brand Kit',
    price: 120,
    period: 'once',
    features: {
      projects: Infinity,
      aiGenerations: Infinity,
      exports: Infinity,
      teamMembers: Infinity,
    },
  },
} as const;

export const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'vk', name: 'VK', color: '#0077FF' },
  { id: 'telegram', name: 'Telegram', color: '#0088CC' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000' },
  { id: 'facebook', name: 'Facebook', color: '#1877F2' },
  { id: 'twitter', name: 'Twitter', color: '#1DA1F2' },
] as const;

export const BLOCK_TYPES = [
  'hero',
  'features',
  'gallery',
  'text',
  'pricing',
  'testimonials',
  'faq',
  'footer',
  'contact',
  'newsletter',
  'cta',
  'stats',
] as const;

export const BRAND_STYLES = [
  { id: 'minimalist', name: 'Минимализм', icon: '⚪' },
  { id: 'modern', name: 'Современный', icon: '🔷' },
  { id: 'classic', name: 'Классический', icon: '📜' },
  { id: 'creative', name: 'Креативный', icon: '🎨' },
  { id: 'corporate', name: 'Корпоративный', icon: '💼' },
] as const;

export const NICHE_OPTIONS = [
  'Технологии',
  'Красота и здоровье',
  'Образование',
  'Еда и рестораны',
  'Мода',
  'Финансы',
  'Недвижимость',
  'Спорт',
  'Развлечения',
  'Другое',
] as const;

