import { View } from 'react-native';

import { errorMessage } from '@/core/domain/errors';
import type { ProposalType } from '@/core/domain/types';
import { EntityFields } from '@/features/catalog/components/EntityFields';
import { toFormValues } from '@/features/catalog/fields';
import { useForm } from '@/shared/hooks/useForm';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Button, ChipGroup, FormError } from '@/shared/ui';

import { useCreateProposal } from '../hooks';
import { proposalConfig, proposalTypeLabel } from '../meta';

interface ProposalFormProps {
  type: ProposalType;
  onTypeChange?: (type: ProposalType) => void;
  initialName?: string;
  onSent: () => void;
}

/** El cliente propone; usa los mismos campos y validaciones que el admin. */
export function ProposalForm({ type, onTypeChange, initialName, onSent }: ProposalFormProps) {
  const { spacing } = useTheme();
  const config = proposalConfig[type];
  const initial: Record<string, string> = { ...toFormValues(config), name: initialName ?? '' };
  const form = useForm(config.schema, initial);
  const create = useCreateProposal();

  const submit = () => {
    const payload = form.validate();
    if (!payload) return;
    create.mutate(
      { type, payload: payload as Record<string, string | number> },
      { onSuccess: onSent, onError: (e) => form.setFormError(errorMessage(e)) }
    );
  };

  return (
    <View style={{ gap: spacing.lg }}>
      {onTypeChange ? (
        <ChipGroup
          options={(Object.keys(proposalTypeLabel) as ProposalType[]).map((value) => ({ value, label: proposalTypeLabel[value] }))}
          value={type}
          onChange={(v) => v && onTypeChange(v)}
          accessibilityLabel="Tipo de propuesta"
        />
      ) : null}
      <AppText tone="muted">El equipo revisará tu propuesta antes de sumarla al catálogo. Verás el resultado en Mis propuestas.</AppText>
      <FormError message={form.errors.form} />
      <EntityFields fields={config.fields} values={form.values} errors={form.errors} setField={form.setField} />
      <Button label="Enviar propuesta" onPress={submit} loading={create.isPending} block />
    </View>
  );
}
