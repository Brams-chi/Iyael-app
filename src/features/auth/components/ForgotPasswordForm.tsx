import { useState } from 'react';
import { View } from 'react-native';

import { errorMessage } from '@/core/domain/errors';
import { useForm } from '@/shared/hooks/useForm';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Button, Card, TextField, FormError } from '@/shared/ui';

import { useAuthActions } from '../AuthContext';
import { passwordResetSchema } from '../schemas';

export function ForgotPasswordForm({ onDone }: { onDone: () => void }) {
  const { spacing } = useTheme();
  const { requestPasswordReset } = useAuthActions();
  const form = useForm(passwordResetSchema, { email: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const submit = async () => {
    const data = form.validate();
    if (!data) return;
    setStatus('sending');
    try {
      await requestPasswordReset(data.email);
      setStatus('sent');
    } catch (error) {
      form.setFormError(errorMessage(error));
      setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <Card highlighted>
        <AppText variant="subheading">Revisa tu correo</AppText>
        {/* Mismo mensaje exista o no la cuenta: no revela qué correos están registrados. */}
        <AppText tone="muted">Si {form.values.email} tiene una cuenta, te enviamos un enlace para crear una contraseña nueva.</AppText>
        <Button label="Volver a iniciar sesión" onPress={onDone} />
      </Card>
    );
  }

  return (
    <View style={{ gap: spacing.lg }}>
      <FormError message={form.errors.form} />
      <TextField
        label="Correo"
        value={form.values.email}
        onChangeText={(v) => form.setField('email', v)}
        error={form.errors.email}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onSubmitEditing={submit}
      />
      <Button label="Enviar enlace" onPress={submit} loading={status === 'sending'} block />
    </View>
  );
}
