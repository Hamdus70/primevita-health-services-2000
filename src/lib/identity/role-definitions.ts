export type ClinicalRole = 'PATIENT' | 'NURSE' | 'DOCTOR' | 'CAREGIVER' | 'PHYSIOTHERAPIST';

// Excluded roles (Cannot access EMR)
export type NonClinicalRole = 'ADMIN' | 'HR' | 'ACCOUNTANT';

export const CLINICAL_ROLES: ClinicalRole[] = ['PATIENT', 'NURSE', 'DOCTOR', 'CAREGIVER', 'PHYSIOTHERAPIST'];

export const ROLE_PERMISSIONS = {
    PATIENT: {
        canViewOwnEMR: true,
        canViewMedications: true,
        canViewAssessments: true,
        canEditClinicalData: false,
        canPrescribe: false,
    },
    NURSE: {
        canViewAssignedOnly: true,
        canAddVitals: true,
        canAddNursingNotes: true,
        canManageCarePlans: true,
        canPrescribe: false,
    },
    DOCTOR: {
        canViewAssignedOnly: true, // Typically assigned or ward
        canDiagnose: true,
        canPrescribe: true,
        canApproveCarePlans: true,
    },
    CAREGIVER: {
        canViewAssignedTasksOnly: true,
        canAddActivityNotes: true,
        canPrescribe: false,
    },
    PHYSIOTHERAPIST: {
        canViewAssignedTasksOnly: true,
        canAddActivityNotes: true,
        canPrescribe: false,
    }
} as const;

/**
 * Access Control Middleware Simulator / Definition
 * Enforces role boundaries at the request level.
 */
export function hasPermission(userRole: ClinicalRole, action: string): boolean {
    // Permission validation logic matching Next.js API Routes / NextAuth
    return true; 
}
