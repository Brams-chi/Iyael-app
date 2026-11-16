import type { Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAuthActions, useCurrentUser } from '@/features/auth/AuthContext';
import { roleLabel } from '@/features/auth/roles';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Avatar, ConfirmAction, Icon, ListItem } from '@/shared/ui';

import type { MenuSection } from '../types';
import { ThemeSelector } from './ThemeSelector';

interface SideMenuProps {
  /** Secciones propias del rol; el menú no conoce las rutas de cada rol. */
  sections: readonly MenuSection[];
  profileHref: Href;
  onNavigate: (href: Href) => void;
}

export function SideMenu({ sections, profileHref, onNavigate }: SideMenuProps) {
  const { colors, spacing } = useTheme();
  const user = useCurrentUser();
  const { signOut } = useAuthActions();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = () => {
    setSigningOut(true);
    void signOut();
  };

  return (
    <View style={{ gap: spacing.xl, padding: spacing.lg }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${user.displayName}, ${user.email}. Abrir perfil`}
        onPress={() => onNavigate(profileHref)}
        style={({ pressed }) => [styles.row, { gap: spacing.md, opacity: pressed ? 0.7 : 1 }]}>
        <Avatar name={user.displayName} size={52} />
        <View style={styles.fill}>
          <AppText variant="subheading" numberOfLines={1}>
            {user.displayName}
          </AppText>
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {user.email}
          </AppText>
          <AppText variant="caption" tone="accent">
            {roleLabel[user.role]}
          </AppText>
        </View>
      </Pressable>

      {sections.map((section) => (
        <View key={section.title} style={{ gap: spacing.xs }}>
          <AppText variant="label" tone="muted" accessibilityRole="header">
            {section.title}
          </AppText>
          {section.links.map((link, index) => (
            <ListItem
              key={link.label}
              title={link.label}
              subtitle={link.subtitle}
              left={<Icon name={link.icon} size={20} color="accent" />}
              onPress={() => onNavigate(link.href)}
              divider={index < section.links.length - 1}
            />
          ))}
        </View>
      ))}

      <ThemeSelector />

      <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: spacing.lg, gap: spacing.sm }}>
        <View style={[styles.row, { gap: spacing.sm }]}>
          <Icon name="signOut" size={18} color="danger" />
          <View style={styles.fill}>
            <ConfirmAction
              label="Cerrar sesión"
              question="¿Cerrar sesión en este dispositivo?"
              confirmLabel="Cerrar sesión"
              loading={signingOut}
              onConfirm={handleSignOut}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  fill: { flex: 1 },
});
