# Migration Guide

Руководство по миграции между версиями и обновлению проекта.

## 🔄 Обновление проекта

### С версии 1.0.0 на 1.0.1

1. **Обновите зависимости:**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Обновите .env файлы:**
   ```bash
   # Добавьте новые переменные из .env.example
   ```

3. **Проверьте breaking changes:**
   - Нет breaking changes в этой версии

4. **Запустите проект:**
   ```bash
   npm run dev
   ```

---

## 🗄️ Миграция с JSON на PostgreSQL

### Шаг 1: Установка зависимостей

```bash
cd backend
npm install pg @types/pg
```

### Шаг 2: Создание схемы БД

```sql
CREATE TABLE projects (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  brand_name VARCHAR(255) NOT NULL,
  niche VARCHAR(255),
  style VARCHAR(255),
  colors TEXT[],
  goals TEXT[],
  brand_assets JSONB,
  seo JSONB,
  pages JSONB,
  presentation JSONB,
  history JSONB,
  collaborators JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_created ON projects(created_at);
```

### Шаг 3: Обновление ProjectsService

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export class ProjectsService {
  static async getAll(): Promise<Project[]> {
    const result = await pool.query('SELECT * FROM projects');
    return result.rows;
  }
  
  // ... остальные методы
}
```

### Шаг 4: Миграция данных

```typescript
// Скрипт для миграции
import fs from 'fs';
import { ProjectsService } from './services/projects.service';

const projects = JSON.parse(fs.readFileSync('projects.json', 'utf-8'));

for (const project of projects) {
  await ProjectsService.create(project);
}
```

---

## 🔐 Добавление аутентификации

### Шаг 1: Установка зависимостей

```bash
cd backend
npm install jsonwebtoken bcrypt @types/jsonwebtoken @types/bcrypt
```

### Шаг 2: Создание User модели

```typescript
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  plan: 'free' | 'pro' | 'brandkit';
}
```

### Шаг 3: Endpoints для аутентификации

```typescript
app.post('/api/auth/register', async (req, res) => {
  // Регистрация
});

app.post('/api/auth/login', async (req, res) => {
  // Вход
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  // Текущий пользователь
});
```

### Шаг 4: Middleware для проверки токенов

```typescript
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
```

---

## 📦 Миграция на новую версию Node.js

### С Node.js 16 на 18+

1. **Обновите Node.js:**
   ```bash
   # Используйте nvm
   nvm install 18
   nvm use 18
   ```

2. **Обновите зависимости:**
   ```bash
   npm install
   ```

3. **Проверьте совместимость:**
   ```bash
   npm run build
   ```

---

## 🔧 Обновление зависимостей

### Безопасное обновление

```bash
# Проверьте уязвимости
npm audit

# Обновите безопасные патчи
npm audit fix

# Обновите минорные версии
npm update

# Обновите мажорные версии (осторожно!)
npm install package@latest
```

### Проверка после обновления

```bash
# Запустите тесты
npm test

# Проверьте сборку
npm run build

# Проверьте линтер
npm run lint
```

---

## 📝 Чеклист миграции

- [ ] Создан backup текущих данных
- [ ] Прочитана документация новой версии
- [ ] Проверены breaking changes
- [ ] Обновлены зависимости
- [ ] Обновлены .env файлы
- [ ] Протестированы основные функции
- [ ] Проверена производительность
- [ ] Обновлена документация

---

## 🆘 Откат изменений

Если что-то пошло не так:

1. **Восстановите backup:**
   ```bash
   cp backup/projects.json backend/data/projects.json
   ```

2. **Откатите зависимости:**
   ```bash
   git checkout package.json package-lock.json
   npm install
   ```

3. **Откатите код:**
   ```bash
   git checkout <previous-commit>
   ```

