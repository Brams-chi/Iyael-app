import { router } from 'expo-router';

import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { Screen } from '@/shared/ui';

export default function ForgotPasswordScreen() {
  return (
    <Screen>
      <AuthHeader title="Recupera tu contraseña" subtitle="Te enviaremos un enlace para crear una nueva." />
      <ForgotPasswordForm onDone={() => router.back()} />
    </Screen>
  );
}
