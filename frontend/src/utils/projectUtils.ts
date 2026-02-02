/**
 * Утилиты для работы с проектами
 */

import { DateUtils } from './dateUtils';
import { ColorUtils } from './colorUtils';
import { TextUtils } from './textUtils';

export const ProjectUtils = {
  /**
   * Генерирует уникальный ID для проекта
   */
  generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  },

  /**
   * Форматирует дату для отображения
   */
  formatDate(date: string, format: 'short' | 'long' | 'relative' = 'short'): string {
    return DateUtils.formatDate(date, format);
  },

  /**
   * Получает цвет из палитры по индексу
   */
  getColorFromPalette(palette: string[] | undefined, index: number): string {
    if (!palette || palette.length === 0) {
      return '#2563eb'; // Дефолтный синий
    }
    return palette[index % palette.length];
  },

  /**
   * Валидирует HEX цвет
   */
  isValidHexColor(color: string): boolean {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  },

  /**
   * Генерирует палитру из базового цвета
   */
  generatePalette(baseColor: string): string[] {
    return ColorUtils.generatePalette(baseColor);
  },

  /**
   * Форматирует текст
   */
  formatText(text: string, maxLength?: number): string {
    if (maxLength) {
      return TextUtils.truncate(text, maxLength);
    }
    return text;
  },

  /**
   * Экспортирует проект в JSON
   */
  exportToJSON(project: any): string {
    return JSON.stringify(project, null, 2);
  },

  /**
   * Импортирует проект из JSON
   */
  importFromJSON(json: string): any {
    try {
      return JSON.parse(json);
    } catch (error) {
      throw new Error('Неверный формат JSON');
    }
  },

  /**
   * Копирует текст в буфер обмена
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  },

  /**
   * Скачивает файл
   */
  downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};

