import type { Href } from 'expo-router';

import type { IconName } from '@/shared/ui';

export interface MenuLink {
  label: string;
  subtitle?: string;
  icon: IconName;
  href: Href;
}

export interface MenuSection {
  title: string;
  links: readonly MenuLink[];
}
