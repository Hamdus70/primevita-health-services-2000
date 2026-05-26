# Disaster Recovery Plan

This document outlines procedures for restoring EMR platform operations during critical failures.

## 1. Database Outage / Corruption
**Symptom:** App is inaccessible, returning 500s or timeouts, or data corruption detected.
**Action:**
1. Put app in maintenance mode.
2. Ensure no rogue processes are writing to DB.
3. Locate latest backup from object storage or automated backup system.
4. Execute Restore Script: \`npm run db:restore <backup_file> --confirm\`
5. Verify integrity via \`npm run db:health\`
6. Remove maintenance mode.

## 2. Queue (Redis) Failures
**Symptom:** Notifications not sending, background jobs (workflows, summary) not executing.
**Action:**
1. Check Redis instance metrics. If OOM, flush temporary cache keys.
2. If Redis crashed, restart Redis service. BullMQ handles state recovery for persistent queues.
3. Restart workers: \`npm run workers:start\`
4. Verify queue health: \`npm run queue:health\`
5. Requeue dead letters through BullMQ dashboard or CLI script.

## 3. Credential Compromise
**Action:**
1. Revoke the compromised secret immediately.
2. Generate a new secret.
3. Update environment variables in Vercel / Secret Manager.
4. Redeploy application to cycle environment cache.
5. Invalidate existing active user sessions if NEXTAUTH_SECRET was rotated.

## 4. Rollback Deployment
**Action:**
1. In Vercel dashboard, go to Deployments.
2. Select previous stable deployment.
3. Click "Promote to Production".
4. If database schema was altered by recent deployment, roll back Prisma migration matching the older commit BEFORE promoting.

## 5. Outage Communication Checklist
- [ ] Notify stakeholders/hospital admins immediately (Slack/Email/SMS).
- [ ] Update status page.
- [ ] Send 15-minute interval updates during active triage.
- [ ] Send post-mortem report within 48 hours after full recovery.
