import type { PropsWithChildren } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';

interface CardProps extends PropsWithChildren {
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
  /** Fondo destacado para el elemento que necesita atención. */
  highlighted?: boolean;
}

export function Card({ children, onPress, accessibilityLabel, style, highlighted }: CardProps) {
  const { colors, radius, spacing } = useTheme();
  const base: ViewStyle = {
    backgroundColor: highlighted ? colors.accentSoft : colors.surface,
    borderColor: highlighted ? colors.accent : colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  };

  if (!onPress) return <View style={[base, style]}>{children}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [base, style, { opacity: pressed ? 0.85 : 1 }]}>
      {children}
    </Pressable>
  );
}
