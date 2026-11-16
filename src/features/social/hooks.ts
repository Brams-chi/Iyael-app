import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ConnectionStatus, ShareableType } from '@/core/domain/types';
import { queryKeys } from '@/core/queryKeys';
import { useRepositories } from '@/core/repositories/RepositoryContext';

export function useInviteCode() {
  const { social } = useRepositories();
  return useQuery({ queryKey: queryKeys.social.inviteCode, queryFn: () => social.inviteCode() });
}

export function useRegenerateInviteCode() {
  const { social } = useRepositories();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => social.regenerateInviteCode(),
    onSuccess: (code) => queryClient.setQueryData(queryKeys.social.inviteCode, code),
  });
}

export function useConnections(status: ConnectionStatus) {
  const { social } = useRepositories();
  return useQuery({ queryKey: queryKeys.social.connections(status), queryFn: () => social.connections(status) });
}

export function useSharedWithMe() {
  const { social } = useRepositories();
  return useQuery({ queryKey: queryKeys.social.shared, queryFn: () => social.sharedWithMe() });
}

/** Mutaciones sociales: todas invalidan el árbol social (y recetas compartidas). */
function useSocialMutation<V, R>(fn: (vars: V) => Promise<R>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.social.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
    },
  });
}

export function useSendInvitation() {
  const { social } = useRepositories();
  return useSocialMutation((code: string) => social.sendInvitation(code));
}

export function useRespondInvitation() {
  const { social } = useRepositories();
  return useSocialMutation(({ id, accept }: { id: string; accept: boolean }) => (accept ? social.accept(id) : social.reject(id)));
}

export function useRemoveConnection() {
  const { social } = useRepositories();
  return useSocialMutation((id: string) => social.remove(id));
}

export function useShare() {
  const { social } = useRepositories();
  return useSocialMutation(({ type, id, connectionIds }: { type: ShareableType; id: string; connectionIds: string[] }) =>
    social.share(type, id, connectionIds)
  );
}

export function useSaveCopy() {
  const { social } = useRepositories();
  return useSocialMutation((sharedItemId: string) => social.saveCopy(sharedItemId));
}
