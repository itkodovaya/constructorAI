@echo off
chcp 65001 >nul
echo ========================================
echo Публикация проекта на GitHub
echo ========================================
echo.

REM Проверка наличия git
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ОШИБКА] Git не установлен или не найден в PATH
    echo Установите Git: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [✓] Git найден
echo.

REM Проверка настроек git
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo [ВНИМАНИЕ] Git не настроен
    echo.
    set /p GIT_NAME="Введите ваше имя для Git: "
    set /p GIT_EMAIL="Введите ваш email для Git: "
    git config user.name "%GIT_NAME%"
    git config user.email "%GIT_EMAIL%"
    echo [✓] Git настроен
    echo.
)

REM Проверка наличия remote
git remote -v >nul 2>&1
if %errorlevel% equ 0 (
    git remote -v | findstr /C:"origin" >nul
    if %errorlevel% equ 0 (
        echo [✓] Remote origin уже настроен
        git remote -v
        echo.
        set /p PUSH="Отправить код на GitHub? (y/n): "
        if /i "%PUSH%"=="y" (
            git branch -M main
            git push -u origin main
            if %errorlevel% equ 0 (
                echo.
                echo [✓] Проект успешно опубликован на GitHub!
            ) else (
                echo.
                echo [ОШИБКА] Не удалось отправить код. Проверьте настройки доступа.
            )
        )
        pause
        exit /b 0
    )
)

echo [ИНФОРМАЦИЯ] Remote origin не настроен
echo.
echo Для публикации необходимо:
echo 1. Создать репозиторий на GitHub.com
echo 2. Получить URL репозитория
echo.
set /p REPO_URL="Введите URL вашего GitHub репозитория (https://github.com/USERNAME/REPO.git): "

if "%REPO_URL%"=="" (
    echo [ОШИБКА] URL не может быть пустым
    pause
    exit /b 1
)

echo.
echo Настройка remote origin...
git remote add origin "%REPO_URL%"
if %errorlevel% neq 0 (
    echo [ОШИБКА] Не удалось добавить remote. Возможно, он уже существует.
    echo Попробуйте: git remote set-url origin "%REPO_URL%"
    pause
    exit /b 1
)

echo [✓] Remote origin настроен
echo.

REM Переименование ветки в main
git branch -M main
echo [✓] Ветка переименована в main
echo.

REM Отправка на GitHub
echo Отправка кода на GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [✓] ПРОЕКТ УСПЕШНО ОПУБЛИКОВАН!
    echo ========================================
    echo.
    echo Ваш репозиторий: %REPO_URL%
    echo.
) else (
    echo.
    echo [ОШИБКА] Не удалось отправить код
    echo.
    echo Возможные причины:
    echo - Репозиторий не существует или URL неверный
    echo - Нет прав доступа к репозиторию
    echo - Требуется аутентификация (настройте Personal Access Token)
    echo.
    echo Инструкции по настройке: см. GITHUB_SETUP.md
    echo.
)

pause

