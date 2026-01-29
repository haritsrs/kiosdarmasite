# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- feat(security): Add comprehensive security headers middleware with CSP, HSTS, X-Frame-Options
- feat(security): Implement rate limiting for all API routes
- feat(security): Enhance input validation with Zod schemas
- feat(security): Add HTML sanitization utilities
- feat(security): Audit and document Firebase security rules
- docs(security): Add security notes to ENV_SETUP.md

### Performance
- feat(perf): Configure Next.js image optimization with AVIF/WebP support
- feat(perf): Add Lighthouse CI configuration
- feat(perf): Optimize font loading with swap strategy
- feat(perf): Configure bundle optimization and code splitting
- feat(perf): Add performance budgets and monitoring

### Accessibility
- feat(a11y): Add skip links for keyboard navigation
- feat(a11y): Improve form accessibility with proper labels and ARIA attributes
- feat(a11y): Add live regions for dynamic content
- feat(a11y): Enhance error message associations
- style(a11y): Add sr-only utility classes

### SEO
- feat(seo): Add comprehensive metadata to all pages
- feat(seo): Implement Open Graph and Twitter Card tags
- feat(seo): Add structured data (Organization, Website schemas)
- feat(seo): Create dynamic XML sitemap
- feat(seo): Add robots.txt with proper crawl rules

### Testing
- feat(test): Set up Vitest for unit testing
- feat(test): Set up Playwright for E2E testing
- feat(test): Add test utilities and mocks
- feat(test): Create sample unit and E2E tests
- feat(test): Configure test coverage thresholds (80%)

### CI/CD
- feat(ci): Add GitHub Actions CI pipeline
- feat(ci): Add security scanning workflow
- feat(ci): Configure automated lint, test, and build checks

### Observability
- feat(observability): Add error tracking utility with PII scrubbing
- feat(observability): Implement error boundaries (error.tsx, global-error.tsx)
- feat(observability): Add structured logging with correlation IDs
- feat(observability): Create health check endpoint
- feat(observability): Add PII scrubbing for logs and errors

### Features
- feat(auth): Add password strength indicator component
- feat(auth): Prepare email verification flow (documented)
- feat(account): Create profile settings page
- feat(account): Add account deletion UI (API TODO)

### Documentation
- docs: Create comprehensive audit report (docs/audit.md)
- docs: Create owner actions checklist (docs/owner-actions.md)
- docs: Add Firebase security audit (docs/firebase-security-audit.md)
- docs: Update ENV_SETUP.md with security notes
- docs: Create CHANGELOG.md

### Infrastructure
- feat(infra): Add health check API endpoint
- feat(infra): Configure Next.js for production optimizations
- feat(infra): Add bundle analyzer script

## [0.1.0] - Initial Release

### Added
- Initial marketplace application
- Firebase authentication
- Product catalog
- Shopping cart
- Order management
- Support contact form


