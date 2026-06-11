import { useNavigate } from 'react-router-dom';
import { Users, Star } from 'lucide-react';
import { MainLayout }  from '../../shared/components/layout/MainLayout';
import {  Spinner } from '../../shared/components';
import { useTeachers } from '../../features/teachers';
import {
  PageWrapper, PageHeader, PageTitle, PageSubtitle,
  TeachersGrid, TeacherCard, TeacherAvatar, TeacherName,
  TeacherDesc, TeacherStats, StatItem, StatValue, StatLabel,
  EmptyState,
} from './Teachers.styles';

export default function Teachers() {
  const navigate = useNavigate();
  const { data, isLoading } = useTeachers();
  const teachers = data?.teachers ?? [];

  return (
    <MainLayout>
      <PageWrapper>
        <PageHeader>
          <PageTitle>معلمونا</PageTitle>
          <PageSubtitle>
            تعرّف على نخبة من أفضل معلمي التوجيهي في فلسطين
          </PageSubtitle>
        </PageHeader>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <Spinner size="lg" />
          </div>
        ) : teachers.length === 0 ? (
          <EmptyState>
            <Users size={64} />
            <p style={{ fontSize: 16, color: '#475569' }}>
              لا يوجد معلمون متاحون حالياً
            </p>
          </EmptyState>
        ) : (
          <TeachersGrid>
            {teachers.map(teacher => (
              <TeacherCard
                key={teacher._id}
                onClick={() => navigate(`/teachers/${teacher._id}`)}
              >
                <TeacherAvatar>
                  {teacher.coverImage
                    ? <img src={teacher.coverImage} alt={teacher.name} />
                    : <span>{teacher.name?.charAt(0)?.toUpperCase()}</span>
                  }
                </TeacherAvatar>

                <TeacherName>{teacher.name}</TeacherName>

                {teacher.description && (
                  <TeacherDesc>{teacher.description}</TeacherDesc>
                )}

                <TeacherStats>
                  {teacher.averageRating > 0 && (
                    <StatItem>
                      <StatValue style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={14} fill="#F59E0B" color="#F59E0B" />
                        {teacher.averageRating?.toFixed(1)}
                      </StatValue>
                      <StatLabel>التقييم</StatLabel>
                    </StatItem>
                  )}
                  {teacher.reviewsQuantity > 0 && (
                    <StatItem>
                      <StatValue>{teacher.reviewsQuantity}</StatValue>
                      <StatLabel>تقييم</StatLabel>
                    </StatItem>
                  )}
                </TeacherStats>
              </TeacherCard>
            ))}
          </TeachersGrid>
        )}
      </PageWrapper>
    </MainLayout>
  );
}