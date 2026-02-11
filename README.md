# Portfolio Frontend

React + Vite + TypeScript SPA for Portfolio Creator. i18n (EN/VI), light/dark theme, Ant Design. Uses the portfolio backend API.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:10001
```

## Run

```bash
npm run dev
```

- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Lint:** `npm run lint`

## API client (`src/services/api.ts`)

| Function                 | Description                    |
|--------------------------|--------------------------------|
| `getPortfolioBySlug(slug)` | GET /api/portfolios/:slug    |
| `getMePortfolio()`         | GET /api/portfolios/me      |
| `updatePortfolio(id, data)`| PUT /api/portfolios/:id     |
| `login(payload)`           | POST /api/auth/login        |
| `register(payload)`        | POST /api/auth/register     |

Auth token is stored in localStorage and sent as `Authorization: Bearer <token>`.

## Structure

- **Pages:** Home, Login, Edit (portfolio form with EN/VI tabs).
- **Components:** Navbar (two bars on portfolio: logo+settings, then section links), Hero, About, Skills, Experience, Education, Contact.
- **Contexts:** Theme, Auth, Portfolio (fetch by slug).
