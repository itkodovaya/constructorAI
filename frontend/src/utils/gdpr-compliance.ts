/**
 * GDPR compliance utilities
 */

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export class GDPRManager {
  private static storageKey = 'gdpr_consent';

  static getConsent(): ConsentPreferences | null {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : null;
  }

  static setConsent(preferences: ConsentPreferences): void {
    localStorage.setItem(this.storageKey, JSON.stringify(preferences));
    localStorage.setItem('gdpr_consent_date', new Date().toISOString());
  }

  static hasConsent(): boolean {
    return this.getConsent() !== null;
  }

  static canUseAnalytics(): boolean {
    const consent = this.getConsent();
    return consent?.analytics === true;
  }

  static canUseMarketing(): boolean {
    const consent = this.getConsent();
    return consent?.marketing === true;
  }

  static generatePrivacyPolicy(brandName: string): string {
    return `
# Privacy Policy for ${brandName}

Last updated: ${new Date().toLocaleDateString()}

## 1. Information We Collect
We collect information that you provide directly to us, including:
- Name and contact information
- Usage data and analytics
- Cookies and tracking technologies

## 2. How We Use Your Information
We use the information we collect to:
- Provide and improve our services
- Communicate with you
- Analyze usage patterns

## 3. Data Protection
We implement appropriate security measures to protect your personal information.

## 4. Your Rights
Under GDPR, you have the right to:
- Access your personal data
- Rectify inaccurate data
- Erase your data
- Object to processing
- Data portability

## 5. Contact Us
For questions about this privacy policy, please contact us.
    `.trim();
  }
}

