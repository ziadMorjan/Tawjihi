// src/shared/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Delays updating the returned value until after `delay` ms
 * of inactivity on the input value.
 *
 * Usage:
 *   const debouncedQuery = useDebounce(rawQuery, 400);
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
