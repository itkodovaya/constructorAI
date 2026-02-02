/**
 * Пресеты форматов для социальных сетей
 * Определяет размеры, соотношения сторон и безопасные зоны для разных платформ
 */

// Определяем тип через интерфейс для внутреннего использования
interface SocialFormat {
  id: string;
  name: string;
  platform: string;
  width: number;
  height: number;
  aspectRatio: string;
  safeZone?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  description: string;
  useCases: string[];
}

export const SOCIAL_FORMATS: SocialFormat[] = [
  // Instagram
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    platform: 'Instagram',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    safeZone: { top: 50, right: 50, bottom: 50, left: 50 },
    description: 'Квадратный пост для ленты Instagram',
    useCases: ['Основной контент', 'Фотографии', 'Инфографика']
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    platform: 'Instagram',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    safeZone: { top: 100, right: 50, bottom: 200, left: 50 },
    description: 'Вертикальный формат для Stories',
    useCases: ['Временный контент', 'Анонсы', 'За кулисами']
  },
  {
    id: 'instagram-reel',
    name: 'Instagram Reel',
    platform: 'Instagram',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    safeZone: { top: 100, right: 50, bottom: 200, left: 50 },
    description: 'Вертикальное видео для Reels',
    useCases: ['Видео контент', 'Тренды', 'Образовательный контент']
  },
  
  // Facebook
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    platform: 'Facebook',
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
    safeZone: { top: 40, right: 40, bottom: 40, left: 40 },
    description: 'Горизонтальный пост для ленты Facebook',
    useCases: ['Новости', 'Статьи', 'Промо-материалы']
  },
  {
    id: 'facebook-cover',
    name: 'Facebook Cover',
    platform: 'Facebook',
    width: 1640,
    height: 859,
    aspectRatio: '1.91:1',
    safeZone: { top: 100, right: 200, bottom: 100, left: 200 },
    description: 'Обложка страницы Facebook',
    useCases: ['Брендинг', 'Презентация компании']
  },
  {
    id: 'facebook-story',
    name: 'Facebook Story',
    platform: 'Facebook',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    safeZone: { top: 100, right: 50, bottom: 200, left: 50 },
    description: 'Вертикальный формат для Stories',
    useCases: ['Временный контент', 'Анонсы']
  },
  
  // Twitter/X
  {
    id: 'twitter-post',
    name: 'Twitter/X Post',
    platform: 'Twitter',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    safeZone: { top: 30, right: 30, bottom: 30, left: 30 },
    description: 'Горизонтальный пост для Twitter/X',
    useCases: ['Новости', 'Анонсы', 'Инфографика']
  },
  {
    id: 'twitter-header',
    name: 'Twitter/X Header',
    platform: 'Twitter',
    width: 1500,
    height: 500,
    aspectRatio: '3:1',
    safeZone: { top: 50, right: 200, bottom: 50, left: 200 },
    description: 'Шапка профиля Twitter/X',
    useCases: ['Брендинг', 'Презентация']
  },
  
  // LinkedIn
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    platform: 'LinkedIn',
    width: 1200,
    height: 627,
    aspectRatio: '1.91:1',
    safeZone: { top: 40, right: 40, bottom: 40, left: 40 },
    description: 'Пост для ленты LinkedIn',
    useCases: ['Профессиональный контент', 'B2B', 'Статьи']
  },
  {
    id: 'linkedin-cover',
    name: 'LinkedIn Cover',
    platform: 'LinkedIn',
    width: 1584,
    height: 396,
    aspectRatio: '4:1',
    safeZone: { top: 50, right: 200, bottom: 50, left: 200 },
    description: 'Обложка компании LinkedIn',
    useCases: ['Корпоративный брендинг']
  },
  
  // YouTube
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    platform: 'YouTube',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    safeZone: { top: 60, right: 60, bottom: 60, left: 60 },
    description: 'Превью для видео YouTube',
    useCases: ['Видео контент', 'Промо']
  },
  {
    id: 'youtube-channel-art',
    name: 'YouTube Channel Art',
    platform: 'YouTube',
    width: 2560,
    height: 1440,
    aspectRatio: '16:9',
    safeZone: { top: 200, right: 400, bottom: 200, left: 400 },
    description: 'Баннер канала YouTube',
    useCases: ['Брендинг канала']
  },
  
  // TikTok
  {
    id: 'tiktok-video',
    name: 'TikTok Video',
    platform: 'TikTok',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    safeZone: { top: 100, right: 50, bottom: 200, left: 50 },
    description: 'Вертикальное видео для TikTok',
    useCases: ['Видео контент', 'Тренды', 'Развлечения']
  },
  
  // VK
  {
    id: 'vk-post',
    name: 'VK Post',
    platform: 'VK',
    width: 1200,
    height: 800,
    aspectRatio: '3:2',
    safeZone: { top: 40, right: 40, bottom: 40, left: 40 },
    description: 'Пост для ленты VK',
    useCases: ['Новости', 'Промо', 'Контент']
  },
  {
    id: 'vk-cover',
    name: 'VK Cover',
    platform: 'VK',
    width: 1590,
    height: 400,
    aspectRatio: '3.98:1',
    safeZone: { top: 50, right: 200, bottom: 50, left: 200 },
    description: 'Обложка сообщества VK',
    useCases: ['Брендинг сообщества']
  },
  
  // Telegram
  {
    id: 'telegram-post',
    name: 'Telegram Post',
    platform: 'Telegram',
    width: 1200,
    height: 1200,
    aspectRatio: '1:1',
    safeZone: { top: 50, right: 50, bottom: 50, left: 50 },
    description: 'Пост для Telegram канала',
    useCases: ['Новости', 'Анонсы', 'Контент']
  },
  
  // Pinterest
  {
    id: 'pinterest-pin',
    name: 'Pinterest Pin',
    platform: 'Pinterest',
    width: 1000,
    height: 1500,
    aspectRatio: '2:3',
    safeZone: { top: 50, right: 50, bottom: 50, left: 50 },
    description: 'Вертикальный пин для Pinterest',
    useCases: ['Инфографика', 'DIY', 'Рецепты']
  },
];

// Тип для экспорта (используем typeof для совместимости с Vite)
export type SocialFormatType = typeof SOCIAL_FORMATS[number];

/**
 * Получить формат по ID
 */
export function getFormatById(id: string): SocialFormatType | undefined {
  return SOCIAL_FORMATS.find(format => format.id === id);
}

/**
 * Получить форматы для конкретной платформы
 */
export function getFormatsByPlatform(platform: string): SocialFormatType[] {
  return SOCIAL_FORMATS.filter(format => format.platform === platform);
}

/**
 * Получить все платформы
 */
export function getAllPlatforms(): string[] {
  return [...new Set(SOCIAL_FORMATS.map(format => format.platform))];
}

/**
 * Проверить, находится ли точка в безопасной зоне
 */
export function isInSafeZone(
  format: SocialFormatType,
  x: number,
  y: number
): boolean {
  if (!format.safeZone) return true;
  
  const { safeZone } = format;
  return (
    x >= safeZone.left &&
    x <= format.width - safeZone.right &&
    y >= safeZone.top &&
    y <= format.height - safeZone.bottom
  );
}
