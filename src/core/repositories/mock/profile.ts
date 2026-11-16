import { isValidBodyMetrics } from '@/core/domain/bodyMetrics';
import { AppError } from '@/core/domain/errors';
import type { BodyMetrics } from '@/core/domain/types';

import type { ProfileRepository } from '../contracts';
import { delay, type MockDb } from './db';
import type { Guard } from './session';

const empty: BodyMetrics = { weightKg: null, heightCm: null, age: null, updatedAt: null };

export function createMockProfileRepository(db: MockDb, guard: Guard): ProfileRepository {
  return {
    async bodyMetrics() {
      await delay();
      // El dueño se obtiene del token, nunca de un parámetro: no se pueden leer datos ajenos.
      const user = await guard.requireClient();
      return { ...(db.bodyMetrics[user.id] ?? empty) };
    },

    async updateBodyMetrics(input) {
      await delay(400);
      const user = await guard.requireClient();
      // La API vuelve a validar: el cliente nunca es la única barrera.
      if (!isValidBodyMetrics(input)) throw new AppError('validation', '');
      const next: BodyMetrics = { ...input, updatedAt: new Date().toISOString() };
      db.bodyMetrics[user.id] = next;
      return { ...next };
    },
  };
}
