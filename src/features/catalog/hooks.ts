import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { queryKeys } from '@/core/queryKeys';
import type { CatalogRepository } from '@/core/repositories/contracts';
import { useRepositories } from '@/core/repositories/RepositoryContext';

export type CatalogEntityKey = keyof CatalogRepository;

export function useCategories() {
  const { catalog } = useRepositories();
  return useQuery({ queryKey: queryKeys.categories, queryFn: () => catalog.categories.list() });
}

export function useIngredients() {
  const { catalog } = useRepositories();
  return useQuery({ queryKey: queryKeys.ingredients, queryFn: () => catalog.ingredients.list() });
}

export function useExercises() {
  const { catalog } = useRepositories();
  return useQuery({ queryKey: queryKeys.exercises, queryFn: () => catalog.exercises.list() });
}

/** Ingredientes indexados por id, para cálculos nutricionales en vivo. */
export function useIngredientMap() {
  const query = useIngredients();
  const map = useMemo(() => new Map((query.data ?? []).map((i) => [i.id, i])), [query.data]);
  return { ...query, map };
}

/* ---------- CRUD genérico para el admin ---------- */

const keyFor: Record<CatalogEntityKey, readonly string[]> = {
  categories: queryKeys.categories,
  ingredients: queryKeys.ingredients,
  exercises: queryKeys.exercises,
};

type AnyRow = { id: string } & Record<string, unknown>;

function repoFor(catalog: CatalogRepository, entity: CatalogEntityKey) {
  // Las tres colecciones comparten el contrato CrudRepository; el formulario valida la forma con zod.
  return catalog[entity] as unknown as {
    list(): Promise<AnyRow[]>;
    get(id: string): Promise<AnyRow>;
    create(input: object): Promise<AnyRow>;
    update(id: string, input: object): Promise<AnyRow>;
    remove(id: string): Promise<void>;
  };
}

export function useEntityList(entity: CatalogEntityKey) {
  const { catalog } = useRepositories();
  return useQuery({ queryKey: keyFor[entity], queryFn: () => repoFor(catalog, entity).list() });
}

export function useEntity(entity: CatalogEntityKey, id: string | null) {
  const { catalog } = useRepositories();
  return useQuery({
    queryKey: [...keyFor[entity], 'detail', id],
    queryFn: () => repoFor(catalog, entity).get(id as string),
    enabled: id !== null,
  });
}

export function useSaveEntity(entity: CatalogEntityKey) {
  const { catalog } = useRepositories();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string | null; input: object }) =>
      id ? repoFor(catalog, entity).update(id, input) : repoFor(catalog, entity).create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor[entity] }),
  });
}

export function useDeleteEntity(entity: CatalogEntityKey) {
  const { catalog } = useRepositories();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => repoFor(catalog, entity).remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor[entity] }),
  });
}
