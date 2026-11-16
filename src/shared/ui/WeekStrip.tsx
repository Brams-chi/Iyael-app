import { Pressable, View } from 'react-native';

import type { Weekday } from '@/core/domain/types';
import { WEEKDAYS, weekdayLabel } from '@/shared/lib/dates';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { minTouchSize } from '@/shared/theme/tokens';

import { AppText } from './AppText';

interface WeekStripProps {
  selected: Weekday;
  onSelect: (day: Weekday) => void;
  /** Días con contenido (rutina o menú) se marcan con borde de acento. */
  activeDays?: readonly Weekday[];
  today?: Weekday;
}

export function WeekStrip({ selected, onSelect, activeDays = [], today }: WeekStripProps) {
  const { colors, radius, spacing } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: spacing.xs }} accessibilityRole="tablist">
      {WEEKDAYS.map((day) => {
        const isSelected = day === selected;
        const isActive = activeDays.includes(day);
        return (
          <Pressable
            key={day}
            accessibilityRole="tab"
            accessibilityLabel={`${weekdayLabel(day, 'long')}${day === today ? ', hoy' : ''}${isActive ? ', con actividad' : ''}`}
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(day)}
            style={{
              flex: 1,
              minHeight: minTouchSize,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: isSelected || isActive ? colors.accent : colors.border,
              backgroundColor: isSelected ? colors.accent : 'transparent',
            }}>
            <AppText variant="caption" tone={isSelected ? 'onAccent' : isActive ? 'accent' : 'muted'} style={{ fontWeight: '600' }}>
              {weekdayLabel(day, 'short')}
            </AppText>
            {day === today && !isSelected ? <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.accent, marginTop: 2 }} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}
