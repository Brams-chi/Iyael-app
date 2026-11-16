import { View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { Button, FormError, Screen, StepIndicator } from '@/shared/ui';

import { RECIPE_STEP_TITLES } from '../schema';
import { useRecipeEditor } from './RecipeEditorContext';
import { DetailsStep } from './steps/DetailsStep';
import { IngredientsStep } from './steps/IngredientsStep';
import { PresentationStep } from './steps/PresentationStep';
import { StepsStep } from './steps/StepsStep';

const stepComponents = [DetailsStep, IngredientsStep, StepsStep, PresentationStep] as const;

/** Editor por pasos. Lee todo del contexto: ningún paso recibe props. */
export function RecipeEditor({ onCancel }: { onCancel: () => void }) {
  const { spacing } = useTheme();
  const { step, isLast, errors, saving, next, back } = useRecipeEditor();
  const Current = stepComponents[step]!;

  return (
    <Screen>
      <StepIndicator steps={RECIPE_STEP_TITLES} current={step} />
      <FormError message={errors.form} />
      <Current />
      <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: 'auto', paddingTop: spacing.lg }}>
        <View style={{ flex: 1 }}>
          <Button label={step === 0 ? 'Cancelar' : 'Atrás'} variant="secondary" onPress={() => back() || onCancel()} block />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            label={isLast ? 'Guardar receta' : `Siguiente: ${RECIPE_STEP_TITLES[step + 1]?.toLowerCase()}`}
            onPress={next}
            loading={saving}
            block
          />
        </View>
      </View>
    </Screen>
  );
}
