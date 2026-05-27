# Career Platform - Security Documentation

## Overview

This document outlines the security measures implemented in the Career Platform to ensure production-ready security.

## Security Features Implemented

### 1. Input Validation & Sanitization

- **Zod Schema Validation**: All API endpoints use strict Zod schemas for input validation
- **Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **SQL Injection Protection**: Parameterized queries via Prisma ORM
- **URL Validation**: All URLs are validated before processing

```typescript
// Example usage
import { resumeSchema } from "@/lib/security/schemas";
const validation = resumeSchema.safeParse(body);
```

### 2. Rate Limiting

Rate limits are enforced on all API endpoints:

| Endpoint | Limit | Window |
|----------|-------|--------|
| AI Suggestions | 20 | 60 seconds |
| PDF Export | 10 | 60 seconds |
| Resume Operations | 5 | 60 seconds |
| Cover Letter Generation | 10 | 60 seconds |
| Job Search | 100 | 60 seconds |
| Auth Login | 10 | 1 hour |
| Auth Register | 5 | 1 hour |

### 3. Security Headers

The following security headers are configured in `next.config.ts` and middleware:

- `Content-Security-Policy`: Prevents XSS and data injection
- `X-Content-Type-Options: nosniff`: Prevents MIME-sniffing
- `X-Frame-Options: DENY`: Prevents clickjacking
- `X-XSS-Protection: 1; mode=block`: Browser XSS protection
- `Strict-Transport-Security`: Enforces HTTPS
- `Referrer-Policy: strict-origin-when-cross-origin`: Controls referrer info
- `Permissions-Policy`: Restricts browser features

### 4. Authentication & Session Security

- **JWT Strategy**: Secure session management with JWT tokens
- **Secure Cookies**: HttpOnly, Secure, SameSite=Lax
- **Session Expiry**: 30 days with 24-hour update interval
- **CSRF Protection**: CSRF tokens required for state-changing operations
- **Failed Login Tracking**: Account lockout after multiple failed attempts

### 5. Authorization & Access Control

- **Role-Based Access Control (RBAC)**: USER, PREMIUM, PRO, ADMIN roles
- **Resource Ownership**: Users can only access their own data
- **Middleware Protection**: Protected routes require authentication

### 6. Error Handling & Logging

- **Error Boundaries**: React error boundaries catch UI errors
- **Secure Error Messages**: Generic error messages to prevent info leakage
- **Audit Logging**: All sensitive operations are logged
- **Security Monitoring**: Suspicious activity detection

## API Security

### Protected Endpoints

The following endpoints require authentication:

- `/api/resumes/*`
- `/api/cover-letters/*`
- `/api/cvs/*`
- `/api/ats-check/*`
- `/api/applications/*`

### Public Endpoints

The following endpoints are public:

- `/api/jobs/*` (GET)
- `/api/health`
- `/api/auth/*`

## Environment Variables

Required security-related environment variables:

```env
# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secret-32-char-key"

# OAuth (use production credentials)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
LINKEDIN_CLIENT_ID="..."
LINKEDIN_CLIENT_SECRET="..."

# Encryption
ENCRYPTION_KEY="your-32-byte-hex-key"

# Rate Limiting
REDIS_URL="redis://..."
REDIS_TOKEN="..."
```

## Security Best Practices

### For Developers

1. **Never commit `.env` files**: Always use `.env.local` for local development
2. **Validate all inputs**: Use Zod schemas for every API endpoint
3. **Sanitize outputs**: Use sanitization utilities before rendering user content
4. **Check ownership**: Verify user owns resources before CRUD operations
5. **Use parameterized queries**: Never concatenate user input into SQL

### For Production Deployment

1. **Use HTTPS**: Enforce TLS 1.2 or higher
2. **Enable CSP**: Review and tighten Content-Security-Policy
3. **Configure CORS**: Restrict allowed origins
4. **Set up monitoring**: Use Sentry/Datadog for error tracking
5. **Enable rate limiting**: Configure Redis for distributed rate limiting
6. **Regular audits**: Run `npm audit` and update dependencies
7. **Database security**: Use connection pooling and prepared statements

## Security Checklist

Before deploying to production:

- [ ] Update NEXTAUTH_SECRET to a secure random value
- [ ] Configure production OAuth credentials
- [ ] Set up Redis for distributed rate limiting
- [ ] Enable CSP headers
- [ ] Configure security headers in next.config.ts
- [ ] Set up error monitoring (Sentry)
- [ ] Configure audit logging
- [ ] Enable HTTPS
- [ ] Review and test authentication flows
- [ ] Test rate limiting
- [ ] Run security audit (`npm audit`)
- [ ] Review CSP policy

## Incident Response

### Security Incident Procedure

1. **Identify**: Detect and confirm the security incident
2. **Contain**: Stop the attack and prevent further damage
3. **Eradicate**: Remove the threat
4. **Recover**: Restore systems to normal operation
5. **Learn**: Document and analyze the incident

### Emergency Contacts

- Security Team: security@careerplatform.com
- DevOps On-call: devops@careerplatform.com

## Vulnerability Reporting

If you discover a security vulnerability:

1. Do not create a public issue
2. Email security@careerplatform.com with details
3. Allow reasonable time for fix before disclosure

## Compliance

This platform implements security controls aligned with:

- **OWASP Top 10**: Addressing common web application vulnerabilities
- **GDPR**: Data protection and privacy
- **SOC 2**: Security, availability, and confidentiality

## Updates

This document is reviewed and updated:

- After security incidents
- When new features are added
- Quarterly as part of security audit

Last updated: 2024
