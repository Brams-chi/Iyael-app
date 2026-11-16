import { useState } from 'react';
import { View } from 'react-native';

import type { SharedItem } from '@/core/domain/types';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { ChipGroup, QueryState, SectionHeader } from '@/shared/ui';

import { useConnections, useSharedWithMe } from '../hooks';
import { ConnectionRow } from './ConnectionRow';
import { InviteCodeCard } from './InviteCodeCard';
import { InviteCodeForm } from './InviteCodeForm';
import { SharedItemCard } from './SharedItemCard';

type Tab = 'shared' | 'connections';

interface CommunityViewProps {
  onOpenShared: (item: SharedItem) => void;
  onCopySaved: (recipeId: string) => void;
}

export function CommunityView({ onOpenShared, onCopySaved }: CommunityViewProps) {
  const { spacing } = useTheme();
  const [tab, setTab] = useState<Tab>('shared');
  const shared = useSharedWithMe();
  const accepted = useConnections('accepted');
  const pending = useConnections('pending');
  const incoming = (pending.data ?? []).filter((c) => c.direction === 'incoming').length;

  return (
    <View style={{ gap: spacing.lg }}>
      <ChipGroup
        options={[
          { value: 'shared', label: 'Compartido conmigo' },
          { value: 'connections', label: incoming ? `Conexiones · ${incoming} nueva${incoming > 1 ? 's' : ''}` : 'Conexiones' },
        ]}
        value={tab}
        onChange={(v) => v && setTab(v)}
        accessibilityLabel="Sección de comunidad"
      />

      {tab === 'shared' ? (
        <QueryState
          query={shared}
          isEmpty={(list) => list.length === 0}
          empty={{ title: 'Nada compartido aún', message: 'Cuando una conexión te comparta una receta o rutina, aparecerá aquí.' }}>
          {(list) => (
            <View style={{ gap: spacing.md }}>
              {list.map((item) => (
                <SharedItemCard key={item.id} item={item} onOpen={() => onOpenShared(item)} onCopySaved={onCopySaved} />
              ))}
            </View>
          )}
        </QueryState>
      ) : (
        <View style={{ gap: spacing.lg }}>
          <InviteCodeCard />
          <InviteCodeForm />
          <QueryState query={pending} isEmpty={(list) => list.length === 0}>
            {(list) =>
              list.length ? (
                <View>
                  <SectionHeader title={`Invitaciones (${list.length})`} />
                  {list.map((c) => (
                    <ConnectionRow key={c.id} connection={c} />
                  ))}
                </View>
              ) : null
            }
          </QueryState>
          <QueryState
            query={accepted}
            isEmpty={(list) => list.length === 0}
            empty={{ title: 'Aún no tienes conexiones', message: 'Comparte tu código o ingresa el de un amigo para conectar.' }}>
            {(list) => (
              <View>
                <SectionHeader title={`Mis conexiones (${list.length})`} />
                {list.map((c) => (
                  <ConnectionRow key={c.id} connection={c} />
                ))}
              </View>
            )}
          </QueryState>
        </View>
      )}
    </View>
  );
}
