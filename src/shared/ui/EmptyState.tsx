import { View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';

import { AppText } from './AppText';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
  tone?: 'neutral' | 'error';
}

/** Explica qué falta (o qué falló) y cómo resolverlo. */
export function EmptyState({ title, message, action, tone = 'neutral' }: EmptyStateProps) {
  const { spacing } = useTheme();
  return (
    <View accessibilityRole={tone === 'error' ? 'alert' : undefined} style={{ alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg }}>
      <AppText variant="subheading" tone={tone === 'error' ? 'danger' : 'default'} style={{ textAlign: 'center' }}>
        {title}
      </AppText>
      <AppText tone="muted" style={{ textAlign: 'center' }}>
        {message}
      </AppText>
      {action ? <Button label={action.label} onPress={action.onPress} variant="secondary" compact /> : null}
    </View>
  );
}
