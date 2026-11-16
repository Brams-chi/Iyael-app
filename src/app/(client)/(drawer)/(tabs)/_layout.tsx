import { router, Tabs } from 'expo-router';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { HeaderMenuButton, IconButton, tabBarIcon } from '@/shared/ui';

export default function ClientTabsLayout() {
  const { colors, spacing } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerLeft: () => <HeaderMenuButton />,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Hoy', tabBarIcon: tabBarIcon('today') }} />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recetas',
          tabBarIcon: tabBarIcon('recipes'),
          headerRight: () => <IconButton icon="add" filled accessibilityLabel="Crear receta" onPress={() => router.push('/recipe-editor')} />,
          headerRightContainerStyle: { paddingRight: spacing.lg },
        }}
      />
      <Tabs.Screen name="menus" options={{ title: 'Menús', tabBarIcon: tabBarIcon('menus') }} />
      <Tabs.Screen name="training" options={{ title: 'Entreno', tabBarIcon: tabBarIcon('training') }} />
      <Tabs.Screen name="community" options={{ title: 'Comunidad', tabBarIcon: tabBarIcon('community') }} />
    </Tabs>
  );
}
