import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import type { ProposalType } from '@/core/domain/types';
import { ProposalForm } from '@/features/proposals/components/ProposalForm';
import { Screen } from '@/shared/ui';

export default function ProposeScreen() {
  const params = useLocalSearchParams<{ type?: string; name?: string }>();
  const [type, setType] = useState<ProposalType>(params.type === 'exercise' ? 'exercise' : 'ingredient');

  return (
    <Screen>
      {/* key: al cambiar de tipo el formulario se reinicia con sus propios campos. */}
      <ProposalForm key={type} type={type} onTypeChange={setType} initialName={params.name} onSent={() => router.replace('/proposals')} />
    </Screen>
  );
}
