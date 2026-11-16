import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { DateKey } from '@/core/domain/types';
import { queryKeys } from '@/core/queryKeys';
import { useRepositories } from '@/core/repositories/RepositoryContext';

export function useRoutines() {
  const { routines } = useRepositories();
  return useQuery({ queryKey: queryKeys.routines.list, queryFn: () => routines.list() });
}

export function useRoutine(id: string) {
  const { routines } = useRepositories();
  return useQuery({ queryKey: queryKeys.routines.detail(id), queryFn: () => routines.get(id) });
}

export function useWorkoutLogs(date: DateKey) {
  const { routines } = useRepositories();
  return useQuery({ queryKey: queryKeys.routines.logs(date), queryFn: () => routines.logsFor(date) });
}

export function useSetWorkoutDone(date: DateKey) {
  const { routines } = useRepositories();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routineId, done }: { routineId: string; done: boolean }) => routines.setWorkoutDone(routineId, date, done),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.routines.logs(date) }),
  });
}
