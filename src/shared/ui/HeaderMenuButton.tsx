import { useNavigation } from 'expo-router';
import { Pressable } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { minTouchSize } from '@/shared/theme/tokens';

import { Icon } from './Icon';

/**
 * Abre el menú lateral desde el encabezado. La acción sube por los navegadores
 * hasta el Drawer más cercano, así que funciona en cualquier pestaña.
 */
export function HeaderMenuButton() {
  const navigation = useNavigation();
  const { spacing } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Abrir menú"
      onPress={() => navigation.dispatch({ type: 'OPEN_DRAWER' })}
      style={({ pressed }) => ({
        width: minTouchSize,
        height: minTouchSize,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: spacing.xs,
        opacity: pressed ? 0.7 : 1,
      })}>
      <Icon name="menu" size={24} />
    </Pressable>
  );
}
