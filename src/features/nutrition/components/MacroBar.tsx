import { View } from 'react-native';

import type { MacroSplit } from '@/core/domain/types';
import { useTheme } from '@/shared/theme/ThemeProvider';

/** Barra de reparto de kcal: proteína · carbohidratos · grasa. */
export function MacroBar({ split, height = 8 }: { split: MacroSplit; height?: number }) {
  const { colors, radius } = useTheme();
  const empty = split.protein + split.carbs + split.fat === 0;
  const pct = (n: number) => Math.round(n * 100);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={empty ? 'Sin datos nutricionales' : `Proteína ${pct(split.protein)} %, carbohidratos ${pct(split.carbs)} %, grasa ${pct(split.fat)} %`}
      style={{ flexDirection: 'row', height, borderRadius: radius.pill, overflow: 'hidden', gap: 2, backgroundColor: empty ? colors.border : 'transparent' }}>
      {empty ? null : (
        <>
          <View style={{ flex: split.protein, backgroundColor: colors.protein }} />
          <View style={{ flex: split.carbs, backgroundColor: colors.carbs }} />
          <View style={{ flex: split.fat, backgroundColor: colors.fat }} />
        </>
      )}
    </View>
  );
}
