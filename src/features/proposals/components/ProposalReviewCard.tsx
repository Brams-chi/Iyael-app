import { useState } from 'react';
import { View } from 'react-native';

import { errorMessage } from '@/core/domain/errors';
import type { Proposal } from '@/core/domain/types';
import { EntityFields } from '@/features/catalog/components/EntityFields';
import { toFormValues } from '@/features/catalog/fields';
import { useForm } from '@/shared/hooks/useForm';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Button, Card, Chip, FormError, TextField } from '@/shared/ui';

import { useReviewProposal } from '../hooks';
import { proposalConfig, proposalTypeLabel } from '../meta';

type Mode = 'view' | 'edit' | 'reject';

/** Revisión de una propuesta: aprobar, editar antes de aprobar o rechazar con motivo. */
export function ProposalReviewCard({ proposal }: { proposal: Proposal }) {
  const { spacing } = useTheme();
  const config = proposalConfig[proposal.type];
  const [mode, setMode] = useState<Mode>('view');
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState<string>();
  const form = useForm(config.schema, toFormValues(config, proposal.payload));
  const review = useReviewProposal();
  const summary = config.describe(proposal.payload);

  const approve = () => {
    const payload = form.validate();
    if (!payload) {
      setMode('edit');
      return;
    }
    review.mutate(
      { id: proposal.id, approve: true, payload: payload as Record<string, string | number> },
      { onError: (e) => form.setFormError(errorMessage(e)) }
    );
  };

  const reject = () => {
    if (note.trim().length < 5) return setNoteError('Explica el motivo en al menos 5 caracteres; el cliente lo verá.');
    review.mutate({ id: proposal.id, approve: false, note: note.trim() }, { onError: (e) => setNoteError(errorMessage(e)) });
  };

  return (
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm }}>
        <AppText variant="subheading" style={{ flex: 1 }}>
          {summary.title}
        </AppText>
        <Chip label={proposalTypeLabel[proposal.type]} />
      </View>
      <AppText variant="caption" tone="muted">
        {summary.subtitle}
      </AppText>
      <AppText variant="caption" tone="muted">
        Propuesto por {proposal.author.displayName}
      </AppText>
      <FormError message={form.errors.form} />

      {mode === 'edit' ? <EntityFields fields={config.fields} values={form.values} errors={form.errors} setField={form.setField} /> : null}
      {mode === 'reject' ? (
        <TextField
          label="Motivo del rechazo"
          value={note}
          onChangeText={(v) => {
            setNote(v);
            setNoteError(undefined);
          }}
          error={noteError}
          multiline
        />
      ) : null}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: spacing.sm }}>
        {mode === 'reject' ? (
          <>
            <Button label="Cancelar" variant="ghost" compact onPress={() => setMode('view')} />
            <Button label="Rechazar" variant="danger" compact loading={review.isPending} onPress={reject} />
          </>
        ) : (
          <>
            <Button label="Rechazar" variant="ghost" compact onPress={() => setMode('reject')} />
            {mode === 'view' ? <Button label="Editar" variant="secondary" compact onPress={() => setMode('edit')} /> : null}
            <Button label={mode === 'edit' ? 'Aprobar con cambios' : 'Aprobar'} compact loading={review.isPending} onPress={approve} />
          </>
        )}
      </View>
    </Card>
  );
}
