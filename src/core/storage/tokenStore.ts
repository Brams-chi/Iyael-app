import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { AuthTokens } from '@/core/domain/types';
import type { AccessTokenProvider } from '@/core/repositories/contracts';

const ACCESS_KEY = 'lunchy.access_token';
const REFRESH_KEY = 'lunchy.refresh_token';

const options: SecureStore.SecureStoreOptions = {
  // Sólo accesible con el dispositivo desbloqueado y nunca se migra en respaldos.
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

/**
 * En web no existe un almacén cifrado equivalente: los tokens viven sólo en
 * memoria (la sesión se pierde al recargar) en vez de exponerse en localStorage.
 */
const memory = new Map<string, string>();
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

async function read(key: string): Promise<string | null> {
  return isNative ? SecureStore.getItemAsync(key, options) : (memory.get(key) ?? null);
}

async function write(key: string, value: string): Promise<void> {
  if (isNative) await SecureStore.setItemAsync(key, value, options);
  else memory.set(key, value);
}

async function erase(key: string): Promise<void> {
  if (isNative) await SecureStore.deleteItemAsync(key, options);
  else memory.delete(key);
}

export const tokenStore: AccessTokenProvider & {
  getRefreshToken(): Promise<string | null>;
  save(tokens: AuthTokens): Promise<void>;
  clear(): Promise<void>;
} = {
  getAccessToken: () => read(ACCESS_KEY),
  getRefreshToken: () => read(REFRESH_KEY),
  async save(tokens) {
    await Promise.all([write(ACCESS_KEY, tokens.accessToken), write(REFRESH_KEY, tokens.refreshToken)]);
  },
  async clear() {
    await Promise.all([erase(ACCESS_KEY), erase(REFRESH_KEY)]);
  },
};
