import { AppError } from '@/core/domain/errors';

import type { AuthRepository } from '../contracts';
import { delay, newId, type MockDb } from './db';
import { issueToken, toUser, userIdFromToken } from './session';

export function createMockAuthRepository(db: MockDb): AuthRepository {
  const tokensFor = (userId: string) => ({ accessToken: issueToken('access', userId), refreshToken: issueToken('refresh', userId) });

  return {
    async signIn(email, password) {
      await delay(500);
      const user = db.users.find((u) => u.email === email.trim().toLowerCase());
      // Mismo error si el correo no existe o la contraseña falla: no revela cuentas.
      if (!user || user.mockPassword !== password) throw new AppError('invalid_credentials', '');
      return { user: toUser(user), tokens: tokensFor(user.id) };
    },

    async signUp({ displayName, email, password }) {
      await delay(600);
      const normalized = email.trim().toLowerCase();
      if (db.users.some((u) => u.email === normalized)) throw new AppError('email_taken', '');
      const user = {
        id: newId('u'),
        email: normalized,
        displayName: displayName.trim(),
        role: 'client' as const,
        mockPassword: password,
        inviteCode: `LUN-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 4).toUpperCase()}`,
      };
      db.users.push(user);
      return { user: toUser(user), tokens: tokensFor(user.id) };
    },

    async me(accessToken) {
      await delay(200);
      const user = db.users.find((u) => u.id === userIdFromToken(accessToken, 'access'));
      if (!user) throw new AppError('unauthorized', '');
      return toUser(user);
    },

    async refresh(refreshToken) {
      await delay(200);
      const userId = userIdFromToken(refreshToken, 'refresh');
      if (!userId || !db.users.some((u) => u.id === userId)) throw new AppError('unauthorized', '');
      return tokensFor(userId);
    },

    async signOut() {
      await delay(100);
    },

    async requestPasswordReset() {
      await delay(500);
    },
  };
}
