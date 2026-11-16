import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { minTouchSize } from '@/shared/theme/tokens';
import { AppText, Icon } from '@/shared/ui';

interface FaqListProps {
  items: readonly { question: string; answer: string }[];
}

/** Acordeón accesible: una pregunta abierta a la vez. */
export function FaqList({ items }: FaqListProps) {
  const { colors, spacing } = useTheme();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <View>
      {items.map((item, index) => {
        const expanded = open === index;
        const last = index === items.length - 1;
        return (
          <View key={item.question} style={!last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded }}
              accessibilityLabel={item.question}
              onPress={() => setOpen(expanded ? null : index)}
              style={({ pressed }) => [styles.row, { minHeight: minTouchSize, gap: spacing.md, paddingVertical: spacing.sm, opacity: pressed ? 0.7 : 1 }]}>
              <AppText variant="subheading" style={styles.question}>
                {item.question}
              </AppText>
              <Icon name={expanded ? 'moveUp' : 'moveDown'} size={16} color="textMuted" />
            </Pressable>
            {expanded ? (
              <AppText tone="muted" style={{ paddingBottom: spacing.md }}>
                {item.answer}
              </AppText>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  question: { flex: 1 },
});
