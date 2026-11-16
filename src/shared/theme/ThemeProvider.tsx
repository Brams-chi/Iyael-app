import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { Appearance, Platform, useColorScheme } from 'react-native';

import { palettes, radius, spacing, typography, type ColorTokens } from './tokens';

export interface Theme {
  scheme: 'light' | 'dark';
  colors: ColorTokens;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

/** `system` sigue el ajuste del dispositivo. */
export type ThemePreference = 'system' | 'light' | 'dark';

export const themePreferences: readonly ThemePreference[] = ['system', 'light', 'dark'];

export const isThemePreference = (value: unknown): value is ThemePreference =>
  typeof value === 'string' && (themePreferences as readonly string[]).includes(value);

/** Persistencia de la preferencia. Se inyecta desde la raíz (inversión de dependencias). */
export interface ThemePreferenceStorage {
  load(): Promise<ThemePreference | null>;
  save(preference: ThemePreference): Promise<void>;
}

interface ThemePreferenceState {
  preference: ThemePreference;
  setPreference(preference: ThemePreference): void;
  /** `false` mientras se lee la preferencia guardada (el splash sigue visible). */
  ready: boolean;
}

/* Tema y preferencia van en contextos separados: los componentes visuales sólo leen el tema. */
const ThemeContext = createContext<Theme | null>(null);
const ThemePreferenceContext = createContext<ThemePreferenceState | null>(null);

const supportsNativeOverride = Platform.OS === 'ios' || Platform.OS === 'android';

export function ThemeProvider({ storage, children }: PropsWithChildren<{ storage: ThemePreferenceStorage }>) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [ready, setReady] = useState(false);
  const systemScheme = useColorScheme();

  useEffect(() => {
    let cancelled = false;
    storage
      .load()
      .then((saved) => {
        if (!cancelled && saved) setPreferenceState(saved);
      })
      // Una preferencia ilegible no debe impedir abrir la app: se usa la del sistema.
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [storage]);

  // En iOS/Android el override también aplica a controles nativos (teclado, alertas, selectores).
  useEffect(() => {
    if (supportsNativeOverride) Appearance.setColorScheme(preference === 'system' ? 'auto' : preference);
  }, [preference]);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      setPreferenceState(next);
      void storage.save(next).catch(() => undefined);
    },
    [storage]
  );

  const scheme: Theme['scheme'] = preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const theme = useMemo<Theme>(() => ({ scheme, colors: palettes[scheme], spacing, radius, typography }), [scheme]);

  // Los navegadores de Expo Router usan el mismo fondo y color de acento que la app.
  const navigationTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.colors.accent,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
      },
    };
  }, [scheme, theme]);

  const preferenceState = useMemo(() => ({ preference, setPreference, ready }), [preference, setPreference, ready]);

  return (
    <ThemePreferenceContext.Provider value={preferenceState}>
      <ThemeContext.Provider value={theme}>
        <NavigationThemeProvider value={navigationTheme}>{children}</NavigationThemeProvider>
      </ThemeContext.Provider>
    </ThemePreferenceContext.Provider>
  );
}

export function useTheme(): Theme {
  const theme = use(ThemeContext);
  if (!theme) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return theme;
}

export function useThemePreference(): ThemePreferenceState {
  const value = use(ThemePreferenceContext);
  if (!value) throw new Error('useThemePreference debe usarse dentro de <ThemeProvider>');
  return value;
}
