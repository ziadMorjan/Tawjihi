import * as React from "react";

// MUI
import { styled, alpha } from "@mui/material/styles";
import { Button, Menu, MenuItem, Divider } from "@mui/material";
import {
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  PersonOutline as PersonOutlineIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Cookie,
} from "@mui/icons-material";
import { convertToObj } from "../../utils/convertToObject";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { PATH } from "../../routes";

import axios from "axios";

import { API_URL } from "../../config";

// Styled Menu
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

  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  let user = localStorage.getItem("user");
  if (user) {
    user = convertToObj(user);
  }

  const handleClose = async () => {
    localStorage.removeItem("user");
    await axios.get(`${API_URL}/auth/logout`, {
      withCredentials: true,
    });
    setIsAuth(false);
    navigate(`${PATH.Main}`);
  };

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
          color: "var(--color-primary)",
          fontSize: "16px",
          textTransform: "none",
          p: 0,
          minWidth: "100%",
        }}
      >
        {user ? user.name : "زائر"}
      </Button>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        open={open}
        slotProps={{
          list: {
            "aria-labelledby": "customized-button",
          },
        }}
      >
        <MenuItem disableRipple>
          <PersonOutlineIcon />
          الصفحة الشخصية
        </MenuItem>

        <Divider sx={{ my: 0.5, borderColor: "#eee" }} />

        <MenuItem disableRipple>
          <FavoriteBorderIcon />
          المفضلة
        </MenuItem>

        <MenuItem disableRipple>
          <ShoppingCartOutlinedIcon />
          السلة
        </MenuItem>

        <Divider sx={{ my: 0.5, borderColor: "#eee" }} />

        <MenuItem onClick={handleClose} disableRipple>
          <LogoutIcon />
          تسجيل خروج
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
