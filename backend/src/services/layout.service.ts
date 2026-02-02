export interface Block {
  id: string;
  type: 'hero' | 'features' | 'gallery' | 'text' | 'footer' | 'pricing' | 'testimonials' | 'faq';
  content: any;
  style?: any;
}

export class LayoutService {
  static generateDefaultLayout(brandName: string, niche: string): Block[] {
    const blocks: Block[] = [
      {
        id: 'hero-1',
        type: 'hero',
        content: {
          title: `Добро пожаловать в ${brandName}`,
          subtitle: `Лучшие решения в нише ${niche} специально для вас.`,
          buttonText: 'Узнать больше'
        }
      },
      {
        id: 'features-1',
        type: 'features',
        content: {
          items: [
            { title: 'Качество', description: 'Мы гарантируем высшее качество.' },
            { title: 'Скорость', description: 'Быстрое выполнение задач.' },
            { title: 'Надежность', description: 'Нам доверяют тысячи клиентов.' }
          ]
        }
      },
      {
        id: 'pricing-1',
        type: 'pricing',
        content: {
          title: 'Тарифные планы',
          plans: [
            { name: 'Старт', price: '0', features: ['Базовый функционал', '1 проект', 'Поддержка сообщества'] },
            { name: 'Про', price: '49', features: ['Все функции', 'Безлимит проектов', 'Приоритетная поддержка'], popular: true }
          ]
        }
      },
      {
        id: 'footer-1',
        type: 'footer',
        content: {
          text: `© 2026 ${brandName}. Все права защищены.`
        }
      }
    ];

    return blocks;
  }
}

