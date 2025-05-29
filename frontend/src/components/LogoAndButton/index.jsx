//style
import { WrapperNav } from "../../styles/style";

//components
import { Logo } from "../logo";
import { LoginAndRegisterButton } from "../loginButtonAndRegister";
import { Link } from "react-router-dom";
import { PATH } from "../../routes";

export const LogoAndButton = () => {
  return (
    <div>
      <WrapperNav>
        <Logo />
        <LoginAndRegisterButton>
            <Link to={`/${PATH.Auth}`}>التسجيل وتسجيل الدخول </Link>
        
          
          </LoginAndRegisterButton>
      </WrapperNav>
    </div>
  );
};
