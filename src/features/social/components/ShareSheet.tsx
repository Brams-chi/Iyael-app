import { useState } from 'react';
import { View } from 'react-native';

import { errorMessage } from '@/core/domain/errors';
import type { ShareableType } from '@/core/domain/types';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Button, Card, Chip, QueryState } from '@/shared/ui';

import { useConnections, useShare } from '../hooks';

interface ShareSheetProps {
  resourceType: ShareableType;
  resourceId: string;
}

/** Elegir conexiones aceptadas y compartir. Se despliega dentro de la pantalla. */
export function ShareSheet({ resourceType, resourceId }: ShareSheetProps) {
  const { spacing } = useTheme();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [feedback, setFeedback] = useState<{ tone: 'accent' | 'danger'; text: string } | null>(null);
  const connections = useConnections('accepted');
  const share = useShare();

  if (!open) {
    return <Button label="Compartir" icon="share" variant="secondary" onPress={() => setOpen(true)} block />;
  }

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <Card>
      <AppText variant="subheading">Compartir con</AppText>
      <QueryState
        query={connections}
        isEmpty={(list) => list.length === 0}
        empty={{ title: 'Sin conexiones', message: 'Comparte tu código desde Comunidad para conectar con alguien.' }}>
        {(list) => (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {list.map((c) => (
              <Chip key={c.id} label={c.other.displayName} selected={selected.has(c.id)} onPress={() => toggle(c.id)} />
            ))}
          </View>
        )}
      </QueryState>
      {feedback ? <AppText tone={feedback.tone}>{feedback.text}</AppText> : null}
      <View style={{ flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' }}>
        <Button label="Cerrar" variant="ghost" compact onPress={() => setOpen(false)} />
        <Button
          label={selected.size ? `Compartir con ${selected.size}` : 'Compartir'}
          compact
          disabled={selected.size === 0}
          loading={share.isPending}
          onPress={() =>
            share.mutate(
              { type: resourceType, id: resourceId, connectionIds: [...selected] },
              {
                onSuccess: () => {
                  setFeedback({ tone: 'accent', text: 'Compartido.' });
                  setSelected(new Set());
                },
                onError: (e) => setFeedback({ tone: 'danger', text: errorMessage(e) }),
              }
            )
          }
        />
      </View>
    </Card>
  );
}
