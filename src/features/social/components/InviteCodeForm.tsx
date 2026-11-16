import { useState } from 'react';
import { View } from 'react-native';
import { z } from 'zod';

import { errorMessage } from '@/core/domain/errors';
import { useForm } from '@/shared/hooks/useForm';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Button, TextField } from '@/shared/ui';

import { useSendInvitation } from '../hooks';

const schema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^LUN-[A-Z0-9]{4}-[A-Z0-9]{2}$/, { error: 'El código tiene la forma LUN-XXXX-XX' }),
});

export function InviteCodeForm() {
  const { spacing } = useTheme();
  const form = useForm(schema, { code: '' });
  const send = useSendInvitation();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const submit = () => {
    const data = form.validate();
    if (!data) return;
    setSentTo(null);
    send.mutate(data.code, {
      onSuccess: (connection) => {
        setSentTo(connection.other.displayName);
        form.reset({ code: '' });
      },
      onError: (error) => form.setFormError(errorMessage(error)),
    });
  };

  return (
    <View style={{ gap: spacing.md }}>
      <TextField
        label="Código de un amigo"
        placeholder="LUN-XXXX-XX"
        value={form.values.code}
        onChangeText={(v) => form.setField('code', v)}
        error={form.errors.code ?? form.errors.form}
        autoCapitalize="characters"
        autoCorrect={false}
        onSubmitEditing={submit}
      />
      <Button label="Enviar invitación" onPress={submit} loading={send.isPending} block />
      {sentTo ? (
        <AppText tone="accent" accessibilityLiveRegion="polite">
          Invitación enviada a {sentTo}. Verás la conexión cuando la acepte.
        </AppText>
      ) : null}
    </View>
  );
}
