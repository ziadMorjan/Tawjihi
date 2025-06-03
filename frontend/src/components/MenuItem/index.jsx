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
} from "@mui/icons-material";

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
        مرحبا علي
      </Button>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "customized-button",
          },
        }}
      >
        <MenuItem onClick={handleClose} disableRipple>
          <PersonOutlineIcon />
          الصفحة الشخصية
        </MenuItem>

        <Divider sx={{ my: 0.5, borderColor: "#eee" }} />

        <MenuItem onClick={handleClose} disableRipple>
          <FavoriteBorderIcon />
          المفضلة
        </MenuItem>

        <MenuItem onClick={handleClose} disableRipple>
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
