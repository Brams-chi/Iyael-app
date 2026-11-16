import { View } from 'react-native';

import { GoalBadges } from '@/features/nutrition/components/GoalBadges';
import { MacroSummary } from '@/features/nutrition/components/MacroSummary';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Card, TextField } from '@/shared/ui';

import { useRecipeEditor } from '../RecipeEditorContext';

export function PresentationStep() {
  const { spacing } = useTheme();
  const { draft, errors, nutrition, setText } = useRecipeEditor();

  return (
    <View style={{ gap: spacing.lg }}>
      <TextField
        label="Presentación"
        placeholder="Cómo se sirve, emplatado, acompañamientos…"
        value={draft.description}
        onChangeText={(v) => setText('description', v)}
        error={errors.description}
        multiline
        hint="Opcional. La foto llegará en una próxima versión."
      />
      <Card>
        <AppText variant="subheading">{draft.title || 'Tu receta'}</AppText>
        <AppText variant="caption" tone="muted">
          {draft.servings} porción(es) · {draft.prepMinutes || '–'} min · {draft.ingredients.length} ingredientes · {draft.steps.filter((s) => s.trim()).length} pasos
        </AppText>
        <MacroSummary nutrition={nutrition} />
        <GoalBadges goals={nutrition.goals} />
      </Card>
    </View>
  );
}
