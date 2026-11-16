import { View } from 'react-native';

import { errorMessage } from '@/core/domain/errors';
import { EntityFields } from '@/features/catalog/components/EntityFields';
import { entityConfigs, toFormValues } from '@/features/catalog/fields';
import { useDeleteEntity, useEntity, useSaveEntity, type CatalogEntityKey } from '@/features/catalog/hooks';
import { useForm } from '@/shared/hooks/useForm';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { Button, ConfirmAction, FormError, QueryState } from '@/shared/ui';

interface EntityFormProps {
  entity: CatalogEntityKey;
  /** `null` para crear. */
  id: string | null;
  onDone: () => void;
}

/** Crear o editar cualquier entidad del catálogo a partir de su configuración. */
export function EntityForm({ entity, id, onDone }: EntityFormProps) {
  const query = useEntity(entity, id);
  if (id === null) return <EntityFormBody entity={entity} id={null} initial={null} onDone={onDone} />;
  return <QueryState query={query}>{(row) => <EntityFormBody entity={entity} id={id} initial={row} onDone={onDone} />}</QueryState>;
}

function EntityFormBody({ entity, id, initial, onDone }: EntityFormProps & { initial: Record<string, unknown> | null }) {
  const { spacing } = useTheme();
  const config = entityConfigs[entity];
  const form = useForm(config.schema, toFormValues(config, initial));
  const save = useSaveEntity(entity);
  const remove = useDeleteEntity(entity);

  const submit = () => {
    const input = form.validate();
    if (!input) return;
    save.mutate({ id, input }, { onSuccess: onDone, onError: (e) => form.setFormError(errorMessage(e)) });
  };

  return (
    <View style={{ gap: spacing.lg }}>
      <FormError message={form.errors.form} />
      <EntityFields fields={config.fields} values={form.values} errors={form.errors} setField={form.setField} />
      <Button label={id ? 'Guardar cambios' : `Crear ${config.singular}`} onPress={submit} loading={save.isPending} block />
      {id ? (
        <ConfirmAction
          label={`Eliminar ${config.singular}`}
          question="Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          loading={remove.isPending}
          onConfirm={() => remove.mutate(id, { onSuccess: onDone, onError: (e) => form.setFormError(errorMessage(e)) })}
        />
      ) : null}
    </View>
  );
}
