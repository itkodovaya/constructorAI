# API Документация ConstructorAI

## Базовый URL

- **Монолитный backend**: `http://localhost:3001/api`
- **API Gateway**: `http://localhost:3000/api`

## Аутентификация

Большинство эндпоинтов требуют аутентификации через JWT токен:

```
Authorization: Bearer <token>
```

## Основные эндпоинты

### Проекты

#### GET /api/projects
Получение списка проектов (публичный для демо)

**Query параметры:**
- `userId` (optional) - фильтр по пользователю

**Response:**
```json
{
  "projects": [
    {
      "id": "string",
      "name": "string",
      "brandName": "string",
      "niche": "string",
      "style": "string",
      "brandAssets": {},
      "pages": [],
      "presentation": []
    }
  ]
}
```

#### GET /api/projects/:id
Получение проекта по ID

#### POST /api/projects
Создание нового проекта

#### PUT /api/projects/:id
Обновление проекта

#### DELETE /api/projects/:id
Удаление проекта

### AI Функции

#### POST /api/ai/chat
Отправка сообщения в AI чат

**Body:**
```json
{
  "projectId": "string",
  "message": "string",
  "context": {}
}
```

#### GET /api/ai/suggestions/:projectId
Получение предложений AI

#### POST /api/ai/semantic-search
Семантический поиск

**Body:**
```json
{
  "query": "string",
  "projectId": "string",
  "type": "block|template|asset|slide"
}
```

### Комментарии

#### GET /api/projects/:id/comments
Получение комментариев проекта

#### POST /api/projects/:id/comments
Добавление комментария

#### PUT /api/projects/:id/comments/:commentId
Обновление комментария

#### DELETE /api/projects/:id/comments/:commentId
Удаление комментария

### Realtime синхронизация

**WebSocket**: `ws://localhost:3002`

**Сообщения:**
```json
{
  "type": "update|lock|unlock|cursor|join|leave",
  "projectId": "string",
  "userId": "string",
  "payload": {}
}
```

### Пользовательские компоненты

#### GET /api/components/my
Получение компонентов пользователя

#### GET /api/components/public
Получение публичных компонентов

#### POST /api/components
Создание компонента

#### POST /api/components/:id/install
Установка компонента

### Плагины

#### GET /api/plugins
Получение всех плагинов

#### POST /api/plugins
Регистрация плагина

#### POST /api/plugins/:id/activate
Активация плагина

#### POST /api/plugins/:id/deactivate
Деактивация плагина

### A/B Тесты

#### GET /api/projects/:id/ab-tests
Получение тестов проекта

#### POST /api/projects/:id/ab-tests
Создание теста

#### GET /api/ab-tests/:id/variant
Получение варианта для посетителя

#### POST /api/ab-tests/:id/conversion
Регистрация конверсии

#### GET /api/ab-tests/:id/results
Получение результатов теста

### Marketplace

#### GET /api/marketplace/items
Получение товаров маркетплейса

**Query параметры:**
- `type`: template|plugin|component
- `category`: string
- `search`: string
- `sortBy`: popular|rating|price|newest
- `isFree`: boolean
- `limit`: number
- `offset`: number

#### GET /api/marketplace/items/:id
Получение товара по ID

#### POST /api/marketplace/purchase
Покупка товара

#### GET /api/marketplace/purchases/:userId
Получение покупок пользователя

## Коды ответов

- `200` - Успешный запрос
- `201` - Ресурс создан
- `204` - Успешное удаление
- `400` - Неверный запрос
- `401` - Требуется аутентификация
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера

## Обработка ошибок

Все ошибки возвращаются в формате:

```json
{
  "error": "Описание ошибки",
  "details": {} // Опционально
}
```

