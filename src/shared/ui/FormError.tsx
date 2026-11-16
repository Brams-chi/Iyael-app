import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText } from './AppText';

/** Error general del formulario (no ligado a un campo). */
export function FormError({ message }: { message?: string }) {
  const { colors, radius, spacing } = useTheme();
  if (!message) return null;
  return (
    <AppText
      accessibilityRole="alert"
      tone="danger"
      style={{ backgroundColor: colors.dangerSoft, borderRadius: radius.md, padding: spacing.md }}>
      {message}
    </AppText>
  );
}
