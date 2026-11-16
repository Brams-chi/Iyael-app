import { Stack, useLocalSearchParams } from 'expo-router';

import { RoutineWeek } from '@/features/training/components/RoutineWeek';
import { useRoutine } from '@/features/training/hooks';
import { QueryState, Screen } from '@/shared/ui';

/** Rutina en modo lectura (p. ej. compartida por una conexión). */
export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routine = useRoutine(id);

  return (
    <Screen>
      <Stack.Screen options={{ title: routine.data?.name ?? 'Rutina' }} />
      <QueryState query={routine}>{(data) => <RoutineWeek routine={data} />}</QueryState>
    </Screen>
  );
}
