import { router, Stack } from 'expo-router';

import { useAuthState } from '@/features/auth/AuthContext';
import { homeHref } from '@/features/auth/homeHref';
import { EmptyState, Screen } from '@/shared/ui';

export default function NotFoundScreen() {
  const { user } = useAuthState();
  const signedIn = user !== null;

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Página no encontrada', headerShown: true }} />
      <EmptyState
        title="Esta pantalla no existe"
        message="El enlace puede estar roto o la pantalla se movió."
        action={{ label: signedIn ? 'Ir al inicio' : 'Iniciar sesión', onPress: () => router.replace(homeHref(user)) }}
      />
    </Screen>
  );
}
