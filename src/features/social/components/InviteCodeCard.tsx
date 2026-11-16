import { Share, View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Button, Card, ConfirmAction } from '@/shared/ui';

import { useInviteCode, useRegenerateInviteCode } from '../hooks';

/** Código propio: compartirlo es la única forma de que alguien te invite. */
export function InviteCodeCard() {
  const { spacing } = useTheme();
  const code = useInviteCode();
  const regenerate = useRegenerateInviteCode();

  return (
    <Card>
      <AppText variant="caption" tone="muted">
        Tu código de invitación
      </AppText>
      <AppText
        variant="heading"
        selectable
        accessibilityLabel={code.data ? `Tu código es ${code.data.split('').join(' ')}` : 'Cargando código'}
        style={{ fontFamily: 'monospace', letterSpacing: 1.5 }}>
        {code.data ?? '··· ···'}
      </AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm }}>
        <Button
          label="Compartir código"
          icon="share"
          compact
          disabled={!code.data}
          onPress={() => void Share.share({ message: `Conectemos en Lunchy. Mi código de invitación es ${code.data}` })}
        />
        <ConfirmAction
          label="Generar otro"
          question="El código actual dejará de funcionar."
          confirmLabel="Generar"
          loading={regenerate.isPending}
          onConfirm={() => regenerate.mutate()}
        />
      </View>
    </Card>
  );
}
