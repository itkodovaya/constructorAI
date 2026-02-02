/**
 * Enhanced accessibility utilities for WCAG 2.1 AAA compliance
 */

// Check color contrast ratio
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  const [r, g, b] = rgb.map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

// Check if contrast meets WCAG AAA standards
export function meetsWCAGAAA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 7; // AAA requires 7:1 for normal text
}

// Generate ARIA labels
export function generateAriaLabel(element: HTMLElement): string {
  const text = element.textContent || '';
  const role = element.getAttribute('role') || element.tagName.toLowerCase();
  return `${role}: ${text}`;
}

// Keyboard navigation helper
export function setupKeyboardNavigation(
  container: HTMLElement,
  selector: string = 'a, button, [tabindex="0"]'
) {
  const focusableElements = Array.from(container.querySelectorAll(selector)) as HTMLElement[];
  
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
      
      if (e.shiftKey) {
        // Shift + Tab: move backwards
        if (currentIndex > 0) {
          focusableElements[currentIndex - 1].focus();
        } else {
          focusableElements[focusableElements.length - 1].focus();
        }
      } else {
        // Tab: move forwards
        if (currentIndex < focusableElements.length - 1) {
          focusableElements[currentIndex + 1].focus();
        } else {
          focusableElements[0].focus();
        }
      }
      e.preventDefault();
    }
  });
}

// Screen reader announcements
export function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

