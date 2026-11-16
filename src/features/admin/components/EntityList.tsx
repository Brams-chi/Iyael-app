import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import { entityConfigs } from '@/features/catalog/fields';
import { useEntityList, type CatalogEntityKey } from '@/features/catalog/hooks';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { Button, ListItem, QueryState, TextField } from '@/shared/ui';

interface EntityListProps {
  entity: CatalogEntityKey;
  onOpen: (id: string) => void;
  onCreate: () => void;
  /** Contenido sobre el buscador (p. ej. alternar entre entidades). */
  header?: React.ReactNode;
}

const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

/** Lista genérica del catálogo: una configuración por entidad, una sola pantalla. */
export function EntityList({ entity, onOpen, onCreate, header }: EntityListProps) {
  const { spacing } = useTheme();
  const config = entityConfigs[entity];
  const query = useEntityList(entity);
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const term = normalize(search.trim());
    return (query.data ?? []).map((row) => ({ id: row.id, ...config.describe(row) })).filter((r) => (term ? normalize(r.title).includes(term) : true));
  }, [query.data, search, config]);

  return (
    <FlatList
      data={query.isSuccess ? rows : []}
      keyExtractor={(r) => r.id}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: spacing.lg }}
      ListHeaderComponent={
        <View style={{ gap: spacing.md, marginBottom: spacing.sm }}>
          {header}
          <Button label={`Nuevo ${config.singular}`} icon="add" variant="secondary" onPress={onCreate} block />
          <TextField
            label={`Buscar en ${query.data?.length ?? 0} ${config.title.toLowerCase()}`}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      }
      ListEmptyComponent={
        <QueryState
          query={query}
          isEmpty={() => rows.length === 0}
          empty={
            search
              ? { title: 'Sin coincidencias', message: 'Prueba con otro nombre.' }
              : { title: `No hay ${config.title.toLowerCase()}`, message: `Crea el primer ${config.singular}.`, action: { label: 'Crear', onPress: onCreate } }
          }>
          {() => null}
        </QueryState>
      }
      renderItem={({ item }) => <ListItem title={item.title} subtitle={item.subtitle} onPress={() => onOpen(item.id)} />}
    />
  );
}
