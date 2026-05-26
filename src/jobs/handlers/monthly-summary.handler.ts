import { Job } from "bullmq";
import { withTransaction } from "@/lib/db/transaction";
import { JobPayloads, QueueName } from "@/lib/jobs/job-types";

export async function processMonthlySummaryJob(job: Job<JobPayloads[QueueName.MONTHLY_SUMMARY]>) {
  const { year, month } = job.data;

  await withTransaction(async (tx) => {
    // Basic logic to illustrate background job gathering data
    const activeStaff = await tx.staff.findMany({ 
      where: { deleted_at: null } 
    });

    for (const staff of activeStaff) {
      // To strictly ensure idempotency:
      const existing = await tx.staffMonthlySummary.findFirst({
        where: { staff_id: staff.id, summary_year: year, summary_month: month }
      });

      if (existing) {
        continue;
      }

      // Mock calculation (in a real app, you'd aggregate from StaffAttendance)
      // For this step, we just create the summary
      const presentCount = await tx.staffAttendance.count({
        where: {
          staff_id: staff.id,
          attendance_status: "PRESENT",
          attendance_date: {
             gte: new Date(year, month - 1, 1),
             lt: new Date(year, month, 1)
          }
        }
      });

      await tx.staffMonthlySummary.create({
        data: {
          staff_id: staff.id,
          summary_year: year,
          summary_month: month,
          total_present_days: presentCount,
          total_absent_days: 0,
          total_late_days: 0,
          total_off_duty_days: 0,
          total_service_actions: 0,
          activity_score: 1.0
        }
      });
    }
  });
}
