import { useTranslation } from 'react-i18next';
import { Typography, Card, Row, Col } from 'antd';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { usePortfolio, usePortfolioLocale } from '../../contexts/PortfolioContext';
import '../section.css';

const { Title, Paragraph, Text } = Typography;

export default function Contact() {
  const { t } = useTranslation();
  const { portfolio } = usePortfolio();
  const locale = usePortfolioLocale();

  if (!portfolio || !locale) return null;

  return (
    <section id="contact" className="section">
      <div className="container">
        <Title level={2} className="section-title">
          {t('contact.title')}
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 32, maxWidth: 500 }}>
          {locale?.contact?.intro ?? ''}
        </Paragraph>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card
              hoverable
              style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
              onClick={() => window.open(`mailto:${portfolio.email}`)}
            >
              <MailOutlined style={{ fontSize: 24, marginBottom: 8 }} />
              <Text type="secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                {t('contact.email')}
              </Text>
              <div style={{ fontWeight: 500 }}>{portfolio.email}</div>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card
              hoverable
              style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
              onClick={() => window.open(`tel:${portfolio.phone}`)}
            >
              <PhoneOutlined style={{ fontSize: 24, marginBottom: 8 }} />
              <Text type="secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                {t('contact.phone')}
              </Text>
              <div style={{ fontWeight: 500 }}>{portfolio.phone}</div>
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
}
