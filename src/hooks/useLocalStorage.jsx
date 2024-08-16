import { useEffect, useState } from 'react';

export const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        try {
            const value = localStorage.getItem(key);
            if (value == null) {
                return;
            }
            setValue(JSON.parse(value));
        } catch (error) {
            if (
                typeof error === 'object' &&
                error !== null &&
                error.hasOwnProperty('message') &&
                typeof error.message === 'string'
            ) {
                setError(error.message);
                return;
            }
            setError('Ошибка при получении данных');
        }
    }, [key]);

    const setToLocalStorage = (value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return value;
        } catch (error) {
            return null;
        }
    };

    const removeFromLocalStorage = () => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            return false;
        }
    };

    return {
        value,
        error,
        setToLocalStorage,
        removeFromLocalStorage,
    };
};
