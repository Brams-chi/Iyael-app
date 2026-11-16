import { router } from 'expo-router';

import { RecipeBrowser } from '@/features/recipes/components/RecipeBrowser';
import { Screen } from '@/shared/ui';

export default function AdminRecipesScreen() {
  return (
    <Screen scroll={false}>
      <RecipeBrowser scopes={['catalog']} onOpen={(id) => router.push({ pathname: '/admin/recipe-editor', params: { id } })} />
    </Screen>
  );
}
