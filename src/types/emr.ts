export interface Patient {
  id: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contactDetails: string;
  emergencyContact: string;
  medicalHistory: string[];
  assignedNurseId: string;
  assignedDoctorId: string;
}

export interface VitalSigns {
  id: string;
  patientId: string;
  temperature: number;
  bloodPressure: string;
  pulse: number;
  respiratoryRate: number;
  glucoseLevel: number;
  timestamp: Date;
  recordedBy: string;
}

export interface CarePlan {
  id: string;
  patientId: string;
  diagnosis: string;
  goal: string;
  intervention: string;
  evaluation: string;
  createdBy: string;
  createdAt: Date;
}

export interface DrugChart {
  id: string;
  patientId: string;
  drugName: string;
  dosage: string;
  frequency: 'BD' | 'TDS' | 'QDS';
  prescribedBy: string;
  prescribedAt: Date;
  administeredBy?: string;
}

export interface IntakeOutput {
  id: string;
  patientId: string;
  type: 'Intake' | 'Output';
  fluidType: string;
  volume: number;
  timestamp: Date;
  recordedBy: string;
}

export interface NursingReport {
  id: string;
  patientId: string;
  content: string;
  timestamp: Date;
  recordedBy: string;
}
