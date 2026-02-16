import { useState, useEffect } from 'react';

/**
 * Hook que retorna un valor debounced después del delay especificado
 * @param value - El valor a debounce
 * @param delay - El delay en milisegundos (default: 500)
 * @returns El valor debounced
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up el timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancela el timer si value cambia antes del delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
