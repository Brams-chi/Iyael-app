import { Stack } from 'expo-router';

/** El login siempre queda en la base de la pila (p. ej. al abrir directo /sign-up). */
export const unstable_settings = { initialRouteName: 'sign-in' };

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false, headerBackTitle: 'Volver' }}>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ title: '' }} />
      <Stack.Screen name="forgot-password" options={{ title: '' }} />
    </Stack>
  );
}
