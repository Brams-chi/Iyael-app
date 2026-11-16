import { View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText } from '@/shared/ui';

export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
      <AppText variant="label" tone="accent">
        lunchy
      </AppText>
      <AppText variant="title" accessibilityRole="header">
        {title}
      </AppText>
      <AppText tone="muted">{subtitle}</AppText>
    </View>
  );
}
