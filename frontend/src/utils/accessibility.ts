/**
 * Утилиты для обеспечения доступности (WCAG 2.1)
 */

/**
 * Проверка контрастности цветов
 * Возвращает true если контраст соответствует WCAG AA (4.5:1 для обычного текста, 3:1 для крупного)
 */
export function checkContrast(foreground: string, background: string, isLargeText: boolean = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Вычисление контрастного соотношения между двумя цветами
 */
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Вычисление относительной яркости цвета (0-1)
 */
function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Конвертация hex цвета в RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

/**
 * Получение контрастного цвета (черный или белый) для заданного фона
 */
export function getContrastColor(backgroundColor: string): string {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Проверка, является ли элемент видимым для скринридеров
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    !element.hasAttribute('aria-hidden')
  );
}

/**
 * Фокус на элементе с поддержкой скринридеров
 */
export function focusElement(element: HTMLElement | null, options?: { preventScroll?: boolean }) {
  if (!element) return;
  
  // Убеждаемся, что элемент доступен
  if (!element.hasAttribute('tabindex') && !['button', 'a', 'input', 'select', 'textarea'].includes(element.tagName.toLowerCase())) {
    element.setAttribute('tabindex', '-1');
  }
  
  element.focus(options);
  
  // Обновляем aria-live для скринридеров
  announceToScreenReader(element.textContent || element.getAttribute('aria-label') || '');
}

/**
 * Объявление текста для скринридеров
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Проверка поддержки клавиатурной навигации
 */
export function isKeyboardNavigation(event: KeyboardEvent): boolean {
  return ['Tab', 'Enter', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'].includes(event.key);
}

/**
 * Обработчик для клавиатурной навигации в меню
 */
export function handleMenuKeyboardNavigation(
  event: React.KeyboardEvent,
  items: any[],
  currentIndex: number,
  onSelect: (index: number) => void,
  onClose?: () => void
) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      onSelect((currentIndex + 1) % items.length);
      break;
    case 'ArrowUp':
      event.preventDefault();
      onSelect((currentIndex - 1 + items.length) % items.length);
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      onSelect(currentIndex);
      break;
    case 'Escape':
      event.preventDefault();
      onClose?.();
      break;
    case 'Home':
      event.preventDefault();
      onSelect(0);
      break;
    case 'End':
      event.preventDefault();
      onSelect(items.length - 1);
      break;
  }
}

/**
 * Генерация уникального ID для ARIA атрибутов
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Проверка соответствия WCAG уровня AA
 */
export interface WCAGCheckResult {
  passed: boolean;
  issues: string[];
  warnings: string[];
}

export function checkWCAGCompliance(element: HTMLElement): WCAGCheckResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Проверка наличия alt текста для изображений
  const images = element.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      issues.push(`Image ${index + 1} missing alt attribute`);
    }
  });

  // Проверка контрастности текста
  const textElements = element.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, label');
  textElements.forEach((el, index) => {
    const style = window.getComputedStyle(el);
    const color = style.color;
    const bgColor = style.backgroundColor;
    
    if (color && bgColor && color !== 'rgba(0, 0, 0, 0)' && bgColor !== 'rgba(0, 0, 0, 0)') {
      const fontSize = parseFloat(style.fontSize);
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && parseFloat(style.fontWeight) >= 700);
      
      if (!checkContrast(color, bgColor, isLargeText)) {
        warnings.push(`Text element ${index + 1} has insufficient contrast`);
      }
    }
  });

  // Проверка наличия label для форм
  const inputs = element.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    const id = input.getAttribute('id');
    const hasLabel = id && element.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel) {
      issues.push(`Form input ${index + 1} missing label`);
    }
  });

  // Проверка наличия заголовков
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length === 0) {
    warnings.push('No headings found - consider adding semantic headings');
  }

  return {
    passed: issues.length === 0,
    issues,
    warnings
  };
}

/**
 * Добавление skip links для навигации с клавиатуры
 */
export function addSkipLinks() {
  if (document.getElementById('skip-links')) return;

  const skipLinks = document.createElement('div');
  skipLinks.id = 'skip-links';
  skipLinks.className = 'skip-links';
  
  skipLinks.innerHTML = `
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <a href="#navigation" class="skip-link">Skip to navigation</a>
  `;
  
  document.body.insertBefore(skipLinks, document.body.firstChild);
}

/**
 * Инициализация доступности при загрузке страницы
 */
export function initAccessibility() {
  // Добавляем skip links
  addSkipLinks();
  
  // Устанавливаем язык документа
  if (!document.documentElement.lang) {
    document.documentElement.lang = 'ru';
  }
  
  // Добавляем ARIA live region для динамического контента
  if (!document.getElementById('aria-live-region')) {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }
}

