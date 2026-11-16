import { View } from 'react-native';

import { useTheme, useThemePreference, type ThemePreference } from '@/shared/theme/ThemeProvider';
import { AppText, ChipGroup, Icon, type ChipOption } from '@/shared/ui';

const options: readonly ChipOption<ThemePreference>[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
];

/** Selector de apariencia; la elección se guarda en el dispositivo. */
export function ThemeSelector() {
  const { spacing } = useTheme();
  const { preference, setPreference } = useThemePreference();

  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Icon name="theme" size={18} color="textMuted" />
        <AppText variant="label" tone="muted" accessibilityRole="header">
          Apariencia
        </AppText>
      </View>
      <ChipGroup
        options={options}
        value={preference}
        onChange={(value) => value && setPreference(value)}
        accessibilityLabel="Tema de la aplicación"
      />
    </View>
  );
}
