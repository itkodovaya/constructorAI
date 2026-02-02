/**
 * Утилиты для мобильной оптимизации
 */

/**
 * Определение мобильного устройства
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Определение типа устройства
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Touch события
 */
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * PWA: Проверка установки
 */
export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

/**
 * PWA: Запрос на установку
 */
export const promptPWAInstall = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return true;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return false;
  }
};

/**
 * Генерация манифеста PWA
 */
export const generatePWAManifest = (config: {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  icons: Array<{ src: string; sizes: string; type: string }>;
}): string => {
  const manifest = {
    name: config.name,
    short_name: config.shortName,
    description: config.description,
    start_url: '/',
    display: 'standalone',
    background_color: config.backgroundColor,
    theme_color: config.themeColor,
    icons: config.icons,
  };

  return JSON.stringify(manifest, null, 2);
};

/**
 * Оптимизация изображений для мобильных устройств
 */
export const optimizeImageForMobile = (
  src: string,
  width: number = 800
): string => {
  // Добавляем параметры для оптимизации
  if (src.includes('?')) {
    return `${src}&w=${width}&q=80&auto=format`;
  }
  return `${src}?w=${width}&q=80&auto=format`;
};

/**
 * Lazy loading для мобильных устройств
 */
export const lazyLoadMobile = (element: HTMLElement, callback: () => void) => {
  if (!('IntersectionObserver' in window)) {
    callback();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(element);
        }
      });
    },
    {
      rootMargin: '50px',
    }
  );

  observer.observe(element);
};

/**
 * Viewport meta tag helper
 */
export const setViewportMeta = (config: {
  width?: string;
  initialScale?: number;
  maximumScale?: number;
  userScalable?: boolean;
}) => {
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    document.head.appendChild(viewport);
  }

  const content = [
    config.width ? `width=${config.width}` : 'width=device-width',
    config.initialScale ? `initial-scale=${config.initialScale}` : 'initial-scale=1.0',
    config.maximumScale ? `maximum-scale=${config.maximumScale}` : 'maximum-scale=5.0',
    config.userScalable !== undefined ? `user-scalable=${config.userScalable ? 'yes' : 'no'}` : 'user-scalable=yes',
  ].join(', ');

  viewport.setAttribute('content', content);
};

