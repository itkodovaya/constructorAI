# Микросервисная архитектура ConstructorAI

## Структура

```
services/
├── api-gateway/      # API Gateway - единая точка входа
├── auth-service/     # Сервис аутентификации и авторизации
├── projects-service/ # Сервис управления проектами
├── ai-service/       # Сервис AI функций
├── export-service/   # Сервис экспорта проектов
└── docker-compose.yml # Оркестрация всех сервисов
```

## Запуск

### Локальная разработка

```bash
# Запуск всех сервисов через Docker Compose
cd services
docker-compose up

# Или запуск каждого сервиса отдельно
cd api-gateway && npm install && npm run dev
cd auth-service && npm install && npm run dev
cd projects-service && npm install && npm run dev
cd ai-service && npm install && npm run dev
cd export-service && npm install && npm run dev
```

### Production

```bash
cd services
docker-compose up -d
```

## Порты

- **API Gateway**: 3000
- **Auth Service**: 3003
- **Projects Service**: 3004
- **AI Service**: 3005
- **Export Service**: 3006

## API Endpoints

Все запросы идут через API Gateway на порту 3000:

- `/api/auth/*` → Auth Service
- `/api/projects/*` → Projects Service
- `/api/ai/*` → AI Service
- `/api/export/*` → Export Service

## Health Checks

- `GET /health` - проверка состояния всех сервисов

