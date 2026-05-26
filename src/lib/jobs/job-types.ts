export enum QueueName {
  ATTENDANCE = "attendanceQueue",
  PAYMENT_REMINDER = "paymentReminderQueue",
  WORKFLOW = "workflowQueue",
  NOTIFICATION = "notificationQueue",
  AI_INVESTIGATOR = "aiInvestigatorQueue",
  MONTHLY_SUMMARY = "monthlySummaryQueue"
}

export interface JobPayloads {
  [QueueName.ATTENDANCE]: { staffId: string; type: "LOGIN" | "LOGOUT" | "TIMEOUT"; timestamp: string; };
  [QueueName.PAYMENT_REMINDER]: { invoiceId: string; type: "DUE_SOON" | "OVERDUE"; };
  [QueueName.WORKFLOW]: { patientId: string; currentStage: string; event: string; };
  [QueueName.NOTIFICATION]: { recipientId: string; type: string; title: string; message: string; channel: "EMAIL" | "SMS" | "SYSTEM"; };
  [QueueName.AI_INVESTIGATOR]: { type: "TRIAGE" | "ANOMALY_MONITORING" | "SUMMARY"; patientId: string; data?: any; };
  [QueueName.MONTHLY_SUMMARY]: { year: number; month: number; };
}

export type AnyJobPayload = JobPayloads[keyof JobPayloads];
