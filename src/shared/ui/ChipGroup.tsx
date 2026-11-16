import { ScrollView, View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';

import { Chip } from './Chip';

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipGroupProps<T extends string> {
  options: readonly ChipOption<T>[];
  /** Selección única; `null` permite deseleccionar al tocar la opción activa. */
  value: T | null;
  onChange: (value: T | null) => void;
  allowDeselect?: boolean;
  /** Una fila desplazable en lugar de envolver líneas. */
  scrollable?: boolean;
  accessibilityLabel: string;
}

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  allowDeselect = false,
  scrollable = false,
  accessibilityLabel,
}: ChipGroupProps<T>) {
  const { spacing } = useTheme();

  const chips = options.map((option) => (
    <Chip
      key={option.value}
      label={option.label}
      selected={option.value === value}
      onPress={() => onChange(option.value === value && allowDeselect ? null : option.value)}
    />
  ));

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityLabel={accessibilityLabel}
        contentContainerStyle={{ gap: spacing.sm }}>
        {chips}
      </ScrollView>
    );
  }

  return (
    <View accessibilityLabel={accessibilityLabel} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
      {chips}
    </View>
  );
}
