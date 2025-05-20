//style
import { WrapperNav } from "../../styles/style";

//components
import { Logo } from "../logo";
import { LoginAndRegisterButton } from "../loginButtonAndRegister";

export const LogoAndButton = () => {
  return (
    <div>
      <WrapperNav>
        <Logo />
        <LoginAndRegisterButton>التسجيل / تسجيل الدخول</LoginAndRegisterButton>
      </WrapperNav>
    </div>
  );
};
