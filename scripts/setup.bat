@echo off
REM Скрипт для быстрого запуска проекта (Windows)

echo 🚀 Constructor AI Platform - Quick Start
echo.

REM Проверка Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js не установлен. Установите Node.js 18+
    pause
    exit /b 1
)

echo ✅ Node.js версия:
node --version

REM Установка зависимостей
echo.
echo 📦 Установка зависимостей...

echo Backend...
cd backend
if not exist "node_modules" (
    call npm install
)

echo Frontend...
cd ..\frontend
if not exist "node_modules" (
    call npm install
)

cd ..

REM Проверка .env файлов
echo.
echo 🔧 Проверка конфигурации...

if not exist "backend\.env" (
    echo ⚠️  backend\.env не найден. Создаю из примера...
    copy backend\.env.example backend\.env >nul 2>&1
)

if not exist "frontend\.env" (
    echo ⚠️  frontend\.env не найден. Создаю из примера...
    copy frontend\.env.example frontend\.env >nul 2>&1
)

REM Создание директории для данных
if not exist "backend\data" mkdir backend\data

echo.
echo ✅ Готово к запуску!
echo.
echo Запустите в разных терминалах:
echo   Terminal 1: cd backend ^&^& npm run dev
echo   Terminal 2: cd frontend ^&^& npm run dev
echo.
echo Откройте http://localhost:5173 в браузере
pause

