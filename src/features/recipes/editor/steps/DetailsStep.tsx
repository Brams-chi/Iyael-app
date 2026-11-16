import { View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { TextField } from '@/shared/ui';

import { useRecipeEditor } from '../RecipeEditorContext';

export function DetailsStep() {
  const { spacing } = useTheme();
  const { draft, errors, setText } = useRecipeEditor();
  return (
    <View style={{ gap: spacing.lg }}>
      <TextField label="Nombre de la receta" placeholder="Ej. Bowl de pollo y quinoa" value={draft.title} onChangeText={(v) => setText('title', v)} error={errors.title} />
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <View style={{ flex: 1 }}>
          <TextField label="Porciones" value={draft.servings} onChangeText={(v) => setText('servings', v)} error={errors.servings} keyboardType="number-pad" />
        </View>
        <View style={{ flex: 1 }}>
          <TextField label="Minutos" value={draft.prepMinutes} onChangeText={(v) => setText('prepMinutes', v)} error={errors.prepMinutes} keyboardType="number-pad" />
        </View>
      </View>
    </View>
  );
}
