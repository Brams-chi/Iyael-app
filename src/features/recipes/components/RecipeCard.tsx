import type { Recipe } from '@/core/domain/types';
import { MacroBar } from '@/features/nutrition/components/MacroBar';
import { GoalBadges } from '@/features/nutrition/components/GoalBadges';
import { AppText, Card } from '@/shared/ui';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const { nutrition } = recipe;
  return (
    <Card onPress={onPress} accessibilityLabel={`${recipe.title}, ${nutrition.kcal} kilocalorías por porción`}>
      <AppText variant="subheading">{recipe.title}</AppText>
      <MacroBar split={nutrition.split} />
      <AppText variant="caption" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
        {nutrition.kcal} kcal · {recipe.prepMinutes} min · {recipe.authorName}
      </AppText>
      <GoalBadges goals={nutrition.goals} />
    </Card>
  );
}
