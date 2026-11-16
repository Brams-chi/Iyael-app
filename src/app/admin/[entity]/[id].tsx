import { router, Stack, useLocalSearchParams } from 'expo-router';

import { EntityForm } from '@/features/admin/components/EntityForm';
import { entityConfigs } from '@/features/catalog/fields';
import type { CatalogEntityKey } from '@/features/catalog/hooks';
import { EmptyState, Screen } from '@/shared/ui';

const isEntity = (value: string): value is CatalogEntityKey => value in entityConfigs;

export default function AdminEntityScreen() {
  const { entity, id } = useLocalSearchParams<{ entity: string; id: string }>();

  // El parámetro llega desde la URL: se valida antes de usarlo.
  if (!isEntity(entity)) {
    return (
      <Screen>
        <EmptyState title="Sección desconocida" message="Vuelve al catálogo y elige una sección." action={{ label: 'Volver', onPress: () => router.back() }} />
      </Screen>
    );
  }

  const config = entityConfigs[entity];
  const isNew = id === 'new';

  return (
    <Screen>
      <Stack.Screen options={{ title: isNew ? `Nuevo ${config.singular}` : `Editar ${config.singular}` }} />
      <EntityForm entity={entity} id={isNew ? null : id} onDone={() => router.back()} />
    </Screen>
  );
}
