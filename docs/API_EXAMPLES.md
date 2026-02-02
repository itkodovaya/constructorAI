# API Examples

## 📖 Примеры использования API Constructor AI Platform

### Базовая настройка

```typescript
const API_URL = 'http://localhost:3001/api';

// Функция для выполнения запросов с аутентификацией
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Важно для cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  
  return response.json();
}
```

### 1. Аутентификация

#### Регистрация пользователя

```typescript
async function register(email: string, password: string, name: string) {
  const result = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name })
  });
  
  console.log('User registered:', result.user);
  return result;
}
```

#### Вход пользователя

```typescript
async function login(email: string, password: string) {
  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  console.log('User logged in:', result.user);
  return result;
}
```

### 2. Управление проектами

#### Создание проекта

```typescript
async function createProject(data: {
  brandName: string;
  niche: string;
  style?: string;
  colors?: string[];
  goals?: string[];
}) {
  const project = await apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  console.log('Project created:', project.id);
  return project;
}
```

### 3. Коллаборация

#### Приглашение участника

```typescript
async function inviteCollaborator(
  projectId: string,
  email: string,
  role: 'owner' | 'editor' | 'viewer'
) {
  const result = await apiRequest(`/projects/${projectId}/invite`, {
    method: 'POST',
    body: JSON.stringify({ email, role })
  });
  
  console.log('Invitation sent:', result.invitation.id);
  return result;
}
```

### 4. Маркетплейс шаблонов

#### Поиск шаблонов

```typescript
async function searchTemplates(filters?: {
  category?: string;
  search?: string;
  featured?: boolean;
}) {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.featured) params.append('featured', 'true');
  
  const query = params.toString();
  const result = await apiRequest(`/templates${query ? `?${query}` : ''}`);
  
  console.log(`Found ${result.templates.length} templates`);
  return result.templates;
}
```

### Полный пример

```typescript
async function createAndSetupProject() {
  try {
    // 1. Вход
    await login('user@example.com', 'password123');
    
    // 2. Создание проекта
    const project = await createProject({
      brandName: 'My Brand',
      niche: 'tech',
      style: 'modern'
    });
    
    // 3. Генерация контента
    await apiRequest(`/projects/${project.id}/generate-content`, {
      method: 'POST'
    });
    
    // 4. Приглашение коллаборатора
    await inviteCollaborator(project.id, 'designer@example.com', 'editor');
    
    console.log('Project created and configured successfully!');
    return project;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Полезные ссылки

- Swagger документация: `/api-docs/swagger.json`
- API документация: `/docs/API.md`

