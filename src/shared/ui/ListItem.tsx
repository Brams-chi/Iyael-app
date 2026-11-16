import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { minTouchSize } from '@/shared/theme/tokens';

import { AppText } from './AppText';
import { Icon } from './Icon';

interface ListItemProps {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  /** Muestra la línea divisoria inferior. */
  divider?: boolean;
}

export function ListItem({ title, subtitle, left, right, onPress, divider = true }: ListItemProps) {
  const { colors, spacing } = useTheme();

  const content = (
    <View
      style={[
        styles.row,
        { gap: spacing.md, paddingVertical: spacing.sm, minHeight: minTouchSize },
        divider && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
      ]}>
      {left}
      <View style={styles.text}>
        <AppText numberOfLines={2}>{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted" numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right ?? (onPress ? <Icon name="chevronRight" size={16} color="textMuted" /> : null)}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { flex: 1, gap: 2 },
});
