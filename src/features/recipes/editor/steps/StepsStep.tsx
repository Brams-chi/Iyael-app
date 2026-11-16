import { View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Button, IconButton, TextField } from '@/shared/ui';

import { useRecipeEditor } from '../RecipeEditorContext';

export function StepsStep() {
  const { spacing } = useTheme();
  const { draft, errors, setStepText, addStep, removeStep, moveStep } = useRecipeEditor();

  return (
    <View style={{ gap: spacing.lg }}>
      {errors.steps ? (
        <AppText variant="caption" tone="danger" accessibilityRole="alert">
          {errors.steps}
        </AppText>
      ) : null}
      {draft.steps.map((text, index) => (
        // El índice es la identidad del paso: su posición es el dato.
        <View key={index} style={{ gap: spacing.xs }}>
          <TextField label={`Paso ${index + 1}`} value={text} onChangeText={(v) => setStepText(index, v)} multiline placeholder="Describe qué hacer" />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            {index > 0 ? <IconButton icon="moveUp" accessibilityLabel={`Subir paso ${index + 1}`} onPress={() => moveStep(index, -1)} /> : null}
            {index < draft.steps.length - 1 ? (
              <IconButton icon="moveDown" accessibilityLabel={`Bajar paso ${index + 1}`} onPress={() => moveStep(index, 1)} />
            ) : null}
            <IconButton icon="delete" accessibilityLabel={`Eliminar paso ${index + 1}`} onPress={() => removeStep(index)} />
          </View>
        </View>
      ))}
      <Button label="Agregar paso" icon="add" variant="secondary" onPress={addStep} />
    </View>
  );
}
