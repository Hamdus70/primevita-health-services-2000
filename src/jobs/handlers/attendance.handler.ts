import { Job } from "bullmq";
import { withTransaction } from "@/lib/db/transaction";
import { JobPayloads, QueueName } from "@/lib/jobs/job-types";
import { JobFatalError } from "@/lib/jobs/job-errors";

export async function processAttendanceJob(job: Job<JobPayloads[QueueName.ATTENDANCE]>) {
  const { staffId, type, timestamp } = job.data;
  const date = new Date(timestamp);
  
  // Set to midnight UTC for date comparison
  const dateOnly = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

  await withTransaction(async (tx) => {
    const existing = await tx.staffAttendance.findFirst({
      where: {
        staff_id: staffId,
        attendance_date: dateOnly
      }
    });

    if (existing) {
      if (type === "LOGIN" && !existing.login_time) {
        await tx.staffAttendance.update({
          where: { id: existing.id },
          data: { login_time: date }
        });
      }
      return; 
    }

    let status: "PRESENT" | "LATE" | "ABSENT" | "OFF_DUTY" = "PRESENT";
    
    if (type === "LOGIN") {
      // Basic rule: login after 09:00 AM local time considered LATE
      if (date.getUTCHours() >= 9) {
        status = "LATE";
      }
    } else if (type === "TIMEOUT") {
      status = "ABSENT";
    }

    await tx.staffAttendance.create({
      data: {
        staff_id: staffId,
        attendance_date: dateOnly,
        attendance_status: status,
        login_time: type === "LOGIN" ? date : undefined,
        marked_automatically: true,
        auto_marked_at: new Date(),
        attendance_notes: `Auto-marked by ${type} event`
      }
    });
  });
}
