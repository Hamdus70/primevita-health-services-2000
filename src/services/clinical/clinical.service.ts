import { getDb } from "@/lib/db/request-context";
import { withTransaction } from "@/lib/db/transaction";
import { VitalSignRequest, CarePlanRequest, DoctorNoteRequest, MedicationChartRequest } from "@/lib/validation/clinical";
import { QuickAssessmentRequest } from "@/lib/validation/patient";
import { WorkflowStage } from "@prisma/client";
import { AuthorizationError } from "@/lib/api/errors";

export class ClinicalService {

  static async submitQuickAssessment(data: QuickAssessmentRequest, patientId: string) {
    return withTransaction(async (tx) => {
      // 1. Create QuickAssessment
      const assessment = await tx.quickAssessment.create({
        data: {
          patient_id: patientId,
          symptoms: data.symptoms,
          condition_description: data.condition_description,
          pain_level: data.pain_level,
        }
      });

      // 2. update patient flag (could be adding high pain level tag, etc) - optional for now
      // 3. trigger workflow progression
      await tx.patientWorkflowStatus.create({
        data: {
          patient_id: patientId,
          workflow_stage: "TRIAGE" as WorkflowStage,
          status_notes: "Assessment submitted"
        }
      });

      // 4. optionally trigger AI investigator later
      try {
        const { enqueue } = await import("@/lib/jobs/queue");
        const { QueueName } = await import("@/lib/jobs/job-types");
        
        await enqueue(QueueName.WORKFLOW, "QA_WORKFLOW", {
          patientId: patientId,
          currentStage: "REGISTRATION_COMPLETE",
          event: "QUICK_ASSESSMENT_SUBMITTED"
        });

        await enqueue(QueueName.AI_INVESTIGATOR, "QA_TRIAGE", {
          type: "TRIAGE",
          patientId: patientId,
          data: data
        });
      } catch (err: any) {
        console.error("[Queue] submitQuickAssessment error: ", err.message);
      }

      return assessment;
    });
  }

  static async recordVitals(data: VitalSignRequest, staffId: string, role?: string | null) {
    if (role !== "NURSE" && role !== "DOCTOR") {
      throw new AuthorizationError("Only NURSE or DOCTOR can record vitals");
    }

    return withTransaction(async (tx) => {
      // 1. Create VitalSign
      const vitals = await tx.vitalSign.create({
        data: {
          patient_id: data.patient_id,
          recorded_by_staff_id: staffId,
          temperature: data.temperature,
          systolic_bp: data.blood_pressure_systolic,
          diastolic_bp: data.blood_pressure_diastolic,
          pulse_rate: data.pulse_rate,
          respiratory_rate: data.respiratory_rate,
          oxygen_saturation: data.oxygen_saturation,
          blood_glucose: data.blood_glucose,
          weight: data.weight_kg,
          height: data.height_cm,
        }
      });

      // 2. Create StaffServiceLog
      await tx.staffServiceLog.create({
        data: {
          staff_id: staffId,
          patient_id: data.patient_id,
          action_type: "VITALS_DOCUMENTED",
          action_description: "Recorded vitals",
        }
      });

      // 3. trigger anomaly detection hook placeholder
      try {
        const { enqueue } = await import("@/lib/jobs/queue");
        const { QueueName } = await import("@/lib/jobs/job-types");
        
        await enqueue(QueueName.WORKFLOW, "VITALS_WORKFLOW", {
          patientId: data.patient_id,
          currentStage: "VISIT_IN_PROGRESS",
          event: "VITALS_COMPLETED"
        });

        await enqueue(QueueName.AI_INVESTIGATOR, "VITALS_ANOMALY", {
          type: "ANOMALY_MONITORING",
          patientId: data.patient_id,
          data: data
        });
      } catch (err: any) {
        console.error("[Queue] recordVitals error: ", err.message);
      }
      
      return vitals;
    });
  }

  static async createCarePlan(data: CarePlanRequest, staffId: string, role?: string | null) {
    if (role !== "NURSE" && role !== "CAREGIVER") {
      throw new AuthorizationError("Only NURSE or CAREGIVER can create care plans");
    }

    return withTransaction(async (tx) => {
      const plan = await tx.carePlan.create({
        data: {
          patient_id: data.patient_id,
          created_by_staff_id: staffId,
          nursing_problem: data.nursing_problem,
          goal: data.goal,
          interventions: data.interventions,
          start_date: new Date(),
        }
      });
      return plan;
    });
  }

  static async createDoctorNote(data: DoctorNoteRequest, staffId: string, role?: string | null) {
    if (role !== "DOCTOR") {
      throw new AuthorizationError("Only DOCTOR can create doctor notes");
    }

    return withTransaction(async (tx) => {
      const note = await tx.doctorNote.create({
        data: {
          patient_id: data.patient_id,
          authored_by_staff_id: staffId,
          diagnosis: data.assessment,
          treatment_plan: data.plan,
          prescription_notes: data.plan,
          follow_up_instructions: data.follow_up_required ? "Follow up required" : undefined,
        }
      });

      await tx.staffServiceLog.create({
        data: {
          staff_id: staffId,
          patient_id: data.patient_id,
          action_type: "DOCTOR_NOTE_CREATED",
          action_description: "Created doctor note",
        }
      });

      return note;
    });
  }

  static async createMedicationChart(data: MedicationChartRequest, staffId: string, role?: string | null) {
    if (role !== "DOCTOR") {
      throw new AuthorizationError("Only DOCTOR can prescribe medications");
    }

    return withTransaction(async (tx) => {
      // AI prescription safety hook inserted here later

      const chart = await tx.medicationChart.create({
        data: {
          patient_id: data.patient_id,
          prescribed_by_staff_id: staffId,
          drug_name: data.drug_name,
          dosage: data.dosage,
          route: data.route,
          frequency: data.frequency as any,
          duration: data.duration,
          start_date: new Date(data.start_date),
        }
      });
      return chart;
    });
  }
}

