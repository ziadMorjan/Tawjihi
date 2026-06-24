import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PATH } from '../../constants';
import { Edit2, Mail, BookOpen, Heart, ShoppingCart, User, Phone, Calendar, Shield, FileText, Lock } from 'lucide-react';
import { MainLayout }       from '../../shared/components/layout/MainLayout';
import { Button, Spinner } from '../../shared/components';
import { useAuth }          from '../../features/auth';
import { useMyEnrollments } from '../../features/enrollments/hooks/useMyEnrollments';
import { useCart }          from '../../features/cart';
import { useWishlist }      from '../../features/wishlist';
import {
  PageWrapper, CoverSection, ContentWrapper, ProfileHeaderCard, UserBrief,
  AvatarWrapper, UserMeta, UserName, UserEmail, ActionArea,
  Grid, MainPane, SidebarPane, DashboardCard, CardHeader, CardTitle,
  StatGrid, StatCard, StatIconContainer, StatValue, StatLabel,
  BioContainer, BioText, DetailList, DetailItem, DetailLabelGroup,
  DetailLabelText, DetailValueText, RoleBadge, SecurityActions
} from './Profile.styles';

export default function Profile() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, isLoading } = useAuth();
  const { enrollments } = useMyEnrollments();
  const { cartItems }   = useCart();
  const { wishlistIds } = useWishlist();

  const ROLE_MAP = {
    user:    t('roles.user'),
    teacher: t('roles.teacher'),
    admin:   t('roles.admin'),
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    navigate(PATH.login);
    return null;
  }

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long' })
    : '—';

  return (
    <MainLayout>
      <PageWrapper>
        {/* Cover */}
        <CoverSection>
          {user.coverImage && <img src={user.coverImage} alt="cover" />}
        </CoverSection>

        <ContentWrapper>
          {/* Header Card */}
          <ProfileHeaderCard>
            <UserBrief>
              <AvatarWrapper>
                {user.coverImage
                  ? <img src={user.coverImage} alt={user.name} />
                  : <span>{user.name?.charAt(0)?.toUpperCase()}</span>
                }
              </AvatarWrapper>

              <UserMeta>
                <UserName>
                  {user.name}
                  <RoleBadge>{ROLE_MAP[user.role] ?? user.role}</RoleBadge>
                </UserName>
                <UserEmail>
                  <Mail size={14} />
                  {user.email}
                </UserEmail>
              </UserMeta>
            </UserBrief>

            <ActionArea>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Edit2 size={16} />}
                onClick={() => navigate(PATH.editProfile)}
              >
                {t('profile.editProfile')}
              </Button>
            </ActionArea>
          </ProfileHeaderCard>

          <Grid>
            {/* Main Pane (Left) */}
            <MainPane>
              {/* Stats Dashboard */}
              <DashboardCard>
                <CardHeader>
                  <CardTitle>
                    <BookOpen size={20} color="#1B4FD8" />
                    {t('profile.coursesCount')}
                  </CardTitle>
                </CardHeader>
                
                <StatGrid>
                  <StatCard onClick={() => navigate(PATH.myCourses)}>
                    <StatIconContainer style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                      <BookOpen size={24} />
                    </StatIconContainer>
                    <StatValue>{enrollments.length}</StatValue>
                    <StatLabel>{t('profile.coursesCount')}</StatLabel>
                  </StatCard>

                  <StatCard onClick={() => navigate(PATH.cart)}>
                    <StatIconContainer style={{ background: '#FDF2F8', color: '#DB2777' }}>
                      <ShoppingCart size={24} />
                    </StatIconContainer>
                    <StatValue>{cartItems.length}</StatValue>
                    <StatLabel>{t('nav.cart')}</StatLabel>
                  </StatCard>

                  <StatCard onClick={() => navigate(PATH.wishlist)}>
                    <StatIconContainer style={{ background: '#FEF2F2', color: '#DC2626' }}>
                      <Heart size={24} />
                    </StatIconContainer>
                    <StatValue>{wishlistIds.length}</StatValue>
                    <StatLabel>{t('nav.wishlist')}</StatLabel>
                  </StatCard>
                </StatGrid>
              </DashboardCard>

              {/* Bio Card */}
              <DashboardCard>
                <CardHeader>
                  <CardTitle>
                    <FileText size={20} color="#1B4FD8" />
                    {t('profile.bioLabel')}
                  </CardTitle>
                </CardHeader>
                <BioContainer>
                  <BioText>
                    {user.bio || t('profile.noBio')}
                  </BioText>
                </BioContainer>
              </DashboardCard>
            </MainPane>

            {/* Sidebar Pane (Right) */}
            <SidebarPane>
              {/* Account Details */}
              <DashboardCard>
                <CardHeader>
                  <CardTitle>
                    <User size={20} color="#1B4FD8" />
                    {t('profile.title')}
                  </CardTitle>
                </CardHeader>

                <DetailList>
                  <DetailItem>
                    <DetailLabelGroup>
                      <User size={16} />
                      <DetailLabelText>{t('auth.name')}</DetailLabelText>
                    </DetailLabelGroup>
                    <DetailValueText>{user.name}</DetailValueText>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabelGroup>
                      <Mail size={16} />
                      <DetailLabelText>{t('auth.email')}</DetailLabelText>
                    </DetailLabelGroup>
                    <DetailValueText>{user.email}</DetailValueText>
                  </DetailItem>

                  {user.phone && (
                    <DetailItem>
                      <DetailLabelGroup>
                        <Phone size={16} />
                        <DetailLabelText>{t('profile.phoneLabel')}</DetailLabelText>
                      </DetailLabelGroup>
                      <DetailValueText>{user.phone}</DetailValueText>
                    </DetailItem>
                  )}

                  <DetailItem>
                    <DetailLabelGroup>
                      <Shield size={16} />
                      <DetailLabelText>{t('profile.roleLabel')}</DetailLabelText>
                    </DetailLabelGroup>
                    <DetailValueText>{ROLE_MAP[user.role] ?? user.role}</DetailValueText>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabelGroup>
                      <Calendar size={16} />
                      <DetailLabelText>{t('profile.joinDate')}</DetailLabelText>
                    </DetailLabelGroup>
                    <DetailValueText>{joinedDate}</DetailValueText>
                  </DetailItem>
                </DetailList>
              </DashboardCard>

              {/* Security Actions */}
              <DashboardCard>
                <CardHeader>
                  <CardTitle>
                    <Lock size={20} color="#1B4FD8" />
                    {t('profile.changePassword')}
                  </CardTitle>
                </CardHeader>
                <SecurityActions>
                  <Button
                    variant="secondary"
                    fullWidth
                    leftIcon={<Lock size={16} />}
                    onClick={() => navigate(PATH.changePassword)}
                  >
                    {t('profile.changePassword')}
                  </Button>
                </SecurityActions>
              </DashboardCard>
            </SidebarPane>
          </Grid>
        </ContentWrapper>
      </PageWrapper>
    </MainLayout>
  );
}