import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { minTouchSize } from '@/shared/theme/tokens';

import { AppText } from './AppText';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({ label, error, hint, onFocus, onBlur, multiline, ...rest }: TextFieldProps) {
  const { colors, radius, spacing, typography } = useTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.danger : focused ? colors.accent : colors.borderStrong;

  return (
    <View style={{ gap: spacing.xs }}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={error ?? hint}
        placeholderTextColor={colors.textMuted}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        multiline={multiline}
        style={[
          typography.body,
          styles.input,
          {
            minHeight: multiline ? 96 : minTouchSize,
            borderColor,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            color: colors.text,
            backgroundColor: colors.surface,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
        {...rest}
      />
      {error ? (
        <AppText variant="caption" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" tone="muted">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1 },
});
