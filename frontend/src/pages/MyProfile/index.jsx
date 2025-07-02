import { useNavigate } from "react-router-dom";
import { LogoAndButton } from "../../components/LogoAndButton";
import { NavBar } from "../../layout/navBar";
import { Containers } from "../../components/Container";
import { H2, H3, Pargrahph } from "../../components/typography";
import { TeacherProfileWrapper, StatsGrid, EditButton } from "./style";
import { PATH } from "../../routes";

function UserProfile() {
  const navigate = useNavigate();

  const dataUser = JSON.parse(localStorage.getItem("user")) || {
    name: "جون دو",
    email: "johndoe@example.com",
    bio: "لا يوجد نبذة حتى الآن.",
    role: "طالب",
    profileImage:
      "https://th.bing.com/th/id/OIP.x2wDWv8Y8uPFo00LXaOGxAHaHa?w=199&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    joinedAt: "2024",
  };

  const { name, email, bio, role, profileImage, joinedAt } = dataUser;

  const accountDetails = [
    { label: "الاسم", value: name },
    { label: "البريد الإلكتروني", value: email },
    { label: "الدور", value: role || "طالب" },
    { label: "عضو منذ", value: joinedAt || "2024" },
  ];

  const coursesStats = [
    { label: "الدورات المسجَّل بها", value: "٤ دورات" },
    { label: "الدورات المكتملة", value: "٢ دورة" },
    { label: "المفضلة", value: "٣ دورات" },
    { label: "المراجعات المُضافة", value: "٥ مراجعات" },
  ];

  return (
    <TeacherProfileWrapper>
      <LogoAndButton />
      <NavBar />

      {/* رأس الملف الشخصي */}
      <section className="img-sec">
        <Containers>
          <img src={dataUser.coverImage} alt={`صورة ${name}`} />
          <div>
            <H2>{name}</H2>
            <Pargrahph>{email}</Pargrahph>
            <Pargrahph>{role}</Pargrahph>
            <EditButton
              onClick={() => navigate(`/${PATH.User}/${PATH.EditProfile}`)}
              aria-label="تعديل الملف الشخصي"
            >
              تعديل الملف الشخصي
            </EditButton>
          </div>
        </Containers>
      </section>

      <hr />

      {/* نبذة عن المستخدم */}
      <section className="about-sec">
        <Containers>
          <H3>نبذة</H3>
          <Pargrahph>
            {bio ||
              "لم يقم هذا المستخدم بإضافة نبذة حتى الآن. يمكنك هنا كتابة اهتماماتك أو أهدافك التعليمية أو مهنتك."}
          </Pargrahph>
        </Containers>
      </section>

      <hr />

      {/* تفاصيل الحساب */}
      <section>
        <Containers>
          <H3>تفاصيل الحساب</H3>
          <StatsGrid>
            {accountDetails.map(({ label, value }) => (
              <div key={label}>
                <strong>{label}:</strong>
                <span>{value}</span>
              </div>
            ))}
          </StatsGrid>
        </Containers>
      </section>

      <hr />

      {/* دوراتي */}
      <section>
        <Containers>
          <H3>دوراتي</H3>
          <StatsGrid>
            {coursesStats.map(({ label, value }) => (
              <div key={label}>
                <strong>{label}:</strong>
                <span>{value}</span>
              </div>
            ))}
          </StatsGrid>
        </Containers>
      </section>

      <hr />
    </TeacherProfileWrapper>
  );
}

export default UserProfile;
