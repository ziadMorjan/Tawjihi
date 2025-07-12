//react
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

//style
import { Nav } from "./style";

// components
import { LoginAndRegisterButton } from "../../components/loginButtonAndRegister";
import Hamburger from "../../components/humborgar";

//Paths
import { PATH } from "../../routes";

// context
import { ModalContext } from "../../context/ModalContext";
import { AuthContext } from "../../context/AuthContext";
import { lightTheme } from "../../global/Theme";
import { ThemeContext } from "../../context/ThemeContext";

export const NavBar = () => {
  const {theme} = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setIsOpen } = useContext(ModalContext);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const { setIsAuth } = useContext(AuthContext);
  let user = localStorage.getItem("user");
  useEffect(() => {
    if (user) {
      setIsAuth(true);
    }
  }, []);

  return (
    <Nav className="navBar">
      <Hamburger isOpen={menuOpen} toggleMenu={toggleMenu} />
      <ul className={`navBarItems ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to={PATH.Main}>الصفحة الرئيسة</Link>
        </li>
        <li>
          <Link to={`/${PATH.Courses}`}>الدورات</Link>
        </li>
        <li>
          <Link to={`/${PATH.About}`}>من نحن</Link>
        </li>
        <li>
          <Link to={PATH.Contact}>تواصل معنا</Link>
        </li>
        <li>
          <Link to={PATH.News}>اخر الاخبار</Link>
        </li>
      </ul>

      <LoginAndRegisterButton
        onClick={() => setIsOpen(true)}
        color={`${theme.linearGradient}`}
        fontSize="18px"
      >
        الانضمام ك معلم
      </LoginAndRegisterButton>
    </Nav>
  );
};
