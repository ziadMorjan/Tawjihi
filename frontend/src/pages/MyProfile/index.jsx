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
    name: "John Doe",
    email: "johndoe@example.com",
    bio: "No bio yet.",
    role: "Student",
    profileImage:
      "https://th.bing.com/th/id/OIP.x2wDWv8Y8uPFo00LXaOGxAHaHa?w=199&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    joinedAt: "2024",
  };

  const { name, email, bio, role, profileImage, joinedAt } = dataUser;

  const accountDetails = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    { label: "Role", value: role || "Student" },
    { label: "Member Since", value: joinedAt || "2024" },
  ];

  const coursesStats = [
    { label: "Enrolled", value: "4 Courses" },
    { label: "Completed", value: "2 Courses" },
    { label: "Wishlist", value: "3 Courses" },
    { label: "Reviews Given", value: "5 Reviews" },
  ];

  return (
    <TeacherProfileWrapper>
      <LogoAndButton />
      <NavBar />

      {/* Profile Header */}
      <section className="img-sec">
        <Containers>
          <img src={profileImage} alt={`${name} profile`} />
          <div>
            <H2>{name}</H2>
            <Pargrahph>{email}</Pargrahph>
            <Pargrahph>{role}</Pargrahph>
            <EditButton
              onClick={() => navigate(`/${PATH.User}/${PATH.EditProfile}`)}
              aria-label="Edit Profile"
            >
              Edit Profile
            </EditButton>
          </div>
        </Containers>
      </section>

      <hr />

      {/* About Section */}
      <section className="about-sec">
        <Containers>
          <H3>About</H3>
          <Pargrahph>
            {bio ||
              "This user hasn’t added a bio yet. You can describe your interests, profession or learning goals here."}
          </Pargrahph>
        </Containers>
      </section>

      <hr />

      {/* Account Details Section */}
      <section>
        <Containers>
          <H3>Account Details</H3>
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

      {/* My Courses Section */}
      <section>
        <Containers>
          <H3>My Courses</H3>
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
