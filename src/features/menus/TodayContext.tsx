import { createContext, use, useMemo, useState, type PropsWithChildren } from 'react';

import type { MealLogStatus, MenuSlot, Weekday } from '@/core/domain/types';
import { minutesOf, toDateKey, weekdayOf } from '@/shared/lib/dates';

import { useDaySlots, useMealLogs, useSetMealStatus } from './hooks';

interface TodayValue {
  date: Date;
  weekday: Weekday;
  slotsQuery: ReturnType<typeof useDaySlots>;
  statusFor(slotId: string): MealLogStatus | undefined;
  toggle(slotId: string): void;
  done: number;
  total: number;
  /** Primera comida sin marcar a partir de la hora actual (o la primera pendiente). */
  nextSlot?: MenuSlot;
}

const TodayContext = createContext<TodayValue | null>(null);

/** Estado del día para la pestaña Hoy; sus componentes lo leen sin props. */
export function TodayProvider({ children }: PropsWithChildren) {
  // Fecha fija durante la vida de la pantalla para que el memo sea estable.
  const [now] = useState(() => new Date());
  const weekday = weekdayOf(now);
  const dateKey = toDateKey(now);
  const slotsQuery = useDaySlots(weekday);
  const logsQuery = useMealLogs(dateKey);
  const setStatus = useSetMealStatus(dateKey);
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  const value = useMemo<TodayValue>(() => {
    const logs = new Map((logsQuery.data ?? []).map((l) => [l.slotId, l.status]));
    const slots = slotsQuery.data ?? [];
    const pending = slots.filter((s) => logs.get(s.id) !== 'done');
    return {
      date: now,
      weekday,
      slotsQuery,
      statusFor: (slotId) => logs.get(slotId),
      toggle: (slotId) => setStatus.mutate({ slotId, status: logs.get(slotId) === 'done' ? null : 'done' }),
      done: slots.length - pending.length,
      total: slots.length,
      nextSlot: pending.find((s) => minutesOf(s.time) >= minutesNow - 60) ?? pending[0],
    };
  }, [now, weekday, slotsQuery, logsQuery.data, setStatus, minutesNow]);

  return <TodayContext.Provider value={value}>{children}</TodayContext.Provider>;
}

export function useToday(): TodayValue {
  const value = use(TodayContext);
  if (!value) throw new Error('useToday debe usarse dentro de <TodayProvider>');
  return value;
}
