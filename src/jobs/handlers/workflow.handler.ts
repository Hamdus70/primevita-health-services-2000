import { Job } from "bullmq";
import { withTransaction } from "@/lib/db/transaction";
import { JobPayloads, QueueName } from "@/lib/jobs/job-types";

function getNextStage(currentStage: string, event: string): any | null {
  if (currentStage === "REGISTRATION_COMPLETE" && event === "QUICK_ASSESSMENT_SUBMITTED") {
    return "QUICK_ASSESSMENT_SUBMITTED";
  }
  if (currentStage === "QUICK_ASSESSMENT_SUBMITTED" && event === "ASSIGNMENT_PENDING") {
    return "ASSIGNMENT_PENDING";
  }
  if (currentStage === "VISIT_IN_PROGRESS" && event === "VITALS_COMPLETED") {
    return "VITALS_COMPLETED";
  }
  if (currentStage === "VITALS_COMPLETED" && event === "CARE_PLAN_PENDING") {
    return "CARE_PLAN_PENDING";
  }
  if (currentStage === "MEDICATION_ACTIVE" && event === "REVIEW_REQUIRED") {
    return "REVIEW_REQUIRED";
  }
  return null;
}

export async function processWorkflowJob(job: Job<JobPayloads[QueueName.WORKFLOW]>) {
  const { patientId, currentStage, event } = job.data;
  const nextStage = getNextStage(currentStage, event);

  if (!nextStage) return;

  await withTransaction(async (tx) => {
    const existing = await tx.patientWorkflowStatus.findFirst({
        where: { patient_id: patientId },
        orderBy: { created_at: "desc" }
    });

    if (existing && existing.workflow_stage === nextStage) {
        return; // Idempotent
    }

    // Advance to next stage
    await tx.patientWorkflowStatus.create({
      data: {
        patient_id: patientId,
        workflow_stage: nextStage,
        triggered_automatically: true,
        status_notes: `Auto-advanced from ${currentStage} by event ${event}`
      }
    });
  });
}
