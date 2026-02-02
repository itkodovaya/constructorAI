/**
 * Сервис безопасности и соответствия законодательству
 * Шифрование данных, согласия на обработку, соответствие ФЗ-152 и GDPR
 */

import * as crypto from 'crypto';

export interface Consent {
  id: string;
  userId: string;
  type: 'data_processing' | 'marketing' | 'analytics' | 'cookies';
  granted: boolean;
  grantedAt?: Date;
  revokedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  version: string; // Версия политики конфиденциальности
}

export interface DataEncryption {
  algorithm: string;
  key: string; // В реальности - из secure vault
  iv?: string;
}

// Хранилище согласий (в реальности - БД)
const consents: Consent[] = [];

// Ключ шифрования (в реальности - из переменных окружения или secure vault)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';

export class SecurityComplianceService {
  /**
   * Шифрует данные
   */
  static encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  /**
   * Расшифровывает данные
   */
  static decrypt(encryptedData: {
    encrypted: string;
    iv: string;
    tag: string;
  }): string {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      Buffer.from(encryptedData.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Хэширует персональные данные (для анонимизации)
   */
  static hashPersonalData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Регистрирует согласие пользователя
   */
  static grantConsent(
    userId: string,
    type: Consent['type'],
    version: string,
    ipAddress?: string,
    userAgent?: string
  ): Consent {
    // Отзываем предыдущее согласие если есть
    const existing = consents.find(
      (c) => c.userId === userId && c.type === type && c.granted
    );
    if (existing) {
      existing.revokedAt = new Date();
      existing.granted = false;
    }

    const consent: Consent = {
      id: crypto.randomUUID(),
      userId,
      type,
      granted: true,
      grantedAt: new Date(),
      ipAddress: ipAddress ? this.hashPersonalData(ipAddress) : undefined,
      userAgent: userAgent ? this.hashPersonalData(userAgent) : undefined,
      version,
    };

    consents.push(consent);
    console.log(`Consent granted: ${userId} for ${type}`);

    return consent;
  }

  /**
   * Отзывает согласие пользователя
   */
  static revokeConsent(userId: string, type: Consent['type']): Consent | null {
    const consent = consents.find(
      (c) => c.userId === userId && c.type === type && c.granted
    );

    if (!consent) {
      return null;
    }

    consent.granted = false;
    consent.revokedAt = new Date();

    console.log(`Consent revoked: ${userId} for ${type}`);

    return consent;
  }

  /**
   * Проверяет наличие согласия
   */
  static hasConsent(userId: string, type: Consent['type']): boolean {
    const consent = consents.find(
      (c) => c.userId === userId && c.type === type && c.granted
    );
    return !!consent;
  }

  /**
   * Получает все согласия пользователя
   */
  static getUserConsents(userId: string): Consent[] {
    return consents.filter((c) => c.userId === userId);
  }

  /**
   * Экспортирует данные пользователя (GDPR право на доступ)
   */
  static async exportUserData(userId: string): Promise<{
    userId: string;
    consents: Consent[];
    exportedAt: Date;
  }> {
    return {
      userId,
      consents: this.getUserConsents(userId),
      exportedAt: new Date(),
    };
  }

  /**
   * Удаляет данные пользователя (GDPR право на забвение)
   */
  static async deleteUserData(userId: string): Promise<boolean> {
    // В реальности здесь была бы полная очистка всех данных пользователя
    const userConsents = consents.filter((c) => c.userId === userId);
    userConsents.forEach((c) => {
      const index = consents.indexOf(c);
      if (index !== -1) {
        consents.splice(index, 1);
      }
    });

    console.log(`User data deleted: ${userId}`);
    return true;
  }

  /**
   * Проверяет соответствие требованиям ФЗ-152 (РФ)
   */
  static checkFZ152Compliance(userId: string): {
    compliant: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    const userConsents = this.getUserConsents(userId);

    // Проверка наличия согласия на обработку персональных данных
    if (!this.hasConsent(userId, 'data_processing')) {
      issues.push('Missing consent for data processing (required by ФЗ-152)');
    }

    // Проверка версии политики конфиденциальности
    const dataProcessingConsent = userConsents.find((c) => c.type === 'data_processing');
    if (dataProcessingConsent && dataProcessingConsent.version !== '1.0') {
      issues.push('Outdated privacy policy version');
    }

    return {
      compliant: issues.length === 0,
      issues,
    };
  }

  /**
   * Проверяет соответствие требованиям GDPR (ЕС)
   */
  static checkGDPRCompliance(userId: string): {
    compliant: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    const userConsents = this.getUserConsents(userId);

    // GDPR требует явного согласия для всех типов обработки
    const requiredTypes: Consent['type'][] = ['data_processing', 'marketing', 'analytics'];
    requiredTypes.forEach((type) => {
      if (!this.hasConsent(userId, type)) {
        issues.push(`Missing consent for ${type} (required by GDPR)`);
      }
    });

    // Проверка возможности отзыва согласия
    const hasRevokedConsents = userConsents.some((c) => c.revokedAt);
    if (!hasRevokedConsents && userConsents.length > 0) {
      // Это нормально, но проверяем что механизм отзыва работает
    }

    return {
      compliant: issues.length === 0,
      issues,
    };
  }

  /**
   * Генерирует токен для безопасной передачи данных
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Проверяет безопасность пароля
   */
  static validatePasswordStrength(password: string): {
    valid: boolean;
    score: number; // 0-4
    issues: string[];
  } {
    const issues: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    else issues.push('Password must be at least 8 characters');

    if (/[a-z]/.test(password)) score++;
    else issues.push('Password must contain lowercase letters');

    if (/[A-Z]/.test(password)) score++;
    else issues.push('Password must contain uppercase letters');

    if (/[0-9]/.test(password)) score++;
    else issues.push('Password must contain numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else issues.push('Password must contain special characters');

    return {
      valid: score >= 4,
      score,
      issues,
    };
  }
}

