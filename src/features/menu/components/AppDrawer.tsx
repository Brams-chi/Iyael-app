import { router, type Href } from 'expo-router';
import { Drawer, DrawerContentScrollView } from 'expo-router/drawer';

import { useTheme } from '@/shared/theme/ThemeProvider';

import type { MenuSection } from '../types';
import { SideMenu } from './SideMenu';

interface AppDrawerProps {
  sections: readonly MenuSection[];
  profileHref: Href;
}

/**
 * Navegador lateral que envuelve las pestañas de un rol. Las pantallas que abre
 * se apilan sobre él (Stack del rol), así el botón "Volver" regresa al menú.
 */
export function AppDrawer({ sections, profileHref }: AppDrawerProps) {
  const { colors } = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: { backgroundColor: colors.background, width: 320, maxWidth: '85%' },
        overlayColor: 'rgba(0, 0, 0, 0.4)',
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
          <SideMenu
            sections={sections}
            profileHref={profileHref}
            onNavigate={(href) => {
              props.navigation.closeDrawer();
              router.push(href);
            }}
          />
        </DrawerContentScrollView>
      )}>
      <Drawer.Screen name="(tabs)" />
    </Drawer>
  );
}
