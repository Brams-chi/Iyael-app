import { z } from 'zod';

const int = (min: number, max: number, label: string) =>
  z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.coerce
      .number({ error: `Ingresa ${label}` })
      .int({ error: 'Usa un número entero' })
      .min(min, { error: `Mínimo ${min}` })
      .max(max, { error: `Máximo ${max}` })
  );

/** Un esquema por paso del editor; juntos forman la receta completa. */
export const recipeStepSchemas = [
  z.object({
    title: z.string().trim().min(3, { error: 'Escribe al menos 3 caracteres' }).max(80, { error: 'Máximo 80 caracteres' }),
    servings: int(1, 20, 'las porciones'),
    prepMinutes: int(1, 600, 'los minutos'),
  }),
  z.object({
    ingredients: z
      .array(z.object({ ingredientId: z.string(), grams: int(1, 5000, 'los gramos') }))
      .min(1, { error: 'Agrega al menos un ingrediente' }),
  }),
  z.object({
    steps: z
      .array(z.string().trim())
      .transform((steps) => steps.filter(Boolean))
      .pipe(z.array(z.string().max(500)).min(1, { error: 'Escribe al menos un paso' })),
  }),
  z.object({
    description: z.string().trim().max(500, { error: 'Máximo 500 caracteres' }),
  }),
] as const;

export const RECIPE_STEP_TITLES = ['Datos', 'Ingredientes', 'Pasos', 'Presentación'] as const;
