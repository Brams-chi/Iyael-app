import { useState } from 'react';
import { View } from 'react-native';

import { errorMessage } from '@/core/domain/errors';
import type { BodyMetrics, BodyMetricsInput } from '@/core/domain/types';
import { useForm } from '@/shared/hooks/useForm';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Button, Card, ConfirmAction, FormError, QueryState, TextField } from '@/shared/ui';

import { useBodyMetrics, useUpdateBodyMetrics } from '../hooks';
import { bodyMetricsSchema } from '../schemas';

const toText = (value: number | null) => (value === null ? '' : String(value).replace('.', ','));

const toValues = (metrics: BodyMetrics) => ({
  weightKg: toText(metrics.weightKg),
  heightCm: toText(metrics.heightCm),
  age: toText(metrics.age),
});

const cleared: BodyMetricsInput = { weightKg: null, heightCm: null, age: null };

function Form({ metrics }: { metrics: BodyMetrics }) {
  const { spacing } = useTheme();
  const form = useForm(bodyMetricsSchema, toValues(metrics));
  const update = useUpdateBodyMetrics();
  const [saved, setSaved] = useState(false);
  const hasData = metrics.weightKg !== null || metrics.heightCm !== null || metrics.age !== null;

  const save = (input: BodyMetricsInput, after?: (result: BodyMetrics) => void) => {
    setSaved(false);
    update.mutate(input, {
      onSuccess: (result) => {
        setSaved(true);
        after?.(result);
      },
      onError: (error) => form.setFormError(errorMessage(error)),
    });
  };

  const submit = () => {
    const data = form.validate();
    if (data) save(data);
  };

  const edit = (key: keyof BodyMetricsInput, value: string) => {
    setSaved(false);
    form.setField(key, value);
  };

  return (
    <View style={{ gap: spacing.lg }}>
      <FormError message={form.errors.form} />
      <TextField
        label="Peso (kg)"
        value={form.values.weightKg}
        onChangeText={(v) => edit('weightKg', v)}
        error={form.errors.weightKg}
        keyboardType="decimal-pad"
        placeholder="Ej: 64,5"
        maxLength={6}
      />
      <TextField
        label="Estatura (cm)"
        value={form.values.heightCm}
        onChangeText={(v) => edit('heightCm', v)}
        error={form.errors.heightCm}
        keyboardType="decimal-pad"
        placeholder="Ej: 168"
        maxLength={6}
      />
      <TextField
        label="Edad (años)"
        value={form.values.age}
        onChangeText={(v) => edit('age', v)}
        error={form.errors.age}
        keyboardType="number-pad"
        placeholder="Ej: 29"
        maxLength={3}
        onSubmitEditing={submit}
      />
      <Button label="Guardar" onPress={submit} loading={update.isPending} block />
      {saved ? (
        <AppText tone="accent" accessibilityLiveRegion="polite" style={{ textAlign: 'center' }}>
          Datos guardados
        </AppText>
      ) : null}
      {hasData ? (
        <ConfirmAction
          label="Borrar mis datos personales"
          question="Se eliminarán tu peso, estatura y edad."
          confirmLabel="Borrar"
          loading={update.isPending}
          onConfirm={() => save(cleared, (result) => form.reset(toValues(result)))}
        />
      ) : null}
    </View>
  );
}

/** Formulario de datos corporales. Todos los campos son opcionales. */
export function BodyMetricsForm() {
  const { spacing } = useTheme();
  const query = useBodyMetrics();

  return (
    <View style={{ gap: spacing.lg }}>
      <Card>
        <AppText variant="subheading">Sólo tú puedes ver estos datos</AppText>
        <AppText tone="muted">
          Son opcionales y nos ayudan a personalizar tus objetivos. No se comparten con tus conexiones y puedes borrarlos cuando quieras.
        </AppText>
      </Card>
      <QueryState query={query}>{(metrics) => <Form metrics={metrics} />}</QueryState>
    </View>
  );
}
