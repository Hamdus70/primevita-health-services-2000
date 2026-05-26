export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'INTERVIEW_SCHEDULED' | 'APPROVED' | 'REJECTED';

export type ApplicantType = 'PATIENT' | 'NURSE' | 'DOCTOR' | 'CAREGIVER' | 'PHYSIOTHERAPIST';

export interface Biodata {
  email: string;
  phone: string;
  [key: string]: any;
}

export interface Application {
  id: string;
  fullName: string;
  type: ApplicantType;
  status: ApplicationStatus;
  biodata: Biodata;
  createdAt: string;
  updatedAt: string;
}
