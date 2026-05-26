import { Job } from "bullmq";
import { withTransaction } from "@/lib/db/transaction";
import { JobPayloads, QueueName } from "@/lib/jobs/job-types";
import { JobRetryError } from "@/lib/jobs/job-errors";

export async function processPaymentReminderJob(job: Job<JobPayloads[QueueName.PAYMENT_REMINDER]>) {
  const { invoiceId, type } = job.data;

  await withTransaction(async (tx) => {
    const invoice = await tx.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
        return; // Nothing to do if it doesn't exist
    }

    // Check idempotency
    const existingReminder = await tx.paymentReminder.findFirst({
      where: {
        payment_record_id: invoiceId, // Assumption: using invoiceId here
        reminder_type: type
      }
    });

    if (existingReminder) {
      return;
    }

    try {
      await tx.paymentReminder.create({
        data: {
          payment_record_id: invoiceId,
          patient_id: invoice.patient_id,
          reminder_type: type,
          reminder_status: "SCHEDULED",
          scheduled_for: new Date()
        }
      });
      // In reality, this might also dispatch an email job immediately
    } catch (e: any) {
      throw new JobRetryError(e.message);
    }
  });
}
