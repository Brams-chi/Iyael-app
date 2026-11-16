import { useState } from 'react';
import { View } from 'react-native';

import { errorMessage } from '@/core/domain/errors';
import { DEMO_PASSWORD } from '@/core/repositories/mock';
import { useForm } from '@/shared/hooks/useForm';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Button, TextField, FormError } from '@/shared/ui';

import { useAuthActions } from '../AuthContext';
import { signInSchema } from '../schemas';

interface SignInFormProps {
  onForgotPassword: () => void;
  onCreateAccount: () => void;
}

export function SignInForm({ onForgotPassword, onCreateAccount }: SignInFormProps) {
  const { spacing } = useTheme();
  const { signIn } = useAuthActions();
  const form = useForm(signInSchema, { email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const data = form.validate();
    if (!data) return;
    setSubmitting(true);
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      form.setFormError(errorMessage(error));
      setSubmitting(false);
    }
  };

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
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <TextField
        label="Contraseña"
        value={form.values.password}
        onChangeText={(v) => form.setField('password', v)}
        error={form.errors.password}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={submit}
      />
      <Button label="Iniciar sesión" onPress={submit} loading={submitting} block />
      <Button label="¿Olvidaste tu contraseña?" variant="ghost" onPress={onForgotPassword} />
      <Button label="Crear cuenta" variant="secondary" onPress={onCreateAccount} block />
      {__DEV__ ? (
        <AppText variant="caption" tone="muted" style={{ textAlign: 'center' }}>
          Datos de prueba: cliente@lunchy.app o admin@lunchy.app · {DEMO_PASSWORD}
        </AppText>
      ) : null}
    </View>
  );
}
