import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { minTouchSize, type ColorTokens } from '@/shared/theme/tokens';

import { AppText, type TextTone } from './AppText';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  /** Ocupa todo el ancho disponible. */
  block?: boolean;
  compact?: boolean;
}

const looks: Record<Variant, { bg: keyof ColorTokens | null; border: keyof ColorTokens | null; text: TextTone }> = {
  primary: { bg: 'accent', border: null, text: 'onAccent' },
  secondary: { bg: null, border: 'accent', text: 'accent' },
  ghost: { bg: null, border: null, text: 'accent' },
  danger: { bg: 'dangerSoft', border: null, text: 'danger' },
};

export function Button({ label, onPress, variant = 'primary', icon, loading, disabled, block, compact }: ButtonProps) {
  const { colors, radius, spacing } = useTheme();
  const look = looks[variant];
  const inactive = disabled || loading;
  const textColor = look.text === 'onAccent' ? 'onAccent' : look.text === 'danger' ? 'danger' : 'accent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: compact ? 36 : minTouchSize,
          paddingHorizontal: compact ? spacing.md : spacing.lg,
          borderRadius: radius.md,
          backgroundColor: look.bg ? colors[look.bg] : 'transparent',
          borderColor: look.border ? colors[look.border] : 'transparent',
          opacity: inactive ? 0.5 : pressed ? 0.8 : 1,
          alignSelf: block ? 'stretch' : 'auto',
        },
      ]}>
      {loading ? (
        <ActivityIndicator color={colors[textColor]} />
      ) : (
        <View style={[styles.row, { gap: spacing.sm }]}>
          {icon ? <Icon name={icon} size={18} color={textColor} /> : null}
          <AppText variant="subheading" tone={look.text} style={compact ? styles.compactText : undefined}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  compactText: { fontSize: 14 },
});
