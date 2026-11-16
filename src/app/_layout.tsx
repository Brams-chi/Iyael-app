import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type PropsWithChildren } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppError } from '@/core/domain/errors';
import { createMockRepositories } from '@/core/repositories/mock';
import { RepositoryProvider } from '@/core/repositories/RepositoryContext';
import { themePreferenceStore } from '@/core/storage/themePreferenceStore';
import { tokenStore } from '@/core/storage/tokenStore';
import { AuthProvider, useAuthState } from '@/features/auth/AuthContext';
import { SplashController } from '@/features/auth/components/SplashController';
import { homeHref } from '@/features/auth/homeHref';
import { ThemeProvider, useTheme, useThemePreference } from '@/shared/theme/ThemeProvider';

export { ErrorBoundary } from 'expo-router';

// Fase front: repositorios simulados. Con la API se reemplaza por createHttpRepositories().
const repositories = createMockRepositories(tokenStore);

function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            // Errores de permisos no se reintentan: repetirlos no cambia el resultado.
            retry: (count, error) => !(error instanceof AppError && ['unauthorized', 'forbidden', 'not_found'].includes(error.code)) && count < 2,
          },
        },
      })
  );

  return (
    <SafeAreaProvider>
      <ThemeProvider storage={themePreferenceStore}>
        <QueryClientProvider client={queryClient}>
          <RepositoryProvider repositories={repositories}>
            <AuthProvider>{children}</AuthProvider>
          </RepositoryProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

/** Guardas por rol. Son experiencia de usuario: la autorización real ocurre en la API. */
function RootNavigator() {
  const { status, user } = useAuthState();
  const { scheme } = useTheme();
  const { ready: themeReady } = useThemePreference();

  // El splash sigue visible mientras se resuelven la sesión y el tema (sin parpadeo de colores).
  if (status === 'loading' || !themeReady) return null;

  // Redirección explícita al perder acceso (p. ej. al cerrar sesión): sin ella el
  // router cae en una ruta por defecto que no existe para el nuevo estado.
  const home = homeHref(user);

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={status === 'signedOut'} redirectTo={home}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={user?.role === 'client'} redirectTo={home}>
          <Stack.Screen name="(client)" />
        </Stack.Protected>
        <Stack.Protected guard={user?.role === 'admin'} redirectTo={home}>
          <Stack.Screen name="admin" />
        </Stack.Protected>
        {/* Información pública (políticas, quiénes somos, FAQ): visible con o sin sesión. */}
        <Stack.Screen name="info/[page]" options={{ headerShown: true, title: '', headerBackTitle: 'Volver' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <Providers>
      <SplashController />
      <RootNavigator />
    </Providers>
  );
}
