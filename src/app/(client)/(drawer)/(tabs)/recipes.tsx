import { router } from 'expo-router';

import { RecipeBrowser } from '@/features/recipes/components/RecipeBrowser';
import { Screen } from '@/shared/ui';

export default function RecipesScreen() {
  return (
    <Screen scroll={false}>
      <RecipeBrowser onOpen={(id) => router.push(`/recipes/${id}`)} />
    </Screen>
  );
}
