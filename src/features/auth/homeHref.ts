import type { Href } from 'expo-router';

import type { User } from '@/core/domain/types';

/**
 * Pantalla de inicio según el estado de sesión. Única fuente de verdad para las
 * redirecciones de las guardas y de "+not-found": sin sesión siempre se va al login.
 */
export function homeHref(user: User | null): Href {
  if (!user) return '/sign-in';
  return user.role === 'admin' ? '/admin' : '/';
}
