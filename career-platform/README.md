# Career Platform

Next.js 16 fullstack career platform with resume builder, CV builder, ATS checker, job search, cover letter generator, LinkedIn tools, and AI-powered career counselling.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth v4 (Google, LinkedIn, credentials)
- **Payments:** Stripe
- **AI:** OpenAI
- **Cache/Rate Limiting:** Redis (Upstash)
- **Monitoring:** Sentry (optional)

## Getting Started

```bash
cp .env.example .env.local
npm install
npm run db:push
npm run dev
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server (port 5555) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier format |
| `npm run typecheck` | TypeScript check |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run check:all` | Full CI check suite |

## Production

See [README-PRODUCTION.md](./README-PRODUCTION.md) for deployment guide.

## License

Private
