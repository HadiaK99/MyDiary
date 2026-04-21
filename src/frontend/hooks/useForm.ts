import { useState, useEffect, useCallback } from "react";

interface FormOptions<T> {
  initialValues: T;
  storageKey?: string;
  onValuesLoaded?: (values: T) => void;
}

export function useForm<T extends Record<string, any>>({ 
  initialValues, 
  storageKey,
  onValuesLoaded
}: FormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [isReady, setIsReady] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const merged = { ...initialValues, ...parsed };
          setValues(merged);
          if (onValuesLoaded) onValuesLoaded(merged);
        } catch (e) {
          console.error("Failed to parse saved form draft:", e);
        }
      }
    }
    setIsReady(true);
  }, [storageKey, initialValues, onValuesLoaded]);

  // Save to localStorage whenever values change
  useEffect(() => {
    if (isReady && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(values));
    }
  }, [values, storageKey, isReady]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFieldValue(name as keyof T, val);
  }, [setFieldValue]);

  const resetForm = useCallback((newValues?: T) => {
    setValues(newValues || initialValues);
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [initialValues, storageKey]);

  const clearDraft = useCallback(() => {
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  return {
    values,
    setValues,
    setFieldValue,
    handleChange,
    resetForm,
    clearDraft,
    isReady
  };
}
