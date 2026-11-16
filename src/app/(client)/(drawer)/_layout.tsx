import { AppDrawer } from '@/features/menu/components/AppDrawer';
import { clientAccountSection, infoSection } from '@/features/menu/sections';

const sections = [clientAccountSection, infoSection];

export default function ClientDrawerLayout() {
  return <AppDrawer sections={sections} profileHref="/profile" />;
}
