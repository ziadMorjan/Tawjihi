//style
import { WrapperNav } from "../../styles/style";


import Brightness4Icon from '@mui/icons-material/Brightness4';


//components
import { Logo } from "../logo";
import { LoginAndRegisterButton } from "../loginButtonAndRegister";
import { Link } from "react-router-dom";
import { PATH } from "../../routes";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

import CustomizedMenus from "../MenuItem/MneuItem";
import { ThemeContext } from "../../context/ThemeContext";


import IconButton from '@mui/material/IconButton';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';


export const LogoAndButton = () => {

  //check if user is auth
    const { isAuth ,setIsAuth } = useContext(AuthContext);
    let user = localStorage.getItem("user");
    useEffect(() => {
      if (user) {
        setIsAuth(true);
      }
    }, []);

    const {toggleTheme,theme } =useContext(ThemeContext)

  return (
    <div>
      <WrapperNav>
        <Logo />

        <div style={{display:'flex' ,alignItems:'center',justifyContent:'center'}}>
    <IconButton
      sx={{ color: 'var(--color-dark-bg)' }}
      onClick={toggleTheme}
      aria-label="toggle theme"
    >
      {theme.mode === 'dark' ? <WbSunnyIcon /> : <NightsStayIcon />}
    </IconButton>
        {isAuth ? (
          <LoginAndRegisterButton>
            <CustomizedMenus />
          </LoginAndRegisterButton>
        ) : (
          <LoginAndRegisterButton>
            <Link to={`/${PATH.Auth}`}>التسجيل وتسجيل الدخول </Link>
          </LoginAndRegisterButton>
        )}
        </div>
      </WrapperNav>
    </div>
  );
};
