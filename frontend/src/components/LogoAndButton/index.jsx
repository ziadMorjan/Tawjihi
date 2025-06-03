//style
import { WrapperNav } from "../../styles/style";

//components
import { Logo } from "../logo";
import { LoginAndRegisterButton } from "../loginButtonAndRegister";
import { Link } from "react-router-dom";
import { PATH } from "../../routes";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import CustomizedMenus from "../../components/MenuItem";
export const LogoAndButton = () => {
  const { isAuth } = useContext(AuthContext);
  return (
    <div>
      <WrapperNav>
        <Logo />

        {isAuth ? (
          <LoginAndRegisterButton>
            <CustomizedMenus />
          </LoginAndRegisterButton>
        ) : (
          <LoginAndRegisterButton>
            <Link to={`/${PATH.Auth}`}>التسجيل وتسجيل الدخول </Link>
          </LoginAndRegisterButton>
        )}
      </WrapperNav>
    </div>
  );
};
