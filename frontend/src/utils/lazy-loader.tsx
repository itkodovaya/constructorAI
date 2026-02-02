import React, { lazy, ComponentType } from 'react';

// Lazy load components with retry logic
export const LazyLoader = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3
): React.LazyExoticComponent<T> {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      let attempts = 0;
      
      const tryImport = () => {
        importFn()
          .then(resolve)
          .catch((error) => {
            attempts++;
            if (attempts < retries) {
              setTimeout(tryImport, 1000 * attempts);
            } else {
              reject(error);
            }
          });
      };
      
      tryImport();
    });
  });
}

// Preload component
export function preloadComponent(importFn: () => Promise<any>) {
  importFn();
}
