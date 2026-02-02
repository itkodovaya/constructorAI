# Руководство по развертыванию ConstructorAI

## Быстрый старт

### Локальная разработка

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Docker Compose (микросервисы)

```bash
cd services
docker-compose up
```

## Требования

- Node.js 18+
- npm или yarn
- Docker и Docker Compose (для микросервисов)

## Переменные окружения

### Backend

Создайте `.env` файл в `backend/`:

```env
PORT=3001
WS_PORT=3002
OPENAI_API_KEY=your_key_here
NODE_ENV=development
```

### Frontend

Создайте `.env` файл в `frontend/`:

```env
VITE_API_URL=http://localhost:3001/api
```

## Production развертывание

### 1. Подготовка

```bash
# Build backend
cd backend
npm install
npm run build

# Build frontend
cd frontend
npm install
npm run build
```

### 2. Docker

```bash
# Build и запуск всех сервисов
cd services
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Nginx конфигурация

Пример конфигурации для Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/constructor/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API Gateway
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Мониторинг

### Health Checks

- Backend: `http://localhost:3001/health`
- API Gateway: `http://localhost:3000/health`
- Каждый микросервис: `http://localhost:<port>/health`

### Логи

```bash
# Docker логи
docker-compose logs -f

# Backend логи
cd backend && npm run dev
```

## Резервное копирование

### Данные проектов

```bash
# Копирование JSON файлов
cp backend/data/projects.json backups/projects-$(date +%Y%m%d).json
```

### База данных (когда будет PostgreSQL)

```bash
pg_dump constructorai > backups/db-$(date +%Y%m%d).sql
```

## Масштабирование

### Горизонтальное масштабирование

```yaml
# docker-compose.yml
services:
  projects-service:
    deploy:
      replicas: 3
```

### Вертикальное масштабирование

Увеличьте ресурсы контейнеров в docker-compose.yml:

```yaml
services:
  projects-service:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## Безопасность

### SSL/HTTPS

Используйте Let's Encrypt или другой SSL сертификат:

```bash
certbot --nginx -d your-domain.com
```

### Firewall

```bash
# Открыть только необходимые порты
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## Troubleshooting

### Проблемы с портами

```bash
# Проверить занятые порты
netstat -tulpn | grep LISTEN

# Освободить порт
kill -9 <PID>
```

### Проблемы с Docker

```bash
# Пересоздать контейнеры
docker-compose down
docker-compose up -d --force-recreate
```

### Проблемы с зависимостями

```bash
# Очистить и переустановить
rm -rf node_modules package-lock.json
npm install
```

