import { useState } from 'react';
import { View } from 'react-native';

import type { ProposalStatus } from '@/core/domain/types';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { ChipGroup, ListItem, QueryState } from '@/shared/ui';

import { useProposals } from '../hooks';
import { proposalConfig, proposalStatusLabel, proposalTypeLabel } from '../meta';
import { ProposalReviewCard } from './ProposalReviewCard';

const statuses: ProposalStatus[] = ['pending', 'approved', 'rejected'];

export function ProposalReviewQueue() {
  const { spacing } = useTheme();
  const [status, setStatus] = useState<ProposalStatus>('pending');
  const proposals = useProposals(status);

  return (
    <View style={{ gap: spacing.lg }}>
      <ChipGroup
        options={statuses.map((value) => ({ value, label: proposalStatusLabel[value] }))}
        value={status}
        onChange={(v) => v && setStatus(v)}
        accessibilityLabel="Estado de las propuestas"
      />
      <QueryState
        query={proposals}
        isEmpty={(list) => list.length === 0}
        empty={{ title: 'Nada por aquí', message: status === 'pending' ? 'No hay propuestas esperando revisión.' : 'Aún no hay propuestas en este estado.' }}>
        {(list) =>
          status === 'pending' ? (
            <View style={{ gap: spacing.md }}>
              {list.map((p) => (
                <ProposalReviewCard key={p.id} proposal={p} />
              ))}
            </View>
          ) : (
            <View>
              {list.map((p) => (
                <ListItem
                  key={p.id}
                  title={proposalConfig[p.type].describe(p.payload).title}
                  subtitle={`${proposalTypeLabel[p.type]} · ${p.author.displayName}${p.reviewNote ? ` · ${p.reviewNote}` : ''}`}
                />
              ))}
            </View>
          )
        }
      </QueryState>
    </View>
  );
}
