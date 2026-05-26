import { Job } from "bullmq";
import { withTransaction } from "@/lib/db/transaction";
import { JobPayloads, QueueName } from "@/lib/jobs/job-types";
import { 
  runTriage, 
  runClinicalSummary, 
  runPrescriptionSafety, 
  runAnomalyDetection,
  runCarePlanSuggestion,
  runDiagnosticSupport 
} from "@/lib/integrations/ai/gemini";
import { JobRetryError } from "@/lib/jobs/job-errors";

export async function processAiInvestigatorJob(job: Job<JobPayloads[QueueName.AI_INVESTIGATOR]>) {
  const { type, patientId, data } = job.data;

  // Perform AI Call outside transaction to avoid holding DB locks during slow network
  let aiResult: any;
  let investigationType: any = "TRIAGE_ANALYSIS";
  
  try {
    if (type === "TRIAGE") {
      investigationType = "TRIAGE_ANALYSIS";
      aiResult = await runTriage(data);
    } else if (type === "ANOMALY_MONITORING") {
      investigationType = "VITALS_ANOMALY_DETECTION";
      aiResult = await runAnomalyDetection(data);
    } else if (type === "SUMMARY") {
      investigationType = "CLINICAL_SUMMARY";
      aiResult = await runClinicalSummary(data);
    } else {
      // Fallback
      aiResult = await runDiagnosticSupport(data);
    }
  } catch (error: any) {
    throw new JobRetryError(`Gemini AI call failed: ${error.message}`);
  }

  await withTransaction(async (tx) => {
    let parsedText = {};
    let severityLevel: any = "LOW";

    try {
      if (aiResult.text) parsedText = JSON.parse(aiResult.text);
      if ((parsedText as any).severity_level) {
        severityLevel = (parsedText as any).severity_level;
      }
    } catch (e) {
      console.warn("Failed to parse Gemini output as JSON", aiResult.text);
    }

    await tx.aIInvestigationRecord.create({
      data: {
        patient_id: patientId,
        investigation_type: investigationType,
        input_context_summary: JSON.stringify(data),
        ai_response_text: aiResult.text,
        ai_confidence_score: 0.95,
        severity_level: severityLevel,
        review_status: "PENDING_REVIEW",
        model_name: aiResult.modelName,
        token_usage: aiResult.tokenUsage,
        prompt_version: "v1",
        processing_time_ms: aiResult.processingTimeMs
      }
    });
  });
}
