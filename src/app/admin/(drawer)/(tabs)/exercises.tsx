import { router } from 'expo-router';

import { EntityList } from '@/features/admin/components/EntityList';
import { Screen } from '@/shared/ui';

export default function AdminExercisesScreen() {
  return (
    <Screen scroll={false}>
      <EntityList
        entity="exercises"
        onOpen={(id) => router.push({ pathname: '/admin/[entity]/[id]', params: { entity: 'exercises', id } })}
        onCreate={() => router.push({ pathname: '/admin/[entity]/[id]', params: { entity: 'exercises', id: 'new' } })}
      />
    </Screen>
  );
}
