import { useTranslation } from 'react-i18next';
import { Typography, Space } from 'antd';
import { usePortfolio } from '../../contexts/PortfolioContext';
import '../section.css';

const { Title } = Typography;

export default function Skills() {
  const { t } = useTranslation();
  const { portfolio } = usePortfolio();

  if (!portfolio) return null;

  return (
    <section id="skills" className="section">
      <div className="container">
        <Title level={2} className="section-title">
          {t('skills.title')}
        </Title>
        <Space size={[8, 8]} wrap className="skills-tags">
          {portfolio.skills.map((skill) => (
            <span key={skill} className="skill-tag">
              {skill}
            </span>
          ))}
        </Space>
      </div>
    </section>
  );
}
