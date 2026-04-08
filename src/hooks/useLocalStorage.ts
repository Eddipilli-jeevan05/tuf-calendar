"use client";

import { useCallback, useEffect, useState } from "react";

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): UseLocalStorageReturn<T> {
  const [value, setValueState] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        setValueState(initialValue);
        return;
      }

      const parsed = JSON.parse(item) as T;
      setValueState(parsed);
    } catch (error) {
      console.warn("Invalid localStorage payload. Resetting key:", key, error);
      setValueState(initialValue);
    }
  }, [initialValue, key]);

  const setValue = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      setValueState((prevValue) => {
        const resolvedValue =
          nextValue instanceof Function ? nextValue(prevValue) : nextValue;

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(resolvedValue));
        }

        return resolvedValue;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
    setValueState(initialValue);
  }, [initialValue, key]);

  return {
    value,
    setValue,
    removeValue,
  };
}
