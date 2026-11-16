import { useState, type ReactNode } from 'react';
import { View } from 'react-native';

import type { Recipe } from '@/core/domain/types';
import { useIngredientMap } from '@/features/catalog/hooks';
import { GoalBadges } from '@/features/nutrition/components/GoalBadges';
import { MacroSummary } from '@/features/nutrition/components/MacroSummary';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Card, ChipGroup, ListItem } from '@/shared/ui';

type Tab = 'ingredients' | 'steps';
const tabs = [
  { value: 'ingredients', label: 'Ingredientes' },
  { value: 'steps', label: 'Pasos' },
] as const;

interface RecipeDetailProps {
  recipe: Recipe;
  /** Acciones según quién mira (dueño, catálogo, compartida). */
  actions?: ReactNode;
}

/** Muestra la evaluación antes que la preparación. */
export function RecipeDetail({ recipe, actions }: RecipeDetailProps) {
  const { spacing } = useTheme();
  const { map } = useIngredientMap();
  const [tab, setTab] = useState<Tab>('ingredients');

  return (
    <View style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="title" accessibilityRole="header">
          {recipe.title}
        </AppText>
        <AppText tone="muted">
          {recipe.servings} porción(es) · {recipe.prepMinutes} min · por {recipe.authorName}
        </AppText>
      </View>
      <GoalBadges goals={recipe.nutrition.goals} />
      <Card>
        <MacroSummary nutrition={recipe.nutrition} />
      </Card>
      {recipe.description ? <AppText>{recipe.description}</AppText> : null}
      {actions}
      <ChipGroup options={tabs} value={tab} onChange={(v) => v && setTab(v)} accessibilityLabel="Sección de la receta" />
      {tab === 'ingredients' ? (
        <View>
          {recipe.ingredients.map((line) => (
            <ListItem key={line.ingredientId} title={map.get(line.ingredientId)?.name ?? 'Ingrediente'} right={<AppText tone="muted">{line.grams} g</AppText>} />
          ))}
        </View>
      ) : (
        <View style={{ gap: spacing.md }}>
          {recipe.steps.map((text, index) => (
            <View key={index} style={{ flexDirection: 'row', gap: spacing.md }}>
              <AppText variant="subheading" tone="accent" style={{ width: 24 }}>
                {index + 1}
              </AppText>
              <AppText style={{ flex: 1 }}>{text}</AppText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
