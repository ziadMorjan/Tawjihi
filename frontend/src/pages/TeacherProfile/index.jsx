"use client";

import { useParams } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import { API_URL } from "../../config";
import { useProfileApi } from "../../hooks/useProfileApi";
import { LogoAndButton } from "../../components/LogoAndButton";
import { NavBar } from "../../layout/navBar";
import { Containers } from "../../components/Container";
import { useApi } from "../../hooks/useApi";
import { Card, CourseCard } from "../../components/card/courseCard";
import { CardSkeleton } from "../../components/Loading/LoadingCard";
import { Typography } from "@mui/material";
import Paginations from "../../components/paginations";
import FilterMenuItem from "../../components/MenuItem/FilterMenuItem";
import { paginate } from "../../utils/pagination";

// Styled Components
const TeacherProfileWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(120, 119, 198, 0.3) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(255, 119, 198, 0.3) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 40%,
        rgba(120, 219, 255, 0.2) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroSection = styled.section`
  position: relative;
  padding: 4rem 0 2rem;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &.img-sec {
    margin-bottom: 0;
  }
`;

const ProfileHeroCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  padding: 3rem;
  margin: 2rem 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  }

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 1.5rem;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: right;
    align-items: center;
  }
`;

const ProfileImageContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const ProfileImage = styled.img`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 8px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2),
      0 0 0 8px rgba(255, 255, 255, 0.2);
  }

  @media (min-width: 768px) {
    width: 12rem;
    height: 12rem;
  }
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  &::after {
    content: "✓";
    color: white;
    font-weight: bold;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TeacherName = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ContactCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1),
    rgba(118, 75, 162, 0.1)
  );
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.15),
      rgba(118, 75, 162, 0.15)
    );
  }
`;

const ContactIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
`;

const ContactText = styled.div`
  color: #374151;
  font-weight: 500;
  font-size: 0.95rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1.5rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.7)
  );
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
`;

const StatNumber = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const SectionContainer = styled.section`
  margin: 3rem 0;
`;

const SectionCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  padding: 2rem 3rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05),
    rgba(118, 75, 162, 0.05)
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem 2rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SectionIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
`;

const SectionContent = styled.div`
  padding: 2rem 3rem;

  @media (max-width: 768px) {
    padding: 1.5rem 2rem;
  }

  &.about-sec {
    background: linear-gradient(
      135deg,
      rgba(248, 250, 252, 0.5),
      rgba(241, 245, 249, 0.5)
    );
  }
`;

const AboutText = styled.p`
  color: #374151;
  line-height: 1.8;
  font-size: 1.125rem;
  margin: 0 0 2rem 0;
  text-align: justify;
`;

const ModernDownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  text-decoration: none;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);

    &::before {
      left: 100%;
    }
  }
`;

const CoursesSection = styled.div`
  position: relative;
`;

const FilterSection = styled.div`
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.6)
  );
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const CourseCardWrapper = styled.div`
  transform: translateY(0);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }
`;

const LoadingGrid = styled(CoursesGrid)`
  .skeleton-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1.5rem;
    overflow: hidden;
    animation: shimmer 2s infinite;

    @keyframes shimmer {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
      100% {
        opacity: 1;
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
`;

const EmptyText = styled.p`
  font-size: 1.25rem;
  margin: 0;
  font-weight: 500;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #ef4444;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  margin: 2rem 0;
`;

function TeacherProfile() {
  const { id } = useParams();
  const { data, isLoading, error } = useProfileApi(`${API_URL}/users/${id}`);
  const profileData = data.doc;

  const {
    data: fetchedCourses = [],
    coursesIsLoading,
    coursesError,
  } = useApi(`${API_URL}/courses/`);

  const teacherCourses = fetchedCourses.filter(
    (course) => course?.teacher._id === id
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Use paginate util
  const { currentItems, totalPages } = paginate(
    teacherCourses,
    currentPage,
    itemsPerPage
  );

  return (
    <TeacherProfileWrapper>
      <ContentWrapper>
        <LogoAndButton />
        <NavBar />

        {/* Hero Section */}
        <HeroSection className="img-sec">
          <Containers>
            <ProfileHeroCard>
              <ProfileHeader>
                <ProfileImageContainer>
                  <ProfileImage
                    src="https://th.bing.com/th/id/OIP.x2wDWv8Y8uPFo00LXaOGxAHaHa?w=199&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                    alt={`صورة ${profileData?.name}`}
                  />
                  <OnlineIndicator />
                </ProfileImageContainer>

                <ProfileInfo>
                  <TeacherName>{profileData?.name}</TeacherName>

                  <ContactGrid>
                    <ContactCard>
                      <ContactIcon>✉️</ContactIcon>
                      <ContactText>{profileData?.email}</ContactText>
                    </ContactCard>
                    <ContactCard>
                      <ContactIcon>📱</ContactIcon>
                      <ContactText>{profileData?.phone}</ContactText>
                    </ContactCard>
                  </ContactGrid>

                  <StatsContainer>
                    <StatCard>
                      <StatNumber>{teacherCourses.length}</StatNumber>
                      <StatLabel>الدورات</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatNumber>4.8</StatNumber>
                      <StatLabel>التقييم</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatNumber>1,250</StatNumber>
                      <StatLabel>الطلاب</StatLabel>
                    </StatCard>
                  </StatsContainer>
                </ProfileInfo>
              </ProfileHeader>
            </ProfileHeroCard>
          </Containers>
        </HeroSection>

        <Divider />

        {/* About Section */}
        <SectionContainer>
          <Containers>
            <SectionCard>
              <SectionHeader>
                <SectionTitle>
                  <SectionIcon>👨‍🏫</SectionIcon>
                  نبذة عن المدرس
                </SectionTitle>
              </SectionHeader>
              <SectionContent className="about-sec">
                <AboutText>
                  {profileData?.description || "لا توجد نبذة متاحة حاليًا."}
                </AboutText>
                {profileData?.cv && (
                  <ModernDownloadButton
                    href={profileData.cv}
                    download={`${profileData.name}_CV.pdf`}
                  >
                    <span>📄</span>
                    تحميل السيرة الذاتية
                  </ModernDownloadButton>
                )}
              </SectionContent>
            </SectionCard>
          </Containers>
        </SectionContainer>

        <Divider />

        {/* Courses Section */}
        <SectionContainer>
          <Containers>
            <SectionCard>
              <SectionHeader>
                <SectionTitle>
                  <SectionIcon>📚</SectionIcon>
                  الدورات ({teacherCourses.length})
                </SectionTitle>
              </SectionHeader>
              <SectionContent>
                <CoursesSection>
                  {teacherCourses.length ? (
                    <FilterSection>
                      <FilterMenuItem
                        currentPage={currentPage}
                        totalPages={totalPages}
                        order={false}
                      />
                    </FilterSection>
                  ) : null}

                  {isLoading ? (
                    <LoadingGrid>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="skeleton-card">
                          <CardSkeleton />
                        </div>
                      ))}
                    </LoadingGrid>
                  ) : error ? (
                    <ErrorState>
                      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                        ❌
                      </div>
                      <Typography color="error">
                        فشل في تحميل الدورات
                      </Typography>
                    </ErrorState>
                  ) : teacherCourses.length === 0 ? (
                    <EmptyState>
                      <EmptyIcon>📚</EmptyIcon>
                      <EmptyText>لا توجد دورات متاحة حاليًا.</EmptyText>
                    </EmptyState>
                  ) : (
                    <CoursesGrid>
                      {currentItems.map((item) => (
                        <CourseCardWrapper key={item._id}>
                          <CourseCard
                            item={item}
                            id={item._id}
                            imgSrc={item.img || "/assets/img/logo.png"}
                            name={item.name}
                            starIcon={item.averageRating}
                            price={item.price}
                            priceAfterDiscount={item.priceAfterDiscount}
                            teacherName={item.teacher?.name}
                            teacherImg={
                              item.teacher?.img || "/assets/img/logo.png"
                            }
                            branch={item.branches
                              .map((b) => b.name)
                              .join(" | ")}
                            subject={item.subject?.name}
                          />
                        </CourseCardWrapper>
                      ))}
                    </CoursesGrid>
                  )}

                  {totalPages > 1 && (
                    <PaginationWrapper>
                      <Paginations
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                      />
                    </PaginationWrapper>
                  )}
                </CoursesSection>
              </SectionContent>
            </SectionCard>
          </Containers>
        </SectionContainer>
      </ContentWrapper>
    </TeacherProfileWrapper>
  );
}

export default TeacherProfile;
