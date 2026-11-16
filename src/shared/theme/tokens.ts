import type { TextStyle } from 'react-native';

/**
 * Única fuente de verdad visual de la app.
 * El color comunica significado: `accent` = acción / cumplido;
 * `protein`, `carbs` y `fat` se reservan para macronutrientes.
 */
const light = {
  background: '#F5F7F4',
  surface: '#FFFFFF',
  surfaceMuted: '#ECF1EA',
  text: '#16201A',
  textMuted: '#4D5B52',
  border: '#DAE2D8',
  borderStrong: '#B4C1B3',
  accent: '#1D6A4D',
  accentSoft: '#DCEDE2',
  onAccent: '#FFFFFF',
  danger: '#B3261E',
  dangerSoft: '#F9DEDC',
  protein: '#B63F59',
  carbs: '#B8760F',
  fat: '#3A67A6',
};

export type ColorTokens = typeof light;

const dark: ColorTokens = {
  background: '#0F1411',
  surface: '#161D19',
  surfaceMuted: '#1C2520',
  text: '#E4EBE5',
  textMuted: '#9CAAA1',
  border: '#29332D',
  borderStrong: '#3D4A42',
  accent: '#5EC096',
  accentSoft: '#1B382B',
  onAccent: '#0A1A12',
  danger: '#F2B8B5',
  dangerSoft: '#3B1B19',
  protein: '#E57890',
  carbs: '#E2A54A',
  fat: '#80A7E0',
};

export const palettes = { light, dark } as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;

/** Tamaño mínimo de objetivo táctil (iOS HIG 44pt / Material 48dp). */
export const minTouchSize = 44;

export const typography = {
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.4 },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
  subheading: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase' },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
