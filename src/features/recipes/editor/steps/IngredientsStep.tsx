import { useMemo } from 'react';
import { View } from 'react-native';

import { IngredientPicker } from '@/features/catalog/components/IngredientPicker';
import { MacroSummary } from '@/features/nutrition/components/MacroSummary';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Card, IconButton, SectionHeader, TextField } from '@/shared/ui';

import { useRecipeEditor } from '../RecipeEditorContext';

export function IngredientsStep() {
  const { spacing } = useTheme();
  const { draft, errors, ingredientsById, nutrition, canPropose, addIngredient, setGrams, removeIngredient, proposeIngredient } = useRecipeEditor();
  const added = useMemo(() => new Set(draft.ingredients.map((l) => l.ingredientId)), [draft.ingredients]);

  return (
    <View style={{ gap: spacing.lg }}>
      <Card>
        <AppText variant="caption" tone="muted">
          Evaluación en vivo
        </AppText>
        <MacroSummary nutrition={nutrition} />
      </Card>

      <SectionHeader title={`En la receta (${draft.ingredients.length})`} />
      {errors.ingredients ? (
        <AppText variant="caption" tone="danger" accessibilityRole="alert">
          {errors.ingredients}
        </AppText>
      ) : null}
      {draft.ingredients.map((line, index) => {
        const name = ingredientsById.get(line.ingredientId)?.name ?? 'Ingrediente';
        return (
          <View key={line.ingredientId} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm }}>
            <AppText style={{ flex: 1, paddingBottom: spacing.md }}>{name}</AppText>
            <View style={{ width: 96 }}>
              <TextField
                label="Gramos"
                value={line.grams}
                onChangeText={(v) => setGrams(line.ingredientId, v)}
                keyboardType="decimal-pad"
                error={errors[`ingredients.${index}.grams`]}
                accessibilityLabel={`Gramos de ${name}`}
              />
            </View>
            <IconButton icon="close" accessibilityLabel={`Quitar ${name}`} onPress={() => removeIngredient(line.ingredientId)} />
          </View>
        );
      })}

      <SectionHeader title="Agregar ingredientes" />
      <IngredientPicker excludeIds={added} onPick={addIngredient} onPropose={canPropose ? proposeIngredient : undefined} />
    </View>
  );
}
