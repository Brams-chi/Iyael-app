import { router, useLocalSearchParams } from 'expo-router';

import { RecipeEditorScreen } from '@/features/recipes/editor/RecipeEditorScreen';

export default function ClientRecipeEditorRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return (
    <RecipeEditorScreen
      recipeId={id}
      onCancel={() => router.back()}
      onSaved={(recipe) => (id ? router.back() : router.replace(`/recipes/${recipe.id}`))}
      onProposeIngredient={(name) => router.push({ pathname: '/propose', params: { type: 'ingredient', name } })}
    />
  );
}
