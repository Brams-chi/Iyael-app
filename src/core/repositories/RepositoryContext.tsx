import { createContext, use, type PropsWithChildren } from 'react';

import type { Repositories } from './contracts';

const RepositoryContext = createContext<Repositories | null>(null);

/**
 * Punto de inversión de dependencias: decide qué implementación usa la app.
 * Hoy recibe los repositorios simulados; con la API recibirá los HTTP.
 */
export function RepositoryProvider({ repositories, children }: PropsWithChildren<{ repositories: Repositories }>) {
  return <RepositoryContext.Provider value={repositories}>{children}</RepositoryContext.Provider>;
}

export function useRepositories(): Repositories {
  const repositories = use(RepositoryContext);
  if (!repositories) throw new Error('useRepositories debe usarse dentro de <RepositoryProvider>');
  return repositories;
}
