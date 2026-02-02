/**
 * Тестовые данные для разработки и демонстрации
 */

export const MOCK_PROJECTS = [
  {
    id: 'demo-1',
    brandName: 'TechStart',
    niche: 'Технологии',
    style: 'modern',
    colors: ['#2563eb', '#1e40af'],
    goals: ['website', 'logo'],
    brandAssets: {
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzI1NjNlYiIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VDwvdGV4dD48L3N2Zz4=',
      palette: ['#2563eb', '#1e40af', '#3b82f6'],
      fonts: ['Inter', 'Roboto'],
    },
    pages: [
      {
        id: '1',
        title: 'Home',
        blocks: [
          {
            id: 'hero-1',
            type: 'hero',
            content: {
              title: 'Welcome to TechStart',
              subtitle: 'Инновационные решения для вашего бизнеса',
            },
          },
          {
            id: 'features-1',
            type: 'features',
            content: {
              items: ['Быстрая разработка', 'Современные технологии', 'Поддержка 24/7'],
            },
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    brandName: 'BeautyBrand',
    niche: 'Красота и здоровье',
    style: 'creative',
    colors: ['#ec4899', '#f472b6'],
    goals: ['brandkit', 'social'],
    brandAssets: {
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VjNDg5OSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QjwvdGV4dD48L3N2Zz4=',
      palette: ['#ec4899', '#f472b6', '#fbcfe8'],
      fonts: ['Playfair Display', 'Lato'],
    },
    pages: [
      {
        id: '1',
        title: 'Home',
        blocks: [
          {
            id: 'hero-1',
            type: 'hero',
            content: {
              title: 'BeautyBrand',
              subtitle: 'Красота начинается здесь',
            },
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_BLOCKS = [
  {
    id: 'hero-example',
    type: 'hero',
    content: {
      title: 'Добро пожаловать',
      subtitle: 'Создавайте удивительные бренды с помощью AI',
      buttonText: 'Начать',
    },
  },
  {
    id: 'features-example',
    type: 'features',
    content: {
      items: [
        { title: 'Быстро', description: 'Создайте бренд за минуты' },
        { title: 'Просто', description: 'Интуитивный интерфейс' },
        { title: 'Умно', description: 'AI помогает на каждом шаге' },
      ],
    },
  },
  {
    id: 'pricing-example',
    type: 'pricing',
    content: {
      title: 'Выберите план',
      plans: [
        {
          name: 'Старт',
          price: '0',
          features: ['1 проект', 'Базовые функции'],
        },
        {
          name: 'Про',
          price: '20',
          features: ['Безлимит проектов', 'Все функции'],
          popular: true,
        },
      ],
    },
  },
];

export const MOCK_SOCIAL_POSTS = [
  {
    id: 'post-1',
    platform: 'instagram',
    content: 'Новый бренд создан! 🚀',
    image: 'https://via.placeholder.com/1080x1080',
    scheduledTime: new Date().toISOString(),
  },
  {
    id: 'post-2',
    platform: 'vk',
    content: 'Делимся нашим новым дизайном',
    image: 'https://via.placeholder.com/1200x800',
    scheduledTime: new Date().toISOString(),
  },
];

