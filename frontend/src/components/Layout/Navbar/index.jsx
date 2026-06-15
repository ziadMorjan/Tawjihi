import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, Heart, BookOpen, User,
  LogOut, Settings, ChevronDown,
} from 'lucide-react';

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
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCourseActions();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const links = [
    { label: 'الرئيسية',  path: '/'         },
    { label: 'الكورسات',  path: '/courses'  },
    { label: 'المعلمون',  path: '/teachers' },
  ];

  // أضف "كورساتي" لو مسجل دخول
  if (isAuthenticated) {
    links.push({ label: 'كورساتي', path: '/user/my-courses' });
  }

  const initials = user?.name?.charAt(0)?.toUpperCase() ?? '؟';

  // إغلاق الـ dropdown عند الضغط خارجه
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
    navigate('/');
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const handleNavClick = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  const ROLE_MAP = { user: 'طالب', teacher: 'معلم', admin: 'مدير' };

  return (
    <NavWrapper>
      <NavInner>

        <Logo onClick={() => navigate('/')}>
          <img src="/assets/img/logo.png" alt="Tawjihi" />
          <span>توجيهي</span>
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
          {isAuthenticated ? (
            <>
              {/* Cart */}
              <CartBtn onClick={() => navigate('/cart')} aria-label="السلة">
                <ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <CartCount>{cartItems.length}</CartCount>
                )}
              </CartBtn>

              {/* User Avatar + Dropdown */}
              <DropdownWrapper ref={dropdownRef}>
                <UserAvatar
                  onClick={() => setDropdownOpen(p => !p)}
                  aria-label="قائمة المستخدم"
                >
                  {user?.coverImage
                    ? <img src={user.coverImage} alt={user.name} />
                    : initials
                  }
                </UserAvatar>

                {dropdownOpen && (
                  <DropdownMenu>
                    {/* Header */}
                    <DropdownHeader>
                      <DropdownName>{user?.name}</DropdownName>
                      <DropdownEmail>
                        {ROLE_MAP[user?.role] ?? user?.role}
                      </DropdownEmail>
                    </DropdownHeader>

                    {/* Links */}
                    <DropdownItem onClick={() => handleNavClick('/user/profile')}>
                      <User size={16} />
                      الملف الشخصي
                    </DropdownItem>

                    <DropdownItem onClick={() => handleNavClick('/user/my-courses')}>
                      <BookOpen size={16} />
                      كورساتي
                    </DropdownItem>

                    <DropdownItem onClick={() => handleNavClick('/wishlist')}>
                      <Heart size={16} />
                      المفضلة
                    </DropdownItem>

                    <DropdownItem onClick={() => handleNavClick('/cart')}>
                      <ShoppingCart size={16} />
                      السلة
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

                    <DropdownItem onClick={() => handleNavClick('/user/edit-profile')}>
                      <Settings size={16} />
                      الإعدادات
                    </DropdownItem>

                    <DropdownDivider />

                    <DropdownItem $danger onClick={handleLogout}>
                      <LogOut size={16} />
                      تسجيل الخروج
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
                onClick={() => navigate('/auth/login')}
              >
                تسجيل الدخول
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/auth/register')}
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