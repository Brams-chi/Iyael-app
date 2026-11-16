import { useState } from 'react';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';

import { AppText } from './AppText';
import { Button } from './Button';

interface ConfirmActionProps {
  label: string;
  /** Pregunta que se muestra al pedir confirmación. */
  question: string;
  confirmLabel: string;
  onConfirm: () => void;
  loading?: boolean;
}

/**
 * Acción destructiva con confirmación dentro de la pantalla.
 * Funciona igual en iOS, Android y web (sin depender de Alert).
 */
export function ConfirmAction({ label, question, confirmLabel, onConfirm, loading }: ConfirmActionProps) {
  const { spacing } = useTheme();
  const [asking, setAsking] = useState(false);

  if (!asking) return <Button label={label} variant="ghost" compact onPress={() => setAsking(true)} />;

  return (
    <View style={{ gap: spacing.xs, alignItems: 'flex-end' }}>
      <AppText variant="caption" tone="muted">
        {question}
      </AppText>
      <View style={{ flexDirection: 'row', gap: spacing.xs }}>
        <Button label="Cancelar" variant="ghost" compact onPress={() => setAsking(false)} />
        <Button label={confirmLabel} variant="danger" compact loading={loading} onPress={onConfirm} />
      </View>
    </View>
  );
}
