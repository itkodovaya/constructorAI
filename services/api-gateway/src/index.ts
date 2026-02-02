/**
 * API Gateway - Единая точка входа для всех микросервисов
 */

import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as http from 'http';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Конфигурация микросервисов
const services = {
  auth: 'http://localhost:3003',
  projects: 'http://localhost:3004',
  ai: 'http://localhost:3005',
  export: 'http://localhost:3006'
};

// Проксирование запросов к микросервисам
app.use('/api/auth', createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/api/auth' }
}));

app.use('/api/projects', createProxyMiddleware({
  target: services.projects,
  changeOrigin: true,
  pathRewrite: { '^/api/projects': '/api/projects' }
}));

app.use('/api/ai', createProxyMiddleware({
  target: services.ai,
  changeOrigin: true,
  pathRewrite: { '^/api/ai': '/api/ai' }
}));

app.use('/api/export', createProxyMiddleware({
  target: services.export,
  changeOrigin: true,
  pathRewrite: { '^/api/export': '/api/export' }
}));

// Health check для всех сервисов
app.get('/health', async (req, res) => {
  const health = {
    gateway: 'ok',
    services: {} as Record<string, string>
  };

  // Проверка доступности каждого сервиса
  for (const [name, url] of Object.entries(services)) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = http.get(`${url}/health`, (res) => {
          health.services[name] = res.statusCode === 200 ? 'ok' : 'error';
          resolve();
        });
        req.on('error', () => {
          health.services[name] = 'unavailable';
          resolve();
        });
        req.setTimeout(2000, () => {
          req.destroy();
          health.services[name] = 'timeout';
          resolve();
        });
      });
    } catch (error) {
      health.services[name] = 'unavailable';
    }
  }

  res.json(health);
});

app.listen(port, () => {
  console.log(`API Gateway running at http://localhost:${port}`);
  console.log('Routing to services:');
  Object.entries(services).forEach(([name, url]) => {
    console.log(`  ${name}: ${url}`);
  });
});

