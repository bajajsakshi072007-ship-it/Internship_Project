import { useState, useEffect } from 'react'

/**
 * Debounces a value by the specified delay.
 * Useful for search inputs to avoid excessive API calls.
 *
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {*} The debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
