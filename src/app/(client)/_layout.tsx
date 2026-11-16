import { Stack } from 'expo-router';

export default function ClientLayout() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false, headerBackTitle: 'Volver' }}>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="recipes/[id]" options={{ title: '' }} />
      <Stack.Screen name="recipe-editor" options={{ presentation: 'modal', title: 'Receta' }} />
      <Stack.Screen name="routines/[id]" options={{ title: 'Rutina' }} />
      <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
      <Stack.Screen name="personal-data" options={{ title: 'Datos personales' }} />
      <Stack.Screen name="propose" options={{ presentation: 'modal', title: 'Proponer al catálogo' }} />
      <Stack.Screen name="proposals" options={{ title: 'Mis propuestas' }} />
    </Stack>
  );
}
