import { useEffect } from 'react';
import { ConfigProvider, Layout, theme, Spin, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useParams, Outlet, useLocation } from 'react-router-dom';
const PORTFOLIO_HEADER_HEIGHT = 112; // 64 (navbar) + 48 (section bar)
const DEFAULT_HEADER_HEIGHT = 64;
import { ThemeProvider, useTheme, Theme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { PortfolioProvider, usePortfolio } from './contexts/PortfolioContext';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import EditPage from './pages/Edit';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';

const { Footer, Content } = Layout;

/** Wraps app with antd theme so Navbar/Footer and all pages use same theme. */
function ThemedApp({ children }: { children: React.ReactNode }) {
  const { theme: themeMode } = useTheme();
  const isDark = themeMode === Theme.Dark;
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? '#818cf8' : '#6366f1',
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          colorText: isDark ? '#f4f4f5' : '#1a1a1a',
          colorTextHeading: isDark ? '#f4f4f5' : '#1a1a1a',
          colorTextSecondary: isDark ? '#b8b8c4' : '#4b5563',
          colorTextTertiary: isDark ? '#9ca3af' : '#6b7280',
        },
        components: {
          Button: {
            defaultColor: isDark ? '#e4e4e7' : '#1a1a1a',
            defaultBorderColor: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.22)',
            defaultBg: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
          },
          Card: {
            colorBorderSecondary: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

/** Layout that always shows Header (Navbar) and Footer on every page (login, edit, portfolio). */
function AppLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const year = new Date().getFullYear();
  const isPortfolio = location.pathname.startsWith('/p/');
  const contentPaddingTop = isPortfolio ? PORTFOLIO_HEADER_HEIGHT : DEFAULT_HEADER_HEIGHT;
  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Navbar />
      <Content style={{ flex: 1, paddingTop: contentPaddingTop }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center', borderTop: '1px solid var(--header-border)', padding: '16px 24px' }}>
        <div className="footer-text">
          <div>{t('footer', { year })}</div>
          <div style={{ marginTop: 4, fontSize: '0.875rem', opacity: 0.85 }}>{t('login.creator')}</div>
        </div>
      </Footer>
    </Layout>
  );
}

const SECTION_IDS = ['hero', 'about', 'skills', 'experience', 'education', 'contact'];

function AppContent() {
  const { t } = useTranslation();
  const location = useLocation();
  const { portfolio, loading, error } = usePortfolio();

  useEffect(() => {
    if (!portfolio || !location.hash) return;
    const id = location.hash.slice(1);
    if (SECTION_IDS.includes(id)) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [portfolio, location.hash]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" tip={t('loading')} />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div style={{ padding: 48, maxWidth: 560, margin: '0 auto' }}>
        <Alert type="error" showIcon message={t('error')} description={error?.message} />
      </div>
    );
  }

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Contact />
    </>
  );
}

function PortfolioBySlug() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <PortfolioProvider slug={slug ?? undefined}>
      <AppContent />
    </PortfolioProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedApp>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/edit" element={<EditPage />} />
              <Route path="/p/:slug" element={<PortfolioBySlug />} />
            </Route>
          </Routes>
        </ThemedApp>
      </AuthProvider>
    </ThemeProvider>
  );
}
