import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { errorMessage } from '@/core/domain/errors';
import { useTheme } from '@/shared/theme/ThemeProvider';

import { EmptyState } from './EmptyState';

interface QueryStateProps<T> {
  query: UseQueryResult<T>;
  /** Cuándo los datos cuentan como vacíos (p. ej. lista sin elementos). */
  isEmpty?: (data: T) => boolean;
  empty?: { title: string; message: string; action?: { label: string; onPress: () => void } };
  children: (data: T) => ReactNode;
}

/** Resuelve carga, error y vacío de una consulta en un único lugar. */
export function QueryState<T>({ query, isEmpty, empty, children }: QueryStateProps<T>) {
  const { colors, spacing } = useTheme();

  if (query.isPending) {
    return (
      <View style={{ paddingVertical: spacing.xxl }} accessibilityLabel="Cargando">
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (query.isError) {
    return (
      <EmptyState
        tone="error"
        title="No pudimos cargar esta información"
        message={errorMessage(query.error)}
        action={{ label: 'Reintentar', onPress: () => query.refetch() }}
      />
    );
  }

  if (empty && isEmpty?.(query.data)) return <EmptyState {...empty} />;

  return <>{children(query.data)}</>;
}
