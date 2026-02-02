/**
 * Примеры использования API
 */

import { api } from '../services/api';

// Пример 1: Создание проекта
export async function createProjectExample() {
  const projectData = {
    brandName: 'My Awesome Brand',
    niche: 'Технологии',
    style: 'modern',
    colors: ['#2563eb', '#1e40af', '#3b82f6'],
    goals: ['website', 'logo', 'presentation'],
  };

  try {
    const project = await api.createProject(projectData);
    console.log('Проект создан:', project);
    return project;
  } catch (error) {
    console.error('Ошибка создания проекта:', error);
  }
}

// Пример 2: Обновление бренд-кита
export async function updateBrandAssetsExample(projectId: string) {
  const newAssets = {
    palette: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    fonts: ['Inter', 'Roboto'],
  };

  try {
    const updated = await api.updateProject(projectId, {
      brandAssets: newAssets,
    });
    console.log('Бренд-кит обновлен:', updated);
    return updated;
  } catch (error) {
    console.error('Ошибка обновления:', error);
  }
}

// Пример 3: Генерация контента через AI
export async function generateContentExample(projectId: string) {
  try {
    const updated = await api.generateFullContent(projectId);
    console.log('Контент сгенерирован:', updated.pages[0].blocks);
    return updated;
  } catch (error) {
    console.error('Ошибка генерации:', error);
  }
}

// Пример 4: Перевод проекта
export async function translateProjectExample(projectId: string) {
  try {
    const translated = await api.translateProject(projectId, 'en');
    console.log('Проект переведен:', translated);
    return translated;
  } catch (error) {
    console.error('Ошибка перевода:', error);
  }
}

// Пример 5: Экспорт сайта
export async function exportSiteExample(projectId: string) {
  try {
    await api.exportProject(projectId);
    console.log('Сайт экспортирован');
  } catch (error) {
    console.error('Ошибка экспорта:', error);
  }
}

// Пример 6: Полный workflow
export async function fullWorkflowExample() {
  // 1. Создаем проект
  const project = await createProjectExample();
  if (!project) return;

  // 2. Обновляем бренд-кит
  await updateBrandAssetsExample(project.id);

  // 3. Генерируем контент
  await generateContentExample(project.id);

  // 4. Экспортируем сайт
  await exportSiteExample(project.id);

  console.log('Workflow завершен!');
}

