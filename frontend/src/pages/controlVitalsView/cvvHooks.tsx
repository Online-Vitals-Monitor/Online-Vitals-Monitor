import { useCallback, useEffect, useRef } from "react";

// Debounce hook
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedFunction = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunction;
}

// API error handler
export function useApiErrorHandler(setError: (msg: string | null) => void) {
  return useCallback((error: unknown, defaultMsg: string) => {
    console.error(defaultMsg, error);
    setError(defaultMsg);
  }, [setError]);
}