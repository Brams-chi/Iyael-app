import { View } from 'react-native';

import { AppText } from './AppText';
import { Button } from './Button';

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <AppText variant="label" tone="muted" accessibilityRole="header">
        {title}
      </AppText>
      {action ? <Button label={action.label} onPress={action.onPress} variant="ghost" compact /> : null}
    </View>
  );
}
