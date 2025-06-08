//style
import { WrapperNav } from "../../styles/style";

//components
import { Logo } from "../logo";
import { LoginAndRegisterButton } from "../loginButtonAndRegister";
import { Link } from "react-router-dom";
import { PATH } from "../../routes";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

import CustomizedMenus from "../MenuItem/MneuItem";
export const LogoAndButton = () => {

  //check if user is auth
    const { isAuth ,setIsAuth } = useContext(AuthContext);
    let user = localStorage.getItem("user");
    useEffect(() => {
      if (user) {
        setIsAuth(true);
      }
    }, []);

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
