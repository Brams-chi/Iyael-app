import { QueryState } from '@/shared/ui';

import { useToday } from '../TodayContext';
import { MealTimeline } from './MealTimeline';

/** Conecta la línea de tiempo con el estado del día. */
export function TodayMeals({ onOpenRecipe }: { onOpenRecipe: (recipeId: string) => void }) {
  const { slotsQuery, statusFor, toggle, nextSlot } = useToday();
  return (
    <QueryState
      query={slotsQuery}
      isEmpty={(slots) => slots.length === 0}
      empty={{ title: 'Sin comidas para hoy', message: 'Planifica tu día desde la pestaña Menús.' }}>
      {(slots) => <MealTimeline slots={slots} onOpenRecipe={onOpenRecipe} tracking={{ statusFor, onToggle: toggle, nextSlotId: nextSlot?.id }} />}
    </QueryState>
  );
}
