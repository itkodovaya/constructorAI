/**
 * Утилиты для работы с датами и временем
 */

export class DateUtils {
  /**
   * Форматирует дату для отображения
   */
  static formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    if (format === 'relative') {
      return this.getRelativeTime(d);
    }
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: format === 'long' ? 'long' : 'short',
      day: 'numeric',
    };
    
    return d.toLocaleDateString('ru-RU', options);
  }

  /**
   * Получает относительное время (2 часа назад, вчера и т.д.)
   */
  static getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} дн назад`;
    
    return this.formatDate(date, 'short');
  }

  /**
   * Проверяет, является ли дата сегодняшней
   */
  static isToday(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }

  /**
   * Добавляет дни к дате
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}

