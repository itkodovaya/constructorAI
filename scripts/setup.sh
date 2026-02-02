#!/bin/bash
# Скрипт для быстрого запуска проекта

echo "🚀 Constructor AI Platform - Quick Start"
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js 18+"
    exit 1
fi

echo "✅ Node.js версия: $(node --version)"

# Установка зависимостей
echo ""
echo "📦 Установка зависимостей..."

echo "Backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "Frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

cd ..

# Проверка .env файлов
echo ""
echo "🔧 Проверка конфигурации..."

if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env не найден. Создаю из примера..."
    cp backend/.env.example backend/.env 2>/dev/null || echo "Создайте backend/.env вручную"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  frontend/.env не найден. Создаю из примера..."
    cp frontend/.env.example frontend/.env 2>/dev/null || echo "Создайте frontend/.env вручную"
fi

# Создание директории для данных
mkdir -p backend/data

echo ""
echo "✅ Готово к запуску!"
echo ""
echo "Запустите в разных терминалах:"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Откройте http://localhost:5173 в браузере"

