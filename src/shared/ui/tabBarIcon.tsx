import type { ColorValue } from 'react-native';

import { Icon, type IconName } from './Icon';

/** Fábrica para la opción `tabBarIcon` de las pestañas de Expo Router. */
export function tabBarIcon(name: IconName) {
  return function TabBarIcon({ color }: { color: ColorValue }) {
    return <Icon name={name} color={color} size={24} />;
  };
}
