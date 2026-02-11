import { useTranslation } from 'react-i18next';
import { Typography, Card, Row, Col } from 'antd';
import { usePortfolio, usePortfolioLocale } from '../../contexts/PortfolioContext';
import '../section.css';

const { Title, Paragraph, Text } = Typography;

interface InfoItem {
  label: string;
  value: string;
  href: string | null;
}

export default function About() {
  const { t } = useTranslation();
  const { portfolio } = usePortfolio();
  const locale = usePortfolioLocale();

  if (!portfolio || !locale) return null;

  const infoItems: InfoItem[] = [
    { label: t('about.email'), value: portfolio.email, href: `mailto:${portfolio.email}` },
    { label: t('about.phone'), value: portfolio.phone, href: `tel:${portfolio.phone}` },
    { label: t('about.address'), value: locale?.profile?.address ?? '', href: null },
    { label: t('about.dob'), value: portfolio.dob, href: null },
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        <Title level={2} className="section-title">
          {t('about.title')}
        </Title>
        <Row gutter={[48, 24]} wrap>
          <Col xs={24} lg={16}>
            <Paragraph type="secondary" style={{ fontSize: '1.05rem', lineHeight: 1.75 }}>
              {locale?.profile?.summary ?? ''}
            </Paragraph>
          </Col>
          <Col xs={24} lg={8}>
            <Card size="small" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              {infoItems.map((item, idx) => (
                <div
                  key={item.label}
                  style={{
                    padding: '12px 0',
                    borderBottom: idx < infoItems.length - 1 ? '1px solid var(--card-border)' : 'none',
                  }}
                >
                  <Text type="secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    {item.label}
                  </Text>
                  <br />
                  {item.href ? (
                    <a href={item.href} style={{ color: 'inherit', fontSize: '0.95rem' }}>
                      {item.value}
                    </a>
                  ) : (
                    <Text style={{ fontSize: '0.95rem' }}>{item.value}</Text>
                  )}
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
}
