import { AppError } from '@/core/domain/errors';

import type { CatalogRepository, CrudRepository } from '../contracts';
import { delay, newId } from './db';
import type { MockDb } from './db';
import type { Guard } from './session';

/** CRUD genérico sobre una colección: lectura para todos, escritura sólo admin. */
function crud<T extends { id: string }, Input extends Omit<T, 'id'>>(
  rows: T[],
  prefix: string,
  guard: Guard,
  sort: (a: T, b: T) => number
): CrudRepository<T, Input> {
  const find = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) throw new AppError('not_found', '');
    return row;
  };

  return {
    async list() {
      await delay();
      await guard.currentUser();
      return [...rows].sort(sort);
    },
    async get(id) {
      await delay();
      await guard.currentUser();
      return { ...find(id) };
    },
    async create(input) {
      await delay();
      await guard.requireAdmin();
      const row = { ...input, id: newId(prefix) } as unknown as T;
      rows.push(row);
      return row;
    },
    async update(id, input) {
      await delay();
      await guard.requireAdmin();
      const row = find(id);
      Object.assign(row, input);
      return { ...row };
    },
    async remove(id) {
      await delay();
      await guard.requireAdmin();
      const index = rows.findIndex((r) => r.id === id);
      if (index < 0) throw new AppError('not_found', '');
      rows.splice(index, 1);
    },
  };
}

const byName = <T extends { name: string }>(a: T, b: T) => a.name.localeCompare(b.name, 'es');

export function createMockCatalogRepository(db: MockDb, guard: Guard): CatalogRepository {
  return {
    categories: crud(db.categories, 'c', guard, (a, b) => a.order - b.order),
    ingredients: crud(db.ingredients, 'i', guard, byName),
    exercises: crud(db.exercises, 'e', guard, byName),
  };
}
