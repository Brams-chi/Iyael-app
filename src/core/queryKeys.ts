import type { ConnectionStatus, DateKey, ProposalStatus, RecipeScope, Weekday } from './domain/types';

/** Claves de caché centralizadas: invalidar siempre por estos prefijos. */
export const queryKeys = {
  profile: {
    all: ['profile'] as const,
    bodyMetrics: ['profile', 'body-metrics'] as const,
  },
  categories: ['catalog', 'categories'] as const,
  ingredients: ['catalog', 'ingredients'] as const,
  exercises: ['catalog', 'exercises'] as const,
  recipes: {
    all: ['recipes'] as const,
    list: (scope: RecipeScope) => ['recipes', 'list', scope] as const,
    detail: (id: string) => ['recipes', 'detail', id] as const,
  },
  menus: {
    all: ['menus'] as const,
    day: (weekday: Weekday) => ['menus', 'day', weekday] as const,
    week: ['menus', 'week'] as const,
    logs: (date: DateKey) => ['menus', 'logs', date] as const,
  },
  routines: {
    all: ['routines'] as const,
    list: ['routines', 'list'] as const,
    detail: (id: string) => ['routines', 'detail', id] as const,
    logs: (date: DateKey) => ['routines', 'logs', date] as const,
  },
  social: {
    all: ['social'] as const,
    inviteCode: ['social', 'invite-code'] as const,
    connections: (status: ConnectionStatus) => ['social', 'connections', status] as const,
    shared: ['social', 'shared'] as const,
  },
  proposals: {
    all: ['proposals'] as const,
    mine: ['proposals', 'mine'] as const,
    list: (status: ProposalStatus) => ['proposals', 'list', status] as const,
  },
} as const;
