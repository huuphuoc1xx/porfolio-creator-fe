import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, message } from 'antd';
import { useTheme, Theme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { ConfigProvider, theme } from 'antd';
function LogoIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="40" height="40" rx="10" fill="currentColor" fillOpacity="0.12" />
      <path d="M12 14h16v2H12v-2zm0 5h16v2H12v-2zm0 5h10v2H12v-2z" fill="currentColor" fillOpacity="0.9" />
      <path d="M14 10h2v4h-2v-4zm10 0h2v4h-2v-4z" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme: themeMode } = useTheme();
  const { login, register } = useAuth();
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const isDark = themeMode === Theme.Dark;

  const onFinish = async (values: { email: string; password: string }) => {
    setError(null);
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(values.email, values.password);
        message.success(t('login.successRegistered'));
      } else {
        await login(values.email, values.password);
        message.success(t('login.successLoggedIn'));
      }
      navigate('/', { replace: true });
    } catch (e) {
      const err = e as { body?: { message?: string | string[] } };
      const m = err?.body?.message;
      const msg = Array.isArray(m) ? m[0] : m ?? (e instanceof Error ? e.message : t('login.failed'));
      setError(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? '#818cf8' : '#6366f1',
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          colorText: isDark ? '#f4f4f5' : '#1a1a1a',
          colorTextHeading: isDark ? '#f4f4f5' : '#1a1a1a',
        },
      }}
    >
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          position: 'relative',
          background: 'var(--page-bg)',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, textDecoration: 'none', color: 'var(--accent)' }}>
          <LogoIcon />
          <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{t('login.logoText')}</span>
        </Link>
        <Card
          title={isRegister ? t('login.registerTitle') : t('login.title')}
          style={{ maxWidth: 400, width: '100%' }}
        >
          {error && (
            <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />
          )}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              label={t('login.email')}
              rules={[{ required: true, message: t('login.emailRequired') }]}
            >
              <Input type="email" placeholder="you@example.com" autoComplete="email" />
            </Form.Item>
            <Form.Item
              name="password"
              label={t('login.password')}
              rules={[{ required: true, message: t('login.passwordRequired') }]}
            >
              <Input.Password placeholder="••••••••" autoComplete={isRegister ? 'new-password' : 'current-password'} />
            </Form.Item>
            {isRegister && (
              <Form.Item
                name="confirmPassword"
                label={t('login.confirmPassword')}
                dependencies={['password']}
                rules={[
                  { required: true, message: t('login.confirmPasswordRequired') },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) return Promise.resolve();
                      return Promise.reject(new Error(t('login.passwordMismatch')));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="••••••••" autoComplete="new-password" />
              </Form.Item>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting} block>
                {isRegister ? t('login.registerSubmit') : t('login.submit')}
              </Button>
            </Form.Item>
          </Form>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--colorPrimary)', cursor: 'pointer' }}
            >
              {isRegister ? t('login.hasAccount') : t('login.noAccount')}
            </button>
          </div>
        </Card>
        <p style={{ marginTop: 24, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {t('login.creator')}
        </p>
      </div>
    </ConfigProvider>
  );
}
