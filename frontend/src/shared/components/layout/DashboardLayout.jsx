import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import {
  ChevronRight,
  ChevronLeft,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ArrowLeftFromLine,
} from "lucide-react";
import { useThemeMode } from "../../../features/theme/ThemeContext";
import { useLanguage } from "../../hooks/useLanguage";
import { useAuth } from "../../../features/auth";
import { PATH } from "../../../constants";

const SIDEBAR_EXPANDED = 240;
const SIDEBAR_COLLAPSED = 64;

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bgSecondary};
`;

const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  ${({ $isAr }) => ($isAr ? "right: 0;" : "left: 0;")}
  height: 100vh;
  width: ${({ $collapsed }) =>
    $collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED}px;
  background: ${({ theme }) => theme.colors.bgPrimary};
  ${({ $isAr, theme }) =>
    $isAr
      ? `border-left: 1px solid ${theme.colors.border};`
      : `border-right: 1px solid ${theme.colors.border};`} display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width 0.25s ease;
  overflow: hidden;

  @media (max-width: 767px) {
    display: none;
  }
`;

const MobileOverlay = styled.div`
  display: none;
  @media (max-width: 767px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99;
  }
`;

const MobileDrawer = styled.aside`
  display: none;
  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    ${({ $isAr }) => ($isAr ? "right: 0;" : "left: 0;")}
    height: 100vh;
    width: ${SIDEBAR_EXPANDED}px;
    background: ${({ theme }) => theme.colors.bgPrimary};
${({ $isAr, theme }) => $isAr 
  ? `border-left: 1px solid ${theme.colors.border};` 
  : `border-right: 1px solid ${theme.colors.border};`
}    z-index: 100;
    transform: translateX(${({ $isAr, $open }) => ($open ? "0" : $isAr ? "100%" : "-100%")});
    transition: transform 0.25s ease;
  }
`;

const MobileHeader = styled.div`
  display: none;
  @media (max-width: 767px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
    background: ${({ theme }) => theme.colors.bgPrimary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 98;
    height: 56px;
  }
`;

const mainMl = ({ $collapsed, $isAr }) => {
  const w = $collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;
  return $isAr ? `margin-right: ${w}px` : `margin-left: ${w}px`;
};

const MainContent = styled.main`
  flex: 1;
  min-height: 100vh;
  overflow-y: auto;
  transition: margin 0.25s ease;
  ${mainMl};

  @media (max-width: 767px) {
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding-top: 56px;
  }
`;

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "space-between"};
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme, $collapsed }) =>
    $collapsed
      ? `${theme.spacing[3]} ${theme.spacing[3]}`
      : `${theme.spacing[4]} ${theme.spacing[4]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  min-height: ${({ $collapsed }) => ($collapsed ? "auto" : "56px")};
  cursor: pointer;

  img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    flex-shrink: 0;
  }
`;

const ToggleRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  width: 100%;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.bgTertiary};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const LogoText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.accent}
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  overflow: hidden;
`;

const ToggleBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.bgTertiary};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const NavList = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: ${({ theme }) => theme.spacing[3]};
  overflow-y: auto;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme, $collapsed }) => ($collapsed ? 0 : theme.spacing[3])};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]}`};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  font-weight: ${({ $active, theme }) =>
    $active
      ? theme.typography.fontWeight.semibold
      : theme.typography.fontWeight.medium};
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};
  text-align: ${({ $collapsed }) => ($collapsed ? "center" : "right")};
  width: 100%;
  white-space: nowrap;
  transition: all 0.15s;
  position: relative;

  ${({ $active, $isAr, theme }) =>
    $active
      ? css`
          box-shadow: inset ${$isAr ? "-2px" : "2px"} 0 0 0
            ${theme.colors.accent};
        `
      : ""}

  &:hover {
    background: ${({ theme }) => theme.colors.bgTertiary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const NavLabel = styled.span`
  overflow: hidden;
  white-space: nowrap;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  max-width: ${({ $visible }) => ($visible ? "200px" : "0")};
  transition:
    opacity 0.15s,
    max-width 0.15s,
    padding 0.15s;
`;

const BadgeDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.danger};
  margin-right: auto;
  flex-shrink: 0;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => `0 ${theme.spacing[3]}`};
  flex-shrink: 0;
`;

const SideFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};
  gap: ${({ theme, $collapsed }) => ($collapsed ? 0 : theme.spacing[2])};
  padding: ${({ theme }) => theme.spacing[2]};
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.primaryLight};
  box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.bgPrimary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  overflow: hidden;
  white-space: nowrap;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  max-width: ${({ $visible }) => ($visible ? "200px" : "0")};
  transition:
    opacity 0.15s,
    max-width 0.15s,
    padding 0.15s;
`;

const UserName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`;

const UserRole = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};
  gap: ${({ theme, $collapsed }) => ($collapsed ? 0 : theme.spacing[2])};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  text-align: right;
  width: 100%;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.bgTertiary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

const IconLabel = styled.span`
  overflow: hidden;
  white-space: nowrap;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  max-width: ${({ $visible }) => ($visible ? "200px" : "0")};
  transition:
    opacity 0.15s,
    max-width 0.15s,
    padding 0.15s;
`;

const HamburgerBtn = styled.button`
  display: none;
  @media (max-width: 767px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
  }
`;

export default function DashboardLayout({
  navItems,
  activeNav,
  onNavChange,
  children,
}) {
  const navigate = useNavigate();
  const { isAr } = useLanguage();
  const { isDark, toggle } = useThemeMode();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("dashboard-sidebar-collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("dashboard-sidebar-collapsed", collapsed);
  }, [collapsed]);

  const initials = user?.name?.charAt(0)?.toUpperCase() ?? "؟";

  const roleLabel =
    user?.role === "admin"
      ? "مدير"
      : user?.role === "teacher"
        ? "معلم"
        : "مستخدم";

  const renderSidebarContent = (isMobile) => (
    <>
      <LogoWrap
        $collapsed={collapsed}
        onClick={() => {
          navigate(PATH.home);
          if (isMobile) setMobileOpen(false);
        }}
      >
        <img src="/assets/img/logo.png" alt="Tawjihi" />
        <LogoText>توجيهي</LogoText>
        {!isMobile && !collapsed && (
          <ToggleBtn
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(true);
            }}
          >
            {isAr ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </ToggleBtn>
        )}
      </LogoWrap>

      {!isMobile && collapsed && (
        <ToggleRow onClick={() => setCollapsed(false)}>
          {isAr ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </ToggleRow>
      )}

      <NavList>
        {navItems.map((item) => (
          <NavItem
            key={item.key}
            $active={activeNav === item.key}
            $collapsed={collapsed}
            $isAr={isAr}
            onClick={() => {
              onNavChange(item.key);
              if (isMobile) setMobileOpen(false);
            }}
          >
            <item.icon />
            <NavLabel $visible={!collapsed || isMobile}>{item.label}</NavLabel>
            {item.badge != null && item.badge > 0 && !collapsed && <BadgeDot />}
          </NavItem>
        ))}
      </NavList>

      <Divider />

      <SideFooter>
        <UserRow $collapsed={collapsed}>
          <UserAvatar>
            {user?.coverImage ? <img src={user.coverImage} alt="" /> : initials}
          </UserAvatar>
          <UserInfo $visible={!collapsed || isMobile}>
            <UserName>{user?.name || ""}</UserName>
            <UserRole>{roleLabel}</UserRole>
          </UserInfo>
        </UserRow>

        <IconBtn $collapsed={collapsed} onClick={toggle}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <IconLabel $visible={!collapsed || isMobile}>
            {isDark ? "وضع فاتح" : "وضع داكن"}
          </IconLabel>
        </IconBtn>

        <IconBtn $collapsed={collapsed} onClick={() => navigate(PATH.home)}>
          <ArrowLeftFromLine size={18} />
          <IconLabel $visible={!collapsed || isMobile}>العودة للموقع</IconLabel>
        </IconBtn>

        <IconBtn
          $collapsed={collapsed}
          onClick={() => {
            logout();
            navigate(PATH.home);
          }}
          style={{ color: "#DC2626" }}
        >
          <LogOut size={18} />
          <IconLabel $visible={!collapsed || isMobile}>تسجيل خروج</IconLabel>
        </IconBtn>
      </SideFooter>
    </>
  );

  return (
    <Layout>
      {/* Desktop sidebar */}
      <Sidebar $collapsed={collapsed} $isAr={isAr}>
        {renderSidebarContent(false)}
      </Sidebar>

      {/* Mobile drawer */}
      {mobileOpen && <MobileOverlay onClick={() => setMobileOpen(false)} />}
      <MobileDrawer $open={mobileOpen} $isAr={isAr}>
        {renderSidebarContent(true)}
      </MobileDrawer>

      {/* Mobile header */}
      <MobileHeader>
        <HamburgerBtn onClick={() => setMobileOpen((p) => !p)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </HamburgerBtn>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src="/assets/img/logo.png"
            alt="Tawjihi"
            style={{ width: 28, height: 28, objectFit: "contain" }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: 15,
              background:
                "linear-gradient(135deg, var(--primary, #0B6B8A), var(--accent, #C8893A))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            توجيهي
          </span>
        </div>
        <HamburgerBtn
          as="button"
          onClick={toggle}
          style={{ border: "none", width: 36, height: 36 }}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </HamburgerBtn>
      </MobileHeader>

      <MainContent $collapsed={collapsed} $isAr={isAr}>
        {children}
      </MainContent>
    </Layout>
  );
}
