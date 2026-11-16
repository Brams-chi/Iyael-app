import { z } from 'zod';

import type { ExerciseType } from '@/core/domain/types';
import type { ChipOption } from '@/shared/ui';

import type { CatalogEntityKey } from './hooks';

/**
 * Definición declarativa de los formularios del catálogo. La usan el CRUD del
 * admin y las propuestas del cliente, así los campos y validaciones viven en
 * un solo lugar (abierto a nuevas entidades sin tocar los formularios).
 */

export type FieldConfig =
  | { key: string; label: string; kind: 'text'; hint?: string }
  | { key: string; label: string; kind: 'number'; hint?: string }
  | { key: string; label: string; kind: 'select'; options: readonly ChipOption<string>[] }
  | { key: string; label: string; kind: 'category' };

export interface EntityConfig {
  key: CatalogEntityKey;
  title: string;
  singular: string;
  fields: readonly FieldConfig[];
  schema: z.ZodType<Record<string, unknown>>;
  /** Cómo se ve una fila en la lista. */
  describe(row: Record<string, unknown>): { title: string; subtitle: string };
}

/** Acepta coma decimal ("4,3") y trata vacío como ausente. */
const numeric = (max: number, label: string) =>
  z.preprocess(
    (v) => (typeof v === 'string' ? (v.trim() === '' ? undefined : v.replace(',', '.').trim()) : v),
    z.coerce
      .number({ error: `Ingresa ${label} como número` })
      .min(0, { error: 'No puede ser negativo' })
      .max(max, { error: `El máximo es ${max}` })
  );

const name = z.string().trim().min(2, { error: 'Escribe al menos 2 caracteres' }).max(60, { error: 'Máximo 60 caracteres' });

export const exerciseTypeOptions: readonly ChipOption<ExerciseType>[] = [
  { value: 'strength', label: 'Fuerza' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'mobility', label: 'Movilidad' },
];

const typeLabel = (v: unknown) => exerciseTypeOptions.find((o) => o.value === v)?.label ?? '';
const fmt = (v: unknown) => String(v).replace('.', ',');

export const entityConfigs: Record<CatalogEntityKey, EntityConfig> = {
  categories: {
    key: 'categories',
    title: 'Categorías',
    singular: 'categoría',
    fields: [
      { key: 'name', label: 'Nombre', kind: 'text' },
      { key: 'order', label: 'Orden en listas', kind: 'number', hint: '1 aparece primero.' },
    ],
    schema: z.object({ name, order: numeric(99, 'el orden') }),
    describe: (row) => ({ title: String(row.name), subtitle: `Posición ${String(row.order)}` }),
  },
  ingredients: {
    key: 'ingredients',
    title: 'Ingredientes',
    singular: 'ingrediente',
    fields: [
      { key: 'name', label: 'Nombre', kind: 'text' },
      { key: 'categoryId', label: 'Categoría', kind: 'category' },
      { key: 'kcal100', label: 'Kilocalorías por 100 g', kind: 'number' },
      { key: 'protein100', label: 'Proteína (g por 100 g)', kind: 'number' },
      { key: 'carbs100', label: 'Carbohidratos (g por 100 g)', kind: 'number' },
      { key: 'fat100', label: 'Grasa (g por 100 g)', kind: 'number' },
    ],
    schema: z.object({
      name,
      categoryId: z.string().min(1, { error: 'Elige una categoría' }),
      kcal100: numeric(900, 'las kilocalorías'),
      protein100: numeric(100, 'la proteína'),
      carbs100: numeric(100, 'los carbohidratos'),
      fat100: numeric(100, 'la grasa'),
    }),
    describe: (row) => ({
      title: String(row.name),
      subtitle: `${fmt(row.kcal100)} kcal · P ${fmt(row.protein100)} · C ${fmt(row.carbs100)} · G ${fmt(row.fat100)}`,
    }),
  },
  exercises: {
    key: 'exercises',
    title: 'Ejercicios',
    singular: 'ejercicio',
    fields: [
      { key: 'name', label: 'Nombre', kind: 'text' },
      { key: 'muscleGroup', label: 'Grupo muscular', kind: 'text' },
      { key: 'type', label: 'Tipo', kind: 'select', options: exerciseTypeOptions },
    ],
    schema: z.object({
      name,
      muscleGroup: z.string().trim().min(2, { error: 'Escribe el grupo muscular' }).max(40),
      type: z.enum(['strength', 'cardio', 'mobility'], { error: 'Elige un tipo' }),
    }),
    describe: (row) => ({ title: String(row.name), subtitle: `${String(row.muscleGroup)} · ${typeLabel(row.type)}` }),
  },
};

/** Valores iniciales del formulario (todo como texto, como lo entrega un TextInput). */
export function toFormValues(config: EntityConfig, row?: Record<string, unknown> | null): Record<string, string> {
  return Object.fromEntries(config.fields.map((f) => [f.key, row?.[f.key] == null ? '' : fmt(row[f.key])]));
}
