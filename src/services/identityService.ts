import { prisma } from '@/lib/db/prisma';
import { Role } from '@prisma/client';
import { SequenceService } from './identity/sequence.service';

export { Role };

export interface UserRegistration {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: Role;
    dateOfBirth: Date; // Important: added DOB
}

export const IdentityService = {
  /**
   * Generates a patient username: CL-[INITIALS]-[SEQUENCE]
   */
  async generatePatientUsername(firstName: string, lastName: string): Promise<string> {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase().replace(/[^A-Z]/g, '');
    const seq = await SequenceService.getNextSequence('PATIENT');
    return `CL-${initials}-${String(seq).padStart(4, '0')}`;
  },

  /**
   * Generates a staff ID: HSP-[ROLE]-[SEQUENCE]
   */
  async generateStaffId(role: Role): Promise<string> {
    const roleCode = {
        NURSE: 'NUR',
        DOCTOR: 'DOC',
        CAREGIVER: 'CRG',
        PHYSIOTHERAPIST: 'PHY',
        ADMIN: 'ADM',
        SUPER_ADMIN: 'SAD',
        ACCOUNTANT: 'ACC'
    }[role] || 'STF';
    
    const seq = await SequenceService.getNextSequence('STAFF');
    return `HSP-${roleCode}-${String(seq).padStart(4, '0')}`;
  },

  // ... other methods ...
};
