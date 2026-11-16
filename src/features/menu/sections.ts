import { infoHref } from '@/features/info/content';

import type { MenuSection } from './types';

/** Secciones informativas comunes a todos los roles. */
export const infoSection: MenuSection = {
  title: 'Información',
  links: [
    { label: 'Preguntas frecuentes', icon: 'faq', href: infoHref('faq') },
    { label: 'Quiénes somos', subtitle: 'Brams Tech', icon: 'about', href: infoHref('about') },
    { label: 'Política de privacidad', icon: 'privacy', href: infoHref('privacy') },
    { label: 'Términos y condiciones', icon: 'terms', href: infoHref('terms') },
  ],
};

export const clientAccountSection: MenuSection = {
  title: 'Mi cuenta',
  links: [
    { label: 'Mi perfil', subtitle: 'Propuestas y datos de la cuenta', icon: 'person', href: '/profile' },
    { label: 'Datos personales', subtitle: 'Peso, estatura y edad', icon: 'bodyData', href: '/personal-data' },
  ],
};

export const adminAccountSection: MenuSection = {
  title: 'Mi cuenta',
  links: [{ label: 'Mi perfil', icon: 'person', href: '/admin/profile' }],
};
