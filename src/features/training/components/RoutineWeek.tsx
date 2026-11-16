import { useState, type ReactNode } from 'react';
import { View } from 'react-native';

import type { Routine, Weekday } from '@/core/domain/types';
import { weekdayLabel, weekdayOf } from '@/shared/lib/dates';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { SectionHeader, WeekStrip } from '@/shared/ui';

import { DayExerciseList } from './DayExerciseList';
import { RoutineGoals } from './RoutineGoals';

interface RoutineWeekProps {
  routine: Routine;
  /** Acción para el día elegido (p. ej. marcar entreno). Recibe el día seleccionado. */
  renderDayAction?: (day: Weekday, isToday: boolean) => ReactNode;
}

/** Objetivos, semana y ejercicios del día. Sirve para rutinas propias y compartidas. */
export function RoutineWeek({ routine, renderDayAction }: RoutineWeekProps) {
  const { spacing } = useTheme();
  const today = weekdayOf(new Date());
  const [day, setDay] = useState<Weekday>(routine.weekdays.includes(today) ? today : (routine.weekdays[0] ?? today));
  const exercises = routine.exercises.filter((e) => e.weekday === day);

  return (
    <View style={{ gap: spacing.lg }}>
      <RoutineGoals goals={routine.goals} />
      <WeekStrip selected={day} onSelect={setDay} activeDays={routine.weekdays} today={today} />
      <SectionHeader title={`${weekdayLabel(day, 'long')} · ${exercises.length} ejercicios`} />
      <DayExerciseList exercises={exercises} />
      {exercises.length > 0 ? renderDayAction?.(day, day === today) : null}
    </View>
  );
}
