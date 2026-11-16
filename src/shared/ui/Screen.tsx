import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme/ThemeProvider';

interface ScreenProps extends PropsWithChildren {
  /** `false` cuando el contenido ya es una lista virtualizada (FlatList). */
  scroll?: boolean;
  /** Respeta el área segura superior en pantallas sin encabezado (p. ej. login). */
  safeTop?: boolean;
  contentStyle?: ViewStyle;
}

/** Contenedor estándar: fondo, padding, scroll y teclado. */
export function Screen({ children, scroll = true, safeTop = false, contentStyle }: ScreenProps) {
  const { colors, spacing } = useTheme();
  const padding = { padding: spacing.lg, gap: spacing.lg };

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[padding, styles.grow, contentStyle]}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic">
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView edges={safeTop ? ['top', 'left', 'right'] : ['left', 'right']} style={[styles.fill, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  grow: { flexGrow: 1 },
});
