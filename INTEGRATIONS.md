# Интеграции с внешними сервисами

Этот документ описывает настройку и использование внешних сервисов в проекте Constructor AI Platform.

## v0.dev

[v0.dev](https://v0.dev) - это инструмент от Vercel для генерации UI компонентов с помощью AI.

### Использование

1. **Генерация компонентов:**
   - Откройте [v0.dev](https://v0.dev)
   - Опишите нужный компонент на естественном языке
   - Скопируйте сгенерированный код
   - Вставьте в соответствующий файл в `frontend/src/components/`

2. **Интеграция в проект:**
   - Компоненты из v0.dev совместимы с React и TypeScript
   - Используйте существующие стили и утилиты проекта (Tailwind CSS)
   - Адаптируйте компоненты под структуру проекта

3. **Пример использования:**
   ```tsx
   // Сгенерированный компонент из v0.dev можно использовать напрямую
   import { GeneratedComponent } from './components/GeneratedComponent';
   
   function App() {
     return <GeneratedComponent />;
   }
   ```

### Рекомендации

- Проверяйте совместимость с TypeScript
- Используйте существующие иконки из `lucide-react`
- Сохраняйте стиль проекта (rounded-2xl, shadow-xl и т.д.)

---

## Antigravity

Antigravity - AI сервис для расширенных возможностей генерации контента.

### Настройка

1. **Получение API ключа:**
   - Зарегистрируйтесь на платформе Antigravity
   - Получите API ключ в личном кабинете

2. **Добавление в проект:**
   ```bash
   # Добавьте в backend/.env
   ANTIGRAVITY_API_KEY=your_api_key_here
   ANTIGRAVITY_API_URL=https://api.antigravity.com
   ```

3. **Использование в коде:**
   ```typescript
   // backend/src/services/antigravity.service.ts
   import axios from 'axios';
   
   const antigravityClient = axios.create({
     baseURL: process.env.ANTIGRAVITY_API_URL,
     headers: {
       'Authorization': `Bearer ${process.env.ANTIGRAVITY_API_KEY}`,
       'Content-Type': 'application/json'
     }
   });
   
   export async function generateWithAntigravity(prompt: string) {
     const response = await antigravityClient.post('/generate', {
       prompt,
       model: 'default'
     });
     return response.data;
   }
   ```

### Интеграция с существующими сервисами

Antigravity можно использовать как альтернативу или дополнение к существующим AI сервисам:

- Генерация контента для сайтов
- Создание описаний продуктов
- Генерация SEO-текстов

---

## Google Gemini

[Google Gemini](https://ai.google.dev/) - мощная AI модель от Google для различных задач.

### Настройка

1. **Получение API ключа:**
   - Перейдите на [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Создайте новый API ключ
   - Скопируйте ключ

2. **Добавление в проект:**
   ```bash
   # Добавьте в backend/.env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Установка SDK:**
   ```bash
   cd backend
   npm install @google/generative-ai
   ```

4. **Использование в коде:**
   ```typescript
   // backend/src/services/gemini.service.ts
   import { GoogleGenerativeAI } from '@google/generative-ai';
   
   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
   
   export async function generateWithGemini(prompt: string) {
     const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
     
     const result = await model.generateContent(prompt);
     const response = await result.response;
     return response.text();
   }
   ```

### Возможности

- Генерация текстового контента
- Анализ и обработка данных
- Многоязычная поддержка
- Интеграция с существующими AI функциями проекта

### Примеры использования

```typescript
// Генерация описания бренда
const brandDescription = await generateWithGemini(
  `Создай описание бренда для ${brandName} в нише ${niche}`
);

// Генерация SEO-метатегов
const seoTags = await generateWithGemini(
  `Сгенерируй SEO метатеги для сайта о ${topic}`
);
```

---

## Комбинированное использование

Все три сервиса можно использовать вместе для максимальной эффективности:

1. **v0.dev** - для быстрой генерации UI компонентов
2. **Antigravity** - для специализированного контента
3. **Gemini** - для сложных AI задач и анализа

### Пример workflow

```typescript
// 1. Генерируем структуру с помощью Gemini
const structure = await generateWithGemini(prompt);

// 2. Создаем UI компоненты через v0.dev (вручную или через API)
// 3. Дополняем контентом через Antigravity
const content = await generateWithAntigravity(structure);
```

---

## Безопасность

⚠️ **Важно:**
- Никогда не коммитьте API ключи в репозиторий
- Используйте переменные окружения (.env файлы)
- Добавьте `.env` в `.gitignore`
- Используйте разные ключи для development и production

---

## Поддержка

При возникновении проблем с интеграциями:
1. Проверьте правильность API ключей
2. Убедитесь, что ключи активны и не истекли
3. Проверьте лимиты использования API
4. Изучите документацию сервисов:
   - [v0.dev Documentation](https://v0.dev/docs)
   - [Antigravity API Docs](https://docs.antigravity.com)
   - [Google Gemini API Docs](https://ai.google.dev/docs)

