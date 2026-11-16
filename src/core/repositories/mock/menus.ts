import type { MenuSlot } from '@/core/domain/types';
import { minutesOf } from '@/shared/lib/dates';

import type { MenuRepository } from '../contracts';
import { delay, type MockDb, type MockMenuSlot } from './db';
import type { Guard } from './session';

export function createMockMenuRepository(db: MockDb, guard: Guard): MenuRepository {
  const toSlot = ({ ownerId: _owner, ...slot }: MockMenuSlot): MenuSlot => ({
    ...slot,
    recipeTitle: db.recipes.find((r) => r.id === slot.recipeId)?.title ?? 'Receta eliminada',
  });

  const byTime = (a: MenuSlot, b: MenuSlot) => a.weekday - b.weekday || minutesOf(a.time) - minutesOf(b.time);

  return {
    async slotsFor(weekday) {
      await delay();
      const user = await guard.requireClient();
      return db.menuSlots.filter((s) => s.ownerId === user.id && s.weekday === weekday).map(toSlot).sort(byTime);
    },

    async weekSlots() {
      await delay();
      const user = await guard.requireClient();
      return db.menuSlots.filter((s) => s.ownerId === user.id).map(toSlot).sort(byTime);
    },

    async logsFor(date) {
      await delay(150);
      const user = await guard.requireClient();
      return db.mealLogs.filter((l) => l.userId === user.id && l.date === date).map(({ userId: _u, ...log }) => log);
    },

    async setMealStatus(slotId, date, status) {
      await delay(150);
      const user = await guard.requireClient();
      db.mealLogs = db.mealLogs.filter((l) => !(l.userId === user.id && l.slotId === slotId && l.date === date));
      if (status) db.mealLogs.push({ userId: user.id, slotId, date, status });
    },
  };
}
