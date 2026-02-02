export interface Slide {
  id: string;
  title: string;
  content: string;
  type: 'title' | 'content' | 'features' | 'contact';
}

export class PresentationService {
  static generate(brandName: string, niche: string): Slide[] {
    return [
      {
        id: '1',
        title: brandName,
        content: `Инновационное решение в сфере ${niche}`,
        type: 'title'
      },
      {
        id: '2',
        title: 'Проблема',
        content: 'Современный рынок требует новых подходов и автоматизации процессов.',
        type: 'content'
      },
      {
        id: '3',
        title: 'Наше решение',
        content: `Мы предлагаем уникальную платформу ${brandName}, которая решает ключевые боли клиентов.`,
        type: 'content'
      },
      {
        id: '4',
        title: 'Преимущества',
        content: 'Скорость, Качество, Инновации, Эффективность',
        type: 'features'
      },
      {
        id: '5',
        title: 'Контакты',
        content: 'Свяжитесь с нами для демонстрации продукта.',
        type: 'contact'
      }
    ];
  }
}

