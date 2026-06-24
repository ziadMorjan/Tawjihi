import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PATH } from '../../../constants';
import {
  ShoppingCart, Heart, BookOpen, User,
  LogOut, Settings, Moon, Sun, Languages,
} from 'lucide-react';
import { useThemeMode } from '../../../features/theme/ThemeContext';

import {
  NavWrapper, NavInner, Logo, NavLinks, NavLink,
  NavActions, CartBtn, CartCount, UserAvatar,
  DropdownWrapper, DropdownMenu, DropdownHeader,
  DropdownName, DropdownEmail, DropdownItem, DropdownDivider,
} from './Navbar.styles';
import { useAuth } from '../../../features/auth';
import { useCourseActions } from '../../../features/courses/hooks/useCourseActions';
import {Button} from "../../../shared/components/Button";
import { toast } from 'react-toastify';
export function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCourseActions();
  const { isDark, toggle } = useThemeMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const lang = i18n.resolvedLanguage ?? i18n.language;
  const isAr = lang === 'ar' || lang.startsWith('ar');

  const handleToggleLanguage = () => {
    const next = isAr ? 'en' : 'ar';
    i18n.changeLanguage(next);
  };

  const links = [
    { label: t('nav.home'),     path: PATH.home     },
    { label: t('nav.courses'),  path: PATH.courses  },
    { label: t('nav.teachers'), path: PATH.teachers },
  ];

  if (isAuthenticated) {
    links.push({ label: t('nav.myCourses'), path: PATH.myCourses });
  }

  const initials = user?.name?.charAt(0)?.toUpperCase() ?? '؟';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate(PATH.home);
    toast.success(t('auth.logoutSuccess'));
  };

  const handleNavClick = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  const ROLE_MAP = {
    user:    t('roles.user'),
    teacher: t('roles.teacher'),
    admin:   t('roles.admin'),
  };

  return (
    <NavWrapper>
      <NavInner>

        <Logo onClick={() => navigate(PATH.home)}>
          <img src="/assets/img/logo.png" alt="Tawjihi" />
          <span>{t('nav.logoText')}</span>
        </Logo>

        <NavLinks>
          {links.map(link => (
            <NavLink
              key={link.path}
              onClick={() => navigate(link.path)}
              className={location.pathname === link.path ? 'active' : ''}
            >
              {link.label}
            </NavLink>
          ))}
        </NavLinks>

        <NavActions>
          <CartBtn onClick={toggle} aria-label={isDark ? t('nav.lightMode') : t('nav.darkMode')} title={isDark ? t('nav.lightMode') : t('nav.darkMode')}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </CartBtn>

          <CartBtn onClick={handleToggleLanguage} aria-label="toggle language" title={isAr ? 'Switch to English' : 'التبديل للعربية'}>
            <Languages size={18} />
          </CartBtn>

          {isAuthenticated ? (
            <>
              <CartBtn onClick={() => navigate(PATH.cart)} aria-label={t('nav.cart')}>
                <ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <CartCount>{cartItems.length}</CartCount>
                )}
              </CartBtn>

              <DropdownWrapper ref={dropdownRef}>
                <UserAvatar
                  onClick={() => setDropdownOpen(p => !p)}
                  aria-label={t('nav.userMenu')}
                >
                  {user?.coverImage
                    ? <img src={user.coverImage} alt={user.name} />
                    : initials
                  }
                </UserAvatar>

                {dropdownOpen && (
                  <DropdownMenu>
                    <DropdownHeader>
                      <DropdownName>{user?.name}</DropdownName>
                      <DropdownEmail>
                        {ROLE_MAP[user?.role] ?? user?.role}
                      </DropdownEmail>
                    </DropdownHeader>

                    <DropdownItem onClick={() => handleNavClick(PATH.profile)}>
                      <User size={16} />
                      {t('nav.profile')}
                    </DropdownItem>

                    <DropdownItem onClick={() => handleNavClick(PATH.myCourses)}>
                      <BookOpen size={16} />
                      {t('nav.myCourses')}
                    </DropdownItem>

                    <DropdownItem onClick={() => handleNavClick(PATH.wishlist)}>
                      <Heart size={16} />
                      {t('nav.wishlist')}
                    </DropdownItem>

                    <DropdownItem onClick={() => handleNavClick(PATH.cart)}>
                      <ShoppingCart size={16} />
                      {t('nav.cart')}
                      {cartItems.length > 0 && (
                        <span style={{
                          marginRight: 'auto',
                          background: '#1B4FD8',
                          color: 'white',
                          borderRadius: 999,
                          fontSize: 11,
                          padding: '1px 7px',
                          fontWeight: 600,
                        }}>
                          {cartItems.length}
                        </span>
                      )}
                    </DropdownItem>

                    <DropdownItem onClick={() => handleNavClick(PATH.editProfile)}>
                      <Settings size={16} />
                      {t('nav.settings')}
                    </DropdownItem>

                    <DropdownDivider />

                    <DropdownItem $danger onClick={handleLogout}>
                      <LogOut size={16} />
                      {t('nav.logout')}
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </DropdownWrapper>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(PATH.login)}
              >
                {t('nav.login')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(PATH.register)}
              >
                {t('nav.register')}
              </Button>
            </>
          )}
        </NavActions>

      </NavInner>
    </NavWrapper>
  );
}