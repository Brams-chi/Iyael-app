import type { ComponentType } from 'react';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { AppText, Card } from '@/shared/ui';

import type { DocumentPage, FaqPage, InfoPage } from '../content';
import { FaqList } from './FaqList';

function DocumentView({ page }: { page: DocumentPage }) {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.xl }}>
      {page.updated ? (
        <AppText variant="caption" tone="muted">
          Última actualización: {page.updated}
        </AppText>
      ) : null}
      {page.intro ? <AppText>{page.intro}</AppText> : null}
      {page.sections.map((section) => (
        <View key={section.heading} style={{ gap: spacing.sm }}>
          <AppText variant="subheading" accessibilityRole="header">
            {section.heading}
          </AppText>
          {section.paragraphs.map((paragraph) => (
            <AppText key={paragraph} tone="muted">
              {paragraph}
            </AppText>
          ))}
        </View>
      ))}
    </View>
  );
}

function FaqView({ page }: { page: FaqPage }) {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.lg }}>
      {page.intro ? <AppText>{page.intro}</AppText> : null}
      <Card>
        <FaqList items={page.items} />
      </Card>
    </View>
  );
}

/** Un renderizador por tipo de página: sumar un tipo no obliga a tocar los existentes. */
const renderers: { [K in InfoPage['kind']]: ComponentType<{ page: Extract<InfoPage, { kind: K }> }> } = {
  document: DocumentView,
  faq: FaqView,
};

export function InfoPageView({ page }: { page: InfoPage }) {
  const Renderer = renderers[page.kind] as ComponentType<{ page: InfoPage }>;
  return <Renderer page={page} />;
}
