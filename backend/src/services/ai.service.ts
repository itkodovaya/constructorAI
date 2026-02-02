/**
 * AI Service для работы с локальным AI Engine
 * Обеспечивает полную автономность без внешних интеграций
 */

interface AIConfig {
  localEndpoint?: string; // Эндпоинт локального инференс-сервера (например, Ollama)
  modelName: string;      // Название локальной модели
  useMock: boolean;       // Использовать встроенный движок если локальный сервер недоступен
}

export class AIService {
  private static config: AIConfig = {
    localEndpoint: process.env.LOCAL_AI_ENDPOINT || 'http://localhost:11434/api',
    modelName: process.env.LOCAL_MODEL_NAME || 'llama3',
    useMock: process.env.AI_USE_MOCK !== 'false',
  };

  static configure(config: Partial<AIConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Генерация текста через локальный инференс или встроенный движок
   */
  static async generateText(prompt: string, maxTokens: number = 500): Promise<string> {
    if (this.config.useMock) {
      return this.mockGenerateText(prompt);
    }

    try {
      // Пример интеграции с локальным Ollama API
      const response = await fetch(`${this.config.localEndpoint}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.modelName,
          prompt: prompt,
          stream: false,
          options: { num_predict: maxTokens }
        }),
      });

      if (!response.ok) {
        throw new Error(`Local AI error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || this.mockGenerateText(prompt);
    } catch (error) {
      console.error('Local AI generation failed, using internal engine:', error);
      return this.mockGenerateText(prompt);
    }
  }

  /**
   * Генерация изображения через локальный Stable Diffusion (Automatic1111 или ComfyUI API)
   */
  static async generateImage(prompt: string, width: number = 512, height: number = 512): Promise<string> {
    if (this.config.useMock) {
      return this.mockGenerateImage(prompt);
    }

    try {
      // Пример интеграции с локальным SD WebUI API
      const response = await fetch('http://localhost:7860/sdapi/v1/txt2img', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          width,
          height,
          steps: 20,
        }),
      });

      if (!response.ok) {
        throw new Error(`Local SD error: ${response.statusText}`);
      }

      const data = await response.json();
      return `data:image/png;base64,${data.images[0]}` || this.mockGenerateImage(prompt);
    } catch (error) {
      console.error('Local image generation failed, using internal engine:', error);
      return this.mockGenerateImage(prompt);
    }
  }

  /**
   * Перевод текста (используется локальная модель)
   */
  static async translateText(text: string, targetLang: 'ru' | 'en'): Promise<string> {
    const prompt = `Translate the following text to ${targetLang === 'ru' ? 'Russian' : 'English'}. Keep the style and tone.\n\nText: ${text}`;
    return this.generateText(prompt, 1000);
  }

  /**
   * Семантический поиск по базе знаний (RAG)
   */
  static async knowledgeSearch(knowledgeBaseId: string, query: string): Promise<string> {
    const { RagService } = require('./rag.service');
    const relevantChunks = await RagService.searchKnowledge(knowledgeBaseId, query);
    
    const context = relevantChunks.map((c: any) => c.content).join('\n---\n');
    const prompt = `Используй следующий контекст для ответа на вопрос пользователя.\n\nКОНТЕКСТ:\n${context}\n\nВОПРОС: ${query}`;
    
    return this.generateText(prompt);
  }

  /**
   * Генерация контента для бренда (текст + изображение)
   */
  static async generateBrandContent(brandName: string, niche: string, style: string): Promise<{
    description: string;
    slogan: string;
    logoPrompt: string;
  }> {
    const prompt = `Создай описание бренда "${brandName}" в нише "${niche}" со стилем "${style}". Включи краткое описание, слоган и промпт для генерации логотипа.`;

    if (this.config.useMock) {
      return this.mockGenerateBrandContent(brandName, niche, style);
    }

    try {
      const response = await this.generateText(prompt, 300);
      // Парсинг ответа (в реальности нужен более сложный парсинг)
      return this.parseBrandContent(response, brandName, niche, style);
    } catch (error) {
      console.error('Brand content generation failed, using mock:', error);
      return this.mockGenerateBrandContent(brandName, niche, style);
    }
  }

  // Mock методы (заглушки)
  private static mockGenerateText(prompt: string): string {
    return `[AI Generated] ${prompt.substring(0, 100)}... Это автоматически сгенерированный контент на основе вашего запроса. В реальной версии здесь будет результат работы GPT-4.`;
  }

  private static mockGenerateImage(prompt: string): string {
    // Возвращаем SVG placeholder
    const svg = `
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="#f0f0f0"/>
        <text x="256" y="256" font-family="Arial" font-size="20" fill="#666" text-anchor="middle">
          AI Generated Image
        </text>
        <text x="256" y="280" font-family="Arial" font-size="14" fill="#999" text-anchor="middle">
          ${prompt.substring(0, 30).replace(/[<>]/g, '')}
        </text>
      </svg>
    `;
    // В Node.js используем Buffer
    const Buffer = require('buffer').Buffer;
    return `data:image/svg+xml;base64,${Buffer.from(svg.trim()).toString('base64')}`;
  }

  private static mockTranslate(text: string, targetLang: 'ru' | 'en'): string {
    // Простой словарь для демонстрации
    const dictionary: Record<string, Record<string, string>> = {
      'Welcome': { ru: 'Добро пожаловать', en: 'Welcome' },
      'Hello': { ru: 'Привет', en: 'Hello' },
    };

    if (dictionary[text] && dictionary[text][targetLang]) {
      return dictionary[text][targetLang];
    }

    return targetLang === 'en' ? `[EN] ${text}` : `[RU] ${text}`;
  }

  private static mockGenerateBrandContent(brandName: string, niche: string, style: string): {
    description: string;
    slogan: string;
    logoPrompt: string;
  } {
    return {
      description: `${brandName} - это инновационный бренд в нише ${niche}, сочетающий стиль ${style} с современными технологиями.`,
      slogan: `Создаем будущее вместе с ${brandName}`,
      logoPrompt: `Modern ${style} logo for ${brandName}, ${niche} industry, professional, minimalist`,
    };
  }

  private static parseBrandContent(response: string, brandName: string, niche: string, style: string): {
    description: string;
    slogan: string;
    logoPrompt: string;
  } {
    // Упрощенный парсинг (в реальности нужен более сложный)
    return {
      description: response.substring(0, 200),
      slogan: response.split('\n').find(line => line.includes('слоган')) || `Создаем будущее вместе с ${brandName}`,
      logoPrompt: `Modern ${style} logo for ${brandName}, ${niche} industry`,
    };
  }
}
