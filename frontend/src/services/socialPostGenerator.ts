/**
 * Сервис для генерации изображений для социальных сетей
 * Создает готовые посты на основе бренд-кита, контента и формата
 */

import { SOCIAL_FORMATS } from '../utils/socialFormats';

// Используем typeof для получения типа из массива
export type SocialFormat = typeof SOCIAL_FORMATS[number];

export interface SocialPostContent {
  title: string;
  subtitle?: string;
  cta?: string;
  logoUrl?: string;
  backgroundImage?: string;
  backgroundColor?: string;
}

export interface SocialPostOptions {
  format: SocialFormat;
  content: SocialPostContent;
  brandAssets: {
    palette: string[];
    fonts: string[];
    logoUrl?: string;
  };
}

export interface GeneratedPost {
  formatId: string;
  formatName: string;
  imageData: string; // Base64 или URL
  width: number;
  height: number;
}

export class SocialPostGenerator {
  /**
   * Генерирует изображение поста для социальных сетей
   * В MVP использует Canvas API для создания статичного изображения
   */
  static async generatePost(options: SocialPostOptions): Promise<GeneratedPost> {
    const { format, content, brandAssets } = options;
    
    // Создаем canvas
    const canvas = document.createElement('canvas');
    canvas.width = format.width;
    canvas.height = format.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context not available');
    }
    
    // Фон
    const bgColor = content.backgroundColor || brandAssets.palette[0] || '#2563eb';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, format.width, format.height);
    
    // Если есть фоновое изображение, загружаем его
    if (content.backgroundImage) {
      try {
        const img = await this.loadImage(content.backgroundImage);
        ctx.drawImage(img, 0, 0, format.width, format.height);
      } catch (error) {
        console.warn('Failed to load background image:', error);
      }
    }
    
    // Безопасная зона (опционально, для отладки)
    if (format.safeZone) {
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        format.safeZone.left,
        format.safeZone.top,
        format.width - format.safeZone.left - format.safeZone.right,
        format.height - format.safeZone.top - format.safeZone.bottom
      );
    }
    
    // Логотип (если есть)
    if (content.logoUrl || brandAssets.logoUrl) {
      try {
        const logoUrl = content.logoUrl || brandAssets.logoUrl;
        if (logoUrl) {
          const logo = await this.loadImage(logoUrl);
          const logoSize = Math.min(format.width, format.height) * 0.15;
          const logoX = format.safeZone?.left || 50;
          const logoY = format.safeZone?.top || 50;
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        }
      } catch (error) {
        console.warn('Failed to load logo:', error);
      }
    }
    
    // Заголовок
    if (content.title) {
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${this.getFontSize(format, 'title')}px ${brandAssets.fonts[0] || 'Arial'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      const titleX = format.width / 2;
      const titleY = (format.safeZone?.top || 100) + (format.height * 0.2);
      
      // Обводка для читаемости
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 4;
      ctx.strokeText(content.title, titleX, titleY);
      ctx.fillText(content.title, titleX, titleY);
    }
    
    // Подзаголовок
    if (content.subtitle) {
      ctx.fillStyle = '#f0f0f0';
      ctx.font = `${this.getFontSize(format, 'subtitle')}px ${brandAssets.fonts[0] || 'Arial'}`;
      ctx.textAlign = 'center';
      
      const subtitleY = (format.safeZone?.top || 100) + (format.height * 0.35);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 3;
      ctx.strokeText(content.subtitle, format.width / 2, subtitleY);
      ctx.fillText(content.subtitle, format.width / 2, subtitleY);
    }
    
    // CTA кнопка (если есть)
    if (content.cta) {
      const buttonWidth = format.width * 0.3;
      const buttonHeight = format.height * 0.08;
      const buttonX = (format.width - buttonWidth) / 2;
      const buttonY = format.height - (format.safeZone?.bottom || 100) - buttonHeight - 50;
      
      // Фон кнопки
      ctx.fillStyle = brandAssets.palette[1] || '#1e40af';
      ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
      
      // Текст кнопки
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${this.getFontSize(format, 'cta')}px ${brandAssets.fonts[0] || 'Arial'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(content.cta, format.width / 2, buttonY + buttonHeight / 2);
    }
    
    // Конвертируем в base64
    const imageData = canvas.toDataURL('image/png');
    
    return {
      formatId: format.id,
      formatName: format.name,
      imageData,
      width: format.width,
      height: format.height
    };
  }
  
  /**
   * Генерирует серию постов для разных форматов
   */
  static async generatePostSeries(
    formats: SocialFormat[],
    content: SocialPostContent,
    brandAssets: any
  ): Promise<GeneratedPost[]> {
    const posts = await Promise.all(
      formats.map(format => 
        this.generatePost({ format, content, brandAssets })
      )
    );
    return posts;
  }
  
  /**
   * Загружает изображение
   */
  private static loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }
  
  /**
   * Определяет размер шрифта в зависимости от формата и типа текста
   */
  private static getFontSize(format: SocialFormat, type: 'title' | 'subtitle' | 'cta'): number {
    const baseSize = Math.min(format.width, format.height) / 20;
    
    switch (type) {
      case 'title':
        return baseSize * 2.5;
      case 'subtitle':
        return baseSize * 1.5;
      case 'cta':
        return baseSize * 1.2;
      default:
        return baseSize;
    }
  }
  
  /**
   * Экспортирует изображение в файл
   */
  static downloadImage(post: GeneratedPost, filename?: string): void {
    const link = document.createElement('a');
    link.download = filename || `${post.formatId}_${Date.now()}.png`;
    link.href = post.imageData;
    link.click();
  }
  
  /**
   * Конвертирует base64 в Blob
   */
  static base64ToBlob(base64: string): Blob {
    const parts = base64.split(',');
    const contentType = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
  }
}

