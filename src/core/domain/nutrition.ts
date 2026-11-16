import type { GoalId, Ingredient, MacroSplit, RecipeIngredientLine, RecipeNutrition } from './types';

/** Factores de Atwater: kcal por gramo de cada macronutriente. */
export const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 } as const;

interface GoalRule {
  id: GoalId;
  test: (split: MacroSplit) => boolean;
}

/**
 * Una regla por objetivo (patrón estrategia). Agregar un objetivo nuevo es
 * agregar una regla, sin modificar `evaluateRecipe`.
 * Umbrales iniciales sobre % de kcal; deben validarse con un nutricionista.
 */
export const goalRules: readonly GoalRule[] = [
  { id: 'low_carb', test: (s) => s.carbs < 0.26 },
  { id: 'high_carb', test: (s) => s.carbs >= 0.55 },
  { id: 'high_protein', test: (s) => s.protein >= 0.25 },
  { id: 'low_protein', test: (s) => s.protein < 0.1 },
  { id: 'low_fat', test: (s) => s.fat <= 0.2 },
  { id: 'high_fat', test: (s) => s.fat >= 0.4 },
];

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Función pura: mismas entradas, mismo resultado, en la app y en la API. */
export function evaluateRecipe(
  lines: readonly RecipeIngredientLine[],
  ingredientsById: ReadonlyMap<string, Ingredient>,
  servings: number
): RecipeNutrition {
  const portions = Math.max(1, servings);
  const totals = { protein: 0, carbs: 0, fat: 0 };

  for (const line of lines) {
    const ingredient = ingredientsById.get(line.ingredientId);
    if (!ingredient || line.grams <= 0) continue;
    const factor = line.grams / 100;
    totals.protein += ingredient.protein100 * factor;
    totals.carbs += ingredient.carbs100 * factor;
    totals.fat += ingredient.fat100 * factor;
  }

  const kcalFrom = {
    protein: totals.protein * KCAL_PER_GRAM.protein,
    carbs: totals.carbs * KCAL_PER_GRAM.carbs,
    fat: totals.fat * KCAL_PER_GRAM.fat,
  };
  const kcal = kcalFrom.protein + kcalFrom.carbs + kcalFrom.fat;

  const split: MacroSplit =
    kcal > 0
      ? { protein: kcalFrom.protein / kcal, carbs: kcalFrom.carbs / kcal, fat: kcalFrom.fat / kcal }
      : { protein: 0, carbs: 0, fat: 0 };

  return {
    kcal: Math.round(kcal / portions),
    protein: round1(totals.protein / portions),
    carbs: round1(totals.carbs / portions),
    fat: round1(totals.fat / portions),
    split,
    // Sin calorías no hay reparto que evaluar.
    goals: kcal > 0 ? goalRules.filter((rule) => rule.test(split)).map((rule) => rule.id) : [],
  };
}
