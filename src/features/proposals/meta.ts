import type { ProposalStatus, ProposalType } from '@/core/domain/types';
import { entityConfigs } from '@/features/catalog/fields';

/** Cada tipo de propuesta usa la misma configuración que su entidad del catálogo. */
export const proposalConfig = {
  ingredient: entityConfigs.ingredients,
  exercise: entityConfigs.exercises,
} as const satisfies Record<ProposalType, (typeof entityConfigs)[keyof typeof entityConfigs]>;

export const proposalTypeLabel: Record<ProposalType, string> = { ingredient: 'Ingrediente', exercise: 'Ejercicio' };

export const proposalStatusLabel: Record<ProposalStatus, string> = {
  pending: 'En revisión',
  approved: 'Aprobada',
  rejected: 'Rechazada',
};
