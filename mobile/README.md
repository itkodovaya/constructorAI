# ConstructorAI Mobile App

Мобильное приложение для ConstructorAI на React Native.

## Структура

```
mobile/
├── src/
│   ├── screens/        # Экраны приложения
│   ├── components/     # Переиспользуемые компоненты
│   ├── services/       # API сервисы
│   ├── navigation/     # Навигация
│   └── utils/          # Утилиты
├── android/            # Android проект
├── ios/                 # iOS проект
└── package.json        # Зависимости
```

## Установка

```bash
cd mobile
npm install
```

## Запуск

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Функциональность

- Просмотр проектов
- Редактирование контента
- Просмотр бренд-кита
- Синхронизация с веб-версией
- Офлайн-режим
- Push-уведомления

## API

Приложение использует тот же API, что и веб-версия через API Gateway.

