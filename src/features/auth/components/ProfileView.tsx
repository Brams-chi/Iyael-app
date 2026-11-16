import type { ReactNode } from 'react';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Avatar, Button, Card } from '@/shared/ui';

import { useAuthActions, useCurrentUser } from '../AuthContext';
import { roleLabel } from '../roles';

/** `children`: accesos propios del rol (p. ej. "Mis propuestas" para clientes). */
export function ProfileView({ children }: { children?: ReactNode }) {
  const { spacing } = useTheme();
  const user = useCurrentUser();
  const { signOut } = useAuthActions();

  return (
    <View style={{ gap: spacing.lg }}>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Avatar name={user.displayName} size={56} />
          <View style={{ flex: 1 }}>
            <AppText variant="heading">{user.displayName}</AppText>
            <AppText tone="muted">{user.email}</AppText>
            <AppText variant="caption" tone="accent">
              {roleLabel[user.role]}
            </AppText>
          </View>
        </View>
      </Card>
      {children}
      <Button label="Cerrar sesión" variant="danger" onPress={() => void signOut()} block />
    </View>
  );
}
