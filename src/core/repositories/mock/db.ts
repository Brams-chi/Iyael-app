import type {
  BodyMetrics,
  Exercise,
  FoodCategory,
  Ingredient,
  MealLog,
  MealType,
  MenuSlot,
  Proposal,
  RecipeIngredientLine,
  Role,
  Routine,
  Weekday,
  WorkoutLog,
} from '@/core/domain/types';

/**
 * Base de datos en memoria SÓLO para desarrollo del front.
 * Se reinicia al recargar la app. Las contraseñas en texto plano existen
 * únicamente aquí; la API real guardará hashes (argon2).
 */

export interface MockUser {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  mockPassword: string;
  inviteCode: string;
}

export interface MockRecipe {
  id: string;
  ownerId: string | null;
  title: string;
  description: string;
  servings: number;
  prepMinutes: number;
  ingredients: RecipeIngredientLine[];
  steps: string[];
  updatedAt: string;
}

export interface MockConnection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: 'pending' | 'accepted';
}

export interface MockShare {
  id: string;
  fromUserId: string;
  toUserId: string;
  resourceType: 'recipe' | 'routine';
  resourceId: string;
  createdAt: string;
}

export interface MockMenuSlot extends Omit<MenuSlot, 'recipeTitle'> {
  ownerId: string;
}

export interface MockMealLog extends MealLog {
  userId: string;
}

export interface MockWorkoutLog extends WorkoutLog {
  userId: string;
}

export const DEMO_PASSWORD = 'Lunchy2026!';

const users: MockUser[] = [
  { id: 'u-client', email: 'cliente@lunchy.app', displayName: 'Ana Torres', role: 'client', mockPassword: DEMO_PASSWORD, inviteCode: 'LUN-7K2Q-M9' },
  { id: 'u-admin', email: 'admin@lunchy.app', displayName: 'Equipo Lunchy', role: 'admin', mockPassword: DEMO_PASSWORD, inviteCode: 'LUN-ADM1-N0' },
  { id: 'u-camila', email: 'camila@lunchy.app', displayName: 'Camila Rojas', role: 'client', mockPassword: DEMO_PASSWORD, inviteCode: 'LUN-C4M1-LA' },
  { id: 'u-diego', email: 'diego@lunchy.app', displayName: 'Diego Muñoz', role: 'client', mockPassword: DEMO_PASSWORD, inviteCode: 'LUN-D13G-0X' },
  { id: 'u-vale', email: 'vale@lunchy.app', displayName: 'Valentina Soto', role: 'client', mockPassword: DEMO_PASSWORD, inviteCode: 'LUN-V4L3-SS' },
  { id: 'u-mateo', email: 'mateo@lunchy.app', displayName: 'Mateo Pérez', role: 'client', mockPassword: DEMO_PASSWORD, inviteCode: 'LUN-M4T3-0P' },
];

const categories: FoodCategory[] = [
  { id: 'c-prot', name: 'Proteínas', order: 1 },
  { id: 'c-veg', name: 'Verduras y hortalizas', order: 2 },
  { id: 'c-fruit', name: 'Frutas', order: 3 },
  { id: 'c-leg', name: 'Legumbres', order: 4 },
  { id: 'c-cer', name: 'Cereales y granos', order: 5 },
  { id: 'c-dairy', name: 'Lácteos', order: 6 },
  { id: 'c-fat', name: 'Grasas saludables', order: 7 },
];

const ing = (id: string, name: string, categoryId: string, kcal100: number, protein100: number, carbs100: number, fat100: number): Ingredient => ({
  id, name, categoryId, kcal100, protein100, carbs100, fat100,
});

const ingredients: Ingredient[] = [
  ing('i-chicken', 'Pechuga de pollo', 'c-prot', 165, 31, 0, 3.6),
  ing('i-salmon', 'Salmón', 'c-prot', 208, 20, 0, 13),
  ing('i-egg', 'Huevo', 'c-prot', 155, 13, 1.1, 11),
  ing('i-tuna', 'Atún al agua', 'c-prot', 116, 26, 0, 1),
  ing('i-spinach', 'Espinaca', 'c-veg', 23, 2.9, 3.6, 0.4),
  ing('i-broccoli', 'Brócoli', 'c-veg', 34, 2.8, 7, 0.4),
  ing('i-tomato', 'Tomate', 'c-veg', 18, 0.9, 3.9, 0.2),
  ing('i-banana', 'Plátano', 'c-fruit', 89, 1.1, 23, 0.3),
  ing('i-berries', 'Frutos rojos', 'c-fruit', 57, 0.7, 14, 0.3),
  ing('i-apple', 'Manzana', 'c-fruit', 52, 0.3, 14, 0.2),
  ing('i-lentil', 'Lenteja cocida', 'c-leg', 116, 9, 20, 0.4),
  ing('i-chickpea', 'Garbanzo cocido', 'c-leg', 164, 8.9, 27, 2.6),
  ing('i-quinoa', 'Quinoa cocida', 'c-cer', 120, 4.4, 21.3, 1.9),
  ing('i-oats', 'Avena', 'c-cer', 389, 16.9, 66, 6.9),
  ing('i-rice', 'Arroz integral cocido', 'c-cer', 112, 2.3, 23.5, 0.8),
  ing('i-yogurt', 'Yogur griego natural', 'c-dairy', 97, 9, 3.6, 5),
  ing('i-milk', 'Leche descremada', 'c-dairy', 34, 3.4, 5, 0.1),
  ing('i-avocado', 'Palta', 'c-fat', 160, 2, 8.5, 14.7),
  ing('i-almond', 'Almendras', 'c-fat', 579, 21, 22, 50),
  ing('i-olive', 'Aceite de oliva', 'c-fat', 884, 0, 0, 100),
];

const now = '2026-11-10T12:00:00.000Z';
const lines = (...pairs: [string, number][]): RecipeIngredientLine[] => pairs.map(([ingredientId, grams]) => ({ ingredientId, grams }));

const recipes: MockRecipe[] = [
  {
    id: 'r-bowl', ownerId: 'u-client', title: 'Bowl de pollo, quinoa y palta', servings: 1, prepMinutes: 20, updatedAt: now,
    description: 'Almuerzo completo y saciante, listo en 20 minutos.',
    ingredients: lines(['i-chicken', 150], ['i-quinoa', 100], ['i-avocado', 50], ['i-spinach', 40]),
    steps: ['Cocina la quinoa según el envase y deja enfriar.', 'Sella el pollo en sartén caliente 5 minutos por lado.', 'Corta el pollo y la palta en láminas.', 'Arma el bowl sobre una base de espinaca.'],
  },
  {
    id: 'r-tuna', ownerId: 'u-client', title: 'Ensalada de atún y huevo', servings: 1, prepMinutes: 10, updatedAt: now,
    description: 'Cena liviana con proteína de sobra.',
    ingredients: lines(['i-tuna', 120], ['i-tomato', 100], ['i-egg', 50], ['i-olive', 5]),
    steps: ['Cuece el huevo 9 minutos y enfría en agua.', 'Corta el tomate en cubos.', 'Mezcla con el atún escurrido y aliña con aceite.'],
  },
  {
    id: 'r-oats', ownerId: null, title: 'Avena con frutos rojos', servings: 1, prepMinutes: 5, updatedAt: now,
    description: 'Desayuno rápido con carbohidratos de absorción lenta.',
    ingredients: lines(['i-oats', 50], ['i-milk', 200], ['i-berries', 80]),
    steps: ['Calienta la leche sin que hierva.', 'Agrega la avena y revuelve 3 minutos.', 'Sirve con los frutos rojos encima.'],
  },
  {
    id: 'r-lentils', ownerId: null, title: 'Lentejas guisadas', servings: 1, prepMinutes: 40, updatedAt: now,
    description: 'Legumbre clásica, alta en fibra.',
    ingredients: lines(['i-lentil', 250], ['i-tomato', 100], ['i-olive', 5]),
    steps: ['Sofríe el tomate en el aceite.', 'Agrega las lentejas cocidas y un poco de agua.', 'Cocina a fuego bajo 15 minutos.'],
  },
  {
    id: 'r-salmon', ownerId: null, title: 'Salmón con verduras', servings: 1, prepMinutes: 25, updatedAt: now,
    description: 'Cena rica en omega 3.',
    ingredients: lines(['i-salmon', 150], ['i-broccoli', 150], ['i-rice', 80]),
    steps: ['Hornea el salmón a 200 °C por 15 minutos.', 'Cuece el brócoli al vapor 6 minutos.', 'Sirve con el arroz.'],
  },
  {
    id: 'r-yogurt', ownerId: null, title: 'Yogur griego con almendras', servings: 1, prepMinutes: 2, updatedAt: now,
    description: 'Colación con proteína y grasas saludables.',
    ingredients: lines(['i-yogurt', 170], ['i-almond', 15]),
    steps: ['Sirve el yogur y agrega las almendras picadas.'],
  },
  {
    id: 'r-apple', ownerId: null, title: 'Manzana y almendras', servings: 1, prepMinutes: 2, updatedAt: now,
    description: 'Colación de media tarde.',
    ingredients: lines(['i-apple', 150], ['i-almond', 15]),
    steps: ['Corta la manzana en gajos y acompaña con las almendras.'],
  },
  {
    id: 'r-chickpea', ownerId: 'u-camila', title: 'Ensalada de garbanzos', servings: 2, prepMinutes: 15, updatedAt: now,
    description: 'Fresca, ideal para llevar al trabajo.',
    ingredients: lines(['i-chickpea', 300], ['i-tomato', 200], ['i-spinach', 80], ['i-olive', 20]),
    steps: ['Enjuaga los garbanzos.', 'Corta el tomate y mezcla con la espinaca.', 'Aliña con aceite de oliva y sal.'],
  },
];

const mealPlan: [MealType, string, (day: Weekday) => string][] = [
  ['breakfast', '08:00', () => 'r-oats'],
  ['morning_snack', '11:00', () => 'r-yogurt'],
  ['lunch', '14:00', (d) => (d % 2 === 1 ? 'r-bowl' : 'r-lentils')],
  ['afternoon_snack', '17:30', () => 'r-apple'],
  ['dinner', '21:00', (d) => (d % 2 === 1 ? 'r-salmon' : 'r-tuna')],
];

const weekdays: Weekday[] = [1, 2, 3, 4, 5, 6, 7];
const menuSlots: MockMenuSlot[] = weekdays.flatMap((weekday) =>
  mealPlan.map(([mealType, time, recipeFor]) => ({
    id: `s-${weekday}-${mealType}`,
    ownerId: 'u-client',
    weekday,
    mealType,
    time,
    recipeId: recipeFor(weekday),
    reminder: mealType === 'lunch' || mealType === 'dinner',
  }))
);

const exercises: Exercise[] = [
  { id: 'e-squat', name: 'Sentadilla', muscleGroup: 'Piernas', type: 'strength' },
  { id: 'e-rdl', name: 'Peso muerto rumano', muscleGroup: 'Piernas', type: 'strength' },
  { id: 'e-lunge', name: 'Zancadas', muscleGroup: 'Piernas', type: 'strength' },
  { id: 'e-plank', name: 'Plancha', muscleGroup: 'Core', type: 'strength' },
  { id: 'e-push', name: 'Flexiones', muscleGroup: 'Pecho', type: 'strength' },
  { id: 'e-row', name: 'Remo con mancuerna', muscleGroup: 'Espalda', type: 'strength' },
  { id: 'e-press', name: 'Press militar', muscleGroup: 'Hombros', type: 'strength' },
  { id: 'e-run', name: 'Trote', muscleGroup: 'Cardio', type: 'cardio' },
  { id: 'e-bike', name: 'Bicicleta', muscleGroup: 'Cardio', type: 'cardio' },
  { id: 'e-hip', name: 'Movilidad de cadera', muscleGroup: 'Movilidad', type: 'mobility' },
];

const exerciseName = (id: string) => exercises.find((e) => e.id === id)?.name ?? '';
let rx = 0;
const rex = (exerciseId: string, weekday: Weekday, sets: number, reps: number | undefined, durationSec: number | undefined, restSec: number) => ({
  id: `rx-${++rx}`, exerciseId, exerciseName: exerciseName(exerciseId), weekday, sets, reps, durationSec, restSec,
});

const routines: Routine[] = [
  {
    id: 'rt-strength', ownerId: 'u-client', name: 'Fuerza 4 días', weekdays: [1, 3, 4, 6],
    exercises: [
      rex('e-push', 1, 4, 12, undefined, 60), rex('e-row', 1, 4, 10, undefined, 60), rex('e-press', 1, 3, 10, undefined, 90), rex('e-plank', 1, 3, undefined, 45, 30),
      rex('e-squat', 3, 4, 10, undefined, 90), rex('e-rdl', 3, 3, 12, undefined, 90), rex('e-lunge', 3, 3, 12, undefined, 60),
      rex('e-run', 4, 1, undefined, 1800, 0), rex('e-hip', 4, 2, undefined, 300, 0),
      rex('e-squat', 6, 4, 10, undefined, 90), rex('e-rdl', 6, 3, 12, undefined, 90), rex('e-lunge', 6, 3, 12, undefined, 60), rex('e-plank', 6, 3, undefined, 45, 30),
    ],
    goals: [
      { id: 'g-1', description: '10 sentadillas con 60 kg', deadline: '2027-01-31' },
      { id: 'g-2', description: 'Correr 5 km sin parar', deadline: '2027-02-28' },
    ],
  },
  {
    id: 'rt-diego', ownerId: 'u-diego', name: 'Full body 2 días', weekdays: [2, 5],
    exercises: [
      rex('e-squat', 2, 3, 12, undefined, 60), rex('e-push', 2, 3, 12, undefined, 60), rex('e-row', 2, 3, 12, undefined, 60),
      rex('e-lunge', 5, 3, 10, undefined, 60), rex('e-press', 5, 3, 10, undefined, 60), rex('e-bike', 5, 1, undefined, 1200, 0),
    ],
    goals: [{ id: 'g-3', description: 'Entrenar 8 semanas seguidas' }],
  },
];

const connections: MockConnection[] = [
  { id: 'cn-1', requesterId: 'u-client', addresseeId: 'u-camila', status: 'accepted' },
  { id: 'cn-2', requesterId: 'u-diego', addresseeId: 'u-client', status: 'accepted' },
  { id: 'cn-3', requesterId: 'u-vale', addresseeId: 'u-client', status: 'pending' },
];

const shares: MockShare[] = [
  { id: 'sh-1', fromUserId: 'u-camila', toUserId: 'u-client', resourceType: 'recipe', resourceId: 'r-chickpea', createdAt: '2026-11-12T18:20:00.000Z' },
  { id: 'sh-2', fromUserId: 'u-diego', toUserId: 'u-client', resourceType: 'routine', resourceId: 'rt-diego', createdAt: '2026-11-11T09:05:00.000Z' },
];

const proposals: (Omit<Proposal, 'author'> & { authorId: string })[] = [
  { id: 'p-1', authorId: 'u-camila', type: 'ingredient', status: 'pending', createdAt: '2026-11-12T10:00:00.000Z', payload: { name: 'Kale', categoryId: 'c-veg', kcal100: 49, protein100: 4.3, carbs100: 8.8, fat100: 0.9 } },
  { id: 'p-2', authorId: 'u-diego', type: 'exercise', status: 'pending', createdAt: '2026-11-12T11:30:00.000Z', payload: { name: 'Hip thrust', muscleGroup: 'Glúteos', type: 'strength' } },
  { id: 'p-3', authorId: 'u-client', type: 'ingredient', status: 'pending', createdAt: '2026-11-13T08:15:00.000Z', payload: { name: 'Tofu firme', categoryId: 'c-prot', kcal100: 144, protein100: 17.3, carbs100: 2.8, fat100: 8.7 } },
];

export const db = {
  users,
  categories,
  ingredients,
  recipes,
  menuSlots,
  mealLogs: [] as MockMealLog[],
  exercises,
  routines,
  workoutLogs: [] as MockWorkoutLog[],
  connections,
  shares,
  proposals,
  /** Datos corporales por id de usuario. */
  bodyMetrics: {
    'u-client': { weightKg: 64, heightCm: 168, age: 29, updatedAt: '2026-11-10T12:00:00.000Z' },
  } as Record<string, BodyMetrics>,
};

export type MockDb = typeof db;

/** Latencia simulada para que los estados de carga se vean en desarrollo. */
export function delay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
