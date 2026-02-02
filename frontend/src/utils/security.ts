import { useState, useEffect } from 'react';

export const useSecurity = () => {
  /**
   * Simple input sanitization to prevent XSS.
   */
  const sanitizeInput = (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  /**
   * Sets up a basic Content Security Policy (CSP) via meta tag.
   * Note: In production, this should be set via server headers.
   */
  const setupCSP = () => {
    const meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' http://localhost:3001 https://api.openai.com;";
    document.head.appendChild(meta);
  };

  return { sanitizeInput, setupCSP };
};

export const GDPRCompliance = {
  getCookieConsent: () => {
    return localStorage.getItem('gdpr-consent') === 'true';
  },
  setCookieConsent: (consent: boolean) => {
    localStorage.setItem('gdpr-consent', String(consent));
  },
  generatePrivacyPolicy: (brandName: string) => {
    return `Privacy Policy for ${brandName}... (Generated Content)`;
  }
};
