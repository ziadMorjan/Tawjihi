//react
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

//MUI Library
import { styled, alpha } from "@mui/material/styles";
import { Button, Menu, MenuItem, Divider } from "@mui/material";
import {
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  PersonOutline as PersonOutlineIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

//context
import { AuthContext } from "../../context/AuthContext";
import { LogOutContext } from "../../context/LogoutContext";

//Paths
import { PATH } from "../../routes";

//axios
import axios from "axios";

//URL
import { API_URL } from "../../config";

// Styled dropdown menu
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 8,
    marginTop: theme.spacing(1),
    minWidth: 200,
    backgroundColor: "#fff",
    color: "#333",
    boxShadow: "0px 1px 5px rgba(0,0,0,0.1), 0px 4px 10px rgba(0,0,0,0.15)",
    "& .MuiMenu-list": {
      padding: "6px 0",
    },
    "& .MuiMenuItem-root": {
      fontSize: 14,
      padding: "8px 16px",
      "& .MuiSvgIcon-root": {
        fontSize: 20,
        color: "#666",
        marginRight: theme.spacing(1.5),
      },
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    },
  },
}));

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { setIsAuth } = React.useContext(AuthContext);
  const { setIsLogout } = React.useContext(LogOutContext);

  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //logout function request
  const handleLogout = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, {
        withCredentials: true,
      }); //withCredentials to cookies
      setIsAuth(false);
      localStorage.removeItem("user");
      navigate(PATH.Main);
      setIsLogout(true);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      handleMenuClose();
    }
  };

  //check user if exist
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  return (
    <div>
      <Button
        id="customized-button"
        aria-controls={open ? "customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="text"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: "var(--color-link)",
          fontSize: "16px",
          textTransform: "none",
          p: 0,
          minWidth: "100%",
        }}
      >
        {String(user?.name).split(" ")[0]}{" "}
      </Button>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
          list: {
            "aria-labelledby": "customized-button",
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} disableRipple>
          <PersonOutlineIcon />
          الصفحة الشخصية
        </MenuItem>

        <Divider sx={{ my: 0.5, borderColor: "#eee" }} />

        <MenuItem onClick={handleMenuClose} disableRipple>
          <MenuBookIcon />
          دوراتي
        </MenuItem>

        <MenuItem onClick={handleMenuClose} disableRipple>
          <FavoriteBorderIcon />
          <Link to={`/${PATH.Wishlist}`}>
          
          المفضلة
          </Link>
        </MenuItem>

        <MenuItem onClick={handleMenuClose} disableRipple>
          <ShoppingCartOutlinedIcon />
          السلة
        </MenuItem>

        <Divider sx={{ my: 0.5, borderColor: "#eee" }} />

        <MenuItem onClick={handleLogout} disableRipple>
          <LogoutIcon />
          تسجيل خروج
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
