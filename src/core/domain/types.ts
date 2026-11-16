/**
 * Entidades del dominio. Son el contrato compartido entre la UI, los
 * repositorios simulados y, más adelante, la API REST.
 */

export type Role = 'admin' | 'client';

/** Lunes = 1 … Domingo = 7. */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Fecha local `YYYY-MM-DD`. */
export type DateKey = string;

export interface UserSummary {
  id: string;
  displayName: string;
}

export interface User extends UserSummary {
  email: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

/* ---------- Datos personales ---------- */

/**
 * Datos corporales del usuario. Son datos sensibles (salud): todos son
 * opcionales (`null` = no informado) y sólo los ve su dueño.
 */
export interface BodyMetrics {
  weightKg: number | null;
  heightCm: number | null;
  /** Edad en años; se pide la edad y no la fecha de nacimiento para minimizar datos. */
  age: number | null;
  /** ISO 8601 de la última actualización; `null` si nunca se registraron. */
  updatedAt: string | null;
}

export type BodyMetricsInput = Omit<BodyMetrics, 'updatedAt'>;

/* ---------- Catálogo ---------- */

export interface FoodCategory {
  id: string;
  name: string;
  order: number;
}

export interface Ingredient {
  id: string;
  name: string;
  categoryId: string;
  /** Valores por cada 100 g. */
  kcal100: number;
  protein100: number;
  carbs100: number;
  fat100: number;
}

export type ExerciseType = 'strength' | 'cardio' | 'mobility';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  type: ExerciseType;
}

/* ---------- Recetas y nutrición ---------- */

export type GoalId = 'low_carb' | 'high_carb' | 'high_protein' | 'low_protein' | 'low_fat' | 'high_fat';

export interface MacroSplit {
  /** Fracción de kcal (0–1) aportada por cada macro. */
  protein: number;
  carbs: number;
  fat: number;
}

export interface RecipeNutrition {
  /** Por porción. */
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  split: MacroSplit;
  goals: GoalId[];
}

export interface RecipeIngredientLine {
  ingredientId: string;
  grams: number;
}

export interface Recipe {
  id: string;
  /** `null` = receta oficial del catálogo (creada por un admin). */
  ownerId: string | null;
  authorName: string;
  title: string;
  description: string;
  servings: number;
  prepMinutes: number;
  ingredients: RecipeIngredientLine[];
  steps: string[];
  nutrition: RecipeNutrition;
  updatedAt: string;
}

export type RecipeInput = Pick<Recipe, 'title' | 'description' | 'servings' | 'prepMinutes' | 'ingredients' | 'steps'>;

export type RecipeScope = 'mine' | 'catalog' | 'shared';

/* ---------- Menús y avance ---------- */

export type MealType = 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner';

export interface MenuSlot {
  id: string;
  weekday: Weekday;
  mealType: MealType;
  /** `HH:mm` */
  time: string;
  recipeId: string;
  recipeTitle: string;
  reminder: boolean;
}

export type MealLogStatus = 'done' | 'skipped';

export interface MealLog {
  slotId: string;
  date: DateKey;
  status: MealLogStatus;
}

/* ---------- Entrenamiento ---------- */

export interface RoutineExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weekday: Weekday;
  sets: number;
  reps?: number;
  durationSec?: number;
  restSec: number;
}

export interface RoutineGoal {
  id: string;
  description: string;
  deadline?: DateKey;
}

export interface Routine {
  id: string;
  ownerId: string;
  name: string;
  weekdays: Weekday[];
  exercises: RoutineExercise[];
  goals: RoutineGoal[];
}

export interface WorkoutLog {
  routineId: string;
  date: DateKey;
}

/* ---------- Social ---------- */

export type ConnectionStatus = 'pending' | 'accepted';

export interface Connection {
  id: string;
  other: UserSummary;
  status: ConnectionStatus;
  /** `incoming`: me invitaron; `outgoing`: invité yo. */
  direction: 'incoming' | 'outgoing';
}

export type ShareableType = 'recipe' | 'routine';

export interface SharedItem {
  id: string;
  from: UserSummary;
  resourceType: ShareableType;
  resourceId: string;
  title: string;
  createdAt: string;
}

/* ---------- Propuestas ---------- */

export type ProposalType = 'ingredient' | 'exercise';
export type ProposalStatus = 'pending' | 'approved' | 'rejected';

export interface Proposal {
  id: string;
  author: UserSummary;
  type: ProposalType;
  /** Campos propuestos, con la misma forma que el formulario del catálogo. */
  payload: Record<string, string | number>;
  status: ProposalStatus;
  reviewNote?: string;
  createdAt: string;
}
