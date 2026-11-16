import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ProposalStatus } from '@/core/domain/types';
import { queryKeys } from '@/core/queryKeys';
import type { ProposalInput } from '@/core/repositories/contracts';
import { useRepositories } from '@/core/repositories/RepositoryContext';

export function useMyProposals() {
  const { proposals } = useRepositories();
  return useQuery({ queryKey: queryKeys.proposals.mine, queryFn: () => proposals.mine() });
}

export function useProposals(status: ProposalStatus) {
  const { proposals } = useRepositories();
  return useQuery({ queryKey: queryKeys.proposals.list(status), queryFn: () => proposals.list(status) });
}

export function useCreateProposal() {
  const { proposals } = useRepositories();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProposalInput) => proposals.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.proposals.all }),
  });
}

/** Revisión del admin: aprobar agrega el elemento al catálogo. */
export function useReviewProposal() {
  const { proposals } = useRepositories();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (review: { id: string; approve: true; payload: Record<string, string | number> } | { id: string; approve: false; note: string }) =>
      review.approve ? proposals.approve(review.id, review.payload) : proposals.reject(review.id, review.note),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.proposals.all });
      void queryClient.invalidateQueries({ queryKey: ['catalog'] });
    },
  });
}
