import type { RoutineExercise } from '@/core/domain/types';

/** "4 × 10", "3 × 45 s" o "30 min", según cómo se mide el ejercicio. */
export function formatVolume(exercise: RoutineExercise): string {
  if (exercise.reps) return `${exercise.sets} × ${exercise.reps}`;
  const seconds = exercise.durationSec ?? 0;
  const duration = seconds >= 120 ? `${Math.round(seconds / 60)} min` : `${seconds} s`;
  return exercise.sets > 1 ? `${exercise.sets} × ${duration}` : duration;
}

export function formatDeadline(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
}
