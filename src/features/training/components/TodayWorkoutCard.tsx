import { weekdayOf } from '@/shared/lib/dates';
import { AppText, Card } from '@/shared/ui';

import { useRoutines } from '../hooks';

/** Resumen del entreno de hoy para la pestaña Hoy. */
export function TodayWorkoutCard({ onOpen }: { onOpen: () => void }) {
  const routines = useRoutines();
  const today = weekdayOf(new Date());
  const routine = routines.data?.find((r) => r.weekdays.includes(today));
  const exercises = routine?.exercises.filter((e) => e.weekday === today) ?? [];

  if (routines.isPending) return null;

  return (
    <Card onPress={onOpen} accessibilityLabel="Ver entrenamiento">
      <AppText variant="subheading">{routine ? routine.name : 'Hoy descansas'}</AppText>
      <AppText variant="caption" tone="muted">
        {routine
          ? `${exercises.length} ejercicios: ${exercises.map((e) => e.exerciseName).slice(0, 3).join(', ')}${exercises.length > 3 ? '…' : ''}`
          : 'No hay entrenamiento planificado para hoy.'}
      </AppText>
    </Card>
  );
}
