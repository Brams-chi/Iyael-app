import { router, Tabs } from 'expo-router';

import { useProposals } from '@/features/proposals/hooks';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { HeaderMenuButton, IconButton, tabBarIcon } from '@/shared/ui';

export default function AdminTabsLayout() {
  const { colors, spacing } = useTheme();
  const pending = useProposals('pending').data?.length ?? 0;

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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Recetas',
          tabBarIcon: tabBarIcon('recipes'),
          headerRight: () => (
            <IconButton icon="add" filled accessibilityLabel="Crear receta del catálogo" onPress={() => router.push('/admin/recipe-editor')} />
          ),
          headerRightContainerStyle: { paddingRight: spacing.lg },
        }}
      />
      <Tabs.Screen name="ingredients" options={{ title: 'Ingredientes', tabBarIcon: tabBarIcon('ingredients') }} />
      <Tabs.Screen name="exercises" options={{ title: 'Ejercicios', tabBarIcon: tabBarIcon('exercises') }} />
      <Tabs.Screen
        name="proposals"
        options={{
          title: 'Propuestas',
          tabBarIcon: tabBarIcon('proposals'),
          tabBarBadge: pending > 0 ? pending : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.accent, color: colors.onAccent },
        }}
      />
    </Tabs>
  );
}
