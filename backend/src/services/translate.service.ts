export class TranslateService {
  private static dictionary: Record<string, Record<string, string>> = {
    "Будущее IT уже здесь": { en: "The Future of IT is Here" },
    "Масштабируемые решения для вашего стартапа с использованием передовых технологий AI.": { en: "Scalable solutions for your startup using advanced AI technologies." },
    "Начать сейчас": { en: "Get Started" },
    "Быстрый запуск": { en: "Quick Launch" },
    "Безопасность": { en: "Security" },
    "AI-Оптимизация": { en: "AI-Optimization" },
    "О компании": { en: "About Company" },
    "Все права защищены": { en: "All rights reserved" },
    "Welcome to": { ru: "Добро пожаловать в" },
    "Your amazing slogan goes here": { ru: "Ваш потрясающий слоган" }
  };

  static translate(text: string, targetLang: 'ru' | 'en'): string {
    const lang = targetLang.toLowerCase();
    if (this.dictionary[text] && this.dictionary[text][lang]) {
      return this.dictionary[text][lang];
    }
    // Если точного совпадения нет, имитируем "умный" перевод
    return lang === 'en' ? `[EN] ${text}` : `[RU] ${text}`;
  }

  static translateBlocks(blocks: any[], targetLang: 'ru' | 'en'): any[] {
    return blocks.map(block => ({
      ...block,
      content: this.translateObject(block.content, targetLang)
    }));
  }

  private static translateObject(obj: any, targetLang: 'ru' | 'en'): any {
    if (typeof obj === 'string') return this.translate(obj, targetLang);
    if (Array.isArray(obj)) return obj.map(item => this.translateObject(item, targetLang));
    if (typeof obj === 'object' && obj !== null) {
      const newObj: any = {};
      for (const key in obj) {
        newObj[key] = this.translateObject(obj[key], targetLang);
      }
      return newObj;
    }
    return obj;
  }
}

