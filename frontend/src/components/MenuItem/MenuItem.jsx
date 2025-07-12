import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

// MUI
import { styled, alpha } from "@mui/material/styles";
import {
  Button,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  FavoriteBorder as FavoriteBorderIcon,
  PersonOutline as PersonOutlineIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  MenuBook as MenuBookIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";

// Context
import { AuthContext } from "../../context/AuthContext";
import { LogOutContext } from "../../context/LogoutContext";
import { AppContext } from "../../context/WishAndCartListContext";
import { Actions } from "../../constant/ACTIONS";

// Paths
import { PATH } from "../../routes";

// Axios
import axios from "axios";

// Config
import { API_URL } from "../../config";

// Toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled menu
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
  const [loading, setLoading] = React.useState(false);
  const open = Boolean(anchorEl);

  const { setIsAuth } = React.useContext(AuthContext);
  const { setIsLogout } = React.useContext(LogOutContext);
  const { dispatch } = React.useContext(AppContext);

  const navigate = useNavigate();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });

      setIsAuth(false);
      localStorage.removeItem("user");

      dispatch({ type: Actions.SetWishList, payload: [] });
      dispatch({ type: Actions.SetCartList, payload: [] });

      setIsLogout(true);
      toast.success("تم تسجيل الخروج بنجاح");
      navigate(PATH.Main);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("فشل تسجيل الخروج، حاول مرة أخرى");
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

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
       sx={(theme) => ({
  backgroundImage: theme.linearGradient || "linear-gradient(135deg, #667eea, #764ba2)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
  fontSize: "14px",
  textTransform: "none",
  px: 1, // paddingLeft & paddingRight
  py: 0, // paddingTop & paddingBottom
  maxWidth: 100,
})}

      >
        {user?.name?.split(" ")[0] || "المستخدم"}
      </Button>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
          list: { "aria-labelledby": "customized-button" },
        }}
      >
        <MenuItem
          component={Link}
          to={`/${PATH.User}/${PATH.UserProfile}`}
          onClick={handleMenuClose}
          disableRipple
        >
          <PersonOutlineIcon />
          الصفحة الشخصية
        </MenuItem>

        <Divider sx={{ my: 0.5, borderColor: "#eee" }} />

        <MenuItem
          component={Link}
          to={`/${PATH.User}/${PATH.MyCourses}`}
          onClick={handleMenuClose}
          disableRipple
        >
          <MenuBookIcon />
          دوراتي
        </MenuItem>

        <MenuItem
          component={Link}
          to={`/${PATH.User}/${PATH.WishList}`}
          onClick={handleMenuClose}
          disableRipple
        >
          <FavoriteBorderIcon />
          المفضلة
        </MenuItem>

        <MenuItem
          component={Link}
          to={`/${PATH.User}/${PATH.CartList}`}
          onClick={handleMenuClose}
          disableRipple
        >
          <ShoppingCartIcon />
          السلة
        </MenuItem>

        <Divider sx={{ my: 0.5, borderColor: "#eee" }} />

        <MenuItem
          onClick={!loading ? handleLogout : undefined}
          disableRipple
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {loading ? (
            <CircularProgress size={20} thickness={5} color="error" />
          ) : (
            <LogoutIcon />
          )}
          {loading ? "جاري تسجيل الخروج..." : "تسجيل خروج"}
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
