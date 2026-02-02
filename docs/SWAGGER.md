# Swagger/OpenAPI Documentation

## 📚 API Документация для Constructor AI Platform

### Доступ к документации

Swagger документация доступна по адресу:
```
http://localhost:3001/api-docs/swagger.json
```

### Использование Swagger UI

Для визуального просмотра API документации можно использовать Swagger UI:

1. Установите `swagger-ui-express`:
```bash
cd backend
npm install swagger-ui-express @types/swagger-ui-express
```

2. Добавьте в `backend/src/index.ts`:
```typescript
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './docs/swagger';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

3. Откройте в браузере:
```
http://localhost:3001/api-docs
```

### Основные эндпоинты

#### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход пользователя
- `GET /api/auth/me` - Получение текущего пользователя
- `GET /api/plans` - Информация о тарифных планах

#### Проекты
- `GET /api/projects` - Получить все проекты пользователя
- `POST /api/projects` - Создать новый проект
- `GET /api/projects/:id` - Получить проект по ID
- `PUT /api/projects/:id` - Обновить проект
- `DELETE /api/projects/:id` - Удалить проект

#### Коллаборация
- `POST /api/projects/:id/invite` - Пригласить участника
- `POST /api/invitations/:id/accept` - Принять приглашение
- `GET /api/projects/:id/collaborators` - Получить коллабораторов
- `DELETE /api/projects/:id/collaborators/:userId` - Удалить коллаборатора

#### Маркетплейс
- `GET /api/templates` - Получить шаблоны
- `GET /api/templates/:id` - Получить шаблон по ID
- `POST /api/templates/:id/download` - Скачать шаблон
- `POST /api/templates/:id/reviews` - Добавить отзыв

### Примеры использования

См. `/docs/API_EXAMPLES.md` для полных примеров.

### Безопасность

Все эндпоинты, кроме публичных, требуют аутентификации через cookie `token`.

### Обработка ошибок

Все ошибки возвращаются в формате:
```json
{
  "error": "Описание ошибки",
  "details": {}
}
```

### Поддержка

Для вопросов по API обращайтесь:
- Email: support@constructor.ai
- Документация: `/docs/API.md`
- Swagger: `/api-docs/swagger.json`

