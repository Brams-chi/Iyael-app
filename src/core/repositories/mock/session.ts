import { AppError } from '@/core/domain/errors';
import type { User } from '@/core/domain/types';

import type { AccessTokenProvider } from '../contracts';
import type { MockDb, MockUser } from './db';

/**
 * Tokens simulados con el id de usuario embebido, para que la sesión
 * sobreviva a recargas en desarrollo. La API real emitirá JWT firmados.
 */
export function issueToken(kind: 'access' | 'refresh', userId: string): string {
  return `mock-${kind}.${userId}.${Math.random().toString(36).slice(2)}`;
}

export function userIdFromToken(token: string | null, kind: 'access' | 'refresh'): string | null {
  if (!token) return null;
  const [prefix, userId] = token.split('.');
  return prefix === `mock-${kind}` && userId ? userId : null;
}

export function toUser(user: MockUser): User {
  return { id: user.id, email: user.email, displayName: user.displayName, role: user.role };
}

/** Equivalente al middleware de autenticación/autorización de la API. */
export function createGuard(db: MockDb, tokens: AccessTokenProvider) {
  async function currentUser(): Promise<MockUser> {
    const userId = userIdFromToken(await tokens.getAccessToken(), 'access');
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new AppError('unauthorized', '');
    return user;
  }

  async function requireAdmin(): Promise<MockUser> {
    const user = await currentUser();
    if (user.role !== 'admin') throw new AppError('forbidden', '');
    return user;
  }

  async function requireClient(): Promise<MockUser> {
    const user = await currentUser();
    if (user.role !== 'client') throw new AppError('forbidden', '');
    return user;
  }

  return { currentUser, requireAdmin, requireClient };
}

export type Guard = ReturnType<typeof createGuard>;

export function summary(db: MockDb, userId: string) {
  const user = db.users.find((u) => u.id === userId);
  return { id: userId, displayName: user?.displayName ?? 'Usuario' };
}
