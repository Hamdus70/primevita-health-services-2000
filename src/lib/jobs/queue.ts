import { Queue, DefaultJobOptions } from "bullmq";
import { getRedisConnection } from "./redis";
import { QueueName } from "./job-types";

const defaultJobOptions: DefaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
  removeOnComplete: {
    age: 3600, // keep for 1 hour
    count: 1000, // keep max 1000
  },
  removeOnFail: {
    age: 24 * 3600 // keep failed for 24 hours
  }
};

const connection = getRedisConnection();

const getQueue = (name: QueueName) => connection ? new Queue(name, {
  connection,
  defaultJobOptions
}) : null;

export const queues = {
  attendance: getQueue(QueueName.ATTENDANCE),
  paymentReminder: getQueue(QueueName.PAYMENT_REMINDER),
  workflow: getQueue(QueueName.WORKFLOW),
  notification: getQueue(QueueName.NOTIFICATION),
  aiInvestigator: getQueue(QueueName.AI_INVESTIGATOR),
  monthlySummary: getQueue(QueueName.MONTHLY_SUMMARY),
};

export async function enqueue<T extends QueueName>(queueName: T, jobName: string, data: any, options?: any) {
  const queue = Object.values(queues).find(q => q && q.name === queueName);
  if (!queue) {
    console.warn(`[Queue] Queue ${queueName} not available (Redis disabled)`);
    return null;
  }
  return await queue.add(jobName, data, options);
}

export async function scheduleRecurringJobs() {
  if (!connection) {
    console.info("[Queue] Redis not configured, skipping recurring job scheduling.");
    return;
  }
  try {
    // Every day at 23:59
    await queues.attendance?.add("DAILY_SWEEP", { type: "SWEEP" }, {
      repeat: { pattern: "59 23 * * *" }
    });

    // Every day at 08:00
    await queues.paymentReminder?.add("DAILY_REMINDER_SCAN", { type: "SCAN" }, {
      repeat: { pattern: "0 8 * * *" }
    });

    // Every 15 minutes
    await queues.aiInvestigator?.add("VITALS_ANOMALY_SWEEP", { type: "ANOMALY_SWEEP" }, {
      repeat: { pattern: "*/15 * * * *" }
    });

    // First day of month at 00:05
    await queues.monthlySummary?.add("MONTHLY_SUMMARY_GENERATE", { type: "GENERATE" }, {
      repeat: { pattern: "5 0 1 * *" }
    });
    
    console.log("[Queue] Recurring jobs scheduled");
  } catch (err: any) {
    console.error("[Queue] Failed to schedule recurring jobs:", err.message);
  }
}
