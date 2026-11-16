import { useCallback, useState } from 'react';
import type { z } from 'zod';

export type FormErrors<K extends string> = Partial<Record<K | 'form', string>>;

/**
 * Estado de formulario con validación por esquema zod.
 * Los valores se guardan como texto (lo que entrega un TextInput) y el esquema
 * los convierte al tipo final al validar.
 */
export function useForm<K extends string, S extends z.ZodType>(schema: S, initial: Record<K, string>) {
  const [values, setValues] = useState<Record<K, string>>(initial);
  const [errors, setErrors] = useState<FormErrors<K>>({});

  const setField = useCallback((key: K, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  /** Devuelve los datos tipados si son válidos; si no, publica los errores y devuelve `null`. */
  const validate = useCallback((): z.output<S> | null => {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return result.data;
    }
    const next: FormErrors<K> = {};
    for (const issue of result.error.issues) {
      const key = (issue.path[0] as K | undefined) ?? 'form';
      if (!next[key]) next[key] = issue.message;
    }
    setErrors(next);
    return null;
  }, [schema, values]);

  const setFormError = useCallback((message: string) => setErrors((prev) => ({ ...prev, form: message })), []);

  const reset = useCallback((next: Record<K, string>) => {
    setValues(next);
    setErrors({});
  }, []);

  return { values, errors, setField, validate, setFormError, reset };
}
