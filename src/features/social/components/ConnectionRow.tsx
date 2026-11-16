import { View } from 'react-native';

import type { Connection } from '@/core/domain/types';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Avatar, Button, ConfirmAction, ListItem } from '@/shared/ui';

import { useRemoveConnection, useRespondInvitation } from '../hooks';

/** Una conexión con las acciones que corresponden a su estado. */
export function ConnectionRow({ connection }: { connection: Connection }) {
  const { spacing } = useTheme();
  const respond = useRespondInvitation();
  const remove = useRemoveConnection();
  const { other, status, direction } = connection;

  let right;
  if (status === 'accepted') {
    right = (
      <ConfirmAction
        label="Eliminar"
        question={`Dejarás de compartir con ${other.displayName}.`}
        confirmLabel="Eliminar"
        loading={remove.isPending}
        onConfirm={() => remove.mutate(connection.id)}
      />
    );
  } else if (direction === 'incoming') {
    right = (
      <View style={{ flexDirection: 'row', gap: spacing.xs }}>
        <Button label="Rechazar" variant="ghost" compact disabled={respond.isPending} onPress={() => respond.mutate({ id: connection.id, accept: false })} />
        <Button label="Aceptar" compact loading={respond.isPending} onPress={() => respond.mutate({ id: connection.id, accept: true })} />
      </View>
    );
  } else {
    right = (
      <AppText variant="caption" tone="muted">
        Esperando respuesta
      </AppText>
    );
  }

  return <ListItem left={<Avatar name={other.displayName} />} title={other.displayName} right={right} />;
}
