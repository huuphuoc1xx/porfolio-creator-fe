import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Layout, Button, Menu, Dropdown, Switch } from 'antd';
import { MenuOutlined, SunOutlined, MoonOutlined, SettingOutlined, EditOutlined, LogoutOutlined, ProfileOutlined, GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Locale } from '../../config/i18n';
import { useTheme, Theme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { DEFAULT_SLUG } from '../../contexts/PortfolioContext';
import * as api from '../../services/api';
import './Navbar.css';

const { Header } = Layout;
const linkIds = ['hero', 'about', 'skills', 'experience', 'education', 'contact'] as const;

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { slug: paramSlug } = useParams<{ slug?: string }>();
  const [open, setOpen] = useState(false);
  const [mySlug, setMySlug] = useState<string | null>(null);
  const isDark = theme === Theme.Dark;
  const isVi = i18n.language.startsWith('vi') || i18n.language === 'vn';
  const isPortfolioPage = location.pathname.startsWith('/p/') && paramSlug;

  useEffect(() => {
    if (!isAuthenticated) {
      setMySlug(null);
      return;
    }
    api.getMePortfolio().then((p) => setMySlug(p?.slug ?? null)).catch(() => setMySlug(null));
  }, [isAuthenticated]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
    }
    setOpen(false);
  };

  const onNavClick = (id: string) => {
    if (isPortfolioPage) {
      scrollTo(id);
    } else {
      navigate(`/p/${DEFAULT_SLUG}#${id}`);
    }
  };

  const menuItems: MenuProps['items'] = linkIds.map((id) => ({
    key: id,
    label: t(id === 'hero' ? 'nav.home' : `nav.${id}`),
    onClick: () => onNavClick(id),
  }));

  return (
    <>
      {/* Thanh 1: Logo + Settings (luôn hiển thị) */}
      <Header
        className="navbar-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 64,
          background: 'var(--header-bg)',
          backdropFilter: 'blur(12px)',
          borderBottom: isPortfolioPage ? 'none' : '1px solid var(--header-border)',
        }}
      >
        <Link
          to="/"
          style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--accent)', textDecoration: 'none' }}
        >
          NHP
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isAuthenticated ? (
          <>
            <Button
              type="text"
              size="middle"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              title={isDark ? t('login.themeLight') : t('login.themeDark')}
              style={{ color: 'var(--text-muted)' }}
            />
            <Button
              type="text"
              size="middle"
              icon={<GlobalOutlined />}
              onClick={() => i18n.changeLanguage(isVi ? Locale.En : Locale.Vi)}
              title={isVi ? t('nav.languageVi') : t('nav.languageEn')}
              style={{ color: 'var(--text-muted)', minWidth: 48 }}
            >
              {isVi ? 'VI' : 'EN'}
            </Button>
            <Link to="/login" style={{ marginLeft: 8 }}>
              <Button type="primary" size="small">
                {t('nav.login')}
              </Button>
            </Link>
          </>
        ) : (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'theme',
                  icon: isDark ? <MoonOutlined /> : <SunOutlined />,
                  label: (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minWidth: 140 }}
                    >
                      <span>{isDark ? t('login.themeDark') : t('login.themeLight')}</span>
                      <Switch checked={isDark} onChange={toggleTheme} size="small" />
                    </div>
                  ),
                },
                {
                  key: 'language',
                  icon: <GlobalOutlined />,
                  label: (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minWidth: 140 }}
                    >
                      <span>{isVi ? t('nav.languageVi') : t('nav.languageEn')}</span>
                      <Switch
                        checked={isVi}
                        onChange={(checked) => i18n.changeLanguage(checked ? Locale.Vi : Locale.En)}
                        size="small"
                        checkedChildren="VI"
                        unCheckedChildren="EN"
                      />
                    </div>
                  ),
                },
                { type: 'divider' as const },
                ...(mySlug
                  ? [{
                      key: 'portfolio',
                      icon: <ProfileOutlined />,
                      label: <Link to={`/p/${mySlug}`}>{t('edit.myPortfolio')}</Link>,
                    }]
                  : []),
                {
                  key: 'edit',
                  icon: <EditOutlined />,
                  label: <Link to="/edit">{t('edit.edit')}</Link>,
                },
                { type: 'divider' as const },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: t('nav.logout'),
                  danger: true,
                  onClick: logout,
                },
              ],
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="default" size="small" icon={<SettingOutlined />} style={{ marginLeft: 8 }}>
              {t('nav.settings')}
            </Button>
          </Dropdown>
          )}
        </div>
      </Header>

      {/* Thanh 2: Home, About, ... (chỉ trên trang portfolio) */}
      {isPortfolioPage && (
        <div
          className="navbar-section-bar"
          style={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            zIndex: 1000,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 24px',
            background: 'var(--header-bg)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--header-border)',
          }}
        >
          <div className="nav-menu-desktop" style={{ width: '100%', maxWidth: 600 }}>
            <Menu
              mode="horizontal"
              selectedKeys={[]}
              items={menuItems}
              className="nav-menu"
              style={{
                border: 'none',
                background: 'transparent',
                lineHeight: '48px',
                justifyContent: 'center',
              }}
            />
          </div>
          <div className="nav-menu-mobile" style={{ display: 'none' }}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setOpen(!open)}
              style={{ color: 'var(--text-muted)' }}
            />
            {open && (
              <Menu
                mode="vertical"
                selectedKeys={[]}
                items={menuItems}
                className="nav-menu-mobile-dropdown"
                style={{
                  position: 'absolute',
                  top: 48,
                  left: 0,
                  right: 0,
                  zIndex: 1001,
                  background: 'var(--header-bg)',
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
