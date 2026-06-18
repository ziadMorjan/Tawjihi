import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../constants';
import { Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { MainLayout }  from '../../shared/components/layout/MainLayout';
import { useTeachers } from '../../features/teachers';
import { Pagination }  from '../../features/courses/components/Pagination';
import {
  PageWrapper, PageHeader, PageTitle, PageSubtitle,
  TeachersGrid, TeacherCard, TeacherAvatar, TeacherName,
  TeacherDesc, TeacherStats, StatItem, StatValue, StatLabel,
  EmptyState,
  SkeletonCard, SkeletonAvatar, SkeletonLine, SkeletonStats, SkeletonStatItem,
} from './Teachers.styles';

const LIMIT = 12;

function TeacherCardSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonAvatar />
      <SkeletonLine height="18px" width="60%" />
      <SkeletonLine height="13px" width="85%" />
      <SkeletonLine height="13px" width="70%" />
      <SkeletonStats>
        <SkeletonStatItem>
          <SkeletonLine height="16px" width="40px" />
          <SkeletonLine height="11px" width="32px" />
        </SkeletonStatItem>
        <SkeletonStatItem>
          <SkeletonLine height="16px" width="40px" />
          <SkeletonLine height="11px" width="32px" />
        </SkeletonStatItem>
      </SkeletonStats>
    </SkeletonCard>
  );
}

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export default function Teachers() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTeachers({ page, limit: LIMIT });

  const teachers   = data?.teachers   ?? [];
  const pagination = data?.pagination ?? null;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.totalResults ?? teachers.length;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainLayout>
      <PageWrapper>
        <PageHeader>
          <PageTitle>معلمونا</PageTitle>
          <PageSubtitle>
            تعرّف على نخبة من أفضل معلمي التوجيهي في فلسطين
          </PageSubtitle>
          {!isLoading && totalItems > 0 && (
            <p style={{ marginTop: 8, fontSize: '0.875rem', color: 'var(--text-muted, #94A3B8)' }}>
              {totalItems} معلم متاح
            </p>
          )}
        </PageHeader>

        {isLoading ? (
          <TeachersGrid>
            {Array.from({ length: LIMIT }).map((_, i) => (
              <TeacherCardSkeleton key={i} />
            ))}
          </TeachersGrid>
        ) : teachers.length === 0 ? (
          <EmptyState>
            <Users size={64} />
            <p style={{ fontSize: 16 }}>لا يوجد معلمون متاحون حالياً</p>
          </EmptyState>
        ) : (
          <>
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              key={page}   /* إعادة تشغيل الأنيميشن عند تغيير الصفحة */
            >
              <TeachersGrid>
                {teachers.map((teacher) => (
                  <motion.div key={teacher._id} variants={fadeUp}>
                    <TeacherCard
                      onClick={() => navigate(PATH.teacherProfile(teacher._id))}
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
                  </motion.div>
                ))}
              </TeachersGrid>
            </motion.div>

            {/* ── Pagination ── */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </PageWrapper>
    </MainLayout>
  );
}