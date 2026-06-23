import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PATH } from '../../constants';
import { Edit2, Mail, BookOpen, Heart, ShoppingCart } from 'lucide-react';
import { MainLayout }       from '../../shared/components/layout/MainLayout';
import { Button, Spinner } from '../../shared/components';
import { useAuth }          from '../../features/auth';
import { useMyEnrollments } from '../../features/enrollments/hooks/useMyEnrollments';
import { useCart }          from '../../features/cart';
import { useWishlist }      from '../../features/wishlist';
import {
  PageWrapper, CoverSection, ContentWrapper, ProfileHeader,
  AvatarWrapper, HeaderActions, UserInfo, UserName, UserEmail,
  Grid, Card, CardTitle, DetailRow, DetailLabel, DetailValue,
  StatGrid, StatCard, StatValue, StatLabel, BioText, RoleBadge,
} from './Profile.styles';

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    ? new Date(user.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })
    : '—';

  return (
    <MainLayout>
      <PageWrapper>

        {/* Cover */}
        <CoverSection>
          {user.coverImage && <img src={user.coverImage} alt="cover" />}
        </CoverSection>

        <ContentWrapper>

          {/* Header */}
          <ProfileHeader>
            <AvatarWrapper>
              {user.coverImage
                ? <img src={user.coverImage} alt={user.name} />
                : <span>{user.name?.charAt(0)?.toUpperCase()}</span>
              }
            </AvatarWrapper>

            <HeaderActions>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Edit2 size={15} />}
                onClick={() => navigate(PATH.editProfile)}
              >
                {t('profile.editProfile')}
              </Button>
            </HeaderActions>
          </ProfileHeader>

          {/* User Info */}
          <UserInfo>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <UserName>{user.name}</UserName>
              <RoleBadge>{ROLE_MAP[user.role] ?? user.role}</RoleBadge>
            </div>
            <UserEmail>
              <Mail size={14} />
              {user.email}
            </UserEmail>
          </UserInfo>

          {/* Stats */}
          <StatGrid style={{ marginBottom: 24 }}>
            <StatCard>
              <BookOpen size={22} color="#1B4FD8" />
              <StatValue>{enrollments.length}</StatValue>
              <StatLabel>{t('profile.coursesCount')}</StatLabel>
            </StatCard>
            <StatCard>
              <ShoppingCart size={22} color="#1B4FD8" />
              <StatValue>{cartItems.length}</StatValue>
              <StatLabel>{t('nav.cart')}</StatLabel>
            </StatCard>
            <StatCard>
              <Heart size={22} color="#DC2626" />
              <StatValue>{wishlistIds.length}</StatValue>
              <StatLabel>{t('nav.wishlist')}</StatLabel>
            </StatCard>
          </StatGrid>

          <Grid>
            {/* Account Details */}
            <Card>
                <CardTitle>
                  <Mail size={16} color="#1B4FD8" />
                  {t('profile.title')}
                </CardTitle>

                <DetailRow>
                  <DetailLabel>{t('auth.name')}</DetailLabel>
                  <DetailValue>{user.name}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>{t('auth.email')}</DetailLabel>
                  <DetailValue>{user.email}</DetailValue>
                </DetailRow>
              {user.phone && (
                <DetailRow>
                  <DetailLabel>الهاتف</DetailLabel>
                  <DetailValue>{user.phone}</DetailValue>
                </DetailRow>
              )}
              <DetailRow>
                <DetailLabel>الدور</DetailLabel>
                <DetailValue>{ROLE_MAP[user.role] ?? user.role}</DetailValue>
              </DetailRow>
                <DetailRow>
                  <DetailLabel>{t('profile.joinDate')}</DetailLabel>
                  <DetailValue>{joinedDate}</DetailValue>
                </DetailRow>
            </Card>

            {/* Bio + Security */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <Card>
                <CardTitle>نبذة شخصية</CardTitle>
                <BioText>
                  {user.bio || 'لم تُضف نبذة بعد — اضغط على تعديل الملف لإضافة نبذة عن نفسك.'}
                </BioText>
              </Card>

              <Card>
                <CardTitle>{t('auth.changePassword')}</CardTitle>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(PATH.changePassword)}
                >
                  {t('profile.changePassword')}
                </Button>
              </Card>
            </div>
          </Grid>
        </ContentWrapper>
      </PageWrapper>
    </MainLayout>
  );
}