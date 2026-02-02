/**
 * Сервис для управления темами и обложками
 * Поддерживает глобальные темы с готовыми блоками, цветами и типографикой
 */

import { v4 as uuidv4 } from 'uuid';

export interface Theme {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'modern' | 'classic' | 'bold' | 'elegant' | 'playful';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    palette: string[]; // Дополнительные цвета
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingSize: string;
    bodySize: string;
    lineHeight: string;
  };
  blocks: ThemeBlock[];
  coverImage?: string;
  preview?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  usageCount: number;
}

export interface ThemeBlock {
  id: string;
  type: string;
  name: string;
  preview: string;
  config: Record<string, any>;
}

// Предустановленные темы
const DEFAULT_THEMES: Theme[] = [
  {
    id: 'theme-minimal',
    name: 'Минимализм',
    description: 'Чистый и простой дизайн с акцентом на контент',
    category: 'minimal',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#666666',
      background: '#FFFFFF',
      text: '#000000',
      palette: ['#000000', '#FFFFFF', '#666666', '#F5F5F5'],
    },
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      headingSize: '2.5rem',
      bodySize: '1rem',
      lineHeight: '1.6',
    },
    blocks: [
      {
        id: 'block-hero-minimal',
        type: 'hero',
        name: 'Минималистичный Hero',
        preview: '',
        config: { layout: 'centered', showImage: false },
      },
      {
        id: 'block-text-minimal',
        type: 'text',
        name: 'Простой текст',
        preview: '',
        config: { alignment: 'left', maxWidth: '800px' },
      },
    ],
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date(),
    usageCount: 0,
  },
  {
    id: 'theme-modern',
    name: 'Современный',
    description: 'Современный дизайн с градиентами и анимациями',
    category: 'modern',
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      background: '#FFFFFF',
      text: '#1F2937',
      palette: ['#6366F1', '#8B5CF6', '#EC4899', '#F3F4F6'],
    },
    typography: {
      headingFont: 'Poppins, sans-serif',
      bodyFont: 'Inter, sans-serif',
      headingSize: '3rem',
      bodySize: '1.125rem',
      lineHeight: '1.75',
    },
    blocks: [
      {
        id: 'block-hero-modern',
        type: 'hero',
        name: 'Современный Hero',
        preview: '',
        config: { layout: 'split', showGradient: true },
      },
    ],
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date(),
    usageCount: 0,
  },
];

// Хранилище тем (в реальности - БД)
const themes: Theme[] = [...DEFAULT_THEMES];

export class ThemeService {
  /**
   * Получает все публичные темы
   */
  static getAllThemes(category?: string): Theme[] {
    let filtered = themes.filter((t) => t.isPublic);
    if (category) {
      filtered = filtered.filter((t) => t.category === category);
    }
    return filtered;
  }

  /**
   * Получает тему по ID
   */
  static getThemeById(themeId: string): Theme | null {
    return themes.find((t) => t.id === themeId) || null;
  }

  /**
   * Создает новую тему
   */
  static createTheme(userId: string, themeData: Omit<Theme, 'id' | 'createdAt' | 'usageCount'>): Theme {
    const theme: Theme = {
      ...themeData,
      id: uuidv4(),
      createdAt: new Date(),
      usageCount: 0,
    };

    themes.push(theme);
    console.log(`Theme ${theme.id} created by user ${userId}`);
    return theme;
  }

  /**
   * Применяет тему к проекту
   */
  static applyThemeToProject(projectId: string, themeId: string): Theme | null {
    const theme = this.getThemeById(themeId);
    if (!theme) {
      return null;
    }

    // Увеличиваем счетчик использования
    theme.usageCount++;

    // В реальности здесь была бы логика применения темы к проекту
    // (обновление цветов, типографики, добавление блоков)
    console.log(`Theme ${themeId} applied to project ${projectId}`);

    return theme;
  }

  /**
   * Получает темы пользователя
   */
  static getUserThemes(userId: string): Theme[] {
    return themes.filter((t) => t.createdBy === userId);
  }

  /**
   * Обновляет тему
   */
  static updateTheme(themeId: string, userId: string, updates: Partial<Theme>): Theme | null {
    const theme = themes.find((t) => t.id === themeId && t.createdBy === userId);
    if (!theme) {
      return null;
    }

    Object.assign(theme, updates);
    console.log(`Theme ${themeId} updated by user ${userId}`);
    return theme;
  }

  /**
   * Удаляет тему
   */
  static deleteTheme(themeId: string, userId: string): boolean {
    const index = themes.findIndex((t) => t.id === themeId && t.createdBy === userId);
    if (index === -1) {
      return false;
    }

    themes.splice(index, 1);
    console.log(`Theme ${themeId} deleted by user ${userId}`);
    return true;
  }

  /**
   * Получает популярные темы
   */
  static getPopularThemes(limit: number = 10): Theme[] {
    return themes
      .filter((t) => t.isPublic)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }
}

