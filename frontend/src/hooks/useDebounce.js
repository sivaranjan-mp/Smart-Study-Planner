import { useState, useEffect } from 'react';

/**
 * Debounce Value Hook.
 * Responsibility: Generic debounce utility hook delaying updates until delay ms has passed.
 */
export default function useDebounce(value, delay = 300) {
  // TODO: Debounce given value with setTimeout and cleanup
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
