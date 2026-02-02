/**
 * Сервис для локализации контента
 * Поддержка языковых вариантов блоков для разных локалей
 */

import { v4 as uuidv4 } from 'uuid';

export interface LocalizedContent {
  id: string;
  projectId: string;
  elementId: string; // ID блока, слайда, страницы
  elementType: 'block' | 'slide' | 'page' | 'asset';
  locale: string; // Код локали (ru, en, es, de, fr)
  content: Record<string, any>; // Локализованный контент
  metadata?: {
    translator?: string;
    translatedAt?: Date;
    autoTranslated?: boolean;
    quality?: number; // Оценка качества перевода (0-1)
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Locale {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

// Поддерживаемые локали
const SUPPORTED_LOCALES: Locale[] = [
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
];

// Хранилище локализованного контента (в реальности - БД)
const localizedContent: LocalizedContent[] = [];

export class ContentLocalizationService {
  /**
   * Получает список поддерживаемых локалей
   */
  static getSupportedLocales(): Locale[] {
    return SUPPORTED_LOCALES;
  }

  /**
   * Получает локализованный контент для элемента
   */
  static getLocalizedContent(
    projectId: string,
    elementId: string,
    locale: string
  ): LocalizedContent | null {
    return (
      localizedContent.find(
        (lc) =>
          lc.projectId === projectId &&
          lc.elementId === elementId &&
          lc.locale === locale
      ) || null
    );
  }

  /**
   * Получает все локали для элемента
   */
  static getElementLocales(
    projectId: string,
    elementId: string
  ): string[] {
    return localizedContent
      .filter(
        (lc) => lc.projectId === projectId && lc.elementId === elementId
      )
      .map((lc) => lc.locale);
  }

  /**
   * Создает или обновляет локализованный контент
   */
  static setLocalizedContent(
    projectId: string,
    elementId: string,
    elementType: LocalizedContent['elementType'],
    locale: string,
    content: Record<string, any>,
    metadata?: LocalizedContent['metadata']
  ): LocalizedContent {
    // Проверяем, поддерживается ли локаль
    if (!SUPPORTED_LOCALES.find((l) => l.code === locale)) {
      throw new Error(`Locale ${locale} is not supported`);
    }

    const existing = this.getLocalizedContent(projectId, elementId, locale);

    if (existing) {
      // Обновляем существующий
      existing.content = content;
      existing.metadata = { ...existing.metadata, ...metadata };
      existing.updatedAt = new Date();
      return existing;
    } else {
      // Создаем новый
      const localized: LocalizedContent = {
        id: uuidv4(),
        projectId,
        elementId,
        elementType,
        locale,
        content,
        metadata: {
          ...metadata,
          translatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      localizedContent.push(localized);
      return localized;
    }
  }

  /**
   * Автоматически переводит контент на другой язык
   */
  static async autoTranslate(
    projectId: string,
    elementId: string,
    sourceLocale: string,
    targetLocale: string,
    sourceContent: Record<string, any>
  ): Promise<LocalizedContent> {
    // В реальности здесь был бы вызов API перевода (Google Translate, DeepL, etc.)
    // Для демо возвращаем заглушку

    const translatedContent: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(sourceContent)) {
      if (typeof value === 'string') {
        // Заглушка перевода
        translatedContent[key] = `[${targetLocale}] ${value}`;
      } else {
        translatedContent[key] = value;
      }
    }

    return this.setLocalizedContent(
      projectId,
      elementId,
      'block', // По умолчанию
      targetLocale,
      translatedContent,
      {
        autoTranslated: true,
        quality: 0.8, // Оценка качества автоматического перевода
      }
    );
  }

  /**
   * Получает все локализованные версии проекта
   */
  static getProjectLocales(projectId: string): string[] {
    const locales = new Set<string>();
    localizedContent
      .filter((lc) => lc.projectId === projectId)
      .forEach((lc) => locales.add(lc.locale));
    return Array.from(locales);
  }

  /**
   * Копирует контент из одной локали в другую
   */
  static copyLocale(
    projectId: string,
    elementId: string,
    sourceLocale: string,
    targetLocale: string
  ): LocalizedContent | null {
    const source = this.getLocalizedContent(projectId, elementId, sourceLocale);
    if (!source) {
      return null;
    }

    return this.setLocalizedContent(
      projectId,
      elementId,
      source.elementType,
      targetLocale,
      { ...source.content },
      {
        ...source.metadata,
        autoTranslated: false,
      }
    );
  }

  /**
   * Удаляет локализованный контент
   */
  static deleteLocalizedContent(
    projectId: string,
    elementId: string,
    locale: string
  ): boolean {
    const index = localizedContent.findIndex(
      (lc) =>
        lc.projectId === projectId &&
        lc.elementId === elementId &&
        lc.locale === locale
    );

    if (index === -1) {
      return false;
    }

    localizedContent.splice(index, 1);
    return true;
  }

  /**
   * Получает статистику локализации проекта
   */
  static getLocalizationStats(projectId: string): {
    totalElements: number;
    localizedElements: Record<string, number>; // По локалям
    coverage: Record<string, number>; // Процент покрытия по локалям
  } {
    const projectContent = localizedContent.filter(
      (lc) => lc.projectId === projectId
    );

    const elementIds = new Set(projectContent.map((lc) => lc.elementId));
    const localizedByLocale: Record<string, Set<string>> = {};

    projectContent.forEach((lc) => {
      if (!localizedByLocale[lc.locale]) {
        localizedByLocale[lc.locale] = new Set();
      }
      localizedByLocale[lc.locale].add(lc.elementId);
    });

    const stats = {
      totalElements: elementIds.size,
      localizedElements: {} as Record<string, number>,
      coverage: {} as Record<string, number>,
    };

    Object.keys(localizedByLocale).forEach((locale) => {
      stats.localizedElements[locale] = localizedByLocale[locale].size;
      stats.coverage[locale] =
        elementIds.size > 0
          ? (localizedByLocale[locale].size / elementIds.size) * 100
          : 0;
    });

    return stats;
  }
}

