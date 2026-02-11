import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Locale } from '../config/i18n';
import { getPortfolioBySlug, type Portfolio } from '../services/api';

type LocaleCode = 'en' | 'vi';

function getSlugFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

export const DEFAULT_SLUG = import.meta.env.VITE_DEFAULT_SLUG ?? 'nguyen-huu-phuoc';

interface PortfolioContextValue {
  portfolio: Portfolio | null;
  loading: boolean;
  error: Error | null;
  slug: string;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

interface PortfolioProviderProps {
  children: ReactNode;
  /** Slug from route /p/:slug; nếu có thì dùng, không thì query ?slug= hoặc default */
  slug?: string | null;
}

export function PortfolioProvider({ children, slug: slugProp }: PortfolioProviderProps) {
  const { i18n } = useTranslation();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const slug = useMemo(
    () => (slugProp != null && slugProp !== '' ? slugProp : getSlugFromUrl() ?? DEFAULT_SLUG),
    [slugProp],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const locale: LocaleCode = i18n.language.startsWith('vi') || i18n.language === 'vn' ? 'vi' : 'en';
    getPortfolioBySlug(slug, locale)
      .then((data) => {
        if (!cancelled) {
          setPortfolio(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setPortfolio(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug, i18n.language]);

  const value = useMemo<PortfolioContextValue>(
    () => ({ portfolio, loading, error, slug }),
    [portfolio, loading, error, slug],
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}

/** Current locale content from portfolio for active language */
export function usePortfolioLocale() {
  const { i18n } = useTranslation();
  const { portfolio } = usePortfolio();
  const lang = i18n.language.startsWith('vi') || i18n.language === 'vn' ? Locale.Vi : Locale.En;
  return portfolio?.locales?.[lang] ?? null;
}
