import { router } from 'expo-router';
import { useState } from 'react';

import { EntityList } from '@/features/admin/components/EntityList';
import { ChipGroup, Screen } from '@/shared/ui';

type Section = 'ingredients' | 'categories';

const sections = [
  { value: 'ingredients', label: 'Ingredientes' },
  { value: 'categories', label: 'Categorías' },
] as const;

export default function AdminIngredientsScreen() {
  const [section, setSection] = useState<Section>('ingredients');
  return (
    <Screen scroll={false}>
      <EntityList
        key={section}
        entity={section}
        header={<ChipGroup options={sections} value={section} onChange={(v) => v && setSection(v)} accessibilityLabel="Sección del catálogo" />}
        onOpen={(id) => router.push({ pathname: '/admin/[entity]/[id]', params: { entity: section, id } })}
        onCreate={() => router.push({ pathname: '/admin/[entity]/[id]', params: { entity: section, id: 'new' } })}
      />
    </Screen>
  );
}
