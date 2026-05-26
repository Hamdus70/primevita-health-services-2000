import { Worker, WorkerOptions, Job } from "bullmq";
import { getRedisConnection } from "./redis";
import { QueueName } from "./job-types";

// Handlers
import { processAttendanceJob } from "../../jobs/handlers/attendance.handler";
import { processMonthlySummaryJob } from "../../jobs/handlers/monthly-summary.handler";
import { processPaymentReminderJob } from "../../jobs/handlers/payment-reminder.handler";
import { processWorkflowJob } from "../../jobs/handlers/workflow.handler";
import { processNotificationJob } from "../../jobs/handlers/notification.handler";
import { processAiInvestigatorJob } from "../../jobs/handlers/ai-investigator.handler";

// Base worker configuration
const getDefaultWorkerOptions = (): WorkerOptions => ({
  connection: getRedisConnection(),
  concurrency: 5,
  limiter: {
    max: 1000,
    duration: 1000,
  }
});

// A registry to store active workers for graceful shutdown
export const activeWorkers: Worker[] = [];

type JobProcessor<T = any> = (job: Job<T>) => Promise<any>;

export function createWorker<T>(
  queueName: QueueName,
  processor: JobProcessor<T>,
  options?: Partial<WorkerOptions>
): Worker<T> {
  const workerOpts: WorkerOptions = {
    ...getDefaultWorkerOptions(),
    ...options
  };

  const worker = new Worker<T>(queueName, async (job: Job<T>) => {
    // Add structured logging or APM tracking here if needed
    console.log(`[Worker] Started processing job ${job.id} for queue ${queueName}`);
    try {
      const result = await processor(job);
      console.log(`[Worker] Completed job ${job.id} for queue ${queueName}`);
      return result;
    } catch (error) {
      console.error(`[Worker] Failed job ${job.id} for queue ${queueName}:`, error);
      throw error;
    }
  }, workerOpts);

  worker.on('failed', (job, err) => {
    // Dead-letter logic or advanced notification could be placed here
    console.error(`[Worker] Job ${job?.id} has failed with ${err.message}`);
  });

  worker.on('error', err => {
    // Log unexpected worker errors
    console.error(`[Worker] Unexpected error in queue ${queueName}`, err);
  });

  activeWorkers.push(worker);
  return worker;
}

// Initialize all workers
export function startAllWorkers() {
  const connection = getRedisConnection();
  if (!connection) {
    console.info("[Worker] Redis not configured, skipping worker initialization.");
    return;
  }
  createWorker(QueueName.ATTENDANCE, processAttendanceJob);
  createWorker(QueueName.MONTHLY_SUMMARY, processMonthlySummaryJob);
  createWorker(QueueName.PAYMENT_REMINDER, processPaymentReminderJob);
  createWorker(QueueName.WORKFLOW, processWorkflowJob);
  createWorker(QueueName.NOTIFICATION, processNotificationJob);
  createWorker(QueueName.AI_INVESTIGATOR, processAiInvestigatorJob);
  console.log("All workers started structure.");
}

export async function shutdownWorkers() {
  console.log('Shutting down workers...');
  await Promise.allSettled(activeWorkers.map(w => w.close()));
  console.log('All workers shut down.');
}
