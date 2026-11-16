import { View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';

interface ProgressBarProps {
  /** Valor entre 0 y 1. */
  value: number;
  accessibilityLabel: string;
}

export function ProgressBar({ value, accessibilityLabel }: ProgressBarProps) {
  const { colors, radius } = useTheme();
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={{ height: 8, borderRadius: radius.pill, backgroundColor: colors.border, overflow: 'hidden' }}>
      <View style={{ width: `${clamped * 100}%`, height: '100%', backgroundColor: colors.accent, borderRadius: radius.pill }} />
    </View>
  );
}
