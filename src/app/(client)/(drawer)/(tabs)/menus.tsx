import { router } from 'expo-router';

import { WeekMenu } from '@/features/menus/components/WeekMenu';
import { Screen } from '@/shared/ui';

export default function MenusScreen() {
  return (
    <Screen>
      <WeekMenu onOpenRecipe={(id) => router.push(`/recipes/${id}`)} />
    </Screen>
  );
}
