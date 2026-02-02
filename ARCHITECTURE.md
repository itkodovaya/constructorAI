# Архитектура ConstructorAI

## Обзор

ConstructorAI построен на микросервисной архитектуре с возможностью работы как монолитного приложения для разработки и как распределенной системы для продакшена.

## Структура проекта

```
constructor/
├── backend/              # Монолитный backend (для разработки)
│   ├── src/
│   │   ├── services/     # Бизнес-логика
│   │   ├── middleware/   # Middleware функции
│   │   ├── utils/        # Утилиты
│   │   └── index.ts      # Точка входа
│   └── data/             # JSON хранилище
│
├── frontend/             # React приложение
│   ├── src/
│   │   ├── components/   # React компоненты
│   │   ├── services/     # API клиенты
│   │   ├── utils/        # Утилиты
│   │   ├── i18n/         # Переводы
│   │   └── styles/       # Стили
│
├── services/             # Микросервисы
│   ├── api-gateway/      # API Gateway
│   ├── auth-service/     # Аутентификация
│   ├── projects-service/ # Проекты
│   ├── ai-service/       # AI функции
│   └── export-service/  # Экспорт
│
└── mobile/               # Мобильное приложение
    └── src/
        ├── screens/      # Экраны
        ├── services/     # API клиенты
        └── navigation/   # Навигация
```

## Микросервисы

### API Gateway (порт 3000)
- Единая точка входа для всех запросов
- Маршрутизация к соответствующим сервисам
- Health checks для всех сервисов
- В будущем: rate limiting, аутентификация, кэширование

### Auth Service (порт 3003)
- Регистрация и аутентификация пользователей
- Управление сессиями
- JWT токены
- Роли и права доступа

### Projects Service (порт 3004)
- CRUD операции с проектами
- Хранение данных проектов
- Управление версиями

### AI Service (порт 3005)
- Генерация текста
- Генерация изображений
- Генерация эмбеддингов
- AI чат

### Export Service (порт 3006)
- Экспорт в HTML
- Экспорт в PDF
- Экспорт в ZIP (бренд-киты)

## Frontend архитектура

### Компоненты
- **Модальные окна**: PricingModal, ShareModal, AIAssistantChat и др.
- **Редакторы**: SiteBuilder, PresentationBuilder, GraphicsEditor
- **Утилиты**: CommandPalette, HistorySidebar, HelpWidget
- **Специальные**: SemanticSearch, CollaborationIndicator, Marketplace

### State Management
- React hooks (useState, useEffect)
- Локальное состояние компонентов
- API клиент для синхронизации с backend

### Стилизация
- Tailwind CSS v4
- Кастомные CSS модули для специальных случаев
- Framer Motion для анимаций

## Backend архитектура

### Сервисы
- **ProjectsService**: Управление проектами
- **BrandService**: Бренд-киты
- **LayoutService**: Макеты и блоки
- **AIService**: AI функции
- **ExportService**: Экспорт
- **CommentsService**: Комментарии
- **RealtimeSyncService**: Realtime синхронизация
- **SemanticSearchService**: Семантический поиск
- **AIChatService**: AI чат
- **CustomComponentsService**: Пользовательские компоненты
- **PluginsService**: Плагины
- **ABTestService**: A/B тесты
- **MarketplaceService**: Маркетплейс

### Хранение данных
- **Текущее**: JSON файлы (`backend/data/projects.json`)
- **Планируется**: PostgreSQL с Prisma ORM

## Коммуникация

### HTTP/REST
- Основной протокол для синхронных запросов
- JSON формат данных
- CORS для cross-origin запросов

### WebSockets
- Realtime синхронизация (порт 3002)
- Совместное редактирование
- Уведомления о действиях пользователей

## Безопасность

### Текущая реализация
- Базовая аутентификация через JWT
- Валидация данных через Zod
- Санитизация пользовательского ввода
- Sandbox для плагинов

### Планируется
- Rate limiting
- HTTPS/SSL
- Шифрование данных
- Аудит логи
- Соответствие GDPR/ФЗ-152

## Масштабирование

### Горизонтальное масштабирование
- Микросервисы могут масштабироваться независимо
- API Gateway может балансировать нагрузку
- Stateless сервисы для легкого масштабирования

### Вертикальное масштабирование
- Оптимизация запросов к БД
- Кэширование частых запросов
- CDN для статики

## Мониторинг

### Health Checks
- `/health` endpoint в каждом сервисе
- Проверка доступности зависимостей
- Метрики производительности

### Планируется
- Prometheus для метрик
- Grafana для визуализации
- ELK stack для логов
- Sentry для отслеживания ошибок

## Развертывание

### Docker
- Dockerfile для каждого сервиса
- Docker Compose для локальной разработки
- Готовность к Kubernetes

### CI/CD
- GitHub Actions (планируется)
- Автоматические тесты
- Автоматический деплой

## Производительность

### Оптимизации
- Lazy loading компонентов
- Code splitting
- Мемоизация вычислений
- Оптимизация изображений

### Планируется
- Redis для кэширования
- CDN для статики
- Database индексы
- Query оптимизация

