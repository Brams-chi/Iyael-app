import { View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';

import { AppText } from './AppText';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AppText variant="caption" tone="accent" style={{ fontWeight: '700', fontSize: size * 0.38 }}>
        {initials(name)}
      </AppText>
    </View>
  );
}
