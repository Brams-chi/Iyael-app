import type {
  AuthSession,
  AuthTokens,
  BodyMetrics,
  BodyMetricsInput,
  Connection,
  ConnectionStatus,
  DateKey,
  Exercise,
  FoodCategory,
  Ingredient,
  MealLog,
  MealLogStatus,
  MenuSlot,
  Proposal,
  ProposalStatus,
  ProposalType,
  Recipe,
  RecipeInput,
  RecipeScope,
  Routine,
  ShareableType,
  SharedItem,
  User,
  Weekday,
  WorkoutLog,
} from '@/core/domain/types';

/**
 * Contratos de datos. Las pantallas dependen de estas interfaces, nunca de
 * una implementación concreta (mock o HTTP). Todas lanzan `AppError`.
 */

export interface Readable<T> {
  list(): Promise<T[]>;
  get(id: string): Promise<T>;
}

export interface Writable<T, Input> {
  create(input: Input): Promise<T>;
  update(id: string, input: Input): Promise<T>;
  remove(id: string): Promise<void>;
}

export type CrudRepository<T, Input> = Readable<T> & Writable<T, Input>;

export interface SignUpInput {
  displayName: string;
  email: string;
  password: string;
}

export interface AuthRepository {
  signIn(email: string, password: string): Promise<AuthSession>;
  signUp(input: SignUpInput): Promise<AuthSession>;
  me(accessToken: string): Promise<User>;
  refresh(refreshToken: string): Promise<AuthTokens>;
  signOut(refreshToken: string): Promise<void>;
  /** Siempre resuelve, exista o no la cuenta, para no revelar correos registrados. */
  requestPasswordReset(email: string): Promise<void>;
}

export type CategoryInput = Omit<FoodCategory, 'id'>;
export type IngredientInput = Omit<Ingredient, 'id'>;
export type ExerciseInput = Omit<Exercise, 'id'>;

export interface CatalogRepository {
  categories: CrudRepository<FoodCategory, CategoryInput>;
  ingredients: CrudRepository<Ingredient, IngredientInput>;
  exercises: CrudRepository<Exercise, ExerciseInput>;
}

export interface RecipeRepository {
  list(scope: RecipeScope): Promise<Recipe[]>;
  get(id: string): Promise<Recipe>;
  /** Crea en el espacio del usuario, o en el catálogo si quien llama es admin. */
  create(input: RecipeInput): Promise<Recipe>;
  update(id: string, input: RecipeInput): Promise<Recipe>;
  remove(id: string): Promise<void>;
}

export interface MenuRepository {
  slotsFor(weekday: Weekday): Promise<MenuSlot[]>;
  weekSlots(): Promise<MenuSlot[]>;
  logsFor(date: DateKey): Promise<MealLog[]>;
  /** `null` borra el registro (desmarcar). */
  setMealStatus(slotId: string, date: DateKey, status: MealLogStatus | null): Promise<void>;
}

export interface RoutineRepository {
  list(): Promise<Routine[]>;
  get(id: string): Promise<Routine>;
  logsFor(date: DateKey): Promise<WorkoutLog[]>;
  setWorkoutDone(routineId: string, date: DateKey, done: boolean): Promise<void>;
}

export interface SocialRepository {
  inviteCode(): Promise<string>;
  regenerateInviteCode(): Promise<string>;
  sendInvitation(code: string): Promise<Connection>;
  connections(status: ConnectionStatus): Promise<Connection[]>;
  accept(connectionId: string): Promise<void>;
  reject(connectionId: string): Promise<void>;
  /** Elimina la conexión y retira lo compartido entre ambos. Las copias guardadas se conservan. */
  remove(connectionId: string): Promise<void>;
  sharedWithMe(): Promise<SharedItem[]>;
  share(resourceType: ShareableType, resourceId: string, connectionIds: string[]): Promise<void>;
  /** Copia una receta compartida al espacio propio y devuelve el id de la copia. */
  saveCopy(sharedItemId: string): Promise<string>;
}

export interface ProposalInput {
  type: ProposalType;
  payload: Record<string, string | number>;
}

export interface ProposalRepository {
  create(input: ProposalInput): Promise<Proposal>;
  mine(): Promise<Proposal[]>;
  /** Sólo admin. */
  list(status: ProposalStatus): Promise<Proposal[]>;
  approve(id: string, payload: Record<string, string | number>): Promise<void>;
  reject(id: string, note: string): Promise<void>;
}

/** Datos del propio usuario autenticado. Nunca recibe un id: el servidor lo toma del token. */
export interface ProfileRepository {
  bodyMetrics(): Promise<BodyMetrics>;
  updateBodyMetrics(input: BodyMetricsInput): Promise<BodyMetrics>;
}

export interface Repositories {
  auth: AuthRepository;
  profile: ProfileRepository;
  catalog: CatalogRepository;
  recipes: RecipeRepository;
  menus: MenuRepository;
  routines: RoutineRepository;
  social: SocialRepository;
  proposals: ProposalRepository;
}

/** Fuente del token de acceso; la implementan el almacenamiento seguro y los tests. */
export interface AccessTokenProvider {
  getAccessToken(): Promise<string | null>;
}
