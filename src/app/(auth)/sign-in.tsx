import { router } from 'expo-router';

import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { SignInForm } from '@/features/auth/components/SignInForm';
import { Screen } from '@/shared/ui';

export default function SignInScreen() {
  return (
    <Screen safeTop contentStyle={{ justifyContent: 'center' }}>
      <AuthHeader title="Hola de nuevo" subtitle="Tu plan de comidas y entrenos, a tiempo." />
      <SignInForm onForgotPassword={() => router.push('/forgot-password')} onCreateAccount={() => router.push('/sign-up')} />
    </Screen>
  );
}
