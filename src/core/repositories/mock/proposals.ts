import { AppError } from '@/core/domain/errors';
import type { Exercise, ExerciseType, Ingredient, Proposal } from '@/core/domain/types';

import type { ProposalRepository } from '../contracts';
import { delay, newId, type MockDb } from './db';
import { summary, type Guard } from './session';

const MAX_PENDING_PER_USER = 5;

export function createMockProposalRepository(db: MockDb, guard: Guard): ProposalRepository {
  const toProposal = ({ authorId, ...row }: MockDb['proposals'][number]): Proposal => ({ ...row, author: summary(db, authorId) });

  const findPending = (id: string) => {
    const row = db.proposals.find((p) => p.id === id);
    if (!row) throw new AppError('not_found', '');
    if (row.status !== 'pending') throw new AppError('conflict', 'Esta propuesta ya fue revisada.');
    return row;
  };

  return {
    async create({ type, payload }) {
      await delay(400);
      const user = await guard.requireClient();
      const pending = db.proposals.filter((p) => p.authorId === user.id && p.status === 'pending').length;
      if (pending >= MAX_PENDING_PER_USER) {
        throw new AppError('rate_limited', `Tienes ${pending} propuestas en revisión. Espera a que el equipo las revise.`);
      }
      const row = { id: newId('p'), authorId: user.id, type, payload, status: 'pending' as const, createdAt: new Date().toISOString() };
      db.proposals.push(row);
      return toProposal(row);
    },

    async mine() {
      await delay();
      const user = await guard.requireClient();
      return db.proposals.filter((p) => p.authorId === user.id).map(toProposal).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },

    async list(status) {
      await delay();
      await guard.requireAdmin();
      return db.proposals.filter((p) => p.status === status).map(toProposal).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    },

    async approve(id, payload) {
      await delay(400);
      await guard.requireAdmin();
      const row = findPending(id);
      // Al aprobar se crea el registro en el catálogo con los datos (posiblemente editados) por el admin.
      if (row.type === 'ingredient') {
        const ingredient: Ingredient = {
          id: newId('i'),
          name: String(payload.name),
          categoryId: String(payload.categoryId),
          kcal100: Number(payload.kcal100),
          protein100: Number(payload.protein100),
          carbs100: Number(payload.carbs100),
          fat100: Number(payload.fat100),
        };
        db.ingredients.push(ingredient);
      } else {
        const exercise: Exercise = {
          id: newId('e'),
          name: String(payload.name),
          muscleGroup: String(payload.muscleGroup),
          type: String(payload.type) as ExerciseType,
        };
        db.exercises.push(exercise);
      }
      Object.assign(row, { status: 'approved', payload });
    },

    async reject(id, note) {
      await delay();
      await guard.requireAdmin();
      Object.assign(findPending(id), { status: 'rejected', reviewNote: note });
    },
  };
}
