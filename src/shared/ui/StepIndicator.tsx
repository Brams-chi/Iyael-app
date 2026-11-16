import { View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';

import { AppText } from './AppText';

interface StepIndicatorProps {
  steps: readonly string[];
  /** Índice base 0 del paso actual. */
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={{ gap: spacing.sm }}
      accessibilityRole="progressbar"
      accessibilityLabel={`Paso ${current + 1} de ${steps.length}: ${steps[current]}`}>
      <View style={{ flexDirection: 'row', gap: spacing.xs }}>
        {steps.map((step, index) => (
          <View
            key={step}
            style={{ flex: 1, height: 4, borderRadius: radius.pill, backgroundColor: index <= current ? colors.accent : colors.border }}
          />
        ))}
      </View>
      <AppText variant="caption" tone="muted">
        Paso {current + 1} de {steps.length} · {steps[current]}
      </AppText>
    </View>
  );
}
