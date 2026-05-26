# Healthcare EMR System: Database Schema Design

*This document outlines the scalable, normalised, and integrity-enforced relational database schema that supports the multi-portal hospital-grade EMR specified.*

## 1. Core Principles

- **No Active Users Without Applications:** Users cannot exist in the active `patients` or `staff` tables without a corresponding `application_id`.
- **Permanent Record Retention:** All approved records are permanently stored to ensure complete system traceability.
- **Strict Role-Based Isolation:** `applications` track identity lifecycle, `staff` and `patients` track workflow state, and `assignments` track their interactions.

---

## 2. Table Definitions

### 2.1 Applications (`applications`)
*Central record for identity and onboarding before an entity becomes active.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `application_id` | UUID | PK | Unique identifier for initial application |
| `application_type` | ENUM | NOT NULL | `patient` or `staff` |
| `role` | VARCHAR | NULL | Role (e.g. nurse, doctor). Null for patients. |
| `full_name` | VARCHAR | NOT NULL | Applicant full name |
| `email` | VARCHAR | UNIQUE, NOT NULL | Must be unique across all users |
| `phone` | VARCHAR | NOT NULL | Contact number |
| `status` | ENUM | DEFAULT 'pending' | `pending`, `review`, `interview`, `approved`, `rejected` |
| `submitted_at` | TIMESTAMP | DEFAULT NOW() | When application was submitted |
| `reviewed_by` | UUID | FK | `admin_id` who reviewed |
| `decision_at` | TIMESTAMP | NULL | Time of authorization/rejection |

### 2.2 Patients (`patients`)
*Active database of admitted and treated individuals.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `patient_id` | UUID | PK | Unique active identifier |
| `application_id` | UUID | FK, UNIQUE | Links directly to `applications` |
| `full_name` | VARCHAR | NOT NULL | Name (synchronized from app) |
| `email` | VARCHAR | UNIQUE | Login email |
| `phone` | VARCHAR |  | Primary phone |
| `address` | TEXT |  | Physical address |
| `status` | ENUM | DEFAULT 'active' | `active`, `discharged`, `inactive` |
| `created_at` | TIMESTAMP | DEFAULT NOW() | System activation time |

### 2.3 Staff (`staff`)
*Active workforce registry for clinicians and specialists.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `staff_id` | UUID | PK | Unique workforce identifier |
| `application_id` | UUID | FK, UNIQUE | Links directly to `applications` |
| `role` | ENUM | NOT NULL | `nurse`, `doctor`, `caregiver`, `physiotherapist` |
| `full_name` | VARCHAR | NOT NULL | Name |
| `email` | VARCHAR | UNIQUE | Contact/Login email |
| `phone` | VARCHAR |  | Direct line |
| `department` | VARCHAR |  | e.g. Internal Medicine |
| `status` | ENUM | DEFAULT 'active' | `active`, `leave`, `inactive` |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When they joined |

### 2.4 Emergency Contacts (`emergency_contacts`)
*Patient next-of-kin / emergency outreach.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `contact_id` | UUID | PK |  |
| `patient_id` | UUID | FK | Reference to `patients` |
| `full_name` | VARCHAR | NOT NULL |  |
| `relationship` | VARCHAR | NOT NULL |  |
| `phone_primary` | VARCHAR | NOT NULL |  |
| `phone_secondary`| VARCHAR | NULL |  |
| `email` | VARCHAR | NULL |  |
| `address` | TEXT | NULL |  |
| `occupation` | VARCHAR | NULL |  |
| `id_type` | VARCHAR | NOT NULL | e.g. Passport, NIN |
| `id_number` | VARCHAR | NOT NULL | Identifiable ID string |

### 2.5 Guarantors (`guarantors`)
*Accountability references for staff onboarding.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `guarantor_id` | UUID | PK |  |
| `staff_id` | UUID | FK | Reference to `staff` |
| `full_name` | VARCHAR | NOT NULL |  |
| `relationship` | VARCHAR | NOT NULL |  |
| `phone_primary` | VARCHAR | NOT NULL |  |
| `phone_secondary`| VARCHAR | NULL |  |
| `email` | VARCHAR | NULL |  |
| `address` | TEXT | NULL |  |
| `occupation` | VARCHAR | NULL |  |
| `workplace` | VARCHAR | NULL |  |
| `id_type` | VARCHAR | NOT NULL | e.g. Passport, NIN |
| `id_number` | VARCHAR | NOT NULL | Identifiable ID string |

### 2.6 Assignments (`assignments`)
*Relational pivot mapping which workforce members are caring for which patients.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `assignment_id` | UUID | PK |  |
| `patient_id` | UUID | FK | Reference to `patients` |
| `staff_id` | UUID | FK | Reference to `staff` |
| `role_type` | ENUM | NOT NULL | Explicit copy of staff role context |
| `assigned_at` | TIMESTAMP | DEFAULT NOW() | Time of linkage |
| `assigned_by` | UUID | FK | `admin_id` who dispatched |

### 2.7 Attendance Logs (`attendance_logs`)
*Immutable history tracking system log-ons.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `attendance_id` | UUID | PK |  |
| `staff_id` | UUID | FK | Reference to `staff` |
| `date` | DATE | NOT NULL | Date component |
| `login_time` | TIME | NULL | Explicit time |
| `activity_flag` | BOOLEAN | DEFAULT TRUE | True if action performed |
| `status` | ENUM | NOT NULL | `present`, `absent`, `leave` |

### 2.8 Payments (`payments`)
*Initial billing obligations.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `payment_id` | UUID | PK |  |
| `patient_id` | UUID | FK | Billed to which patient |
| `amount_due` | NUMERIC | NOT NULL |  |
| `due_date` | DATE | NOT NULL | Deadline for billing |
| `status` | ENUM | DEFAULT 'pending' | `pending`, `paid`, `overdue` |
| `created_at` | TIMESTAMP | DEFAULT NOW() |  |

### 2.9 Receipts (`receipts`)
*Ledger of actual funds received.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `receipt_id` | UUID | PK |  |
| `payment_id` | UUID | FK | Refers to `payments` obligation |
| `amount_paid` | NUMERIC | NOT NULL | Actual settled amount |
| `payment_date` | TIMESTAMP | DEFAULT NOW() | When payment cleared |
| `method` | ENUM | NOT NULL | e.g. `card`, `transfer`, `cash` |

### 2.10 Notifications (`notifications`)
*Internal system alerts.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `notification_id`| UUID | PK |  |
| `user_type` | ENUM | NOT NULL | `admin`, `staff`, `patient` |
| `user_id` | UUID | NOT NULL | Recipient UUID |
| `message` | TEXT | NOT NULL | Alert body |
| `type` | ENUM | NOT NULL | `application`, `payment`, `interview`, `system` |
| `read_status` | BOOLEAN | DEFAULT FALSE | Status toggle |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Time sent |

### 2.11 Announcements (`announcements`)
*Global and targeted broadcasts.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `announcement_id`| UUID | PK |  |
| `title` | VARCHAR | NOT NULL |  |
| `message` | TEXT | NOT NULL |  |
| `target_type` | ENUM | NOT NULL | `all`, `staff`, `patient`, `specific` |
| `created_by` | UUID | FK | `admin_id` author |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Time of broadcast |

### 2.12 Audit Logs (`audit_logs`)
*Immutable Ledger tracking what Admins did.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `log_id` | UUID | PK |  |
| `admin_id` | UUID | NOT NULL | Actor (or 'SYSTEM') |
| `action` | VARCHAR | NOT NULL | Summary line |
| `entity_type` | VARCHAR | NOT NULL | `application`, `staff`, `patient`, `payment` |
| `entity_id` | UUID | NOT NULL | Changed target's UUID |
| `timestamp` | TIMESTAMP | DEFAULT NOW() |  |

### 2.13 Interviews (`interviews`)
*Tracking scheduled vetting for workforce and selected patients.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `interview_id` | UUID | PK |  |
| `application_id` | UUID | FK | Ties to the vetting step |
| `scheduled_date` | TIMESTAMP | NOT NULL |  |
| `mode` | ENUM | NOT NULL | `virtual`, `physical` |
| `status` | ENUM | DEFAULT 'scheduled'| `scheduled`, `completed`, `cancelled` |
| `result` | ENUM | NULL | `pass`, `fail` |

### 2.14 User Credentials (`user_credentials`)
*Automated authentication parameters for active profiles.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `credential_id` | UUID | PK |  |
| `user_id` | UUID | FK | Maps to `patient_id` or `staff_id` |
| `username` | VARCHAR | UNIQUE, NOT NULL | Format: PT-XXXX or STF-ROLE-XXXX |
| `password_hash`| VARCHAR | NOT NULL | Securely hashed password |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Generation timestamp |
| `acknowledged` | BOOLEAN | DEFAULT FALSE | Has user confirmed backup |

### 2.15 Patient Assessments (`patient_assessments`)
*Mandatory non-duplicative clinical intake telemetry.*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `assessment_id`| UUID | PK |  |
| `patient_id` | UUID | FK | Maps back to `patients` |
| `responses` | JSONB | NOT NULL | Structured dict of symptoms, history, etc. |
| `submitted_at` | TIMESTAMP | DEFAULT NOW() | Write once |

---

## 3. Mandatory Constraints & Data Integrity

1. **Orphans Prohibited:** FK mappings on `patients` and `staff` ensure they *must* link to an `application_id`.
2. **RESTRICT (No Cascade Delete):** `ON DELETE RESTRICT` is enforced on applications. Once an application matures into a `staff` or `patient`, it cannot be deleted.
3. **One-to-One Lifecycle:** `patients.application_id` and `staff.application_id` must have `UNIQUE` constraints so that a single application cannot be used to spawn multiple active user accounts.
4. **Unique Emails Ecosystem-Wide:** The email field must carry a `UNIQUE` constraint over both `staff` and `patients` independently.
5. **Ledger Integrity:** Updates on `audit_logs` triggers should be strictly disabled to ensure it is write-only. If someone modifies a row, DB policy blocks the write.
6. **Billing Chain Integrity:** A `receipt` cannot exist without a matching `payment`, and a `payment` cannot be mapped down without an active `patient` (ensured by Foreign Keys).
