import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import styled from 'styled-components';
import { MainLayout } from '../../shared/components/layout/MainLayout';
import { Button, Badge } from '../../shared/components';
import { CourseCard } from '../../features/courses/components/CourseCard';
import { CourseCardSkeleton } from '../../features/courses/components/CourseCard/CourseCardSkeleton';
import { useWishlist } from '../../features/wishlist';

const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};
  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[4]}`};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[20]} ${theme.spacing[6]}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  svg { color: ${({ theme }) => theme.colors.textMuted}; }
`;

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlistIds, courses, isLoading, isCoursesSuccess } = useWishlist();

  // تحديد ما إذا كانت القائمة فارغة بعد انتهاء التحميل
  const isEmpty = wishlistIds.length === 0 || (isCoursesSuccess && courses.length === 0);

  return (
    <MainLayout>
      <PageWrapper>
        {/* الهيدر يعرض دائماً طالما الصفحة ليست فارغة */}
        {!isEmpty && (
          <Header>
            <PageTitle>
              <Heart size={28} color="#DC2626" fill="#DC2626" />
              المفضلة
              {!isLoading && <Badge variant="danger">{courses.length}</Badge>}
            </PageTitle>

            <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
              تصفح المزيد
            </Button>
          </Header>
        )}

        {/* دمج منطق عرض المحتوى في مكان واحد */}
        {isLoading ? (
          <Grid>
            {Array.from({ length: wishlistIds.length || 3 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </Grid>
        ) : isEmpty ? (
          <EmptyState>
            <Heart size={64} />
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0F172A' }}>
              قائمة المفضلة فارغة
            </h2>
            <p style={{ color: '#475569' }}>أضف كورسات للمفضلة لتجدها هنا بسهولة</p>
            <Button onClick={() => navigate('/courses')}>تصفح الكورسات</Button>
          </EmptyState>
        ) : (
          <Grid>
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </Grid>
        )}
      </PageWrapper>
    </MainLayout>
  );
}