/**
 * Auth Service - Микросервис для аутентификации и авторизации (IAM)
 * Использует Prisma для работы с БД и обеспечивает RBAC
 */

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const app = express();
const port = 3003;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Хеширование пароля (с солью для безопасности)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'sovereign_salt_2026').digest('hex');
}

// Генерация токена (в реальности лучше использовать JWT)
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashPassword(password),
        name,
        plan: 'free',
      }
    });

    const token = generateToken();
    
    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Вход
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken();

    res.json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Проверка прав доступа (RBAC)
app.post('/api/auth/check-permission', async (req, res) => {
  const { userId, action, resource } = req.body;
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ allowed: false });

  // Логика RBAC: Enterprise пользователи могут всё, Free - только базовое
  if (user.plan === 'enterprise') return res.json({ allowed: true });
  
  if (action === 'export' && user.plan === 'free') {
    return res.json({ allowed: false, reason: 'Upgrade to PRO for export' });
  }

  res.json({ allowed: true });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', service: 'auth-service', db: 'connected' });
  } catch (e) {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

app.listen(port, () => {
  console.log(`Sovereign IAM Service running at http://localhost:${port}`);
});
