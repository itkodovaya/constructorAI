# Performance Optimization Guide

## 🚀 Оптимизация Frontend

### Code Splitting

```typescript
// ✅ Хорошо: Ленивая загрузка компонентов
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

### Мемоизация

```typescript
// ✅ Кеширование вычислений
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ✅ Кеширование функций
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

### Оптимизация изображений

```typescript
// ✅ Используйте WebP формат
<img src="image.webp" alt="..." />

// ✅ Lazy loading изображений
<img src="image.jpg" loading="lazy" alt="..." />
```

### Виртуализация списков

```typescript
// Для больших списков используйте react-window или react-virtualized
import { FixedSizeList } from 'react-window';
```

---

## ⚡ Оптимизация Backend

### Кеширование

```typescript
// ✅ Кешируйте часто запрашиваемые данные
const cache = new Map();

async function getCachedProject(id: string) {
  if (cache.has(id)) {
    return cache.get(id);
  }
  const project = await ProjectsService.getById(id);
  cache.set(id, project);
  return project;
}
```

### Пагинация

```typescript
// ✅ Используйте пагинацию для больших списков
app.get('/api/projects', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const projects = await ProjectsService.getAll(skip, limit);
  res.json({ projects, page, total });
});
```

### Оптимизация JSON

```typescript
// ✅ Используйте streaming для больших файлов
import { createReadStream } from 'fs';

app.get('/api/projects/export', (req, res) => {
  const stream = createReadStream('large-file.json');
  stream.pipe(res);
});
```

---

## 📦 Оптимизация сборки

### Tree Shaking

```typescript
// ✅ Импортируйте только нужное
import { specificFunction } from 'large-library';

// ❌ Плохо: Импорт всего
import * from 'large-library';
```

### Минификация

```json
// vite.config.ts
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Удаляет console.log в production
      },
    },
  },
};
```

### Compression

```nginx
# nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript;
```

---

## 🗄️ Оптимизация базы данных

### Индексы (для будущей БД)

```sql
-- Создайте индексы для частых запросов
CREATE INDEX idx_project_user ON projects(user_id);
CREATE INDEX idx_project_created ON projects(created_at);
```

### Запросы

```typescript
// ✅ Выбирайте только нужные поля
SELECT id, name FROM projects;

// ❌ Плохо: SELECT * FROM projects;
```

---

## 📊 Мониторинг производительности

### Метрики для отслеживания

1. **Time to First Byte (TTFB)**
   - Цель: < 200ms

2. **First Contentful Paint (FCP)**
   - Цель: < 1.8s

3. **Largest Contentful Paint (LCP)**
   - Цель: < 2.5s

4. **Time to Interactive (TTI)**
   - Цель: < 3.8s

### Инструменты

- Chrome DevTools Performance
- Lighthouse
- WebPageTest
- New Relic / Datadog

---

## 🎯 Рекомендации

1. **Используйте CDN** для статических файлов
2. **Включите HTTP/2** или HTTP/3
3. **Оптимизируйте изображения** (WebP, сжатие)
4. **Минифицируйте CSS и JS**
5. **Используйте Service Workers** для кеширования
6. **Оптимизируйте шрифты** (subset, preload)
7. **Удалите неиспользуемый код**

---

## 📈 Целевые метрики

- **Bundle size:** < 500KB (gzipped)
- **API response time:** < 100ms
- **Page load time:** < 2s
- **Time to Interactive:** < 3s
- **Lighthouse score:** > 90

