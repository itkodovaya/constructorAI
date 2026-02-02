/**
 * Keyboard shortcuts для платформы
 */

import React from 'react';

export const KEYBOARD_SHORTCUTS = {
  // Навигация
  OPEN_COMMAND_PALETTE: 'Ctrl+K',
  CLOSE_MODAL: 'Escape',
  SAVE: 'Ctrl+S',
  
  // Редактор сайтов
  ADD_BLOCK: 'Ctrl+B',
  DELETE_BLOCK: 'Delete',
  DUPLICATE_BLOCK: 'Ctrl+D',
  MOVE_UP: 'ArrowUp',
  MOVE_DOWN: 'ArrowDown',
  
  // Бренд-кит
  OPEN_BRAND_PANEL: 'Ctrl+P',
  OPEN_SITE_BUILDER: 'Ctrl+L',
  
  // Экспорт
  EXPORT_HTML: 'Ctrl+E',
  PREVIEW: 'Ctrl+P',
} as const;

export function useKeyboardShortcuts() {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Открыть Command Palette
      }
      
      // Сохранение
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Сохранить изменения
      }
      
      // Escape для закрытия модалок
      if (e.key === 'Escape') {
        // Закрыть активную модалку
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

export function getShortcutLabel(shortcut: string): string {
  if (typeof window !== 'undefined' && window.navigator.platform.includes('Mac')) {
    return shortcut.replace('Ctrl', '⌘');
  }
  return shortcut;
}

