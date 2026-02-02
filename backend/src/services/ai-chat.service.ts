/**
 * AI Chat Service для интерактивного ассистента
 * Поддерживает диалог с AI для помощи с дизайном и контентом
 */

import { AIService } from './ai.service';
import { ProjectsService } from './projects.service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'layout' | 'image' | 'color';
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  type?: 'text' | 'layout' | 'image' | 'color';
  data?: any;
}

export class AIChatService {
  /**
   * Обработка сообщения пользователя и генерация ответа
   */
  static async chat(projectId: string | null, userMessage: string): Promise<ChatResponse> {
    // Получаем информацию о проекте, если есть
    let projectContext = '';
    if (projectId) {
      try {
        const project = await ProjectsService.getById(projectId);
        if (project) {
          projectContext = `Проект: ${project.brandName}, ниша: ${project.niche}, стиль: ${project.style}`;
        }
      } catch (error) {
        console.error('Failed to load project context:', error);
      }
    }

    // Определяем тип запроса
    const messageLower = userMessage.toLowerCase();
    let responseType: 'text' | 'layout' | 'image' | 'color' = 'text';
    
    if (messageLower.includes('макет') || messageLower.includes('layout') || messageLower.includes('структур')) {
      responseType = 'layout';
    } else if (messageLower.includes('изображен') || messageLower.includes('картинк') || messageLower.includes('фото')) {
      responseType = 'image';
    } else if (messageLower.includes('цвет') || messageLower.includes('палитр') || messageLower.includes('color')) {
      responseType = 'color';
    }

    // Формируем промпт для AI
    const systemPrompt = `Ты профессиональный AI-ассистент для дизайна и создания контента. 
Ты помогаешь пользователям создавать сайты, презентации и бренд-киты.
${projectContext ? `Контекст проекта: ${projectContext}` : ''}

Твои возможности:
- Предлагать макеты и структуру страниц
- Переоформлять и улучшать текст
- Подбирать изображения и иллюстрации
- Помогать с выбором цветов и палитр
- Отвечать на вопросы о дизайне

Отвечай дружелюбно, профессионально и конкретно. Предлагай конкретные решения.`;

    const userPrompt = userMessage;

    // Генерируем ответ через AI
    const aiResponse = await AIService.generateText(
      `${systemPrompt}\n\nВопрос пользователя: ${userPrompt}\n\nОтветь на вопрос и предложи конкретные действия.`,
      300
    );

    // Генерируем предложения в зависимости от типа запроса
    const suggestions = this.generateSuggestions(responseType, userMessage);

    return {
      message: aiResponse,
      suggestions,
      type: responseType,
    };
  }

  /**
   * Генерация предложений в зависимости от типа запроса
   */
  private static generateSuggestions(
    type: 'text' | 'layout' | 'image' | 'color',
    userMessage: string
  ): string[] {
    const messageLower = userMessage.toLowerCase();

    switch (type) {
      case 'layout':
        return [
          'Создать макет главной страницы с hero-секцией',
          'Добавить секцию "О нас" с командой',
          'Предложить структуру для лендинга'
        ];
      
      case 'image':
        return [
          'Подобрать изображения для hero-секции',
          'Найти иллюстрации для секции услуг',
          'Сгенерировать фоновое изображение'
        ];
      
      case 'color':
        return [
          'Подобрать современную палитру',
          'Создать градиентную схему',
          'Предложить контрастные цвета'
        ];
      
      case 'text':
      default:
        return [
          'Улучшить текст для секции "О нас"',
          'Создать призыв к действию (CTA)',
          'Написать описание для услуг'
        ];
    }
  }

  /**
   * Получение предложений по типу
   */
  static async getSuggestions(
    projectId: string | null,
    type: 'layout' | 'text' | 'image' | 'color'
  ): Promise<any> {
    const project = projectId ? await ProjectsService.getById(projectId) : null;
    
    switch (type) {
      case 'layout':
        return {
          suggestions: [
            {
              id: 'hero-section',
              name: 'Hero секция',
              description: 'Главная секция с заголовком и CTA',
              blocks: ['hero', 'cta']
            },
            {
              id: 'about-section',
              name: 'Секция "О нас"',
              description: 'Информация о компании с командой',
              blocks: ['about', 'team']
            },
            {
              id: 'services-section',
              name: 'Секция услуг',
              description: 'Карточки с услугами и описаниями',
              blocks: ['services', 'pricing']
            }
          ]
        };
      
      case 'text':
        return {
          suggestions: await this.generateTextSuggestions(project)
        };
      
      case 'image':
        return {
          suggestions: await this.generateImageSuggestions(project)
        };
      
      case 'color':
        return {
          suggestions: await this.generateColorSuggestions(project)
        };
      
      default:
        return { suggestions: [] };
    }
  }

  private static async generateTextSuggestions(project: any) {
    const prompts = [
      'Напиши привлекательный заголовок для главной страницы',
      'Создай описание компании в 2-3 предложениях',
      'Напиши призыв к действию для кнопки'
    ];

    const suggestions = [];
    for (const prompt of prompts) {
      const text = await AIService.generateText(prompt, 100);
      suggestions.push({
        text,
        prompt,
        type: prompt.includes('заголовок') ? 'heading' : prompt.includes('CTA') ? 'cta' : 'description'
      });
    }

    return suggestions;
  }

  private static async generateImageSuggestions(project: any) {
    const style = project?.style || 'modern';
    const niche = project?.niche || 'business';
    
    return [
      {
        prompt: `${style} ${niche} hero image`,
        description: 'Главное изображение для hero-секции',
        type: 'hero'
      },
      {
        prompt: `${style} ${niche} background pattern`,
        description: 'Фоновый паттерн',
        type: 'background'
      },
      {
        prompt: `${style} ${niche} illustration`,
        description: 'Иллюстрация для секции',
        type: 'illustration'
      }
    ];
  }

  private static async generateColorSuggestions(project: any) {
    const currentPalette = project?.brandAssets?.palette || [];
    const style = project?.style || 'modern';

    const palettes = {
      modern: [
        ['#2563eb', '#1e40af', '#3b82f6', '#60a5fa'],
        ['#7c3aed', '#6d28d9', '#8b5cf6', '#a78bfa'],
        ['#059669', '#047857', '#10b981', '#34d399']
      ],
      minimal: [
        ['#000000', '#ffffff', '#f3f4f6', '#6b7280'],
        ['#1f2937', '#f9fafb', '#e5e7eb', '#9ca3af']
      ],
      vibrant: [
        ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'],
        ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b']
      ]
    };

    const stylePalettes = palettes[style as keyof typeof palettes] || palettes.modern;
    
    return stylePalettes.map((palette, idx) => ({
      id: `palette-${idx}`,
      colors: palette,
      name: `Палитра ${idx + 1}`,
      description: `Гармоничная палитра в стиле ${style}`
    }));
  }
}

