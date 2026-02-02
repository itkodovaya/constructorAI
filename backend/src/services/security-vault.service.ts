/**
 * Security Vault Service - AI Firewall и Privacy Vault (Phase 8)
 * Обеспечивает защиту данных и предотвращение утечек через AI
 */

import * as crypto from 'crypto';

export class SecurityVaultService {
  private static masterKey = process.env.VAULT_MASTER_KEY || 'sovereign-default-key-2026';

  /**
   * AI Firewall: Проверка промпта на вредоносный контент или инъекции
   */
  static validatePrompt(prompt: string): { allowed: boolean; reason?: string } {
    const dangerousKeywords = ['eval', 'system', 'sudo', 'ignore all previous instructions'];
    const hasInjection = dangerousKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

    if (hasInjection) {
      return { allowed: false, reason: 'Detected potential prompt injection' };
    }

    return { allowed: true };
  }

  /**
   * Privacy Vault: Шифрование конфиденциальных данных на уровне полей
   */
  static encrypt(text: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.masterKey.padEnd(32)), Buffer.alloc(16, 0));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  static decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.masterKey.padEnd(32)), Buffer.alloc(16, 0));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Data Masking: Скрытие персональных данных в ответах AI
   */
  static maskPii(text: string): string {
    // Имитация скрытия email и телефонов
    return text.replace(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/g, '[EMAIL_HIDDEN]')
               .replace(/\+?\d{10,12}/g, '[PHONE_HIDDEN]');
  }
}

