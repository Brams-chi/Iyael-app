import { View } from 'react-native';

import type { GoalId } from '@/core/domain/types';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { Chip } from '@/shared/ui';

import { goalMeta } from '../goals';

export function GoalBadges({ goals }: { goals: readonly GoalId[] }) {
  const { spacing } = useTheme();
  if (goals.length === 0) return null;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
      {goals.map((goal) => (
        <Chip key={goal} label={goalMeta[goal].label} tone={goalMeta[goal].tone} />
      ))}
    </View>
  );
}
