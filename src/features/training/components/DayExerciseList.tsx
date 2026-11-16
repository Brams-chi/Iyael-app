import { View } from 'react-native';

import type { RoutineExercise } from '@/core/domain/types';
import { AppText, EmptyState, ListItem } from '@/shared/ui';

import { formatVolume } from '../format';

export function DayExerciseList({ exercises }: { exercises: readonly RoutineExercise[] }) {
  if (exercises.length === 0) {
    return <EmptyState title="Día de descanso" message="Recuperar también es parte del plan." />;
  }
  return (
    <View>
      {exercises.map((exercise, index) => (
        <ListItem
          key={exercise.id}
          title={exercise.exerciseName}
          subtitle={exercise.restSec ? `Descanso ${exercise.restSec} s` : undefined}
          divider={index < exercises.length - 1}
          right={
            <AppText tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
              {formatVolume(exercise)}
            </AppText>
          }
        />
      ))}
    </View>
  );
}
