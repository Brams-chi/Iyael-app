import { Pressable } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { minTouchSize } from '@/shared/theme/tokens';

import { Icon, type IconName } from './Icon';

interface IconButtonProps {
  icon: IconName;
  /** Obligatorio: el botón no tiene texto visible. */
  accessibilityLabel: string;
  onPress: () => void;
  filled?: boolean;
}

export function IconButton({ icon, accessibilityLabel, onPress, filled }: IconButtonProps) {
  const { colors } = useTheme();
  const size = filled ? 36 : minTouchSize;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={filled ? 4 : 0}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: filled ? colors.accent : 'transparent',
        opacity: pressed ? 0.7 : 1,
      })}>
      <Icon name={icon} size={filled ? 20 : 24} color={filled ? 'onAccent' : 'accent'} />
    </Pressable>
  );
}
