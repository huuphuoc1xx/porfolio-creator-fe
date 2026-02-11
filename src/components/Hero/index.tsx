import { useTranslation } from 'react-i18next';
import { Typography, Button, Space } from 'antd';
import { usePortfolioLocale } from '../../contexts/PortfolioContext';

const { Title, Paragraph, Text } = Typography;

export default function Hero() {
  const { t } = useTranslation();
  const locale = usePortfolioLocale();

  if (!locale) return null;

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '96px 24px 64px',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 100% 0%, rgba(139, 92, 246, 0.08), transparent)
          `,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', maxWidth: 680 }} className="hero-content">
        <Text className="hero-greeting" type="secondary" style={{ fontSize: '0.95rem', display: 'block', marginBottom: 8 }}>
          {t('hero.greeting')}
        </Text>
        <Title level={1} style={{ marginBottom: 8, fontWeight: 700, color: 'var(--text)' }}>
          {locale?.profile?.name ?? ''}
        </Title>
        <Text style={{ fontSize: '1.35rem', color: 'var(--accent)', display: 'block', marginBottom: 16 }}>
          {locale?.hero?.title ?? ''}
        </Text>
        <Paragraph className="hero-summary" type="secondary" style={{ fontSize: 16, maxWidth: 560, marginBottom: 32, lineHeight: 1.7 }}>
          {locale?.hero?.summary ?? ''}
        </Paragraph>
        <Space size="middle" wrap>
          <Button type="primary" size="large" href="#contact">
            {t('hero.contact')}
          </Button>
          <Button size="large" href="#experience" className="hero-btn-secondary">
            {t('hero.viewExperience')}
          </Button>
        </Space>
      </div>
    </section>
  );
}
