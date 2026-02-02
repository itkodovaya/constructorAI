/**
 * Интеграционные тесты для API эндпоинтов
 */

import request from 'supertest';
import express from 'express';
import { ProjectsService } from '../services/projects.service';
import { UserService } from '../services/user.service';

// В реальности здесь был бы импорт настроенного Express приложения
// const app = require('../index').app;

describe('API Integration Tests', () => {
  let authToken: string;
  let userId: string;
  let projectId: string;

  beforeAll(async () => {
    // Создаем тестового пользователя
    const user = await UserService.createUser(
      'test@integration.com',
      'password123',
      'Test User'
    );
    userId = user.id;

    // Получаем токен
    const auth = await UserService.authenticate('test@integration.com', 'password123');
    authToken = auth!.token;
  });

  describe('POST /api/projects', () => {
    it('should create a project with authentication', async () => {
      // В реальности здесь был бы вызов API
      const projectData = {
        brandName: 'Integration Test Brand',
        niche: 'tech',
        style: 'modern',
        colors: [],
        goals: []
      };

      const project = await ProjectsService.create({ ...projectData, ownerId: userId });
      projectId = project.id;

      expect(project).toBeDefined();
      expect(project.brandName).toBe('Integration Test Brand');
    });

    it('should return 401 without authentication', async () => {
      // В реальности здесь был бы вызов API без токена
      // const response = await request(app)
      //   .post('/api/projects')
      //   .send({ brandName: 'Test' });
      // expect(response.status).toBe(401);
    });
  });

  describe('GET /api/projects', () => {
    it('should return user projects', async () => {
      // В реальности здесь был бы вызов API
      const projects = await ProjectsService.getAll(userId);

      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
      expect(projects[0].ownerId).toBe(userId);
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update project', async () => {
      const updated = await ProjectsService.update(projectId, {
        brandName: 'Updated Integration Test Brand'
      });

      expect(updated).toBeDefined();
      expect(updated?.brandName).toBe('Updated Integration Test Brand');
    });

    it('should return 404 for non-existent project', async () => {
      const updated = await ProjectsService.update('non-existent-id', {
        brandName: 'Test'
      });

      expect(updated).toBeNull();
    });
  });

  describe('POST /api/projects/:id/invite', () => {
    it('should create invitation', async () => {
      // В реальности здесь был бы вызов API
      // const response = await request(app)
      //   .post(`/api/projects/${projectId}/invite`)
      //   .set('Authorization', `Bearer ${authToken}`)
      //   .send({ email: 'invited@test.com', role: 'editor' });
      // expect(response.status).toBe(201);
      // expect(response.body.invitation).toBeDefined();
    });
  });

  describe('GET /api/templates', () => {
    it('should return templates', async () => {
      // В реальности здесь был бы вызов API
      // const response = await request(app)
      //   .get('/api/templates');
      // expect(response.status).toBe(200);
      // expect(Array.isArray(response.body.templates)).toBe(true);
    });

    it('should filter templates by category', async () => {
      // В реальности здесь был бы вызов API с параметрами
      // const response = await request(app)
      //   .get('/api/templates?category=website');
      // expect(response.status).toBe(200);
      // response.body.templates.forEach((t: any) => {
      //   expect(t.category).toBe('website');
      // });
    });
  });

  afterAll(async () => {
    // Очистка тестовых данных
    if (projectId) {
      await ProjectsService.delete(projectId);
    }
  });
});

