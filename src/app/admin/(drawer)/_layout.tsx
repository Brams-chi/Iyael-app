import { AppDrawer } from '@/features/menu/components/AppDrawer';
import { adminAccountSection, infoSection } from '@/features/menu/sections';

const sections = [adminAccountSection, infoSection];

export default function AdminDrawerLayout() {
  return <AppDrawer sections={sections} profileHref="/admin/profile" />;
}
