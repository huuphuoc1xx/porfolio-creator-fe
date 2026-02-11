import { useTranslation } from 'react-i18next';
import { Typography, Card } from 'antd';
import { usePortfolioLocale } from '../../contexts/PortfolioContext';
import '../section.css';

const { Title, Text } = Typography;

export default function Education() {
  const { t } = useTranslation();
  const locale = usePortfolioLocale();

  if (!locale) return null;

  const education = locale?.education;
  if (!education) return null;

  return (
    <section id="education" className="section">
      <div className="container">
        <Title level={2} className="section-title">
          {t('education.title')}
        </Title>
        <Card
          style={{ maxWidth: 480, background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <Title level={4} style={{ marginBottom: 8 }}>
            {education?.school ?? ''}
          </Title>
          <Text style={{ color: 'var(--accent)', display: 'block', marginBottom: 8 }}>{education?.major ?? ''}</Text>
          <Text type="secondary" style={{ display: 'block' }}>
            {education?.period ?? ''}
          </Text>
          <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
            {education?.gpa ?? ''}
          </Text>
        </Card>
      </div>
    </section>
  );
}
