// src/shared/components/Layout/Navbar/index.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../../../features/auth";
import { useCourseActions } from "../../../features/courses/hooks/useCourseActions";
import { Button } from "../../../shared/components/Button";
import {
  NavWrapper,
  NavInner,
  Logo,
  NavLinks,
  NavLink,
  NavActions,
  CartBtn,
  CartCount,
  UserAvatar,
} from "./Navbar.styles";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCourseActions();

  const links = [
    { label: "الرئيسية", path: "/" },
    { label: "الكورسات", path: "/courses" },
    { label: "المعلمون", path: "/teachers" },
  ];

  // أول حرف من الاسم للـ avatar
  const initials = user?.name?.charAt(0) ?? "؟";

  return (
    <NavWrapper>
      <NavInner>
        <Logo onClick={() => navigate("/")}>
          <img src="/assets/img/logo.png" alt="Tawjihi" />
          <span>توجيهي</span>
        </Logo>

        <NavLinks>
          {links.map((link) => (
            <NavLink
              key={link.path}
              onClick={() => navigate(link.path)}
              className={location.pathname === link.path ? "active" : ""}
            >
              {link.label}
            </NavLink>
          ))}
                        {isAuthenticated && (
                <NavLink
                  onClick={() => navigate("/user/my-courses")}
                  className={
                    location.pathname === "/user/my-courses" ? "active" : ""
                  }
                >
                  كورساتي
                </NavLink>
              )}
        </NavLinks>

        <NavActions>
          {isAuthenticated ? (
            <>
              <CartBtn onClick={() => navigate("/cart")} aria-label="السلة">
                <ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <CartCount>{cartItems.length}</CartCount>
                )}
              </CartBtn>


              <UserAvatar onClick={() => navigate("/profile")}>
                {user?.img ? <img src={user.img} alt={user.name} /> : initials}
              </UserAvatar>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth/login")}
              >
                تسجيل الدخول
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/auth/register")}
              >
                إنشاء حساب
              </Button>
            </>
          )}
        </NavActions>
      </NavInner>
    </NavWrapper>
  );
}
