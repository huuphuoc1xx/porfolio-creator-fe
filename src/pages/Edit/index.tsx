import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Alert,
  Spin,
  Collapse,
  Select,
  Switch,
  Tabs,
  Space,
  message,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTheme, Theme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { ConfigProvider, theme } from 'antd';
import * as api from '../../services/api';
import type { CreatePortfolioPayload, LocaleContent, ExperienceItem, ExperienceProject } from '../../services/api';

const defaultLocaleEn: LocaleContent = {
  nav: { home: 'Home', about: 'About', skills: 'Skills', experience: 'Experience', education: 'Education', contact: 'Contact' },
  hero: { greeting: "Hi, I'm", title: '', summary: '', contact: 'Contact', viewExperience: 'View experience' },
  profile: { name: '', summary: '', address: '' },
  about: { title: 'About', email: 'Email', phone: 'Phone', address: 'Address', dob: 'Date of birth' },
  skills: { title: 'Skills' },
  experience: { title: 'Experience', team: 'Team' },
  experiences: [],
  education: { title: 'Education' },
  contact: { title: 'Contact', intro: '', email: 'Email', phone: 'Phone' },
  footer: '© {{year}}',
};

const defaultLocaleVi: LocaleContent = {
  ...defaultLocaleEn,
  nav: { home: 'Trang chủ', about: 'Giới thiệu', skills: 'Kỹ năng', experience: 'Kinh nghiệm', education: 'Học vấn', contact: 'Liên hệ' },
  about: { title: 'Giới thiệu', email: 'Email', phone: 'Điện thoại', address: 'Địa chỉ', dob: 'Ngày sinh' },
  skills: { title: 'Kỹ năng' },
  experience: { title: 'Kinh nghiệm', team: 'Team' },
  education: { title: 'Học vấn' },
  contact: { title: 'Liên hệ', intro: '', email: 'Email', phone: 'Điện thoại' },
};

function mergeLocale(base: LocaleContent, from: LocaleContent): LocaleContent {
  if (!from) return base;
  return {
    ...base,
    ...from,
    nav: { ...base.nav, ...(from.nav as object) },
    hero: { ...base.hero, ...(from.hero as object) },
    profile: { ...base.profile, ...(from.profile as object) },
    about: { ...base.about, ...(from.about as object) },
    skills: { ...base.skills, ...(from.skills as object) },
    experience: { ...base.experience, ...(from.experience as object) },
    contact: { ...base.contact, ...(from.contact as object) },
    education: { ...base.education, ...(from.education as object) },
    experiences: Array.isArray(from.experiences) ? (from.experiences as ExperienceItem[]) : base.experiences ?? [],
  };
}

interface LocaleContentEditorProps {
  locale: LocaleContent;
  onChange: (locale: LocaleContent) => void;
  t: (key: string) => string;
}

function LocaleContentEditor({ locale, onChange, t }: LocaleContentEditorProps) {
  const update = useCallback(
    (path: keyof LocaleContent, value: unknown) => {
      onChange({ ...locale, [path]: value });
    },
    [locale, onChange],
  );
  const updateProfile = useCallback(
    (key: keyof NonNullable<LocaleContent['profile']>, value: string) => {
      update('profile', { ...locale.profile, [key]: value });
    },
    [locale, update],
  );
  const updateHero = useCallback(
    (key: keyof NonNullable<LocaleContent['hero']>, value: string) => {
      update('hero', { ...locale.hero, [key]: value });
    },
    [locale, update],
  );
  const updateContact = useCallback(
    (key: keyof NonNullable<LocaleContent['contact']>, value: string) => {
      update('contact', { ...locale.contact, [key]: value });
    },
    [locale, update],
  );
  const updateEducation = useCallback(
    (key: string, value: string) => {
      update('education', { ...locale.education, [key]: value });
    },
    [locale, update],
  );
  const experiences = locale.experiences ?? [];

  const setExperiences = useCallback(
    (next: ExperienceItem[]) => {
      update('experiences', next);
    },
    [update],
  );
  const updateExperience = useCallback(
    (index: number, item: ExperienceItem) => {
      const next = [...experiences];
      next[index] = item;
      setExperiences(next);
    },
    [experiences, setExperiences],
  );
  const addExperience = useCallback(() => {
    setExperiences([...experiences, { company: '', role: '', period: '', projects: [] }]);
  }, [experiences, setExperiences]);
  const removeExperience = useCallback(
    (index: number) => {
      setExperiences(experiences.filter((_, i) => i !== index));
    },
    [experiences, setExperiences],
  );
  const updateProject = useCallback(
    (expIndex: number, projIndex: number, project: ExperienceProject) => {
      const exp = experiences[expIndex];
      if (!exp) return;
      const projects = [...(exp.projects ?? [])];
      projects[projIndex] = project;
      updateExperience(expIndex, { ...exp, projects });
    },
    [experiences, updateExperience],
  );
  const addProject = useCallback(
    (expIndex: number) => {
      const exp = experiences[expIndex];
      if (!exp) return;
      const projects = [...(exp.projects ?? []), { name: '', description: '', teamSize: '', responsibilities: [], tech: [] }];
      updateExperience(expIndex, { ...exp, projects });
    },
    [experiences, updateExperience],
  );
  const removeProject = useCallback(
    (expIndex: number, projIndex: number) => {
      const exp = experiences[expIndex];
      if (!exp) return;
      const projects = (exp.projects ?? []).filter((_, i) => i !== projIndex);
      updateExperience(expIndex, { ...exp, projects });
    },
    [experiences, updateExperience],
  );

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Collapse
        defaultActiveKey={['profile', 'contact', 'education', 'experiences']}
        items={[
          {
            key: 'profile',
            label: t('edit.sectionProfileHero'),
            children: (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Form.Item label={t('edit.profileName')} style={{ marginBottom: 0 }}>
                  <Input
                    value={locale.profile?.name ?? ''}
                    onChange={(e) => updateProfile('name', e.target.value)}
                    placeholder="Nguyen Van A"
                  />
                </Form.Item>
                <Form.Item label={t('edit.heroTitle')} style={{ marginBottom: 0 }}>
                  <Input
                    value={locale.hero?.title ?? ''}
                    onChange={(e) => updateHero('title', e.target.value)}
                    placeholder="Fullstack Developer"
                  />
                </Form.Item>
                <Form.Item label={t('edit.heroGreeting')} style={{ marginBottom: 0 }}>
                  <Input
                    value={locale.hero?.greeting ?? ''}
                    onChange={(e) => updateHero('greeting', e.target.value)}
                    placeholder="Hi, I'm"
                  />
                </Form.Item>
                <Form.Item label={t('edit.heroSummary')} style={{ marginBottom: 0 }}>
                  <Input.TextArea
                    rows={4}
                    value={locale.hero?.summary ?? ''}
                    onChange={(e) => updateHero('summary', e.target.value)}
                    placeholder="Short intro for hero section"
                  />
                </Form.Item>
                <Form.Item label={t('edit.profileSummary')} style={{ marginBottom: 0 }}>
                  <Input.TextArea
                    rows={3}
                    value={locale.profile?.summary ?? ''}
                    onChange={(e) => updateProfile('summary', e.target.value)}
                    placeholder="About you (used in About section)"
                  />
                </Form.Item>
                <Form.Item label={t('edit.profileAddress')} style={{ marginBottom: 0 }}>
                  <Input
                    value={locale.profile?.address ?? ''}
                    onChange={(e) => updateProfile('address', e.target.value)}
                    placeholder="City, District"
                  />
                </Form.Item>
              </Space>
            ),
          },
          {
            key: 'contact',
            label: t('edit.sectionAboutContact'),
            children: (
              <Form.Item label={t('edit.contactIntro')} style={{ marginBottom: 0 }}>
                <Input.TextArea
                  rows={2}
                  value={locale.contact?.intro ?? ''}
                  onChange={(e) => updateContact('intro', e.target.value)}
                  placeholder="You can reach me via email or phone below."
                />
              </Form.Item>
            ),
          },
          {
            key: 'education',
            label: t('edit.sectionEducation'),
            children: (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Form.Item label={t('edit.educationSchool')} style={{ marginBottom: 0 }}>
                  <Input
                    value={(locale.education as Record<string, string>)?.school ?? ''}
                    onChange={(e) => updateEducation('school', e.target.value)}
                    placeholder="University name"
                  />
                </Form.Item>
                <Form.Item label={t('edit.educationMajor')} style={{ marginBottom: 0 }}>
                  <Input
                    value={(locale.education as Record<string, string>)?.major ?? ''}
                    onChange={(e) => updateEducation('major', e.target.value)}
                    placeholder="Computer Science"
                  />
                </Form.Item>
                <Form.Item label={t('edit.educationPeriod')} style={{ marginBottom: 0 }}>
                  <Input
                    value={(locale.education as Record<string, string>)?.period ?? ''}
                    onChange={(e) => updateEducation('period', e.target.value)}
                    placeholder="2015 - 2019"
                  />
                </Form.Item>
                <Form.Item label={t('edit.educationGpa')} style={{ marginBottom: 0 }}>
                  <Input
                    value={(locale.education as Record<string, string>)?.gpa ?? ''}
                    onChange={(e) => updateEducation('gpa', e.target.value)}
                    placeholder="GPA or note"
                  />
                </Form.Item>
              </Space>
            ),
          },
          {
            key: 'experiences',
            label: t('edit.sectionExperiences'),
            children: (
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {experiences.map((exp, expIndex) => (
                  <Card
                    key={expIndex}
                    size="small"
                    title={`${exp.company || t('edit.expCompany')} (${expIndex + 1})`}
                    extra={
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeExperience(expIndex)} />
                    }
                    style={{ background: 'var(--card-bg)' }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                      <Form.Item label={t('edit.expCompany')} style={{ marginBottom: 8 }}>
                        <Input
                          value={exp.company ?? ''}
                          onChange={(e) => updateExperience(expIndex, { ...exp, company: e.target.value })}
                          placeholder="Company name"
                        />
                      </Form.Item>
                      <Form.Item label={t('edit.expRole')} style={{ marginBottom: 8 }}>
                        <Input
                          value={exp.role ?? ''}
                          onChange={(e) => updateExperience(expIndex, { ...exp, role: e.target.value })}
                          placeholder="Job title"
                        />
                      </Form.Item>
                      <Form.Item label={t('edit.expPeriod')} style={{ marginBottom: 8 }}>
                        <Input
                          value={exp.period ?? ''}
                          onChange={(e) => updateExperience(expIndex, { ...exp, period: e.target.value })}
                          placeholder="Jan 2020 - Present"
                        />
                      </Form.Item>
                      <div>
                        <div style={{ marginBottom: 12 }}>
                          <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={() => addProject(expIndex)}>
                            {t('edit.addProject')}
                          </Button>
                        </div>
                        {(exp.projects ?? []).map((proj, projIndex) => (
                          <Card
                            key={projIndex}
                            size="small"
                            type="inner"
                            title={proj.name || t('edit.projName')}
                            extra={
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => removeProject(expIndex, projIndex)}
                              />
                            }
                            style={{ marginBottom: 12 }}
                          >
                            <Form.Item label={t('edit.projName')} style={{ marginBottom: 8 }}>
                              <Input
                                value={proj.name ?? ''}
                                onChange={(e) => updateProject(expIndex, projIndex, { ...proj, name: e.target.value })}
                              />
                            </Form.Item>
                            <Form.Item label={t('edit.projDesc')} style={{ marginBottom: 8 }}>
                              <Input.TextArea
                                rows={2}
                                value={proj.description ?? ''}
                                onChange={(e) => updateProject(expIndex, projIndex, { ...proj, description: e.target.value })}
                              />
                            </Form.Item>
                            <Form.Item label={t('edit.projTeamSize')} style={{ marginBottom: 8 }}>
                              <Input
                                value={proj.teamSize ?? ''}
                                onChange={(e) => updateProject(expIndex, projIndex, { ...proj, teamSize: e.target.value })}
                                placeholder="e.g. 5"
                              />
                            </Form.Item>
                            <Form.Item label={t('edit.projResponsibilities')} style={{ marginBottom: 8 }}>
                              <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder="Add responsibility, press Enter"
                                value={proj.responsibilities ?? []}
                                onChange={(val) => updateProject(expIndex, projIndex, { ...proj, responsibilities: val })}
                                tokenSeparators={[',']}
                              />
                            </Form.Item>
                            <Form.Item label={t('edit.projTech')} style={{ marginBottom: 0 }}>
                              <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder="Add tech, press Enter"
                                value={proj.tech ?? []}
                                onChange={(val) => updateProject(expIndex, projIndex, { ...proj, tech: val })}
                                tokenSeparators={[',']}
                              />
                            </Form.Item>
                          </Card>
                        ))}
                      </div>
                    </Space>
                  </Card>
                ))}
                <Button type="dashed" block icon={<PlusOutlined />} onClick={addExperience}>
                  {t('edit.addExperience')}
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </Space>
  );
}

export default function EditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme: themeMode } = useTheme();
  const { isAuthenticated, loading: authLoading, refreshMyPortfolioSlug } = useAuth();
  const [form] = Form.useForm();
  const [myPortfolio, setMyPortfolio] = useState<api.Portfolio | null | undefined>(undefined);
  const [localeEn, setLocaleEn] = useState<LocaleContent>(defaultLocaleEn);
  const [localeVi, setLocaleVi] = useState<LocaleContent>(defaultLocaleVi);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const isDark = themeMode === Theme.Dark;

  useEffect(() => {
    if (!isAuthenticated) return;
    api.getMePortfolio().then(setMyPortfolio).catch(() => setMyPortfolio(null));
  }, [isAuthenticated]);

  useEffect(() => {
    if (myPortfolio === undefined) return;
    if (!myPortfolio) {
      form.setFieldsValue({
        slug: '',
        email: '',
        phone: '',
        dob: '',
        skills: [],
        isPublic: true,
      });
      setLocaleEn(defaultLocaleEn);
      setLocaleVi(defaultLocaleVi);
    } else {
      form.setFieldsValue({
        slug: myPortfolio.slug,
        email: myPortfolio.email,
        phone: myPortfolio.phone,
        dob: myPortfolio.dob,
        skills: myPortfolio.skills ?? [],
        isPublic: myPortfolio.isPublic !== false,
      });
      setLocaleEn(mergeLocale(defaultLocaleEn, myPortfolio.locales?.en));
      setLocaleVi(mergeLocale(defaultLocaleVi, myPortfolio.locales?.vi));
    }
  }, [myPortfolio, form]);

  if (!authLoading && !isAuthenticated) {
    navigate('/login', { replace: true });
    return null;
  }

  const onFinish = async (values: { slug: string; email: string; phone: string; dob: string; skills: string[]; isPublic?: boolean }) => {
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const payload: CreatePortfolioPayload = {
        slug: values.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        email: values.email,
        phone: values.phone,
        dob: values.dob,
        skills: values.skills ?? [],
        isPublic: values.isPublic !== false,
        locales: { en: localeEn, vi: localeVi },
      };
      if (myPortfolio) {
        const updated = await api.updatePortfolio(myPortfolio.id, payload);
        setMyPortfolio(updated);
        await refreshMyPortfolioSlug();
        setSuccess(t('edit.updated'));
        message.success(t('edit.updated'));
      } else {
        setError(t('edit.noPortfolio'));
      }
    } catch (e) {
      const err = e as { body?: { message?: string } };
      setError(err?.body?.message ?? (e instanceof Error ? e.message : t('edit.failed')));
    } finally {
      setSubmitting(false);
    }
  };

  const shareUrl = myPortfolio
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${myPortfolio.slug}`
    : '';

  const copyShareLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (authLoading || myPortfolio === undefined) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" tip={t('loading')} />
      </div>
    );
  }

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
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px 48px' }}>
        <Card title={myPortfolio ? t('edit.title') : t('edit.createTitle')}>
          {!myPortfolio && (
            <Alert
              type="info"
              message={t('edit.noPortfolio')}
              style={{ marginBottom: 16 }}
              showIcon
              action={
                <Button size="small" onClick={() => window.location.reload()}>
                  Refresh
                </Button>
              }
            />
          )}
          {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}
          {success && <Alert type="success" message={success} style={{ marginBottom: 16 }} showIcon />}
          {myPortfolio && shareUrl && (
            <Alert
              style={{ marginBottom: 16 }}
              message={t('edit.shareLink')}
              description={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <code style={{ flex: 1, wordBreak: 'break-all' }}>{shareUrl}</code>
                  <Button size="small" onClick={copyShareLink}>
                    {copied ? t('edit.copied') : t('edit.copy')}
                  </Button>
                </div>
              }
            />
          )}
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Tabs
              defaultActiveKey="general"
              items={[
                {
                  key: 'general',
                  label: t('edit.tabGeneral'),
                  children: (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                      <Form.Item
                        name="slug"
                        label={t('edit.slug')}
                        extra={t('edit.slugHelp')}
                        rules={[
                          { required: true, message: 'Slug is required' },
                          { pattern: /^[a-z0-9-]+$/, message: 'Only lowercase letters, numbers, hyphens' },
                          { min: 2 },
                        ]}
                      >
                        <Input placeholder="my-portfolio" />
                      </Form.Item>
                      <Form.Item name="email" label={t('about.email')} rules={[{ required: true }, { type: 'email' }]}>
                        <Input type="email" placeholder="you@example.com" />
                      </Form.Item>
                      <Form.Item name="phone" label={t('about.phone')} rules={[{ required: true }]}>
                        <Input placeholder="+84 xxx xxx xxx" />
                      </Form.Item>
                      <Form.Item name="dob" label={t('about.dob')} rules={[{ required: true }]}>
                        <Input placeholder="28-08-1999" />
                      </Form.Item>
                      <Form.Item name="isPublic" label={t('edit.isPublic')} valuePropName="checked" extra={t('edit.publicHelp')}>
                        <Switch checkedChildren={t('edit.publicOn')} unCheckedChildren={t('edit.publicOff')} />
                      </Form.Item>
                      <Form.Item name="skills" label={t('skills.title')}>
                        <Select
                          mode="tags"
                          placeholder="Add skills, press Enter"
                          style={{ width: '100%' }}
                          tokenSeparators={[',']}
                        />
                      </Form.Item>
                    </Space>
                  ),
                },
                {
                  key: 'en',
                  label: t('edit.tabEnglish'),
                  children: <LocaleContentEditor locale={localeEn} onChange={setLocaleEn} t={t} />,
                },
                {
                  key: 'vi',
                  label: t('edit.tabVietnamese'),
                  children: <LocaleContentEditor locale={localeVi} onChange={setLocaleVi} t={t} />,
                },
              ]}
            />
            <Form.Item style={{ marginTop: 24 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {submitting ? t('edit.saving') : t('edit.save')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
}
