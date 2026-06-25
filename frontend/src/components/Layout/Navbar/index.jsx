import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATH } from '../../../constants';
import {
  ShoppingCart, Heart, BookOpen, User,
  LogOut, Settings, Moon, Sun, Languages,
  X,
  Search,
} from 'lucide-react';
import { useThemeMode } from '../../../features/theme/ThemeContext';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useSearch } from '../../../features/search/useSearch';

import {
  NavWrapper, NavInner, Logo, NavLinks, NavLink,
  NavActions, CartBtn, CartCount, UserAvatar,
  DropdownWrapper, DropdownMenu, DropdownHeader,
  DropdownName, DropdownEmail, DropdownItem, DropdownDivider,
  SearchWrap, SearchInputWrap, SearchInput, ClearBtn, SearchDropdown,
  DropSection, DropSectionTitle, DropResult, DropResultImg,
  DropResultInfo, DropResultName, DropResultSub, DropViewAll, SearchSpinner
  
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
  const { isDark, toggle } = useThemeMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { isAr, toggleLanguage: handleToggleLanguage, t } = useLanguage();


  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  const debouncedSearch = useDebounce(searchQuery, 400);
  const { courses, teachers, isLoading, hasResults } = useSearch(debouncedSearch, { limit: 5 });

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
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
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

    const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`${PATH.search}?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchDropdown(false);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearchDropdown(false);
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

        {/* ── Search Bar ── */}
        <SearchWrap ref={searchRef}>
          <SearchInputWrap $focused={searchFocused}>
            <Search size={18} />
            <SearchInput
              type="text"
              placeholder={t('nav.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => {
                setSearchFocused(true);
                setShowSearchDropdown(true);
              }}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
            />
            {isLoading && <SearchSpinner />}
            {searchQuery && !isLoading && (
              <ClearBtn onClick={handleClearSearch} type="button" aria-label="مسح البحث">
                <X size={14} />
              </ClearBtn>
            )}
          </SearchInputWrap>

          {showSearchDropdown && debouncedSearch && (
            <SearchDropdown>
              {isLoading && (
                <div style={{ padding: '16px', textAlign: 'center', color: '#888' }}>
                  {t('nav.searching')}
                </div>
              )}

              {!isLoading && !hasResults && (
                <div style={{ padding: '16px', textAlign: 'center', color: '#888' }}>
                  {t('nav.noResults')} "{debouncedSearch}"
                </div>
              )}

              {!isLoading && hasResults && (
                <>
                  {courses.length > 0 && (
                    <DropSection>
                      <DropSectionTitle>{t('courses.title')}</DropSectionTitle>
                      {courses.slice(0, 3).map((course) => (
                        <DropResult
                          key={course._id}
                          onClick={() => {
                            navigate(PATH.courseDetails(course._id));
                            setShowSearchDropdown(false);
                          }}
                        >
                          <DropResultImg>
                            {course.coverImage ? (
                              <img src={course.coverImage} alt={course.title} />
                            ) : (
                              <BookOpen size={16} />
                            )}
                          </DropResultImg>
                          <DropResultInfo>
                            <DropResultName>{course.title}</DropResultName>
                            <DropResultSub>{course.teacher?.name || 'معلم توجيهي'}</DropResultSub>
                          </DropResultInfo>
                        </DropResult>
                      ))}
                    </DropSection>
                  )}

                  {teachers.length > 0 && (
                    <DropSection>
                      <DropSectionTitle>{t('teachers.title')}</DropSectionTitle>
                      {teachers.slice(0, 3).map((teacher) => (
                        <DropResult
                          key={teacher._id}
                          onClick={() => {
                            navigate(PATH.teacherProfile(teacher._id));
                            setShowSearchDropdown(false);
                          }}
                        >
                          <DropResultImg $round>
                            {teacher.coverImage ? (
                              <img src={teacher.coverImage} alt={teacher.name} />
                            ) : (
                              <span>{teacher.name?.charAt(0).toUpperCase()}</span>
                            )}
                          </DropResultImg>
                          <DropResultInfo>
                            <DropResultName>{teacher.name}</DropResultName>
                            <DropResultSub>{t('teachers.certified')}</DropResultSub>
                          </DropResultInfo>
                        </DropResult>
                      ))}
                    </DropSection>
                  )}

                  <DropViewAll onClick={handleSearchSubmit}>
                    {t('nav.viewAll')} ({courses.length + teachers.length})
                  </DropViewAll>
                </>
              )}
            </SearchDropdown>
          )}
        </SearchWrap>

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