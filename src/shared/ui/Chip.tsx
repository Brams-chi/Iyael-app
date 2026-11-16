import { Pressable } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';

import { AppText } from './AppText';

export type ChipTone = 'default' | 'protein' | 'carbs' | 'fat';

interface ChipProps {
  label: string;
  selected?: boolean;
  tone?: ChipTone;
  onPress?: () => void;
}

/** Píldora para filtros, categorías y etiquetas. Sin `onPress` es sólo informativa. */
export function Chip({ label, selected = false, tone = 'default', onPress }: ChipProps) {
  const { colors, radius, spacing } = useTheme();
  const toneColor = tone === 'default' ? colors.accent : colors[tone];
  const textTone = tone === 'default' ? (selected ? 'accent' : 'default') : tone;

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={onPress ? { selected } : undefined}
      hitSlop={6}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderColor: selected || tone !== 'default' ? toneColor : colors.borderStrong,
        backgroundColor: selected ? colors.accentSoft : 'transparent',
        opacity: pressed ? 0.7 : 1,
      })}>
      <AppText variant="caption" tone={textTone} style={selected ? { fontWeight: '600' } : undefined}>
        {label}
      </AppText>
    </Pressable>
  );
}
