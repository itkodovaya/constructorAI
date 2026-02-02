/**
 * Утилиты для работы с текстом
 */

export class TextUtils {
  /**
   * Обрезает текст до указанной длины
   */
  static truncate(text: string, maxLength: number, suffix: string = '...'): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Преобразует текст в slug (URL-friendly)
   */
  static slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Капитализирует первую букву
   */
  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Капитализирует каждое слово
   */
  static titleCase(text: string): string {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Подсчитывает слова в тексте
   */
  static wordCount(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Подсчитывает символы (без пробелов)
   */
  static charCount(text: string): number {
    return text.replace(/\s/g, '').length;
  }

  /**
   * Извлекает хештеги из текста
   */
  static extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w\u0400-\u04FF]+/g;
    return text.match(hashtagRegex) || [];
  }

  /**
   * Извлекает упоминания (@username)
   */
  static extractMentions(text: string): string[] {
    const mentionRegex = /@[\w\u0400-\u04FF]+/g;
    return text.match(mentionRegex) || [];
  }

  /**
   * Экранирует HTML
   */
  static escapeHtml(text: string): string {
    if (typeof document === 'undefined') {
      // Для Node.js окружения
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Форматирует число с разделителями
   */
  static formatNumber(num: number): string {
    return new Intl.NumberFormat('ru-RU').format(num);
  }
}

