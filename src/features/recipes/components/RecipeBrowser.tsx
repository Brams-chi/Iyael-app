import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import type { GoalId, RecipeScope } from '@/core/domain/types';
import { goalFilterOptions } from '@/features/nutrition/goals';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { ChipGroup, type ChipOption, QueryState, TextField } from '@/shared/ui';

import { useRecipes } from '../hooks';
import { RecipeCard } from './RecipeCard';

const scopeOptions: readonly ChipOption<RecipeScope>[] = [
  { value: 'mine', label: 'Mías' },
  { value: 'catalog', label: 'Catálogo' },
  { value: 'shared', label: 'Compartidas' },
];

const emptyCopy: Record<RecipeScope, { title: string; message: string }> = {
  mine: { title: 'Aún no tienes recetas', message: 'Crea la primera con el botón + y verás su evaluación nutricional al instante.' },
  catalog: { title: 'El catálogo está vacío', message: 'Pronto habrá recetas recomendadas aquí.' },
  shared: { title: 'Nadie te ha compartido recetas', message: 'Conecta con alguien desde Comunidad usando su código de invitación.' },
};

const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

interface RecipeBrowserProps {
  /** Ámbitos disponibles; con uno solo no se muestran los filtros de origen. */
  scopes?: readonly RecipeScope[];
  onOpen: (id: string) => void;
}

export function RecipeBrowser({ scopes = ['mine', 'catalog', 'shared'], onOpen }: RecipeBrowserProps) {
  const { spacing } = useTheme();
  const [scope, setScope] = useState<RecipeScope>(scopes[0] ?? 'mine');
  const [goal, setGoal] = useState<GoalId | null>(null);
  const [search, setSearch] = useState('');
  const query = useRecipes(scope);

  const options = useMemo(() => scopeOptions.filter((o) => scopes.includes(o.value)), [scopes]);

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    return (query.data ?? []).filter(
      (r) => (goal ? r.nutrition.goals.includes(goal) : true) && (term ? normalize(r.title).includes(term) : true)
    );
  }, [query.data, goal, search]);

  return (
    <FlatList
      data={query.isSuccess ? filtered : []}
      keyExtractor={(r) => r.id}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
      ListHeaderComponent={
        <View style={{ gap: spacing.md }}>
          <TextField label="Buscar receta" placeholder="Ej. bowl, lentejas" value={search} onChangeText={setSearch} />
          {options.length > 1 ? (
            <ChipGroup options={options} value={scope} onChange={(v) => v && setScope(v)} accessibilityLabel="Origen de las recetas" />
          ) : null}
          <ChipGroup options={goalFilterOptions} value={goal} onChange={setGoal} allowDeselect scrollable accessibilityLabel="Filtrar por objetivo" />
        </View>
      }
      ListEmptyComponent={
        <QueryState
          query={query}
          isEmpty={() => filtered.length === 0}
          empty={
            (query.data?.length ?? 0) > 0
              ? { title: 'Sin coincidencias', message: 'Prueba con otro nombre u otro objetivo.' }
              : emptyCopy[scope]
          }>
          {() => null}
        </QueryState>
      }
      renderItem={({ item }) => <RecipeCard recipe={item} onPress={() => onOpen(item.id)} />}
    />
  );
}
