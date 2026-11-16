import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import type { ColorTokens } from '@/shared/theme/tokens';

/** Registro único de íconos: SF Symbols en iOS, Material Symbols en Android/web. */
const icons = {
  today: { ios: 'sun.max', android: 'today', web: 'today' },
  recipes: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  menus: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  training: { ios: 'figure.run', android: 'fitness_center', web: 'fitness_center' },
  community: { ios: 'person.2', android: 'group', web: 'group' },
  ingredients: { ios: 'carrot', android: 'nutrition', web: 'nutrition' },
  exercises: { ios: 'dumbbell', android: 'fitness_center', web: 'fitness_center' },
  proposals: { ios: 'tray', android: 'inbox', web: 'inbox' },
  person: { ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' },
  add: { ios: 'plus', android: 'add', web: 'add' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  moveUp: { ios: 'chevron.up', android: 'keyboard_arrow_up', web: 'keyboard_arrow_up' },
  moveDown: { ios: 'chevron.down', android: 'keyboard_arrow_down', web: 'keyboard_arrow_down' },
  delete: { ios: 'trash', android: 'delete', web: 'delete' },
  share: { ios: 'square.and.arrow.up', android: 'share', web: 'share' },
  bell: { ios: 'bell', android: 'notifications', web: 'notifications' },
  clock: { ios: 'clock', android: 'schedule', web: 'schedule' },
  menu: { ios: 'line.3.horizontal', android: 'menu', web: 'menu' },
  theme: { ios: 'circle.lefthalf.filled', android: 'contrast', web: 'contrast' },
  signOut: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' },
  privacy: { ios: 'lock.shield', android: 'shield', web: 'shield' },
  terms: { ios: 'doc.text', android: 'description', web: 'description' },
  about: { ios: 'info.circle', android: 'info', web: 'info' },
  faq: { ios: 'questionmark.circle', android: 'help', web: 'help' },
  bodyData: { ios: 'figure', android: 'monitor_weight', web: 'monitor_weight' },
} as const satisfies Record<string, Extract<SymbolViewProps['name'], object>>;

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  size?: number;
  /** Token de color del tema, o un color ya resuelto (p. ej. el tint del tab bar). */
  color?: keyof ColorTokens | ColorValue;
}

const isToken = (color: IconProps['color'], colors: ColorTokens): color is keyof ColorTokens =>
  typeof color === 'string' && color in colors;

export function Icon({ name, size = 22, color = 'text' }: IconProps) {
  const { colors } = useTheme();
  const tint = isToken(color, colors) ? colors[color] : color;
  return <SymbolView name={icons[name]} size={size} tintColor={tint} />;
}
