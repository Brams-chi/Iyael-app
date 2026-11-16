import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { errorMessage } from '@/core/domain/errors';
import { infoHref } from '@/features/info/content';
import { useForm } from '@/shared/hooks/useForm';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Button, TextField, FormError } from '@/shared/ui';

import { useAuthActions } from '../AuthContext';
import { signUpSchema } from '../schemas';

export function SignUpForm() {
  const { spacing } = useTheme();
  const { signUp } = useAuthActions();
  const form = useForm(signUpSchema, { displayName: '', email: '', password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const data = form.validate();
    if (!data) return;
    setSubmitting(true);
    try {
      await signUp({ displayName: data.displayName, email: data.email, password: data.password });
    } catch (error) {
      form.setFormError(errorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <View style={{ gap: spacing.lg }}>
      <FormError message={form.errors.form} />
      <TextField
        label="Nombre"
        value={form.values.displayName}
        onChangeText={(v) => form.setField('displayName', v)}
        error={form.errors.displayName}
        autoComplete="name"
        textContentType="name"
      />
      <TextField
        label="Correo"
        value={form.values.email}
        onChangeText={(v) => form.setField('email', v)}
        error={form.errors.email}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <TextField
        label="Contraseña"
        value={form.values.password}
        onChangeText={(v) => form.setField('password', v)}
        error={form.errors.password}
        hint="Mínimo 8 caracteres, con letras y números."
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <TextField
        label="Repite la contraseña"
        value={form.values.confirmPassword}
        onChangeText={(v) => form.setField('confirmPassword', v)}
        error={form.errors.confirmPassword}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        onSubmitEditing={submit}
      />
      <Button label="Crear cuenta" onPress={submit} loading={submitting} block />
      <AppText variant="caption" tone="muted" style={{ textAlign: 'center' }}>
        Al crear tu cuenta aceptas los{' '}
        <AppText variant="caption" tone="accent" accessibilityRole="link" onPress={() => router.push(infoHref('terms'))}>
          Términos y condiciones
        </AppText>{' '}
        y la{' '}
        <AppText variant="caption" tone="accent" accessibilityRole="link" onPress={() => router.push(infoHref('privacy'))}>
          Política de privacidad
        </AppText>
        .
      </AppText>
    </View>
  );
}
