import { useState } from 'react';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, ChipGroup, QueryState } from '@/shared/ui';

import { useRoutines } from '../hooks';
import { RoutineWeek } from './RoutineWeek';
import { WorkoutDoneButton } from './WorkoutDoneButton';

export function TrainingOverview() {
  const { spacing } = useTheme();
  const routines = useRoutines();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <QueryState
      query={routines}
      isEmpty={(list) => list.length === 0}
      empty={{ title: 'Aún no tienes rutinas', message: 'Muy pronto podrás crear tu plan de entrenamiento por días.' }}>
      {(list) => {
        const routine = list.find((r) => r.id === selectedId) ?? list[0]!;
        return (
          <View style={{ gap: spacing.lg }}>
            {list.length > 1 ? (
              <ChipGroup
                options={list.map((r) => ({ value: r.id, label: r.name }))}
                value={routine.id}
                onChange={(v) => v && setSelectedId(v)}
                scrollable
                accessibilityLabel="Elegir rutina"
              />
            ) : (
              <AppText variant="heading">{routine.name}</AppText>
            )}
            <RoutineWeek
              key={routine.id}
              routine={routine}
              renderDayAction={(_day, isToday) => (isToday ? <WorkoutDoneButton routineId={routine.id} /> : null)}
            />
          </View>
        );
      }}
    </QueryState>
  );
}
