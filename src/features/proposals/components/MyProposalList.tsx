import { View } from 'react-native';

import { AppText, Chip, ListItem, QueryState } from '@/shared/ui';

import { useMyProposals } from '../hooks';
import { proposalStatusLabel, proposalTypeLabel } from '../meta';

export function MyProposalList() {
  const proposals = useMyProposals();
  return (
    <QueryState
      query={proposals}
      isEmpty={(list) => list.length === 0}
      empty={{ title: 'Sin propuestas', message: 'Si no encuentras un ingrediente o ejercicio, propónlo desde el buscador.' }}>
      {(list) => (
        <View>
          {list.map((p) => (
            <ListItem
              key={p.id}
              title={String(p.payload.name)}
              subtitle={p.reviewNote ? `${proposalTypeLabel[p.type]} · Motivo: ${p.reviewNote}` : proposalTypeLabel[p.type]}
              right={
                p.status === 'approved' ? (
                  <Chip label={proposalStatusLabel[p.status]} selected />
                ) : (
                  <AppText variant="caption" tone={p.status === 'rejected' ? 'danger' : 'muted'}>
                    {proposalStatusLabel[p.status]}
                  </AppText>
                )
              }
            />
          ))}
        </View>
      )}
    </QueryState>
  );
}
