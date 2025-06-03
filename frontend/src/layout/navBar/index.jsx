//react
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

//style
import { Nav } from "./style";

// components/NavBar.jsx
import { LoginAndRegisterButton } from "../../components/loginButtonAndRegister";
import Hamburger from "../../components/humborgar";

//Paths of routers
import { PATH } from "../../routes";

// context 
import { ModalContext } from "../../context/ModalContext";

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setIsOpen } = useContext(ModalContext);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <Nav className="navBar">
      <Hamburger isOpen={menuOpen} toggleMenu={toggleMenu} />
      <ul className={`navBarItems ${menuOpen ? "open" : ""}`}>
        <li><Link to={PATH.Main}>الصفحة الرئيسة</Link></li>
        <li><Link to={PATH.Courses}>الدورات</Link></li>
        <li><Link to={`/${PATH.About}`}>من نحن</Link></li>
        <li><Link to={PATH.Contact}>تواصل معنا</Link></li>
        <li><Link to={PATH.News}>اخر الاخبار</Link></li>
      </ul>

      

      <LoginAndRegisterButton
        onClick={() => setIsOpen(true)}
        color="var(--color-primary)"
        fontSize="18px"
      >
        الانضمام ك معلم
      </LoginAndRegisterButton>
    </Nav>
  );
};
