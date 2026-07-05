import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Layout,
  Sidebar,
  MobileOverlay,
  MobileDrawer,
  MobileHeader,
  MainContent,
  LogoWrap,
  ToggleRow,
  LogoText,
  ToggleBtn,
  NavList,
  NavItem,
  NavLabel,
  BadgeDot,
  Divider,
  SideFooter,
  UserRow,
  UserAvatar,
  UserInfo,
  UserName,
  UserRole,
  IconBtn,
  IconLabel,
  HamburgerBtn,
} from "./DashboardLayout.styles";

export default function DashboardLayout({
  navItems,
  activeNav,
  onNavChange,
  children,
}) {
  const navigate = useNavigate();
  const { isAr, t } = useLanguage();
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

  const initials = user?.name?.charAt(0)?.toUpperCase() ?? t('dashboardLayout.unknownInitial');

  const roleLabel = user?.role
    ? t(`dashboardLayout.roles.${user.role}`)
    : t('dashboardLayout.roles.user');

  const renderSidebarContent = (isMobile) => (
    <>
      <LogoWrap
        $collapsed={collapsed}
        onClick={() => {
          navigate(PATH.home);
          if (isMobile) setMobileOpen(false);
        }}
      >
        <img src="/assets/img/logo.png" alt={t('common.brandName')} />
        <LogoText>{t('common.brandName')}</LogoText>
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
            {t(isDark ? 'dashboardLayout.darkMode' : 'dashboardLayout.lightMode')}
          </IconLabel>
        </IconBtn>

        <IconBtn $collapsed={collapsed} onClick={() => navigate(PATH.home)}>
          <ArrowLeftFromLine size={18} />
          <IconLabel $visible={!collapsed || isMobile}>{t('dashboardLayout.backToSite')}</IconLabel>
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
          <IconLabel $visible={!collapsed || isMobile}>{t('dashboardLayout.logout')}</IconLabel>
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
            alt={t('common.brandName')}
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
            {t('common.brandName')}
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
