import type { Recipe } from '@/core/domain/types';
import { QueryState, Screen } from '@/shared/ui';

import { useRecipe } from '../hooks';
import { RecipeEditor } from './RecipeEditor';
import { RecipeEditorProvider } from './RecipeEditorContext';

interface RecipeEditorScreenProps {
  /** Sin id se crea una receta nueva. */
  recipeId?: string;
  onSaved: (recipe: Recipe) => void;
  onCancel: () => void;
  onProposeIngredient?: (name: string) => void;
}

/** Monta el contexto del editor sólo en esta ruta. Compartida por cliente y admin. */
export function RecipeEditorScreen({ recipeId, ...props }: RecipeEditorScreenProps) {
  if (!recipeId) return <EditorWithContext {...props} />;
  return <ExistingRecipeEditor recipeId={recipeId} {...props} />;
}

function ExistingRecipeEditor({ recipeId, ...props }: RecipeEditorScreenProps & { recipeId: string }) {
  const recipe = useRecipe(recipeId);
  if (recipe.data) return <EditorWithContext initial={recipe.data} {...props} />;
  return (
    <Screen>
      <QueryState query={recipe}>{() => null}</QueryState>
    </Screen>
  );
}

function EditorWithContext({ initial, onSaved, onCancel, onProposeIngredient }: Omit<RecipeEditorScreenProps, 'recipeId'> & { initial?: Recipe }) {
  return (
    <RecipeEditorProvider initial={initial} onSaved={onSaved} onProposeIngredient={onProposeIngredient}>
      <RecipeEditor onCancel={onCancel} />
    </RecipeEditorProvider>
  );
}
