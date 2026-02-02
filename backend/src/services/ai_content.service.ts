export class AIContentService {
  private static contentLibrary: Record<string, any> = {
    tech: {
      header: { logo: "TechFlow AI", links: ["Solutions", "Technology", "Contact"] },
      hero: { title: "Будущее IT уже здесь", subtitle: "Масштабируемые решения для вашего стартапа с использованием передовых технологий AI." },
      features: [
        { title: "Быстрый запуск", description: "Развертывание инфраструктуры за считанные минуты.", icon: "Zap" },
        { title: "Безопасность", description: "Сквозное шифрование и защита данных по стандарту Tier-4.", icon: "Shield" },
        { title: "AI-Оптимизация", description: "Наши алгоритмы сами находят узкие места в вашем коде.", icon: "Sparkles" }
      ],
      pricing: [
        { name: "Starter", price: "49", features: ["1 Project", "Basic Support", "API Access"], popular: false },
        { name: "Business", price: "199", features: ["10 Projects", "Priority Support", "Advanced AI"], popular: true },
        { name: "Enterprise", price: "Custom", features: ["Unlimited Projects", "Dedicated Manager", "Fine-tuning"], popular: false }
      ],
      faq: [
        { question: "Как быстро я могу начать?", answer: "Сразу после регистрации вам будут доступны все инструменты для развертывания проекта." },
        { question: "Есть ли бесплатный период?", answer: "Да, мы предоставляем 14 дней пробного периода для всех Pro-функций." }
      ]
    },
    beauty: {
      header: { logo: "Lumina Beauty", links: ["Services", "Gallery", "Booking"] },
      hero: { title: "Естественная красота в каждом движении", subtitle: "Профессиональный уход и инновационные методики преображения." },
      features: [
        { title: "Органический уход", description: "Используем только проверенные натуральные компоненты.", icon: "Heart" },
        { title: "Эксперты", description: "Мастера с международным опытом и сертификацией.", icon: "Star" },
        { title: "Атмосфера", description: "Уютное пространство для вашего отдыха и релаксации.", icon: "Layout" }
      ],
      pricing: [
        { name: "Basic", price: "2500", features: ["Консультация", "Уход за лицом", "Массаж"], popular: false },
        { name: "Premium", price: "7000", features: ["Полный комплекс", "Макияж", "Подарочный набор"], popular: true }
      ],
      faq: [
        { question: "Нужна ли предварительная запись?", answer: "Да, рекомендуем записываться за 2-3 дня до планируемого визита." }
      ]
    },
    education: {
      header: { logo: "EduVantage", links: ["Courses", "Mentors", "Reviews"] },
      hero: { title: "Знания, которые меняют жизнь", subtitle: "Онлайн-курсы от ведущих практиков рынка с гарантией трудоустройства." },
      features: [
        { title: "Практика", description: "80% обучения — это реальные кейсы и проекты.", icon: "BarChart3" },
        { title: "Менторство", description: "Поддержка от опытных наставников на каждом этапе.", icon: "MessageSquare" },
        { title: "Комьюнити", description: "Доступ в закрытый клуб выпускников и работодателей.", icon: "Globe" }
      ],
      pricing: [
        { name: "Self-paced", price: "15000", features: ["Доступ к лекциям", "Проверка тестов"], popular: false },
        { name: "With Mentor", price: "45000", features: ["Личные созвоны", "Проверка проектов", "Трудоустройство"], popular: true }
      ],
      faq: [
        { question: "Выдаете ли вы сертификат?", answer: "Да, по окончании курса вы получите именной сертификат установленного образца." }
      ]
    }
  };

  static generatePageContent(niche: string, brandName: string) {
    const nicheKey = this.contentLibrary[niche] ? niche : 'tech';
    const nicheContent = this.contentLibrary[nicheKey];
    
    return [
      {
        id: 'header-' + Date.now(),
        type: 'header',
        content: {
          logo: brandName,
          links: nicheContent.header.links,
          padding: 'py-4'
        }
      },
      {
        id: 'hero-' + Date.now(),
        type: 'hero',
        content: {
          title: nicheContent.hero.title,
          subtitle: nicheContent.hero.subtitle,
          padding: 'py-32',
          align: 'center'
        }
      },
      {
        id: 'features-' + (Date.now() + 1),
        type: 'features',
        content: {
          title: 'Почему выбирают ' + brandName,
          items: nicheContent.features,
          padding: 'py-20'
        }
      },
      {
        id: 'pricing-' + (Date.now() + 2),
        type: 'pricing',
        content: {
          title: 'Наши тарифы',
          plans: nicheContent.pricing,
          padding: 'py-20'
        }
      },
      {
        id: 'faq-' + (Date.now() + 3),
        type: 'faq',
        content: {
          title: 'Остались вопросы?',
          items: nicheContent.faq,
          padding: 'py-20'
        }
      },
      {
        id: 'footer-' + (Date.now() + 4),
        type: 'footer',
        content: {
          text: `© 2026 ${brandName}. Все права защищены.`,
          padding: 'py-10'
        }
      }
    ];
  }
}
