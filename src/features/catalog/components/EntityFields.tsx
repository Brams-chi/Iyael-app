import { View } from 'react-native';

import type { FormErrors } from '@/shared/hooks/useForm';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, ChipGroup, TextField } from '@/shared/ui';

import type { FieldConfig } from '../fields';
import { useCategories } from '../hooks';

interface EntityFieldsProps {
  fields: readonly FieldConfig[];
  values: Record<string, string>;
  errors: FormErrors<string>;
  setField: (key: string, value: string) => void;
}

/** Renderiza cualquier formulario del catálogo a partir de su configuración. */
export function EntityFields({ fields, values, errors, setField }: EntityFieldsProps) {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.lg }}>
      {fields.map((field) => {
        const common = { value: values[field.key] ?? '', onChange: (v: string | null) => setField(field.key, v ?? ''), error: errors[field.key] };
        switch (field.kind) {
          case 'text':
            return <TextField key={field.key} label={field.label} hint={field.hint} value={common.value} onChangeText={common.onChange} error={common.error} />;
          case 'number':
            return (
              <TextField
                key={field.key}
                label={field.label}
                hint={field.hint}
                value={common.value}
                onChangeText={common.onChange}
                error={common.error}
                keyboardType="decimal-pad"
              />
            );
          case 'select':
            return <SelectField key={field.key} label={field.label} options={field.options} {...common} />;
          case 'category':
            return <CategoryField key={field.key} label={field.label} {...common} />;
        }
      })}
    </View>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string | null) => void;
  error?: string;
}

function SelectField({ label, options, value, onChange, error }: SelectProps & { options: readonly { value: string; label: string }[] }) {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.xs }}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <ChipGroup options={options} value={value || null} onChange={onChange} accessibilityLabel={label} />
      {error ? (
        <AppText variant="caption" tone="danger">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

function CategoryField(props: SelectProps) {
  const categories = useCategories();
  const options = (categories.data ?? []).map((c) => ({ value: c.id, label: c.name }));
  return <SelectField {...props} options={options} />;
}
