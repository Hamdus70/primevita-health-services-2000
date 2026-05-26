import { Job } from "bullmq";
import { withTransaction } from "@/lib/db/transaction";
import { JobPayloads, QueueName } from "@/lib/jobs/job-types";
import { sendNotificationEmail, sendOtpEmail, sendTempPasswordEmail } from "@/lib/integrations/email/send-email";
import { sendSmsNotification } from "@/lib/integrations/sms/send-sms";

export async function processNotificationJob(job: Job<JobPayloads[QueueName.NOTIFICATION]>) {
  const { recipientId, type, title, message, channel } = job.data;

  await withTransaction(async (tx) => {
    console.log(`[Notification Dispatch] Channel: ${channel}, Type: ${type}, Recipient: ${recipientId}`);
    
    if (channel === "EMAIL") {
      if (type === "PASSWORD_RESET_OTP") {
        await sendOtpEmail(recipientId, message.replace("Your OTP is: ", ""));
      } else if (type === "TEMP_PASSWORD_DELIVERY") {
        await sendTempPasswordEmail(recipientId, message.replace("Your temporary password is: ", ""));
      } else {
        await sendNotificationEmail(recipientId, title, message);
      }
    } else if (channel === "SMS") {
      await sendSmsNotification(recipientId, message);
    } else {
      // SYSTEM notifications integration
      console.log(`[Notification Dispatch] Title: ${title}`);
      console.log(`[Notification Dispatch] Message: ${message}`);
    }
  });
}
