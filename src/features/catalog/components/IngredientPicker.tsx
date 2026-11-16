import { useMemo, useState } from 'react';
import { View } from 'react-native';

import type { Ingredient } from '@/core/domain/types';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Button, ChipGroup, IconButton, ListItem, QueryState, TextField } from '@/shared/ui';

import { useCategories, useIngredients } from '../hooks';

interface IngredientPickerProps {
  /** Ids ya agregados: no se vuelven a ofrecer. */
  excludeIds: ReadonlySet<string>;
  onPick: (ingredient: Ingredient) => void;
  /** Si existe, la búsqueda sin resultados ofrece proponer el ingrediente. */
  onPropose?: (name: string) => void;
}

const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export function IngredientPicker({ excludeIds, onPick, onPropose }: IngredientPickerProps) {
  const { spacing } = useTheme();
  const ingredients = useIngredients();
  const categories = useCategories();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const categoryOptions = useMemo(() => (categories.data ?? []).map((c) => ({ value: c.id, label: c.name })), [categories.data]);

  return (
    <View style={{ gap: spacing.md }}>
      <TextField label="Buscar ingrediente" placeholder="Ej. pollo, quinoa, palta" value={search} onChangeText={setSearch} autoCorrect={false} />
      <ChipGroup options={categoryOptions} value={categoryId} onChange={setCategoryId} allowDeselect scrollable accessibilityLabel="Filtrar por categoría" />
      <QueryState query={ingredients}>
        {(all) => {
          const term = normalize(search.trim());
          const matches = all
            .filter((i) => !excludeIds.has(i.id))
            .filter((i) => (categoryId ? i.categoryId === categoryId : true))
            .filter((i) => (term ? normalize(i.name).includes(term) : true))
            .slice(0, 8);

          if (matches.length === 0) {
            return (
              <View style={{ gap: spacing.sm, alignItems: 'flex-start' }}>
                <AppText tone="muted">{term ? `Sin resultados para "${search.trim()}".` : 'No quedan ingredientes en esta categoría.'}</AppText>
                {term && onPropose ? (
                  <Button label={`Proponer "${search.trim()}"`} variant="secondary" compact onPress={() => onPropose(search.trim())} />
                ) : null}
              </View>
            );
          }

          return (
            <View>
              {matches.map((ingredient) => (
                <ListItem
                  key={ingredient.id}
                  title={ingredient.name}
                  subtitle={`${ingredient.kcal100} kcal por 100 g`}
                  right={<IconButton icon="add" accessibilityLabel={`Agregar ${ingredient.name}`} onPress={() => onPick(ingredient)} />}
                />
              ))}
            </View>
          );
        }}
      </QueryState>
    </View>
  );
}
