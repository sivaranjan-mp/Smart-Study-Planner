import { useState, useEffect } from 'react';

/**
 * Debounce Value Hook.
 * Responsibility: Delays updating the returned debounced value until after delay ms
 * have elapsed since the last time the input value changed.
 *
 * @template T
 * @param {T} value - The input value to debounce
 * @param {number} [delay=300] - Debounce delay in milliseconds
 * @returns {T} The debounced value
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
