import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Typography, Button, Space } from 'antd';
import { DEFAULT_SLUG } from '../../contexts/PortfolioContext';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        textAlign: 'center',
      }}
    >
      <Title level={1} style={{ marginBottom: 16, color: 'var(--text)', fontWeight: 700 }}>
        {t('home.welcome')}
      </Title>
      <Paragraph style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: 480, marginBottom: 32 }}>
        {t('home.subtitle')}
      </Paragraph>
      <Space size="middle" wrap>
        <Link to={`/p/${DEFAULT_SLUG}`}>
          <Button type="default" size="large">
            {t('home.viewSample')}
          </Button>
        </Link>
        {!isAuthenticated && (
          <Link to="/login">
            <Button type="primary" size="large">
              {t('home.getStarted')}
            </Button>
          </Link>
        )}
        {isAuthenticated && (
          <Link to="/edit">
            <Button type="primary" size="large">
              {t('edit.edit')}
            </Button>
          </Link>
        )}
      </Space>
    </div>
  );
}
