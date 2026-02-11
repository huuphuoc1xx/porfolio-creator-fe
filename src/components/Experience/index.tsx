import { useTranslation } from 'react-i18next';
import { Typography, Timeline, Card, Space, Tag } from 'antd';
import type { TimelineItemProps } from 'antd';
import type { ExperienceItem as ExpItem } from '../../services/api';
import { usePortfolioLocale } from '../../contexts/PortfolioContext';
import '../section.css';

const { Title, Text } = Typography;

export default function Experience() {
  const { t } = useTranslation();
  const locale = usePortfolioLocale();

  if (!locale) return null;

  const experiences: ExpItem[] = locale?.experiences ?? [];

  const items: TimelineItemProps[] = experiences.flatMap((exp, i) => [
    {
      children: (
        <div key={`${exp.company}-${i}`}>
          <Title level={4} style={{ marginBottom: 4 }}>
            {exp.company}
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
            {exp.role} · {exp.period}
          </Text>
          <Space direction="vertical" size="small" style={{ marginTop: 12 }}>
            {(exp.projects ?? []).map((proj) => (
              <Card
                key={proj.name}
                size="small"
                title={proj.name}
                style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
              >
                <Text type="secondary" style={{ fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
                  {proj.description}
                </Text>
                <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', marginBottom: 8 }}>
                  {t('experience.team')}: {proj.teamSize}
                </Text>
                <ul style={{ margin: '0 0 8px 0', paddingLeft: 20, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {(proj.responsibilities ?? []).map((r, k) => (
                    <li key={k}>{r}</li>
                  ))}
                </ul>
                <Space size={[4, 4]} wrap>
                  {(proj.tech ?? []).map((tech) => (
                    <Tag key={tech} color="blue">
                      {tech}
                    </Tag>
                  ))}
                </Space>
              </Card>
            ))}
          </Space>
        </div>
      ),
    },
  ]);

  return (
    <section id="experience" className="section">
      <div className="container">
        <Title level={2} className="section-title">
          {t('experience.title')}
        </Title>
        <Timeline items={items} />
      </div>
    </section>
  );
}
