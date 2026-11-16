import { z } from 'zod';

import { BODY_LIMITS } from '@/core/domain/bodyMetrics';

/**
 * Campo numérico opcional: vacío = `null` (dato no informado).
 * Acepta coma decimal ("64,5") porque es lo que escribe un teclado en español.
 */
function measure({ min, max }: { min: number; max: number }, unit: string, integer = false) {
  return z
    .string()
    .trim()
    .transform((raw, ctx) => {
      if (raw === '') return null;
      const value = Number(raw.replace(',', '.'));
      if (!Number.isFinite(value)) {
        ctx.addIssue({ code: 'custom', message: 'Escribe sólo números' });
        return z.NEVER;
      }
      if (integer && !Number.isInteger(value)) {
        ctx.addIssue({ code: 'custom', message: 'Usa un número entero' });
        return z.NEVER;
      }
      if (value < min || value > max) {
        ctx.addIssue({ code: 'custom', message: `Debe estar entre ${min} y ${max} ${unit}` });
        return z.NEVER;
      }
      return Math.round(value * 10) / 10;
    });
}

export const bodyMetricsSchema = z.object({
  weightKg: measure(BODY_LIMITS.weightKg, 'kg'),
  heightCm: measure(BODY_LIMITS.heightCm, 'cm'),
  age: measure(BODY_LIMITS.age, 'años', true),
});
