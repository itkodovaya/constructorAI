# Docker Deployment Guide

## Быстрый старт с Docker

### 1. Сборка и запуск всех сервисов

```bash
docker-compose up --build
```

### 2. Запуск в фоновом режиме

```bash
docker-compose up -d
```

### 3. Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. Остановка

```bash
docker-compose down
```

### 5. Пересборка после изменений

```bash
docker-compose up --build --force-recreate
```

## Отдельные сервисы

### Backend

```bash
cd backend
docker build -t constructor-backend .
docker run -p 3001:3001 constructor-backend
```

### Frontend

```bash
cd frontend
docker build -t constructor-frontend .
docker run -p 80:80 constructor-frontend
```

## Production развертывание

### С переменными окружения

Создайте `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  backend:
    environment:
      - NODE_ENV=production
      - AI_USE_MOCK=false
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./backend/data:/app/data
```

Запуск:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Мониторинг

### Health check

```bash
curl http://localhost:3001/health
```

### Статистика контейнеров

```bash
docker stats
```

## Troubleshooting

### Проблемы с правами доступа

```bash
sudo chown -R $USER:$USER backend/data
```

### Очистка Docker

```bash
# Удалить неиспользуемые образы
docker image prune -a

# Удалить все контейнеры
docker container prune

# Полная очистка
docker system prune -a
```

