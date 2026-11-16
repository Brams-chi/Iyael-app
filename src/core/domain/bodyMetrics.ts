import type { BodyMetricsInput } from './types';

/**
 * Rangos válidos de los datos corporales. Única fuente de verdad: los usa el
 * esquema del formulario y el repositorio (equivalente a la validación de la API).
 */
export const BODY_LIMITS = {
  weightKg: { min: 20, max: 400 },
  heightCm: { min: 50, max: 260 },
  /** Edad mínima de uso; confirmar con asesoría legal según el país de operación. */
  age: { min: 14, max: 120 },
} as const satisfies Record<keyof BodyMetricsInput, { min: number; max: number }>;

/** `true` si cada valor informado está dentro de su rango. */
export function isValidBodyMetrics(input: BodyMetricsInput): boolean {
  return (Object.keys(BODY_LIMITS) as (keyof BodyMetricsInput)[]).every((key) => {
    const value = input[key];
    if (value === null) return true;
    const { min, max } = BODY_LIMITS[key];
    return Number.isFinite(value) && value >= min && value <= max;
  });
}
