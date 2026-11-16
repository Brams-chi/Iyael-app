import { router } from 'expo-router';

import { CommunityView } from '@/features/social/components/CommunityView';
import { Screen } from '@/shared/ui';

export default function CommunityScreen() {
  return (
    <Screen>
      <CommunityView
        onOpenShared={(item) => router.push(item.resourceType === 'recipe' ? `/recipes/${item.resourceId}` : `/routines/${item.resourceId}`)}
        onCopySaved={(recipeId) => router.push(`/recipes/${recipeId}`)}
      />
    </Screen>
  );
}
