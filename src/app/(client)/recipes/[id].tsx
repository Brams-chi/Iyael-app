import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { errorMessage } from '@/core/domain/errors';
import type { Recipe } from '@/core/domain/types';
import { useCurrentUser } from '@/features/auth/AuthContext';
import { RecipeDetail } from '@/features/recipes/components/RecipeDetail';
import { useDeleteRecipe, useRecipe } from '@/features/recipes/hooks';
import { ShareSheet } from '@/features/social/components/ShareSheet';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Button, ConfirmAction, QueryState, Screen } from '@/shared/ui';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = useRecipe(id);
  const user = useCurrentUser();

  return (
    <Screen>
      <QueryState query={recipe}>
        {(data) => <RecipeDetail recipe={data} actions={data.ownerId === user.id ? <OwnerActions recipe={data} /> : null} />}
      </QueryState>
    </Screen>
  );
}

/** Sólo el dueño edita, comparte o elimina. */
function OwnerActions({ recipe }: { recipe: Recipe }) {
  const { spacing } = useTheme();
  const remove = useDeleteRecipe();

  return (
    <View style={{ gap: spacing.sm }}>
      <Button label="Editar" variant="secondary" onPress={() => router.push({ pathname: '/recipe-editor', params: { id: recipe.id } })} block />
      <ShareSheet resourceType="recipe" resourceId={recipe.id} />
      <View style={{ alignItems: 'flex-end' }}>
        <ConfirmAction
          label="Eliminar receta"
          question="También dejará de estar compartida."
          confirmLabel="Eliminar"
          loading={remove.isPending}
          onConfirm={() => remove.mutate(recipe.id, { onSuccess: () => router.back() })}
        />
      </View>
      {remove.isError ? <AppText tone="danger">{errorMessage(remove.error)}</AppText> : null}
    </View>
  );
}
