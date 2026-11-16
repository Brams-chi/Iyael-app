import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { DateKey, MealLog, MealLogStatus, Weekday } from '@/core/domain/types';
import { queryKeys } from '@/core/queryKeys';
import { useRepositories } from '@/core/repositories/RepositoryContext';

export function useDaySlots(weekday: Weekday) {
  const { menus } = useRepositories();
  return useQuery({ queryKey: queryKeys.menus.day(weekday), queryFn: () => menus.slotsFor(weekday) });
}

export function useWeekSlots() {
  const { menus } = useRepositories();
  return useQuery({ queryKey: queryKeys.menus.week, queryFn: () => menus.weekSlots() });
}

export function useMealLogs(date: DateKey) {
  const { menus } = useRepositories();
  return useQuery({ queryKey: queryKeys.menus.logs(date), queryFn: () => menus.logsFor(date) });
}

/** Marca o desmarca una comida con actualización optimista: el check responde al instante. */
export function useSetMealStatus(date: DateKey) {
  const { menus } = useRepositories();
  const queryClient = useQueryClient();
  const key = queryKeys.menus.logs(date);

  return useMutation({
    mutationFn: ({ slotId, status }: { slotId: string; status: MealLogStatus | null }) => menus.setMealStatus(slotId, date, status),
    onMutate: async ({ slotId, status }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<MealLog[]>(key);
      queryClient.setQueryData<MealLog[]>(key, (logs = []) => [
        ...logs.filter((l) => l.slotId !== slotId),
        ...(status ? [{ slotId, date, status }] : []),
      ]);
      return { previous };
    },
    onError: (_error, _vars, context) => queryClient.setQueryData(key, context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
