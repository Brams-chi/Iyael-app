import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { RecipeInput, RecipeScope } from '@/core/domain/types';
import { queryKeys } from '@/core/queryKeys';
import { useRepositories } from '@/core/repositories/RepositoryContext';

export function useRecipes(scope: RecipeScope) {
  const { recipes } = useRepositories();
  return useQuery({ queryKey: queryKeys.recipes.list(scope), queryFn: () => recipes.list(scope) });
}

export function useRecipe(id: string) {
  const { recipes } = useRepositories();
  return useQuery({ queryKey: queryKeys.recipes.detail(id), queryFn: () => recipes.get(id) });
}

export function useSaveRecipe() {
  const { recipes } = useRepositories();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: RecipeInput }) => (id ? recipes.update(id, input) : recipes.create(input)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
      // El título de la receta aparece en los menús.
      void queryClient.invalidateQueries({ queryKey: queryKeys.menus.all });
    },
  });
}

export function useDeleteRecipe() {
  const { recipes } = useRepositories();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recipes.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.menus.all });
    },
  });
}
