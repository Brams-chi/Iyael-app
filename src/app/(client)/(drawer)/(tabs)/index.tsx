import { router } from 'expo-router';

import { DayProgress } from '@/features/menus/components/DayProgress';
import { TodayMeals } from '@/features/menus/components/TodayMeals';
import { TodayProvider } from '@/features/menus/TodayContext';
import { TodayWorkoutCard } from '@/features/training/components/TodayWorkoutCard';
import { formatLongDate } from '@/shared/lib/dates';
import { AppText, Screen, SectionHeader } from '@/shared/ui';

export default function TodayScreen() {
  const date = formatLongDate(new Date());
  return (
    <TodayProvider>
      <Screen>
        <AppText tone="muted" style={{ textTransform: 'capitalize' }}>
          {date}
        </AppText>
        <DayProgress />
        <SectionHeader title="Comidas" />
        <TodayMeals onOpenRecipe={(id) => router.push(`/recipes/${id}`)} />
        <SectionHeader title="Entreno de hoy" />
        <TodayWorkoutCard onOpen={() => router.navigate('/training')} />
      </Screen>
    </TodayProvider>
  );
}
