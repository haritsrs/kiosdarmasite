# Owner Action Items

This document contains a checklist of items that need to be completed outside the repository, including DNS setup, SSL/TLS configuration, monitoring, and compliance requirements.

## DNS & Domain Configuration

### 1. Domain Setup
- [ ] **Register/Configure Domain**
  - Choose and register production domain (e.g., `marketplace.kiosdarma.com` or `kiosdarma.com`)
  - Update `NEXT_PUBLIC_APP_URL` environment variable with production domain
  - Update CSP headers in `src/middleware.ts` with actual domain

### 2. DNS Records
- [ ] **A/AAAA Records** (if using custom domain on Vercel)
  - Point domain to Vercel's IP addresses
  - Or use CNAME to `cname.vercel-dns.com`

- [ ] **CNAME Record** (recommended for Vercel)
  - Create CNAME: `www` → `cname.vercel-dns.com`
  - Or use Vercel's automatic DNS configuration

### 3. Email Records (if using custom email domain)
- [ ] **SPF Record**
  ```
  v=spf1 include:_spf.resend.com ~all
  ```

- [ ] **DKIM Record**
  - Get DKIM keys from Resend dashboard
  - Add TXT record as provided by Resend

- [ ] **DMARC Record**
  ```
  v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com
  ```

## SSL/TLS Configuration

### 1. SSL Certificate
- [ ] **Vercel Automatic SSL**
  - Vercel automatically provisions SSL certificates
  - Ensure domain is properly configured in Vercel dashboard
  - Certificate will auto-renew

### 2. HSTS Preload (Optional but Recommended)
- [ ] **Submit to HSTS Preload List**
  - Visit: https://hstspreload.org/
  - Ensure HSTS header includes `preload` directive (already configured)
  - Submit domain after confirming it works correctly
  - **Note:** This is a one-way operation, ensure you're ready

### 3. Certificate Monitoring
- [ ] **Set up certificate expiration alerts**
  - Vercel handles this automatically
  - Consider third-party monitoring for redundancy

## Content Security Policy (CSP) Domain Allowlist

### Update CSP in `src/middleware.ts` with:
- [ ] **CDN Domains**
  - Add any CDN domains used for assets
  - Firebase domains (already included)

- [ ] **Analytics Domains** (if adding analytics)
  - Google Analytics: `https://www.google-analytics.com`
  - Other analytics services as needed

- [ ] **Font Domains**
  - Google Fonts (already included)
  - Custom font CDNs if used

- [ ] **Third-party Services**
  - Email service domains (Resend)
  - Any other third-party scripts

## OAuth & Third-party App Registration

### 1. Firebase Configuration
- [ ] **Firebase Project Setup**
  - Verify Firebase project is created
  - Enable Authentication (Email/Password)
  - Enable Realtime Database
  - Configure authorized domains in Firebase Console
  - Add production domain to authorized domains

### 2. Resend Configuration (Email Service)
- [ ] **Resend Account Setup**
  - Create Resend account
  - Verify sending domain
  - Generate API key
  - Configure DNS records (SPF, DKIM, DMARC)
  - Set up email templates if needed

## Cloud Infrastructure (Vercel)

### 1. Vercel Project Setup
- [ ] **Create Vercel Project**
  - Connect GitHub repository
  - Configure build settings
  - Set up environment variables (see Environment Variables section)

### 2. Environment Variables
- [ ] **Set Production Environment Variables**
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `RESEND_API_KEY` (optional, for support emails)
  - `NEXT_PUBLIC_APP_URL` (production URL)
  - `NODE_ENV=production`

### 3. Vercel Settings
- [ ] **Configure Domain**
  - Add custom domain in Vercel dashboard
  - Configure redirects (www to non-www or vice versa)

- [ ] **Set up Preview Deployments**
  - Enable preview deployments for PRs
  - Configure preview environment variables if needed

## Monitoring & Observability

### 1. Error Tracking (Sentry)
- [ ] **Set up Sentry Account**
  - Create Sentry account at https://sentry.io
  - Create new project for Next.js
  - Get DSN (Data Source Name)

- [ ] **Install Sentry SDK**
  ```bash
  pnpm add @sentry/nextjs
  ```

- [ ] **Configure Sentry**
  - Run: `npx @sentry/wizard@latest -i nextjs`
  - Update `src/lib/error-tracking.ts` to use Sentry
  - Set `SENTRY_DSN` environment variable

- [ ] **Configure Alerts**
  - Set up error alerts
  - Configure notification channels (email, Slack, etc.)
  - Set alert thresholds

### 2. Performance Monitoring
- [ ] **Vercel Analytics** (Built-in)
  - Enable Vercel Analytics in dashboard
  - Review Core Web Vitals

- [ ] **Additional Monitoring** (Optional)
  - Consider Datadog, New Relic, or similar
  - Set up uptime monitoring (UptimeRobot, Pingdom)

### 3. Logging
- [ ] **Log Aggregation** (Optional)
  - Set up log aggregation service (Logtail, Datadog Logs)
  - Configure log forwarding from Vercel
  - Set up log retention policies

## Backup & Disaster Recovery

### 1. Firebase Backups
- [ ] **Set up Firebase Realtime Database Backups**
  - Enable automated backups in Firebase Console
  - Configure backup schedule (daily recommended)
  - Set retention period (30-90 days)
  - Test restore procedure

### 2. Code Backups
- [ ] **Git Repository**
  - Ensure repository is backed up (GitHub/GitLab handles this)
  - Consider mirroring to secondary location

### 3. Environment Variables Backup
- [ ] **Secure Storage**
  - Store environment variables in secure password manager
  - Document all required variables
  - Keep backup of `.env.example`

## Privacy & Compliance

### 1. Privacy Policy
- [ ] **Create Privacy Policy**
  - Document data collection practices
  - Explain data usage
  - Include cookie policy
  - Add link in footer

### 2. Terms of Service
- [ ] **Create Terms of Service**
  - Define user responsibilities
  - Set service limitations
  - Include dispute resolution
  - Add link in footer

### 3. Cookie Consent (if applicable)
- [ ] **Implement Cookie Banner**
  - Use cookie consent management platform (OneTrust, Cookiebot)
  - Or implement custom solution
  - Track consent preferences
  - Respect user choices

### 4. GDPR/CCPA Compliance (if applicable)
- [ ] **Data Processing Agreement (DPA)**
  - Sign DPA with Firebase (Google)
  - Sign DPA with other data processors
  - Document data processing activities

- [ ] **Data Inventory**
  - Document all data collected
  - Map data flows
  - Identify data processors

- [ ] **User Rights**
  - Implement data export functionality
  - Implement account deletion (API TODO in code)
  - Document data retention policies

## Security

### 1. Secret Rotation
- [ ] **Create Rotation Schedule**
  - Resend API keys: Every 90 days
  - Firebase Admin keys: As needed (if compromised)
  - Document rotation procedure

### 2. Access Control
- [ ] **Vercel Team Access**
  - Set up team members with appropriate roles
  - Use least privilege principle
  - Enable 2FA for all team members

- [ ] **Firebase Access**
  - Review Firebase project access
  - Use Firebase App Check for additional security
  - Enable audit logging

### 3. Security Scanning
- [ ] **Dependency Scanning**
  - Enable Dependabot in GitHub
  - Review and merge security updates
  - Set up automated security scanning in CI

- [ ] **Penetration Testing**
  - Schedule periodic security audits
  - Consider bug bounty program (optional)

## Billing & Cost Management

### 1. Vercel Billing
- [ ] **Review Vercel Plan**
  - Choose appropriate plan (Hobby, Pro, Enterprise)
  - Set up billing alerts
  - Monitor usage

### 2. Firebase Billing
- [ ] **Set up Firebase Billing**
  - Enable billing account
  - Set budget alerts
  - Monitor usage (Realtime Database, Storage, etc.)

### 3. Third-party Services
- [ ] **Monitor Costs**
  - Resend email costs
  - Any other third-party services

## Documentation

### 1. Runbooks
- [ ] **Create Operational Runbooks**
  - Deployment procedure
  - Rollback procedure
  - Incident response
  - Common troubleshooting

### 2. Architecture Documentation
- [ ] **Document Architecture**
  - System architecture diagram
  - Data flow diagrams
  - API documentation

## Testing & Validation

### 1. Pre-production Testing
- [ ] **End-to-end Testing**
  - Test all critical user flows
  - Test order creation and WhatsApp flow
  - Test two-way order confirmation
  - Test email delivery
  - Test error scenarios

### 2. Performance Testing
- [ ] **Load Testing**
  - Test under expected load
  - Identify bottlenecks
  - Optimize as needed

### 3. Security Testing
- [ ] **Security Audit**
  - Review security headers
  - Test rate limiting
  - Verify input validation
  - Test authentication flows

## Launch Checklist

### Pre-launch
- [ ] All environment variables configured
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] Firebase rules deployed
- [ ] Error tracking configured
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Privacy policy published
- [ ] Terms of service published

### Post-launch
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Review security logs
- [ ] Collect user feedback
- [ ] Plan iterative improvements

## Maintenance Schedule

### Daily
- [ ] Monitor error tracking dashboard
- [ ] Review critical alerts

### Weekly
- [ ] Review performance metrics
- [ ] Check security alerts
- [ ] Review dependency updates

### Monthly
- [ ] Review and update dependencies
- [ ] Review access logs
- [ ] Update documentation
- [ ] Review costs

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Rotate secrets (if due)
- [ ] Review and update policies

## Support Contacts

- **Vercel Support:** https://vercel.com/support
- **Firebase Support:** https://firebase.google.com/support
- **Resend Support:** https://resend.com/support

## Notes

- Update this document as you complete items
- Keep sensitive information (API keys, etc.) out of this document
- Review and update quarterly
- Share with team members as needed

