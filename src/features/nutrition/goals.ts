import type { GoalId } from '@/core/domain/types';
import type { ChipTone } from '@/shared/ui/Chip';

export const goalMeta: Record<GoalId, { label: string; tone: ChipTone }> = {
  high_protein: { label: 'Alto en proteína', tone: 'protein' },
  low_protein: { label: 'Bajo en proteína', tone: 'protein' },
  low_carb: { label: 'Bajo en carbohidratos', tone: 'carbs' },
  high_carb: { label: 'Alto en carbohidratos', tone: 'carbs' },
  low_fat: { label: 'Bajo en grasas', tone: 'fat' },
  high_fat: { label: 'Alto en grasas', tone: 'fat' },
};

/** Objetivos ofrecidos como filtro, en orden de uso esperado. */
export const goalFilterOptions = (Object.keys(goalMeta) as GoalId[]).map((value) => ({ value, label: goalMeta[value].label }));
