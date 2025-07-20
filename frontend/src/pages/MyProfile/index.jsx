"use client";

import { useNavigate } from "react-router-dom";
import {
  AboutText,
  AvatarContainer,
  AvatarImage,
  Container,
  CoverImage,
  DetailContent,
  DetailIcon,
  DetailItem,
  DetailLabel,
  DetailsGrid,
  DetailValue,
  EditButton,
  HeaderSection,
  LastCard,
  MaxWidthContainer,
  Overlay,
  ProfileCard,
  ProfileContent,
  ProfileHeader,
  ProfileInfo,
  ProfileSection,
  RoleBadge,
  SectionCard,
  SectionContent,
  SectionDescription,
  SectionTitle,
  StatBar,
  StatCard,
  StatContent,
  StatIcon,
  StatInfo,
  StatLabel,
  StatsGrid,
  StatValue,
  UserDetails,
  UserEmail,
  UserName,
} from "./style";
import { Avatar } from "@mui/material";

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
