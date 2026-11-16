import { AppError } from '@/core/domain/errors';
import type { Connection } from '@/core/domain/types';

import type { SocialRepository } from '../contracts';
import { delay, newId, type MockConnection, type MockDb } from './db';
import { summary, type Guard } from './session';

function randomCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const pick = (n: number) => Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  return `LUN-${pick(4)}-${pick(2)}`;
}

export function createMockSocialRepository(db: MockDb, guard: Guard): SocialRepository {
  const toConnection = (row: MockConnection, me: string): Connection => {
    const incoming = row.addresseeId === me;
    return {
      id: row.id,
      status: row.status,
      direction: incoming ? 'incoming' : 'outgoing',
      other: summary(db, incoming ? row.requesterId : row.addresseeId),
    };
  };

  const involving = (me: string) => db.connections.filter((c) => c.requesterId === me || c.addresseeId === me);

  const findMine = async (connectionId: string) => {
    const user = await guard.requireClient();
    const row = involving(user.id).find((c) => c.id === connectionId);
    if (!row) throw new AppError('not_found', '');
    return { user, row };
  };

  return {
    async inviteCode() {
      await delay(150);
      return (await guard.requireClient()).inviteCode;
    },

    async regenerateInviteCode() {
      await delay(300);
      const user = await guard.requireClient();
      user.inviteCode = randomCode();
      return user.inviteCode;
    },

    async sendInvitation(code) {
      await delay(400);
      const user = await guard.requireClient();
      const target = db.users.find((u) => u.inviteCode === code.trim().toUpperCase() && u.role === 'client');
      // Mismo mensaje si el código no existe: no se pueden enumerar códigos válidos.
      if (!target || target.id === user.id) throw new AppError('not_found', 'Ese código no es válido. Revisa que esté bien escrito.');
      const existing = involving(user.id).find((c) => c.requesterId === target.id || c.addresseeId === target.id);
      if (existing) throw new AppError('conflict', existing.status === 'accepted' ? 'Ya estás conectado con esa persona.' : 'Ya hay una invitación pendiente con esa persona.');
      const row: MockConnection = { id: newId('cn'), requesterId: user.id, addresseeId: target.id, status: 'pending' };
      db.connections.push(row);
      return toConnection(row, user.id);
    },

    async connections(status) {
      await delay();
      const user = await guard.requireClient();
      return involving(user.id)
        .filter((c) => c.status === status)
        .map((c) => toConnection(c, user.id))
        .sort((a, b) => a.other.displayName.localeCompare(b.other.displayName, 'es'));
    },

    async accept(connectionId) {
      await delay();
      const { user, row } = await findMine(connectionId);
      if (row.addresseeId !== user.id || row.status !== 'pending') throw new AppError('forbidden', '');
      row.status = 'accepted';
    },

    async reject(connectionId) {
      await delay();
      const { user, row } = await findMine(connectionId);
      if (row.addresseeId !== user.id || row.status !== 'pending') throw new AppError('forbidden', '');
      db.connections.splice(db.connections.indexOf(row), 1);
    },

    async remove(connectionId) {
      await delay();
      const { row } = await findMine(connectionId);
      const pair = new Set([row.requesterId, row.addresseeId]);
      db.connections.splice(db.connections.indexOf(row), 1);
      // Se retiran los compartidos vigentes entre ambos; las copias ya guardadas son recetas propias y se conservan.
      db.shares = db.shares.filter((s) => !(pair.has(s.fromUserId) && pair.has(s.toUserId)));
    },

    async sharedWithMe() {
      await delay();
      const user = await guard.requireClient();
      return db.shares
        .filter((s) => s.toUserId === user.id)
        .map((s) => ({
          id: s.id,
          from: summary(db, s.fromUserId),
          resourceType: s.resourceType,
          resourceId: s.resourceId,
          title:
            (s.resourceType === 'recipe'
              ? db.recipes.find((r) => r.id === s.resourceId)?.title
              : db.routines.find((r) => r.id === s.resourceId)?.name) ?? 'Elemento eliminado',
          createdAt: s.createdAt,
        }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },

    async share(resourceType, resourceId, connectionIds) {
      await delay(400);
      const user = await guard.requireClient();
      const owned =
        resourceType === 'recipe'
          ? db.recipes.some((r) => r.id === resourceId && r.ownerId === user.id)
          : db.routines.some((r) => r.id === resourceId && r.ownerId === user.id);
      if (!owned) throw new AppError('forbidden', 'Sólo puedes compartir lo que creaste tú.');

      for (const connectionId of connectionIds) {
        const row = involving(user.id).find((c) => c.id === connectionId && c.status === 'accepted');
        if (!row) throw new AppError('forbidden', 'Sólo puedes compartir con conexiones aceptadas.');
        const toUserId = row.requesterId === user.id ? row.addresseeId : row.requesterId;
        const duplicate = db.shares.some((s) => s.fromUserId === user.id && s.toUserId === toUserId && s.resourceId === resourceId);
        if (!duplicate) {
          db.shares.push({ id: newId('sh'), fromUserId: user.id, toUserId, resourceType, resourceId, createdAt: new Date().toISOString() });
        }
      }
    },

    async saveCopy(sharedItemId) {
      await delay(400);
      const user = await guard.requireClient();
      const share = db.shares.find((s) => s.id === sharedItemId && s.toUserId === user.id);
      if (!share || share.resourceType !== 'recipe') throw new AppError('not_found', '');
      const original = db.recipes.find((r) => r.id === share.resourceId);
      if (!original) throw new AppError('not_found', '');
      const copy = {
        ...original,
        id: newId('r'),
        ownerId: user.id,
        ingredients: original.ingredients.map((l) => ({ ...l })),
        steps: [...original.steps],
        updatedAt: new Date().toISOString(),
      };
      db.recipes.push(copy);
      return copy.id;
    },
  };
}
