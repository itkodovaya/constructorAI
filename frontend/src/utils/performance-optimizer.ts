/**
 * Утилиты для оптимизации производительности
 */

/**
 * Ленивая загрузка изображений
 */
export const lazyLoadImage = (img: HTMLImageElement, src: string) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.unobserve(img);
        }
      });
    });
    observer.observe(img);
  } else {
    // Fallback для старых браузеров
    img.src = src;
  }
};

/**
 * Оптимизация изображений - конвертация в WebP/AVIF
 */
export const optimizeImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Определяем оптимальный размер
        const maxWidth = 1920;
        const maxHeight = 1080;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Конвертируем в WebP если поддерживается
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                type: 'image/webp',
              });
              resolve(optimizedFile);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          0.85
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Извлечение критического CSS
 */
export const extractCriticalCSS = (): string => {
  const criticalSelectors = [
    'body',
    'h1, h2, h3, h4, h5, h6',
    '.hero',
    '.header',
    '.navigation',
    '.button',
    '.btn',
  ];

  const styles: string[] = [];
  const sheets = Array.from(document.styleSheets);

  sheets.forEach((sheet) => {
    try {
      const rules = Array.from(sheet.cssRules || sheet.cssRules);
      rules.forEach((rule) => {
        if (rule instanceof CSSStyleRule) {
          const selector = rule.selectorText;
          if (criticalSelectors.some((crit) => selector.includes(crit))) {
            styles.push(rule.cssText);
          }
        }
      });
    } catch (e) {
      // CORS или другие ошибки
    }
  });

  return styles.join('\n');
};

/**
 * Preload критических ресурсов
 */
export const preloadCriticalResources = (resources: string[]) => {
  resources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = resource.endsWith('.css') ? 'style' : resource.endsWith('.js') ? 'script' : 'image';
    link.href = resource;
    document.head.appendChild(link);
  });
};

/**
 * Debounce функция
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle функция
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Виртуализация списка для больших данных
 */
export const virtualizeList = <T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  scrollTop: number
): { startIndex: number; endIndex: number; visibleItems: T[] } => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  return {
    startIndex,
    endIndex,
    visibleItems: items.slice(startIndex, endIndex),
  };
};

/**
 * Кэширование с TTL
 */
export class TTLCache<K, V> {
  private cache = new Map<K, { value: V; expiry: number }>();

  constructor(private ttl: number) {}

  set(key: K, value: V): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl,
    });
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * Мониторинг производительности
 */
export const performanceMonitor = {
  measure(name: string, fn: () => void): number {
    const start = performance.now();
    fn();
    const end = performance.now();
    const duration = end - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  },

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return result;
  },

  getMetrics(): {
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
  } {
    const metrics: any = {};

    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'paint') {
              if (entry.name === 'first-contentful-paint') {
                metrics.fcp = entry.startTime;
              }
            }
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.renderTime || entry.loadTime;
            }
            if (entry.entryType === 'first-input') {
              metrics.fid = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              if (!(entry as any).hadRecentInput) {
                metrics.cls = (metrics.cls || 0) + (entry as any).value;
              }
            }
          }
        });

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (e) {
        console.warn('Performance monitoring not fully supported');
      }
    }

    return metrics;
  },
};

