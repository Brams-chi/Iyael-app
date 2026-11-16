import { useState } from 'react';
import { View } from 'react-native';

import { errorMessage } from '@/core/domain/errors';
import type { SharedItem } from '@/core/domain/types';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Avatar, Button, Card } from '@/shared/ui';

import { useSaveCopy } from '../hooks';

interface SharedItemCardProps {
  item: SharedItem;
  onOpen: () => void;
  onCopySaved: (recipeId: string) => void;
}

/** Lo compartido se ve en modo lectura; "Guardar una copia" lo trae al espacio propio. */
export function SharedItemCard({ item, onOpen, onCopySaved }: SharedItemCardProps) {
  const { spacing } = useTheme();
  const saveCopy = useSaveCopy();
  const [error, setError] = useState<string | null>(null);
  const kind = item.resourceType === 'recipe' ? 'una receta' : 'una rutina';

  return (
    <Card onPress={onOpen} accessibilityLabel={`${item.from.displayName} compartió ${kind}: ${item.title}`}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Avatar name={item.from.displayName} size={28} />
        <AppText variant="caption" tone="muted" style={{ flex: 1 }}>
          {item.from.displayName} compartió {kind}
        </AppText>
      </View>
      <AppText variant="subheading">{item.title}</AppText>
      {item.resourceType === 'recipe' ? (
        <View style={{ alignItems: 'flex-start' }}>
          <Button
            label="Guardar una copia"
            variant="secondary"
            compact
            loading={saveCopy.isPending}
            onPress={() =>
              saveCopy.mutate(item.id, {
                onSuccess: onCopySaved,
                onError: (e) => setError(errorMessage(e)),
              })
            }
          />
        </View>
      ) : null}
      {error ? (
        <AppText variant="caption" tone="danger">
          {error}
        </AppText>
      ) : null}
    </Card>
  );
}
