//react
import * as React from "react";

//MUI Components
import { styled, alpha } from "@mui/material/styles";
import { Button, Menu, MenuItem, } from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";

import UpdateIcon from '@mui/icons-material/Update';
import HistoryIcon from '@mui/icons-material/History';

import { H3 } from "../typography";
import { Pargraph } from "../typography/style";
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

export default function FilterMenuItem() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        width: "100%",
        margin: "10px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row-reverse",
      }}
    >
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
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "8px 16px",
          }}
        >
          ترتيب باستخدام
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
            <UpdateIcon  />
            الاحدث{" "}
          </MenuItem>

          <MenuItem onClick={handleMenuClose} disableRipple>
            <HistoryIcon  />
            الاقدم{" "}
          </MenuItem>
        </StyledMenu>
      </div>

      <Pargraph>عرض الصفحات رقم 1 من 10</Pargraph>
      <H3 color="var(--color-link)">ترتيب باستخدام</H3>
    </div>
  );
}
