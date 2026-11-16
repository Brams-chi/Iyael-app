import { View } from 'react-native';

import type { RecipeNutrition } from '@/core/domain/types';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText } from '@/shared/ui';

import { MacroBar } from './MacroBar';

/** Barra + leyenda con gramos y % de kcal por porción. */
export function MacroSummary({ nutrition }: { nutrition: RecipeNutrition }) {
  const { spacing } = useTheme();
  const pct = (n: number) => `${Math.round(n * 100)} %`;
  const items = [
    { label: 'Proteína', grams: nutrition.protein, share: nutrition.split.protein, tone: 'protein' as const },
    { label: 'Carbos', grams: nutrition.carbs, share: nutrition.split.carbs, tone: 'carbs' as const },
    { label: 'Grasa', grams: nutrition.fat, share: nutrition.split.fat, tone: 'fat' as const },
  ];

  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <AppText variant="heading">{nutrition.kcal} kcal</AppText>
        <AppText variant="caption" tone="muted">
          por porción
        </AppText>
      </View>
      <MacroBar split={nutrition.split} height={10} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {items.map((item) => (
          <View key={item.label}>
            <AppText variant="caption" tone={item.tone} style={{ fontWeight: '600', fontVariant: ['tabular-nums'] }}>
              {item.label} {item.grams} g
            </AppText>
            <AppText variant="caption" tone="muted" style={{ fontVariant: ['tabular-nums'] }}>
              {pct(item.share)}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}
