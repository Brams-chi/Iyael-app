import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

import { useThemePreference } from '@/shared/theme/ThemeProvider';

import { useAuthState } from '../AuthContext';

void SplashScreen.preventAutoHideAsync();

/** Mantiene el splash hasta resolver sesión y tema: nunca se ve un parpadeo del login ni de colores. */
export function SplashController() {
  const { status } = useAuthState();
  const { ready } = useThemePreference();

  useEffect(() => {
    if (status !== 'loading' && ready) SplashScreen.hide();
  }, [status, ready]);

  return null;
}
