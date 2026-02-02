/**
 * Дополнительные типы блоков для сайта
 */

export const ADDITIONAL_BLOCK_TYPES = [
  {
    id: 'contact',
    name: 'Contact Form',
    icon: '📧',
    description: 'Форма обратной связи',
    defaultContent: {
      title: 'Свяжитесь с нами',
      subtitle: 'Мы всегда рады помочь',
      fields: [
        { type: 'text', label: 'Имя', required: true },
        { type: 'email', label: 'Email', required: true },
        { type: 'textarea', label: 'Сообщение', required: true },
      ],
      buttonText: 'Отправить',
    },
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    icon: '📬',
    description: 'Подписка на рассылку',
    defaultContent: {
      title: 'Подпишитесь на новости',
      subtitle: 'Получайте последние обновления',
      placeholder: 'Ваш email',
      buttonText: 'Подписаться',
    },
  },
  {
    id: 'cta',
    name: 'Call to Action',
    icon: '🚀',
    description: 'Призыв к действию',
    defaultContent: {
      title: 'Готовы начать?',
      subtitle: 'Присоединяйтесь к тысячам довольных клиентов',
      buttonText: 'Начать сейчас',
      buttonLink: '#',
    },
  },
  {
    id: 'stats',
    name: 'Statistics',
    icon: '📊',
    description: 'Статистика и цифры',
    defaultContent: {
      title: 'Наши достижения',
      items: [
        { value: '1000+', label: 'Довольных клиентов' },
        { value: '50+', label: 'Проектов' },
        { value: '99%', label: 'Удовлетворенность' },
      ],
    },
  },
];

/**
 * Продвинутые интерактивные блоки
 */
export const ADVANCED_BLOCK_TYPES = [
  {
    id: 'parallax-hero',
    name: 'Parallax Hero',
    icon: '🎬',
    description: 'Hero-секция с эффектом параллакса',
    category: 'interactive',
    defaultContent: {
      title: 'Welcome to the Future',
      subtitle: 'Experience amazing parallax effects',
      backgroundImage: '',
      overlay: true,
      overlayOpacity: 0.5,
      buttonText: 'Get Started',
      buttonLink: '#',
      padding: 'py-0',
    },
  },
  {
    id: 'video-hero',
    name: 'Video Background Hero',
    icon: '🎥',
    description: 'Hero с видео-фоном',
    category: 'interactive',
    defaultContent: {
      title: 'Amazing Video Experience',
      subtitle: 'Watch our story unfold',
      videoUrl: '',
      poster: '',
      overlay: true,
      overlayOpacity: 0.5,
      buttonText: 'Learn More',
      autoplay: true,
      loop: true,
      muted: true,
      padding: 'py-0',
    },
  },
  {
    id: 'particle-effects',
    name: 'Particle Effects',
    icon: '✨',
    description: 'Блок с эффектами частиц',
    category: 'interactive',
    defaultContent: {
      type: 'stars',
      intensity: 50,
      color: '#6366f1',
      title: 'Magical Experience',
      subtitle: 'With beautiful particle effects',
      padding: 'py-20',
    },
  },
  {
    id: 'timeline',
    name: 'Interactive Timeline',
    icon: '📅',
    description: 'Интерактивная временная шкала',
    category: 'interactive',
    defaultContent: {
      title: 'Our Journey',
      orientation: 'vertical',
      items: [
        {
          id: '1',
          date: '2024',
          title: 'Company Founded',
          description: 'We started our journey with a vision to change the world.',
          color: '#6366f1',
        },
        {
          id: '2',
          date: '2025',
          title: 'First Product Launch',
          description: 'Our first product revolutionized the industry.',
          color: '#8b5cf6',
        },
        {
          id: '3',
          date: '2026',
          title: 'Global Expansion',
          description: 'We expanded to serve customers worldwide.',
          color: '#ec4899',
        },
      ],
      padding: 'py-20',
    },
  },
  {
    id: 'countdown',
    name: 'Countdown Timer',
    icon: '⏰',
    description: 'Таймер обратного отсчета',
    category: 'interactive',
    defaultContent: {
      title: 'Limited Time Offer!',
      targetDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      padding: 'py-20',
    },
  },
  {
    id: 'scroll-animation',
    name: 'Scroll Animation',
    icon: '🎭',
    description: 'Блок с анимацией при скролле',
    category: 'interactive',
    defaultContent: {
      animation: 'fade-in',
      delay: 0,
      duration: 0.6,
      title: 'Animated Section',
      subtitle: 'This section animates as you scroll',
      padding: 'py-20',
    },
  },
];

/**
 * Бизнес-блоки
 */
export const BUSINESS_BLOCK_TYPES = [
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    icon: '🛍️',
    description: 'Продвинутая витрина продуктов',
    category: 'business',
    defaultContent: {
      title: 'Our Products',
      subtitle: 'Discover our amazing collection',
      products: [],
      columns: 3,
      showFilters: true,
      showSearch: true,
      padding: 'py-20',
    },
  },
  {
    id: 'pricing-calculator',
    name: 'Pricing Calculator',
    icon: '💰',
    description: 'Интерактивный калькулятор цен',
    category: 'business',
    defaultContent: {
      title: 'Calculate Your Price',
      subtitle: 'Choose the perfect plan for your needs',
      tiers: [
        {
          id: 'basic',
          name: 'Basic',
          basePrice: 29,
          unit: 'month',
          features: ['Feature 1', 'Feature 2', 'Feature 3'],
        },
        {
          id: 'pro',
          name: 'Pro',
          basePrice: 79,
          unit: 'month',
          features: ['All Basic features', 'Feature 4', 'Feature 5'],
          popular: true,
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          basePrice: 199,
          unit: 'month',
          features: ['All Pro features', 'Feature 6', 'Feature 7', 'Priority Support'],
        },
      ],
      padding: 'py-20',
    },
  },
  {
    id: 'booking-system',
    name: 'Booking System',
    icon: '📅',
    description: 'Система бронирования с календарем',
    category: 'business',
    defaultContent: {
      title: 'Book Your Appointment',
      subtitle: 'Select a date and time that works for you',
      serviceName: 'Consultation',
      duration: 60,
      padding: 'py-20',
    },
  },
  {
    id: 'live-chat',
    name: 'Live Chat Widget',
    icon: '💬',
    description: 'Виджет живого чата',
    category: 'business',
    defaultContent: {
      title: 'Chat with us',
      agentName: 'Support Agent',
      agentStatus: 'online',
      position: 'bottom-right',
      padding: 'py-20',
    },
  },
  {
    id: 'social-proof',
    name: 'Social Proof',
    icon: '👥',
    description: 'Блоки социального доказательства',
    category: 'business',
    defaultContent: {
      type: 'users-online',
      count: 127,
      items: [],
      padding: 'py-20',
    },
  },
  {
    id: 'progress-tracker',
    name: 'Progress Tracker',
    icon: '📊',
    description: 'Трекер прогресса',
    category: 'business',
    defaultContent: {
      orientation: 'horizontal',
      showDescriptions: true,
      steps: [
        { id: '1', title: 'Step 1', description: 'Initial setup', completed: true },
        { id: '2', title: 'Step 2', description: 'Configuration', completed: true, current: true },
        { id: '3', title: 'Step 3', description: 'Review', completed: false },
        { id: '4', title: 'Step 4', description: 'Complete', completed: false },
      ],
      padding: 'py-20',
    },
  },
];

/**
 * Медиа-блоки
 */
export const MEDIA_BLOCK_TYPES = [
  {
    id: 'image-gallery',
    name: 'Image Gallery',
    icon: '🖼️',
    description: 'Галерея изображений с lightbox',
    category: 'media',
    defaultContent: {
      title: 'Our Gallery',
      images: [],
      columns: 4,
      showFilters: true,
      lightbox: true,
      padding: 'py-20',
    },
  },
  {
    id: 'before-after',
    name: 'Before/After Slider',
    icon: '🔄',
    description: 'Слайдер сравнения до/после',
    category: 'media',
    defaultContent: {
      beforeImage: '',
      afterImage: '',
      beforeLabel: 'Before',
      afterLabel: 'After',
      orientation: 'horizontal',
      padding: 'py-20',
    },
  },
];

// Export all block types
export const NEW_BLOCK_TYPES = [
  {
    id: '3d-showcase',
    name: '3D Showcase',
    icon: '🎨',
    description: '3D презентация с Three.js',
    category: 'advanced',
    defaultContent: {
      title: '3D Showcase',
      backgroundColor: '#f0f0f0',
      autoRotate: true,
    },
  },
  {
    id: 'interactive-map',
    name: 'Interactive Map',
    icon: '🗺️',
    description: 'Интерактивная карта с маркерами',
    category: 'advanced',
    defaultContent: {
      title: 'Find Us',
      center: { lat: 55.7558, lng: 37.6173 },
      zoom: 13,
      markers: [],
    },
  },
  {
    id: 'form-builder',
    name: 'Form Builder',
    icon: '📝',
    description: 'Визуальный конструктор форм',
    category: 'business',
    defaultContent: {
      title: 'Contact Us',
      subtitle: 'Fill out the form below',
      fields: [
        { id: '1', type: 'text', label: 'Name', required: true },
        { id: '2', type: 'email', label: 'Email', required: true },
        { id: '3', type: 'textarea', label: 'Message', required: true },
      ],
      submitText: 'Submit',
    },
  },
  {
    id: 'chart-builder',
    name: 'Chart Builder',
    icon: '📊',
    description: 'Конструктор графиков и диаграмм',
    category: 'business',
    defaultContent: {
      title: 'Analytics',
      type: 'bar',
      data: [
        { label: 'Jan', value: 100 },
        { label: 'Feb', value: 150 },
        { label: 'Mar', value: 200 },
      ],
    },
  },
  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    icon: '🛒',
    description: 'Корзина покупок',
    category: 'business',
    defaultContent: {
      items: [],
      currency: '$',
    },
  },
];

export const ALL_BLOCK_TYPES = [
  ...ADDITIONAL_BLOCK_TYPES,
  ...ADVANCED_BLOCK_TYPES,
  ...BUSINESS_BLOCK_TYPES,
  ...MEDIA_BLOCK_TYPES,
  ...NEW_BLOCK_TYPES,
];

