# Career Platform - Production Deployment Guide

## Overview

This guide covers deploying the Career Platform to production with all security features enabled.

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Redis 7+ (optional but recommended)
- Docker & Docker Compose (optional)

## Quick Start

### 1. Environment Setup

```bash
# Copy the production template
cp .env.production.template .env.local

# Edit with your production values
nano .env.local
```

### 2. Database Setup

```bash
# Run migrations
npx prisma migrate deploy
npx prisma generate

# Seed initial data (optional)
npx prisma db seed
```

### 3. Build & Deploy

#### Option A: Traditional Deployment

```bash
# Install dependencies
npm ci --legacy-peer-deps

# Build
npm run build

# Start production server
npm start
```

#### Option B: Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app
```

#### Option C: Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Production Checklist

Before going live, ensure all items are checked:

### Security

- [ ] `NEXTAUTH_SECRET` is a strong random string (32+ chars)
- [ ] OAuth credentials are production (not development)
- [ ] Database connection uses SSL
- [ ] Redis is configured for rate limiting
- [ ] Security headers are configured
- [ ] CSP policy is tightened
- [ ] `.env` files are in `.gitignore`
- [ ] `npm audit` shows no high-severity vulnerabilities

### Database

- [ ] Migrations are run on production database
- [ ] Database backups are configured
- [ ] Connection pooling is enabled
- [ ] Database user has minimal required permissions

### Monitoring

- [ ] Health check endpoint `/api/health` returns 200
- [ ] Error logging is configured
- [ ] Sentry/Datadog is set up (optional)
- [ ] Uptime monitoring is active

### Performance

- [ ] Static assets are cached
- [ ] API routes have no-cache headers
- [ ] Images are optimized
- [ ] Rate limiting is active

### DNS & SSL

- [ ] Domain points to correct server
- [ ] SSL certificate is installed
- [ ] `NEXTAUTH_URL` matches domain
- [ ] `NEXT_PUBLIC_APP_URL` matches domain

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Random 32-byte string |
| `NEXTAUTH_URL` | Yes | App URL with https |
| `UPSTASH_REDIS_REST_URL` | Recommended | Redis URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Recommended | Redis token |
| `GOOGLE_CLIENT_ID` | Yes* | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes* | Google OAuth secret |
| `LINKEDIN_CLIENT_ID` | Yes* | LinkedIn OAuth client ID |
| `LINKEDIN_CLIENT_SECRET` | Yes* | LinkedIn OAuth secret |
| `STRIPE_SECRET_KEY` | Yes* | Stripe secret key |
| `OPENAI_API_KEY` | Yes* | OpenAI API key |
| `SENTRY_DSN` | Optional | Error tracking |

*Required if using that feature

## Health Checks

### Database Health
```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": true,
  "redis": true,
  "timestamp": "2024-01-15T12:00:00.000Z",
  "version": "0.1.0",
  "environment": "production"
}
```

### Simple Health Check (for load balancers)
```bash
curl -I https://your-domain.com/api/health
```

Expected: HTTP 200

## Troubleshooting

### Build Errors

**Error: `prisma generate` not found**
```bash
npm install @prisma/client
npx prisma generate
```

**Error: Type errors**
```bash
# Regenerate Prisma client
npx prisma generate

# Run type check
npx tsc --noEmit
```

### Database Errors

**Error: Connection refused**
- Check `DATABASE_URL` is correct
- Verify PostgreSQL is running
- Check firewall rules

**Error: SSL required**
- Add `?sslmode=require` to DATABASE_URL
- Or set `DATABASE_SSL=true`

### Rate Limiting Issues

**Error: Rate limit not working**
- Check Redis connection
- Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Check logs for Redis errors

## Security Best Practices

1. **Keep dependencies updated**
   ```bash
   npm audit fix
   ```

2. **Review OAuth scopes**
   - Only request necessary permissions
   - Review app permissions regularly

3. **Monitor access logs**
   - Watch for suspicious activity
   - Set up alerts for failed logins

4. **Database security**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups

5. **Rate limiting**
   - Monitor usage patterns
   - Adjust limits as needed
   - Check for abuse

## Support

For issues or questions:
- Documentation: `/SECURITY.md`
- Health endpoint: `/api/health`
- Error logs: Check server logs

## License

See project LICENSE file
