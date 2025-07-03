"use client";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const HeaderSection = styled.div`
  position: relative;
  height: 12rem;
  background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%);
  overflow: hidden;

  @media (min-width: 768px) {
    height: 16rem;
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.2;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
`;

const ProfileSection = styled.div`
  position: relative;
  padding: 0 1rem;
  margin-top: -4rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const MaxWidthContainer = styled.div`
  max-width: 56rem;
  margin: 0 auto;
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
`;

const ProfileContent = styled.div`
  padding: 1.5rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const UserDetails = styled.div``;

const UserName = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0f172a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.875rem;
  }
`;

const UserEmail = styled.p`
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.25rem 0;
`;

const RoleBadge = styled.span`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: #f1f5f9;
  color: #475569;
  font-size: 0.875rem;
  border-radius: 9999px;
  font-weight: 500;
`;

const EditButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: linear-gradient(90deg, #1d4ed8 0%, #7c3aed 100%);
    transform: translateY(-1px);
  }
`;

const SectionCard = styled.div`
  margin-top: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #0f172a;
  margin: 0 0 1rem 0;
`;

const SectionDescription = styled.p`
  color: #64748b;
  margin: 0 0 1.5rem 0;
`;

const AboutText = styled.p`
  color: #374151;
  line-height: 1.625;
  margin: 0;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f8fafc;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const DetailIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
`;

const DetailContent = styled.div``;

const DetailLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
`;

const DetailValue = styled.p`
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const StatContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatInfo = styled.div``;

const StatLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin: 0 0 0.25rem 0;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0f172a;
  margin: 0;
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${(props) => props.color}1a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StatBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0.25rem;
  background-color: ${(props) => props.color};
`;

const LastCard = styled(SectionCard)`
  margin-bottom: 2rem;
`;

function UserProfile() {
  const navigate = useNavigate();

  // Keeping the original logic for getting user data
  const dataUser = JSON.parse(localStorage.getItem("user") || "{}") || {
    name: "جون دو",
    email: "johndoe@example.com",
    bio: "لا يوجد نبذة حتى الآن.",
    role: "طالب",
    profileImage:
      "https://th.bing.com/th/id/OIP.x2wDWv8Y8uPFo00LXaOGxAHaHa?w=199&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    joinedAt: "2024",
    coverImage: "/placeholder.svg?height=200&width=800",
  };

  const { name, email, bio, role, profileImage, joinedAt, coverImage } =
    dataUser;

  // Keeping the original account details logic
  const accountDetails = [
    { label: "الاسم", value: name, icon: "👤" },
    { label: "البريد الإلكتروني", value: email, icon: "✉️" },
    { label: "الدور", value: role || "طالب", icon: "🎓" },
    { label: "عضو منذ", value: joinedAt || "2024", icon: "📅" },
  ];

  // Keeping the original courses stats logic
  const coursesStats = [
    {
      label: "الدورات المسجَّل بها",
      value: "٤ دورات",
      icon: "📚",
      color: "#3b82f6",
    },
    {
      label: "الدورات المكتملة",
      value: "٢ دورة",
      icon: "🏆",
      color: "#10b981",
    },
    { label: "المفضلة", value: "٣ دورات", icon: "⭐", color: "#f59e0b" },
    {
      label: "المراجعات المُضافة",
      value: "٥ مراجعات",
      icon: "💬",
      color: "#8b5cf6",
    },
  ];

  const handleEditProfile = () => {
    // Keeping the original navigation logic with React Router
    navigate("/user/edit-profile");
  };

  return (
    <Container>
      {/* Header with cover image */}
      <HeaderSection>
        <CoverImage
          src={coverImage || "/placeholder.svg"}
          alt={`صورة ${name}`}
        />
        <Overlay />
      </HeaderSection>

      {/* Profile section */}
      <ProfileSection>
        <MaxWidthContainer>
          {/* Profile Card */}
          <ProfileCard>
            <ProfileContent>
              <ProfileHeader>
                {/* Avatar */}
                <AvatarContainer>
                  <Avatar>
                    {profileImage ? (
                      <AvatarImage
                        src={profileImage || "/placeholder.svg"}
                        alt={name}
                      />
                    ) : (
                      name.charAt(0)
                    )}
                  </Avatar>
                </AvatarContainer>

                <ProfileInfo>
                  <UserDetails>
                    <UserName>{name}</UserName>
                    <UserEmail>
                      <span>✉️</span>
                      {email}
                    </UserEmail>
                    <RoleBadge>{role}</RoleBadge>
                  </UserDetails>

                  <EditButton onClick={handleEditProfile}>
                    <span>✏️</span>
                    تعديل الملف الشخصي
                  </EditButton>
                </ProfileInfo>
              </ProfileHeader>
            </ProfileContent>
          </ProfileCard>

          {/* About section */}
          <SectionCard>
            <SectionContent>
              <SectionTitle>نبذة</SectionTitle>
              <AboutText>
                {bio ||
                  "لم يقم هذا المستخدم بإضافة نبذة حتى الآن. يمكنك هنا كتابة اهتماماتك أو أهدافك التعليمية أو مهنتك."}
              </AboutText>
            </SectionContent>
          </SectionCard>

          {/* Account details */}
          <SectionCard>
            <SectionContent>
              <SectionTitle>تفاصيل الحساب</SectionTitle>
              <SectionDescription>معلومات حسابك الأساسية</SectionDescription>

              <DetailsGrid>
                {accountDetails.map(({ label, value, icon }) => (
                  <DetailItem key={label}>
                    <DetailIcon>{icon}</DetailIcon>
                    <DetailContent>
                      <DetailLabel>{label}</DetailLabel>
                      <DetailValue>{value}</DetailValue>
                    </DetailContent>
                  </DetailItem>
                ))}
              </DetailsGrid>
            </SectionContent>
          </SectionCard>

          {/* Courses statistics */}
          <LastCard>
            <SectionContent>
              <SectionTitle>دوراتي</SectionTitle>
              <SectionDescription>إحصائيات دوراتك التعليمية</SectionDescription>

              <StatsGrid>
                {coursesStats.map(({ label, value, icon, color }) => (
                  <StatCard key={label}>
                    <StatContent>
                      <StatInfo>
                        <StatLabel>{label}</StatLabel>
                        <StatValue>{value}</StatValue>
                      </StatInfo>
                      <StatIcon color={color}>{icon}</StatIcon>
                    </StatContent>
                    <StatBar color={color} />
                  </StatCard>
                ))}
              </StatsGrid>
            </SectionContent>
          </LastCard>
        </MaxWidthContainer>
      </ProfileSection>
    </Container>
  );
}

export default UserProfile;
