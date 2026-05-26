export interface CurrentUser {
  id: string;
  username: string;
  linkedUserType: "PATIENT" | "STAFF";
  patientId?: string | null;
  patientPublicId?: string | null;
  staffId?: string | null;
  staffPublicId?: string | null;
  role?: "DOCTOR" | "NURSE" | "CAREGIVER" | "PHYSIOTHERAPIST" | null;
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED" | "INTERVIEW_SCHEDULED" | null;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ServiceContext {
  user?: CurrentUser;
}
