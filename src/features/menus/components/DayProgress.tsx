import { AppText, Card, ProgressBar } from '@/shared/ui';

import { mealTypeLabel } from '../mealTypes';
import { useToday } from '../TodayContext';

export function DayProgress() {
  const { done, total, nextSlot } = useToday();
  const complete = total > 0 && done === total;

  return (
    <Card highlighted={complete}>
      <AppText variant="subheading" style={{ fontVariant: ['tabular-nums'] }}>
        {complete ? '¡Día completo!' : `${done} de ${total} comidas`}
      </AppText>
      <ProgressBar value={total ? done / total : 0} accessibilityLabel="Avance de comidas del día" />
      <AppText variant="caption" tone="muted">
        {complete
          ? 'Cumpliste todas las comidas de hoy.'
          : nextSlot
            ? `Próxima: ${mealTypeLabel[nextSlot.mealType].toLowerCase()} a las ${nextSlot.time}`
            : 'No tienes comidas planificadas hoy.'}
      </AppText>
    </Card>
  );
}
