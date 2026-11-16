import { AppError } from '@/core/domain/errors';

import type { RoutineRepository } from '../contracts';
import { delay, type MockDb } from './db';
import type { Guard } from './session';

export function createMockRoutineRepository(db: MockDb, guard: Guard): RoutineRepository {
  return {
    async list() {
      await delay();
      const user = await guard.requireClient();
      return db.routines.filter((r) => r.ownerId === user.id);
    },

    async get(id) {
      await delay();
      const user = await guard.requireClient();
      const routine = db.routines.find((r) => r.id === id);
      const sharedWithMe = db.shares.some((s) => s.toUserId === user.id && s.resourceType === 'routine' && s.resourceId === id);
      if (!routine || (routine.ownerId !== user.id && !sharedWithMe)) throw new AppError('not_found', '');
      return routine;
    },

    async logsFor(date) {
      await delay(150);
      const user = await guard.requireClient();
      return db.workoutLogs.filter((l) => l.userId === user.id && l.date === date).map(({ userId: _u, ...log }) => log);
    },

    async setWorkoutDone(routineId, date, done) {
      await delay(150);
      const user = await guard.requireClient();
      db.workoutLogs = db.workoutLogs.filter((l) => !(l.userId === user.id && l.routineId === routineId && l.date === date));
      if (done) db.workoutLogs.push({ userId: user.id, routineId, date });
    },
  };
}
