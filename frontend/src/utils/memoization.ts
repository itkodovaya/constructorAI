import { useMemo, useCallback } from 'react';

// Memoize expensive computations
export function useExpensiveComputation<T, R>(
  computation: (input: T) => R,
  input: T,
  deps: any[] = []
): R {
  return useMemo(() => computation(input), [input, ...deps]);
}

// Memoize callbacks
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: any[] = []
): T {
  return useCallback(callback, deps) as T;
}

// Cache function results
const cache = new Map<string, any>();

export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  return ((...args: Parameters<T>) => {
    const key = keyGenerator
      ? keyGenerator(...args)
      : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Clear cache
export function clearMemoizationCache() {
  cache.clear();
}

