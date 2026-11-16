import type { RoutineGoal } from '@/core/domain/types';
import { AppText, Card } from '@/shared/ui';

import { formatDeadline } from '../format';

export function RoutineGoals({ goals }: { goals: readonly RoutineGoal[] }) {
  if (goals.length === 0) return null;
  return (
    <Card>
      <AppText variant="label" tone="muted">
        Objetivos
      </AppText>
      {goals.map((goal) => (
        <AppText key={goal.id}>
          {goal.description}
          {goal.deadline ? <AppText tone="muted"> · antes del {formatDeadline(goal.deadline)}</AppText> : null}
        </AppText>
      ))}
    </Card>
  );
}
