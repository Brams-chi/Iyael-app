import { router, Stack, useLocalSearchParams } from 'expo-router';

import { InfoPageView } from '@/features/info/components/InfoPageView';
import { getInfoPage } from '@/features/info/content';
import { EmptyState, Screen } from '@/shared/ui';

export default function InfoScreen() {
  const { page: id } = useLocalSearchParams<{ page: string }>();
  // El parámetro viene de la URL (deep link): sólo se aceptan páginas conocidas.
  const page = getInfoPage(id);

  return (
    <Screen>
      <Stack.Screen options={{ title: page?.title ?? '' }} />
      {page ? (
        <InfoPageView page={page} />
      ) : (
        <EmptyState
          title="Página no encontrada"
          message="El enlace puede estar roto o la página se movió."
          action={{ label: 'Volver', onPress: () => (router.canGoBack() ? router.back() : router.replace('/')) }}
        />
      )}
    </Screen>
  );
}
