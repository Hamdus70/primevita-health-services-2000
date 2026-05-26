# Go-Live Checklist

## Infrastructure
- [ ] Environment variables configured in Vercel Production.
- [ ] PostgreSQL database provisioned, scaled appropriately, and accessible.
- [ ] Redis instance provisioned and connected.
- [ ] Automated database backups enabled and tested.
- [ ] Supabase storage buckets created and public policies correctly set.

## Security
- [ ] Custom domain linked to Vercel.
- [ ] HTTPS/SSL certificates active.
- [ ] Vercel `.vercel.json` security headers verified.
- [ ] Production cookies set to `Secure = true`.
- [ ] Default passwords/placeholder secrets removed and rotated.
- [ ] Rate limits actively protecting `/api/auth` and critical routes.

## Integrations
- [ ] Resend configured with confirmed sending domain (DKIM/SPF).
- [ ] Termii account funded and Sender ID approved.
- [ ] Gemini API key verified with correct quota limits.
- [ ] NextAuth properly configured with actual production URL.

## Quality Assurance (QA)
- [ ] Production build succeeds without warnings.
- [ ] E2E smoke tests passed on staging environment.
- [ ] Sample Super Admin login successful.
- [ ] Sample Patient onboarding successful.
- [ ] Test invoice generated and marked as paid.

## Monitoring & Operations
- [ ] Sentry project created and receiving front-end/API errors.
- [ ] `/api/internal/health` endpoint responding with `status: up`.
- [ ] BullMQ workers active and processing jobs.
- [ ] App Performance metrics (Web Vitals) tracking enabled.

## Launch
- [ ] Super Admin seeds loaded (`npm run db:seed:prod`).
- [ ] DNS switched to live traffic.
- [ ] Stakeholders notified.
- [ ] Support team standby for hypercare period.
