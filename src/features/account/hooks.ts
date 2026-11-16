import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { BodyMetricsInput } from '@/core/domain/types';
import { queryKeys } from '@/core/queryKeys';
import { useRepositories } from '@/core/repositories/RepositoryContext';

export function useBodyMetrics() {
  const { profile } = useRepositories();
  return useQuery({ queryKey: queryKeys.profile.bodyMetrics, queryFn: () => profile.bodyMetrics() });
}

export function useUpdateBodyMetrics() {
  const { profile } = useRepositories();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BodyMetricsInput) => profile.updateBodyMetrics(input),
    // La respuesta del servidor es la verdad: se escribe directo en caché.
    onSuccess: (saved) => queryClient.setQueryData(queryKeys.profile.bodyMetrics, saved),
  });
}
