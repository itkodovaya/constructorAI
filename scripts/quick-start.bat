@echo off
REM Скрипт для быстрого запуска проекта (Windows)

echo 🚀 Constructor AI Platform - Quick Start
echo ========================================
echo.

REM Проверка Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js не установлен. Установите Node.js 18+
    exit /b 1
)

echo ✅ Node.js установлен
echo.

REM Установка зависимостей
echo 📦 Установка зависимостей...
echo.

if not exist "node_modules" (
    echo Установка зависимостей корневого проекта...
    call npm install
)

if not exist "frontend\node_modules" (
    echo Установка зависимостей frontend...
    cd frontend
    call npm install
    cd ..
)

if not exist "backend\node_modules" (
    echo Установка зависимостей backend...
    cd backend
    call npm install
    cd ..
)

echo.
echo ✅ Все зависимости установлены
echo.

REM Проверка .env файлов
echo 🔧 Проверка конфигурации...
echo.

if not exist "backend\.env" (
    echo ⚠️  Создание backend\.env...
    (
        echo NODE_ENV=development
        echo PORT=3001
        echo LOG_LEVEL=info
        echo AI_USE_MOCK=true
        echo OPENAI_API_KEY=
        echo STABLE_DIFFUSION_API_KEY=
        echo DB_PATH=data/projects.json
        echo JWT_SECRET=supersecretjwtkey
    ) > backend\.env
    echo ✅ Создан backend\.env
)

if not exist "frontend\.env" (
    echo ⚠️  Создание frontend\.env...
    (
        echo VITE_API_URL=http://localhost:3001/api
    ) > frontend\.env
    echo ✅ Создан frontend\.env
)

echo.
echo ✅ Конфигурация готова
echo.

REM Создание директорий для данных
if not exist "backend\data" mkdir backend\data
echo ✅ Директории созданы
echo.

echo 🎉 Готово к запуску!
echo.
echo Для запуска используйте:
echo   npm run dev        - Запуск в режиме разработки
echo   npm run build      - Сборка для production
echo   npm run test       - Запуск тестов
echo.
echo Или запустите отдельно:
echo   cd backend ^&^& npm run dev   - Backend сервер
echo   cd frontend ^&^& npm run dev   - Frontend сервер
echo.

pause

