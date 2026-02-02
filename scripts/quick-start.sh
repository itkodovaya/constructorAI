#!/bin/bash

# Скрипт для быстрого запуска проекта

echo "🚀 Constructor AI Platform - Quick Start"
echo "========================================"
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Требуется Node.js 18+. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) установлен"

# Проверка npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен"
    exit 1
fi

echo "✅ npm $(npm -v) установлен"
echo ""

# Установка зависимостей
echo "📦 Установка зависимостей..."
echo ""

if [ ! -d "node_modules" ]; then
    echo "Установка зависимостей корневого проекта..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Установка зависимостей frontend..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Установка зависимостей backend..."
    cd backend && npm install && cd ..
fi

echo ""
echo "✅ Все зависимости установлены"
echo ""

# Проверка .env файлов
echo "🔧 Проверка конфигурации..."
echo ""

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Создание backend/.env из примера..."
    cat > backend/.env << EOF
NODE_ENV=development
PORT=3001
LOG_LEVEL=info
AI_USE_MOCK=true
OPENAI_API_KEY=
STABLE_DIFFUSION_API_KEY=
DB_PATH=data/projects.json
JWT_SECRET=supersecretjwtkey
EOF
    echo "✅ Создан backend/.env"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Создание frontend/.env из примера..."
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:3001/api
EOF
    echo "✅ Создан frontend/.env"
fi

echo ""
echo "✅ Конфигурация готова"
echo ""

# Создание директорий для данных
mkdir -p backend/data
echo "✅ Директории созданы"
echo ""

echo "🎉 Готово к запуску!"
echo ""
echo "Для запуска используйте:"
echo "  npm run dev        - Запуск в режиме разработки"
echo "  npm run build      - Сборка для production"
echo "  npm run test       - Запуск тестов"
echo ""
echo "Или запустите отдельно:"
echo "  cd backend && npm run dev   - Backend сервер"
echo "  cd frontend && npm run dev   - Frontend сервер"
echo ""

