#!/bin/bash

echo "========================================"
echo "Публикация проекта на GitHub"
echo "========================================"
echo ""

# Проверка наличия git
if ! command -v git &> /dev/null; then
    echo "[ОШИБКА] Git не установлен"
    echo "Установите Git: https://git-scm.com/download"
    exit 1
fi

echo "[✓] Git найден"
echo ""

# Проверка настроек git
if [ -z "$(git config user.name)" ] || [ -z "$(git config user.email)" ]; then
    echo "[ВНИМАНИЕ] Git не настроен"
    echo ""
    read -p "Введите ваше имя для Git: " GIT_NAME
    read -p "Введите ваш email для Git: " GIT_EMAIL
    git config user.name "$GIT_NAME"
    git config user.email "$GIT_EMAIL"
    echo "[✓] Git настроен"
    echo ""
fi

# Проверка наличия remote
if git remote -v | grep -q "origin"; then
    echo "[✓] Remote origin уже настроен"
    git remote -v
    echo ""
    read -p "Отправить код на GitHub? (y/n): " PUSH
    if [ "$PUSH" = "y" ] || [ "$PUSH" = "Y" ]; then
        git branch -M main
        git push -u origin main
        if [ $? -eq 0 ]; then
            echo ""
            echo "[✓] Проект успешно опубликован на GitHub!"
        else
            echo ""
            echo "[ОШИБКА] Не удалось отправить код. Проверьте настройки доступа."
        fi
    fi
    exit 0
fi

echo "[ИНФОРМАЦИЯ] Remote origin не настроен"
echo ""
echo "Для публикации необходимо:"
echo "1. Создать репозиторий на GitHub.com"
echo "2. Получить URL репозитория"
echo ""
read -p "Введите URL вашего GitHub репозитория (https://github.com/USERNAME/REPO.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "[ОШИБКА] URL не может быть пустым"
    exit 1
fi

echo ""
echo "Настройка remote origin..."
git remote add origin "$REPO_URL"
if [ $? -ne 0 ]; then
    echo "[ОШИБКА] Не удалось добавить remote. Возможно, он уже существует."
    echo "Попробуйте: git remote set-url origin $REPO_URL"
    exit 1
fi

echo "[✓] Remote origin настроен"
echo ""

# Переименование ветки в main
git branch -M main
echo "[✓] Ветка переименована в main"
echo ""

# Отправка на GitHub
echo "Отправка кода на GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "[✓] ПРОЕКТ УСПЕШНО ОПУБЛИКОВАН!"
    echo "========================================"
    echo ""
    echo "Ваш репозиторий: $REPO_URL"
    echo ""
else
    echo ""
    echo "[ОШИБКА] Не удалось отправить код"
    echo ""
    echo "Возможные причины:"
    echo "- Репозиторий не существует или URL неверный"
    echo "- Нет прав доступа к репозиторию"
    echo "- Требуется аутентификация (настройте Personal Access Token)"
    echo ""
    echo "Инструкции по настройке: см. GITHUB_SETUP.md"
    echo ""
fi

