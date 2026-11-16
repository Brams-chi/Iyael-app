import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import type { ColorTokens, TypographyVariant } from '@/shared/theme/tokens';

export type TextTone = 'default' | 'muted' | 'accent' | 'danger' | 'onAccent' | 'protein' | 'carbs' | 'fat';

const toneToToken: Record<TextTone, keyof ColorTokens> = {
  default: 'text',
  muted: 'textMuted',
  accent: 'accent',
  danger: 'danger',
  onAccent: 'onAccent',
  protein: 'protein',
  carbs: 'carbs',
  fat: 'fat',
};

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  tone?: TextTone;
}

export function AppText({ variant = 'body', tone = 'default', style, ...rest }: AppTextProps) {
  const { colors, typography } = useTheme();
  return <Text style={[typography[variant], { color: colors[toneToToken[tone]] }, style]} {...rest} />;
}
