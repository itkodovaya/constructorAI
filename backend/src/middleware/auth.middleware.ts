/**
 * Middleware для аутентификации
 */

import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    plan: 'free' | 'pro' | 'brandkit';
  };
}

/**
 * Middleware для проверки аутентификации
 */
export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  console.log('[Auth] Authenticating request:', req.method, req.path);
  let token = req.headers.authorization?.replace('Bearer ', '') || (req as any).cookies?.token;

  // Для демо-режима: если токена нет, используем 'demo-token'
  if (!token && process.env.AI_USE_MOCK !== 'false') {
    console.log('[Auth] No token, using demo-token');
    token = 'demo-token';
  }

  if (!token) {
    console.log('[Auth] No token found, returning 401');
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = await UserService.getUserByToken(token);
  if (!user) {
    console.log('[Auth] User not found for token, returning 401');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan as any
  };

  console.log('[Auth] Authenticated user:', user.email);
  next();
}

/**
 * Middleware для проверки плана (опционально)
 */
export function requirePlan(requiredPlan: 'pro' | 'brandkit') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const planHierarchy = { free: 0, pro: 1, brandkit: 2 };
    if (planHierarchy[req.user.plan] < planHierarchy[requiredPlan]) {
      return res.status(403).json({ 
        error: `This feature requires ${requiredPlan} plan`,
        currentPlan: req.user.plan,
        requiredPlan
      });
    }

    next();
  };
}

/**
 * Middleware для проверки лимитов
 */
export function checkLimit(action: 'project' | 'ai_generation') {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!await UserService.checkLimits(req.user.id, action)) {
      return res.status(403).json({ 
        error: `Limit exceeded for ${action}`,
        action
      });
    }

    next();
  };
}

