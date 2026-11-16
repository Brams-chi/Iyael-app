import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { isThemePreference, type ThemePreferenceStorage } from '@/shared/theme/ThemeProvider';

const KEY = 'lunchy.theme_preference';
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Preferencia de tema (dato NO sensible). En nativo reutiliza SecureStore para
 * no sumar dependencias; en web usa localStorage, permitido sólo para
 * preferencias de interfaz (nunca tokens ni datos personales).
 * Todo valor leído se valida contra la lista permitida antes de usarse.
 */
export const themePreferenceStore: ThemePreferenceStorage = {
  async load() {
    let raw: string | null = null;
    if (isNative) raw = await SecureStore.getItemAsync(KEY);
    else {
      try {
        raw = globalThis.localStorage?.getItem(KEY) ?? null;
      } catch {
        raw = null; // Navegación privada o almacenamiento bloqueado.
      }
    }
    return isThemePreference(raw) ? raw : null;
  },

  async save(preference) {
    if (isNative) {
      await SecureStore.setItemAsync(KEY, preference);
      return;
    }
    try {
      globalThis.localStorage?.setItem(KEY, preference);
    } catch {
      // Sin almacenamiento la preferencia dura hasta recargar; no es un error para el usuario.
    }
  },
};
