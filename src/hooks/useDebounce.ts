import { useEffect, useState } from 'react';

/**
 * Custom hook để debounce một giá trị
 * @param value - Giá trị cần debounce
 * @param delay - Thời gian delay (ms), mặc định 500ms
 * @returns Giá trị đã được debounce
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // Call API với debouncedSearchTerm
 *   searchAPI(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set timeout để update giá trị sau khi delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function: clear timeout nếu value thay đổi trước khi delay hết
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}