import type { Weekday } from '@/core/domain/types';

export const WEEKDAYS: readonly Weekday[] = [1, 2, 3, 4, 5, 6, 7];

const short: Record<Weekday, string> = { 1: 'L', 2: 'M', 3: 'M', 4: 'J', 5: 'V', 6: 'S', 7: 'D' };
const long: Record<Weekday, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
};

export function weekdayLabel(day: Weekday, format: 'short' | 'long'): string {
  return format === 'short' ? short[day] : long[day];
}

/** Lunes = 1 … Domingo = 7 (ISO 8601). */
export function weekdayOf(date: Date): Weekday {
  const js = date.getDay();
  return (js === 0 ? 7 : js) as Weekday;
}

/** Fecha local en formato `YYYY-MM-DD`, usada como clave de registros diarios. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
}

/** Minutos desde medianoche para una hora `HH:mm`. */
export function minutesOf(time: string): number {
  const [h = '0', m = '0'] = time.split(':');
  return Number(h) * 60 + Number(m);
}
