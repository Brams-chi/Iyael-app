import { router, useLocalSearchParams } from 'expo-router';

import { RecipeEditorScreen } from '@/features/recipes/editor/RecipeEditorScreen';

/** Mismo editor que el cliente; la API guarda la receta en el catálogo porque quien llama es admin. */
export default function AdminRecipeEditorRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <RecipeEditorScreen recipeId={id} onCancel={() => router.back()} onSaved={() => router.back()} />;
}
