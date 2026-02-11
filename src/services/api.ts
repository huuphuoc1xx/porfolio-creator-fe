/**
 * Portfolio API client.
 * Base URL: VITE_API_URL (default http://localhost:10001)
 */

export interface ExperienceProject {
  name: string;
  description: string;
  teamSize: string;
  responsibilities: string[];
  tech: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  projects: ExperienceProject[];
}

export interface LocaleContent {
  nav: Record<string, string>;
  hero: Record<string, string>;
  profile: { name: string; summary: string; address: string };
  about: Record<string, string>;
  skills: { title: string };
  experience: Record<string, string>;
  experiences: ExperienceItem[];
  education: Record<string, string>;
  contact: Record<string, string>;
  footer: string;
}

export interface Portfolio {
  id: string;
  slug: string;
  email: string;
  phone: string;
  dob: string;
  skills: string[];
  isPublic: boolean;
  locales: { en: LocaleContent; vi: LocaleContent };
}

export interface CreatePortfolioPayload {
  slug: string;
  email: string;
  phone: string;
  dob: string;
  skills: string[];
  isPublic?: boolean;
  locales: { en: LocaleContent; vi: LocaleContent };
}

export interface ApiError extends Error {
  status?: number;
  body?: unknown;
}

const getBaseUrl = (): string =>
  (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '') || 'http://localhost:10001';

const AUTH_TOKEN_KEY = 'portfolio-token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    /* noop */
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T | undefined> {
  const url = `${getBaseUrl()}/api${path.startsWith('/') ? path : `/${path}`}`;
  const token = getAuthToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    const err: ApiError = new Error(res.statusText || 'API request failed');
    err.status = res.status;
    try {
      err.body = await res.json();
    } catch {
      err.body = await res.text();
    }
    throw err;
  }
  if (res.status === 204) return undefined;
  return res.json() as Promise<T>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: { id: string; email: string };
}

/** POST /api/auth/register */
export async function register(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }) as Promise<AuthResponse>;
}

/** POST /api/auth/login */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }) as Promise<AuthResponse>;
}

/** GET /api/portfolios/me - current user portfolio (requires auth). Optional locale: en | vi */
export async function getMePortfolio(locale?: 'en' | 'vi'): Promise<Portfolio | null> {
  const q = locale ? `?locale=${locale}` : '';
  const result = await request<Portfolio | null>(`/portfolios/me${q}`);
  return result ?? null;
}

/** GET /api/portfolios/:slug - get one portfolio by slug. Optional locale: en | vi */
export async function getPortfolioBySlug(slug: string, locale?: 'en' | 'vi'): Promise<Portfolio> {
  const q = locale ? `?locale=${locale}` : '';
  return request<Portfolio>(
    `/portfolios/${encodeURIComponent(slug)}${q}`,
  ) as Promise<Portfolio>;
}

/** PUT /api/portfolios/:id - update portfolio (owner only) */
export async function updatePortfolio(
  id: string,
  data: Partial<CreatePortfolioPayload>,
): Promise<Portfolio> {
  return request<Portfolio>(`/portfolios/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }) as Promise<Portfolio>;
}

export default {
  getAuthToken,
  setAuthToken,
  register,
  login,
  getMePortfolio,
  getPortfolioBySlug,
  updatePortfolio,
};
