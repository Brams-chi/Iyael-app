import { useState } from 'react';
import { View } from 'react-native';

import type { Weekday } from '@/core/domain/types';
import { weekdayLabel, weekdayOf } from '@/shared/lib/dates';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, QueryState, SectionHeader, WeekStrip } from '@/shared/ui';

import { useWeekSlots } from '../hooks';
import { MealTimeline } from './MealTimeline';

/** Menú semanal: elegir un día y ver sus comidas con hora y recordatorio. */
export function WeekMenu({ onOpenRecipe }: { onOpenRecipe: (recipeId: string) => void }) {
  const { spacing } = useTheme();
  const today = weekdayOf(new Date());
  const [day, setDay] = useState<Weekday>(today);
  const week = useWeekSlots();
  const activeDays = [...new Set((week.data ?? []).map((s) => s.weekday))];

  return (
    <View style={{ gap: spacing.lg }}>
      <WeekStrip selected={day} onSelect={setDay} activeDays={activeDays} today={today} />
      <SectionHeader title={weekdayLabel(day, 'long')} />
      <QueryState
        query={week}
        isEmpty={(slots) => !slots.some((s) => s.weekday === day)}
        empty={{ title: 'Día sin menú', message: 'Aún no hay comidas planificadas para este día.' }}>
        {(slots) => <MealTimeline slots={slots.filter((s) => s.weekday === day)} onOpenRecipe={onOpenRecipe} />}
      </QueryState>
      <AppText variant="caption" tone="muted">
        La campana indica las comidas con recordatorio a su hora.
      </AppText>
    </View>
  );
}
