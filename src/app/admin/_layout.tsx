import { Stack } from 'expo-router';

export const unstable_settings = { initialRouteName: '(drawer)' };

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false, headerBackTitle: 'Volver' }}>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="[entity]/[id]" options={{ title: '' }} />
      <Stack.Screen name="recipe-editor" options={{ presentation: 'modal', title: 'Receta del catálogo' }} />
      <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
    </Stack>
  );
}
