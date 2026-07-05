import { useState } from 'react';
import { LayoutDashboard, UserCheck, Users, Layers, GitBranch,
  BookMarked, Ticket, Newspaper, Bell } from 'lucide-react';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { useLanguage } from '../../shared/hooks/useLanguage';
import { PageInner, Header, Title } from './styles';
import OverviewTab from './tabs/OverviewTab';
import PendingTeachersTab from './tabs/PendingTeachersTab';
import UsersTab from './tabs/UsersTab';
import CoursesTab from './tabs/CoursesTab';
import BranchesTab from './tabs/BranchesTab';
import SubjectsTab from './tabs/SubjectsTab';
import CouponsTab from './tabs/CouponsTab';
import NewsTab from './tabs/NewsTab';
import BroadcastTab from './tabs/BroadcastTab';

const NAV_ITEMS = (t) => [
  { key: 0, label: t('adminDashboard.nav.overview'), icon: LayoutDashboard },
  { key: 1, label: t('adminDashboard.nav.pendingTeachers'), icon: UserCheck },
  { key: 2, label: t('adminDashboard.nav.users'), icon: Users },
  { key: 3, label: t('adminDashboard.nav.courses'), icon: Layers },
  { key: 4, label: t('adminDashboard.nav.branches'), icon: GitBranch },
  { key: 5, label: t('adminDashboard.nav.subjects'), icon: BookMarked },
  { key: 6, label: t('adminDashboard.nav.coupons'), icon: Ticket },
  { key: 7, label: t('adminDashboard.nav.news'), icon: Newspaper },
  { key: 8, label: t('adminDashboard.nav.broadcast'), icon: Bell },
];

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState(0);
  const { t } = useLanguage();

  const tabs = {
    0: <OverviewTab />,
    1: <PendingTeachersTab />,
    2: <UsersTab />,
    3: <CoursesTab />,
    4: <BranchesTab />,
    5: <SubjectsTab />,
    6: <CouponsTab />,
    7: <NewsTab />,
    8: <BroadcastTab />,
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS(t)} activeNav={activeNav} onNavChange={setActiveNav}>
      <PageInner>
        <Header><Title>{t('adminDashboard.title')}</Title></Header>
        {tabs[activeNav]}
      </PageInner>
    </DashboardLayout>
  );
}
