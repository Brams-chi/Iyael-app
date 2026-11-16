import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { SignUpForm } from '@/features/auth/components/SignUpForm';
import { Screen } from '@/shared/ui';

export default function SignUpScreen() {
  return (
    <Screen>
      <AuthHeader title="Crea tu cuenta" subtitle="Organiza tus comidas, recetas y entrenamientos en un solo lugar." />
      <SignUpForm />
    </Screen>
  );
}
