import { AppError } from '@/core/domain/errors';
import { evaluateRecipe } from '@/core/domain/nutrition';
import type { Recipe } from '@/core/domain/types';

import type { RecipeRepository } from '../contracts';
import { delay, newId, type MockDb, type MockRecipe } from './db';
import type { Guard } from './session';

export function createMockRecipeRepository(db: MockDb, guard: Guard): RecipeRepository {
  const ingredientMap = () => new Map(db.ingredients.map((i) => [i.id, i]));

  const toRecipe = (row: MockRecipe): Recipe => ({
    ...row,
    authorName: row.ownerId ? (db.users.find((u) => u.id === row.ownerId)?.displayName ?? 'Usuario') : 'Lunchy',
    nutrition: evaluateRecipe(row.ingredients, ingredientMap(), row.servings),
  });

  /** Ids de recetas compartidas con el usuario. */
  const sharedIds = (userId: string) =>
    new Set(db.shares.filter((s) => s.toUserId === userId && s.resourceType === 'recipe').map((s) => s.resourceId));

  /** Puede ver: lo propio, el catálogo y lo que le compartieron. El admin ve el catálogo. */
  const canRead = (row: MockRecipe, userId: string) => row.ownerId === null || row.ownerId === userId || sharedIds(userId).has(row.id);

  const findWritable = async (id: string) => {
    const user = await guard.currentUser();
    const row = db.recipes.find((r) => r.id === id);
    if (!row) throw new AppError('not_found', '');
    const allowed = user.role === 'admin' ? row.ownerId === null : row.ownerId === user.id;
    if (!allowed) throw new AppError('forbidden', '');
    return row;
  };

  return {
    async list(scope) {
      await delay();
      const user = await guard.currentUser();
      const shared = sharedIds(user.id);
      const rows = db.recipes.filter((r) =>
        scope === 'catalog' ? r.ownerId === null : scope === 'mine' ? r.ownerId === user.id : shared.has(r.id)
      );
      return rows.map(toRecipe).sort((a, b) => a.title.localeCompare(b.title, 'es'));
    },

    async get(id) {
      await delay();
      const user = await guard.currentUser();
      const row = db.recipes.find((r) => r.id === id);
      if (!row || !canRead(row, user.id)) throw new AppError('not_found', '');
      return toRecipe(row);
    },

    async create(input) {
      await delay(400);
      const user = await guard.currentUser();
      const row: MockRecipe = {
        ...input,
        id: newId('r'),
        ownerId: user.role === 'admin' ? null : user.id,
        updatedAt: new Date().toISOString(),
      };
      db.recipes.push(row);
      return toRecipe(row);
    },

    async update(id, input) {
      await delay(400);
      const row = await findWritable(id);
      Object.assign(row, input, { updatedAt: new Date().toISOString() });
      return toRecipe(row);
    },

    async remove(id) {
      await delay();
      const row = await findWritable(id);
      db.recipes.splice(db.recipes.indexOf(row), 1);
      db.shares = db.shares.filter((s) => !(s.resourceType === 'recipe' && s.resourceId === row.id));
    },
  };
}
