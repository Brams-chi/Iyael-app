import type { AccessTokenProvider, Repositories } from '../contracts';
import { createMockAuthRepository } from './auth';
import { createMockCatalogRepository } from './catalog';
import { db } from './db';
import { createMockMenuRepository } from './menus';
import { createMockProfileRepository } from './profile';
import { createMockProposalRepository } from './proposals';
import { createMockRecipeRepository } from './recipes';
import { createMockRoutineRepository } from './routines';
import { createGuard } from './session';
import { createMockSocialRepository } from './social';

export { DEMO_PASSWORD } from './db';

export function createMockRepositories(tokens: AccessTokenProvider): Repositories {
  const guard = createGuard(db, tokens);
  return {
    auth: createMockAuthRepository(db),
    profile: createMockProfileRepository(db, guard),
    catalog: createMockCatalogRepository(db, guard),
    recipes: createMockRecipeRepository(db, guard),
    menus: createMockMenuRepository(db, guard),
    routines: createMockRoutineRepository(db, guard),
    social: createMockSocialRepository(db, guard),
    proposals: createMockProposalRepository(db, guard),
  };
}
