import { toDateKey } from '@/shared/lib/dates';
import { Button } from '@/shared/ui';

import { useSetWorkoutDone, useWorkoutLogs } from '../hooks';

/** Marca el entreno de hoy. Sólo se registra el día actual. */
export function WorkoutDoneButton({ routineId }: { routineId: string }) {
  const date = toDateKey(new Date());
  const logs = useWorkoutLogs(date);
  const setDone = useSetWorkoutDone(date);
  const done = (logs.data ?? []).some((l) => l.routineId === routineId);

  return (
    <Button
      label={done ? 'Entreno completado · deshacer' : 'Marcar entreno completo'}
      icon={done ? 'check' : undefined}
      variant={done ? 'secondary' : 'primary'}
      loading={setDone.isPending || logs.isPending}
      onPress={() => setDone.mutate({ routineId, done: !done })}
      block
    />
  );
}
