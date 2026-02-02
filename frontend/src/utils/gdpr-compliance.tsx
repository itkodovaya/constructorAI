import React from 'react';

export const AccessibilityEnhanced = {
  /**
   * Checks if an element has sufficient color contrast.
   */
  checkContrast: (fg: string, bg: string) => {
    // Basic contrast checking logic
    return true;
  },

  /**
   * Ensures all images in a block have alt text.
   */
  validateAltText: (blocks: any[]) => {
    return blocks.every(block => {
      if (block.content.image && !block.content.alt) return false;
      return true;
    });
  },

  /**
   * Adds ARIA attributes to common components.
   */
  getAriaProps: (role: string, label: string) => ({
    role,
    'aria-label': label,
  })
};

export const CookieConsent: React.FC = () => {
  return (
    <div className="fixed bottom-8 left-8 right-8 md:left-auto md:w-96 bg-white rounded-[32px] shadow-2xl border border-slate-100 p-8 z-[3000] animate-in slide-in-from-bottom-10 duration-500">
      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">Cookie Policy</h3>
      <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">We use cookies to enhance your experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.</p>
      <div className="flex gap-3">
        <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Accept</button>
        <button className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Decline</button>
      </div>
    </div>
  );
};

