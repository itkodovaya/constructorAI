# FAQ - Часто задаваемые вопросы

## Общие вопросы

### Как запустить проект?

**Быстрый способ:**
```bash
npm install
npm run dev
```

**Через Docker:**
```bash
docker-compose up --build
```

Подробнее в [README.md](README.md)

### Какие требования к системе?

- Node.js 18 или выше
- npm или yarn
- 2GB свободной памяти
- Для Docker: Docker Desktop или Docker Engine

### Где хранятся данные проекта?

Данные хранятся в `backend/data/projects.json`. При первом запуске файл создается автоматически.

## AI и генерация

### Как использовать реальный AI вместо заглушек?

1. Получите API ключи:
   - OpenAI: https://platform.openai.com/api-keys
   - Stable Diffusion: https://platform.stability.ai/

2. Создайте `backend/.env`:
```env
AI_USE_MOCK=false
OPENAI_API_KEY=your_key_here
STABLE_DIFFUSION_API_KEY=your_key_here
```

3. Перезапустите backend сервер

### Сколько стоит использование AI?

- OpenAI GPT-4: ~$0.03 за 1K токенов
- Stable Diffusion: зависит от провайдера
- По умолчанию используются бесплатные заглушки

## Технические вопросы

### Как изменить порт backend?

В `backend/.env`:
```env
PORT=3002
```

Или через переменную окружения:
```bash
PORT=3002 npm run dev
```

### Как настроить CORS?

В `backend/src/index.ts` измените настройки:
```typescript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Как добавить новый тип блока?

1. Добавьте тип в `backend/src/services/layout.service.ts`
2. Добавьте рендеринг в `frontend/src/components/SiteBuilder.tsx`
3. Добавьте экспорт в `backend/src/services/export.service.ts`

## Развертывание

### Как развернуть на VPS?

1. Установите Node.js и npm
2. Склонируйте репозиторий
3. Установите зависимости: `npm install`
4. Настройте `.env` файлы
5. Запустите: `npm run build && npm start`
6. Настройте Nginx как reverse proxy

### Как использовать с PostgreSQL?

Текущая версия использует JSON файлы. Для PostgreSQL:
1. Установите `pg` и `pg-pool`
2. Создайте схему БД
3. Замените `ProjectsService` на работу с PostgreSQL
4. Обновите миграции

### Как настроить SSL/HTTPS?

Используйте Let's Encrypt с Certbot:
```bash
certbot --nginx -d yourdomain.com
```

Или настройте через Docker с Traefik.

## Проблемы и решения

### Белый экран в браузере

1. Проверьте консоль браузера (F12)
2. Убедитесь, что backend запущен на порту 3001
3. Проверьте `frontend/.env` - правильный ли `VITE_API_URL`
4. Очистите кеш браузера

### Ошибка "Failed to fetch projects"

1. Проверьте, что backend сервер запущен
2. Проверьте `http://localhost:3001/health`
3. Проверьте CORS настройки
4. Проверьте логи backend

### Данные не сохраняются

1. Проверьте права на запись в `backend/data/`
2. Убедитесь, что директория `data` существует
3. Проверьте логи на ошибки записи

### Docker контейнер не запускается

1. Проверьте логи: `docker-compose logs`
2. Убедитесь, что порты не заняты
3. Проверьте `.env` файлы
4. Попробуйте пересобрать: `docker-compose up --build`

## Производительность

### Как оптимизировать для продакшена?

1. Используйте production build: `npm run build`
2. Включите gzip compression в Nginx
3. Настройте кеширование статики
4. Используйте CDN для статических файлов
5. Настройте мониторинг (Sentry, LogRocket)

### Как уменьшить размер бандла?

1. Используйте code splitting
2. Lazy load компоненты
3. Оптимизируйте изображения
4. Удалите неиспользуемые зависимости

## Безопасность

### Как защитить API ключи?

- Никогда не коммитьте `.env` файлы
- Используйте секреты в CI/CD
- Храните ключи в переменных окружения
- Используйте vault для продакшена

### Как настроить аутентификацию?

Текущая версия не имеет аутентификации. Для добавления:
1. Установите `jsonwebtoken` и `bcrypt`
2. Создайте endpoints для регистрации/входа
3. Добавьте middleware для проверки токенов
4. Обновите frontend для работы с токенами

## Интеграции

### Как подключить Telegram Bot?

1. Создайте бота через @BotFather
2. Получите API токен
3. Добавьте токен в настройки проекта
4. Используйте примеры из `frontend/src/examples/integrations.ts`

### Как подключить Яндекс.Метрику?

1. Создайте счетчик в Яндекс.Метрике
2. Получите ID счетчика
3. Добавьте скрипт в `index.html`
4. Используйте `trackYandexMetrica()` из примеров

## Дополнительно

### Как добавить новый язык?

1. Добавьте переводы в `backend/src/services/translate.service.ts`
2. Обновите UI компоненты для поддержки языка
3. Добавьте переключатель языка в интерфейс

### Как кастомизировать стили?

Используйте Tailwind CSS классы или создайте кастомные стили в `frontend/src/index.css`

### Где найти примеры кода?

Смотрите:
- `frontend/src/examples/` - примеры использования API
- `docs/EXAMPLES.md` - примеры кода
- `docs/API.md` - документация API

## Поддержка

Если проблема не решена:
1. Проверьте [Issues на GitHub](https://github.com/your-repo/issues)
2. Создайте новый Issue с описанием проблемы
3. Приложите логи и скриншоты

