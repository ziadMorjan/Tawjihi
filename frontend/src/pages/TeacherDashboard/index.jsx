import { useState } from 'react';
import { LayoutDashboard, Layers, MessageSquare, Star, Bell } from 'lucide-react';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { useLanguage } from '../../shared/hooks/useLanguage';
import { PageInner, Header, Title } from './styles';
import OverviewTab from './tabs/OverviewTab';
import CoursesTab from './tabs/CoursesTab';
import CommentsTab from './tabs/CommentsTab';
import ReviewsTab from './tabs/ReviewsTab';
import SendNotificationTab from './tabs/SendNotificationTab';

const NAV_ITEMS = (t) => [
  { key: 0, label: t('teacherDashboard.nav.overview'), icon: LayoutDashboard },
  { key: 1, label: t('teacherDashboard.nav.courses'), icon: Layers },
  { key: 2, label: t('teacherDashboard.nav.comments'), icon: MessageSquare },
  { key: 3, label: t('teacherDashboard.nav.reviews'), icon: Star },
  { key: 4, label: t('teacherDashboard.nav.sendNotification'), icon: Bell },
];

export default function TeacherDashboard() {
  const [activeNav, setActiveNav] = useState(0);
  const { t } = useLanguage();

  const tabs = {
    0: <OverviewTab />,
    1: <CoursesTab />,
    2: <CommentsTab />,
    3: <ReviewsTab />,
    4: <SendNotificationTab />,
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS(t)} activeNav={activeNav} onNavChange={setActiveNav}>
      <PageInner>
        <Header><Title>{t('teacherDashboard.title')}</Title></Header>
        {tabs[activeNav]}
      </PageInner>
    </DashboardLayout>
  );
}
