import { createContext, use, useCallback, useMemo, useState, type PropsWithChildren } from 'react';

import { errorMessage } from '@/core/domain/errors';
import { evaluateRecipe } from '@/core/domain/nutrition';
import type { Ingredient, Recipe, RecipeInput, RecipeNutrition } from '@/core/domain/types';
import { useIngredientMap } from '@/features/catalog/hooks';

import { useSaveRecipe } from '../hooks';
import { recipeStepSchemas, RECIPE_STEP_TITLES } from '../schema';

/** Borrador editable: los números se guardan como texto hasta validar. */
export interface RecipeDraft {
  title: string;
  description: string;
  servings: string;
  prepMinutes: string;
  ingredients: { ingredientId: string; grams: string }[];
  steps: string[];
}

type TextKey = 'title' | 'description' | 'servings' | 'prepMinutes';

interface RecipeEditorValue {
  draft: RecipeDraft;
  step: number;
  isLast: boolean;
  errors: Record<string, string>;
  saving: boolean;
  /** Evaluación recalculada en cada cambio. */
  nutrition: RecipeNutrition;
  ingredientsById: ReadonlyMap<string, Ingredient>;
  canPropose: boolean;
  setText(key: TextKey, value: string): void;
  addIngredient(ingredient: Ingredient): void;
  setGrams(ingredientId: string, grams: string): void;
  removeIngredient(ingredientId: string): void;
  setStepText(index: number, text: string): void;
  addStep(): void;
  removeStep(index: number): void;
  moveStep(index: number, direction: -1 | 1): void;
  proposeIngredient(name: string): void;
  next(): void;
  back(): boolean;
}

const RecipeEditorContext = createContext<RecipeEditorValue | null>(null);

function toDraft(recipe?: Recipe): RecipeDraft {
  return {
    title: recipe?.title ?? '',
    description: recipe?.description ?? '',
    servings: String(recipe?.servings ?? 1),
    prepMinutes: recipe ? String(recipe.prepMinutes) : '',
    ingredients: recipe?.ingredients.map((l) => ({ ingredientId: l.ingredientId, grams: String(l.grams) })) ?? [],
    steps: recipe?.steps.length ? [...recipe.steps] : [''],
  };
}

interface RecipeEditorProviderProps extends PropsWithChildren {
  initial?: Recipe;
  onSaved(recipe: Recipe): void;
  /** Sólo clientes: abre el flujo de propuesta de ingrediente. */
  onProposeIngredient?: (name: string) => void;
}

export function RecipeEditorProvider({ initial, onSaved, onProposeIngredient, children }: RecipeEditorProviderProps) {
  const [draft, setDraft] = useState<RecipeDraft>(() => toDraft(initial));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { map: ingredientsById } = useIngredientMap();
  const save = useSaveRecipe();

  const update = useCallback((patch: (d: RecipeDraft) => RecipeDraft, clear?: string) => {
    setDraft(patch);
    if (clear) setErrors((e) => (e[clear] ? Object.fromEntries(Object.entries(e).filter(([k]) => k !== clear)) : e));
  }, []);

  const nutrition = useMemo(
    () =>
      evaluateRecipe(
        draft.ingredients.map((l) => ({ ingredientId: l.ingredientId, grams: Number(l.grams.replace(',', '.')) || 0 })),
        ingredientsById,
        Number(draft.servings) || 1
      ),
    [draft.ingredients, draft.servings, ingredientsById]
  );

  /** Valida el paso actual y devuelve sus datos tipados, o publica errores. */
  const validateStep = useCallback(
    (index: number) => {
      const result = recipeStepSchemas[index]!.safeParse(draft);
      if (result.success) return result.data;
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.');
        next[key] ??= issue.message;
        next[String(issue.path[0])] ??= issue.message;
      }
      setErrors(next);
      return null;
    },
    [draft]
  );

  const submit = useCallback(() => {
    const parts = recipeStepSchemas.map((s) => s.safeParse(draft));
    const firstInvalid = parts.findIndex((p) => !p.success);
    if (firstInvalid >= 0) {
      setStep(firstInvalid);
      validateStep(firstInvalid);
      return;
    }
    const input = Object.assign({}, ...parts.map((p) => p.data)) as RecipeInput;
    save.mutate(
      { id: initial?.id, input },
      {
        onSuccess: onSaved,
        onError: (error) => setErrors({ form: errorMessage(error) }),
      }
    );
  }, [draft, initial?.id, onSaved, save, validateStep]);

  const value = useMemo<RecipeEditorValue>(
    () => ({
      draft,
      step,
      isLast: step === RECIPE_STEP_TITLES.length - 1,
      errors,
      saving: save.isPending,
      nutrition,
      ingredientsById,
      canPropose: !!onProposeIngredient,
      setText: (key, v) => update((d) => ({ ...d, [key]: v }), key),
      addIngredient: (ingredient) =>
        update((d) => ({ ...d, ingredients: [...d.ingredients, { ingredientId: ingredient.id, grams: '100' }] }), 'ingredients'),
      setGrams: (id, grams) =>
        update((d) => ({ ...d, ingredients: d.ingredients.map((l) => (l.ingredientId === id ? { ...l, grams } : l)) }), 'ingredients'),
      removeIngredient: (id) => update((d) => ({ ...d, ingredients: d.ingredients.filter((l) => l.ingredientId !== id) })),
      setStepText: (index, text) => update((d) => ({ ...d, steps: d.steps.map((s, i) => (i === index ? text : s)) }), 'steps'),
      addStep: () => update((d) => ({ ...d, steps: [...d.steps, ''] })),
      removeStep: (index) => update((d) => ({ ...d, steps: d.steps.length > 1 ? d.steps.filter((_, i) => i !== index) : [''] })),
      moveStep: (index, direction) =>
        update((d) => {
          const target = index + direction;
          if (target < 0 || target >= d.steps.length) return d;
          const steps = [...d.steps];
          [steps[index], steps[target]] = [steps[target]!, steps[index]!];
          return { ...d, steps };
        }),
      proposeIngredient: (name) => onProposeIngredient?.(name),
      next: () => {
        if (step === RECIPE_STEP_TITLES.length - 1) return submit();
        if (validateStep(step)) {
          setErrors({});
          setStep(step + 1);
        }
      },
      back: () => {
        if (step === 0) return false;
        setErrors({});
        setStep(step - 1);
        return true;
      },
    }),
    [draft, step, errors, save.isPending, nutrition, ingredientsById, onProposeIngredient, update, submit, validateStep]
  );

  return <RecipeEditorContext.Provider value={value}>{children}</RecipeEditorContext.Provider>;
}

export function useRecipeEditor(): RecipeEditorValue {
  const value = use(RecipeEditorContext);
  if (!value) throw new Error('useRecipeEditor debe usarse dentro de <RecipeEditorProvider>');
  return value;
}
