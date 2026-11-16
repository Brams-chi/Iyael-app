import { Pressable, View } from 'react-native';

import type { MealLogStatus, MenuSlot } from '@/core/domain/types';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { minTouchSize } from '@/shared/theme/tokens';
import { AppText, Icon } from '@/shared/ui';

import { mealTypeLabel } from '../mealTypes';

interface MealTimelineProps {
  slots: readonly MenuSlot[];
  onOpenRecipe: (recipeId: string) => void;
  /** Con seguimiento (pestaña Hoy): estado por comida y acción de marcar. */
  tracking?: {
    statusFor: (slotId: string) => MealLogStatus | undefined;
    nextSlotId?: string;
    onToggle: (slotId: string) => void;
  };
}

/** Comidas del día en orden horario. Reutilizada en Hoy (con seguimiento) y en Menús (sólo lectura). */
export function MealTimeline({ slots, onOpenRecipe, tracking }: MealTimelineProps) {
  const { colors, spacing } = useTheme();

  return (
    <View>
      {slots.map((slot, index) => {
        const done = tracking?.statusFor(slot.id) === 'done';
        const isNext = tracking?.nextSlotId === slot.id;
        const last = index === slots.length - 1;

        return (
          <View key={slot.id} style={{ flexDirection: 'row', gap: spacing.md }}>
            <AppText variant="caption" tone="muted" style={{ width: 44, paddingTop: spacing.md, fontVariant: ['tabular-nums'] }}>
              {slot.time}
            </AppText>

            {/* Riel: el punto marca el estado, la línea une el día. */}
            <View style={{ alignItems: 'center', width: minTouchSize }}>
              {tracking ? (
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: done }}
                  accessibilityLabel={`${mealTypeLabel[slot.mealType]} de las ${slot.time}: ${slot.recipeTitle}`}
                  accessibilityHint={done ? 'Desmarcar como comida' : 'Marcar como comida'}
                  onPress={() => tracking.onToggle(slot.id)}
                  style={{ width: minTouchSize, height: minTouchSize, alignItems: 'center', justifyContent: 'center' }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: done || isNext ? colors.accent : colors.borderStrong,
                      backgroundColor: done ? colors.accent : isNext ? colors.accentSoft : 'transparent',
                    }}>
                    {done ? <Icon name="check" size={14} color="onAccent" /> : null}
                  </View>
                </Pressable>
              ) : (
                <View style={{ height: minTouchSize, justifyContent: 'center' }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.borderStrong }} />
                </View>
              )}
              {!last ? <View style={{ flex: 1, width: 2, backgroundColor: colors.border, minHeight: spacing.sm }} /> : null}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Ver receta ${slot.recipeTitle}`}
              onPress={() => onOpenRecipe(slot.recipeId)}
              style={({ pressed }) => ({ flex: 1, paddingVertical: spacing.sm, paddingBottom: spacing.lg, opacity: pressed ? 0.7 : 1 })}>
              <AppText variant="caption" tone={isNext ? 'accent' : 'muted'} style={{ fontWeight: '600' }}>
                {mealTypeLabel[slot.mealType]}
                {isNext ? ' · próxima' : ''}
              </AppText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <AppText style={{ flex: 1, textDecorationLine: done ? 'line-through' : 'none' }} tone={done ? 'muted' : 'default'}>
                  {slot.recipeTitle}
                </AppText>
                {slot.reminder ? <Icon name="bell" size={14} color="textMuted" /> : null}
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
