import { router } from 'expo-router';
import { View } from 'react-native';

import { ProfileView } from '@/features/auth/components/ProfileView';
import { Card, ListItem, Screen } from '@/shared/ui';

export default function ClientProfileScreen() {
  return (
    <Screen>
      <ProfileView>
        <Card>
          <View>
            <ListItem title="Datos personales" subtitle="Peso, estatura y edad" onPress={() => router.push('/personal-data')} />
            <ListItem title="Mis propuestas" subtitle="Ingredientes y ejercicios que enviaste" onPress={() => router.push('/proposals')} />
            <ListItem title="Proponer al catálogo" subtitle="Sugiere un ingrediente o ejercicio que falta" onPress={() => router.push('/propose')} divider={false} />
          </View>
        </Card>
      </ProfileView>
    </Screen>
  );
}
