# Healthcare Identity Lifecycle System Architecture

## CORE OBJECTIVE
A secure identity system that supports patient auto-onboarding, staff controlled onboarding, unique credential generation, login, OTP credential recovery, and strict duplicate prevention.

---

## STEP 1 — ROLE DEFINITIONS

### INCLUDED ROLES:
* **Patients** (auto-approved)
* **Nurses**
* **Doctors**
* **Caregivers**
* **Physiotherapists**

### EXCLUDED ROLES:
* Admin staff
* HR
* Accountants
*(Excluded from this authentication system. Handled via separate administrative identity provider)*

---

## STEP 2 — PATIENT ONBOARDING (AUTO-APPROVAL SYSTEM)

**Flow:**
1. Patient submits application in the Join Portal.
2. System validates input.
3. System auto-approves immediately (No admin approval allowed).
4. System generates credentials instantly.

**USERNAME FORMAT:**
`CL-[INITIALS]-0001` (e.g., `CL-JD-0001`)

**PASSWORD FORMAT:**
Secure auto-generated password (min 12 characters, complex). Stored ONLY as a hashed value (bcrypt/argon2).

**UI Flow:**
* Post-generation screen displays username and password.
* Copy buttons provided for both.
* Mandatory Checkbox: “I have saved my credentials”
* Action Button: “Go to Patient Portal” (Disabled until checkbox is ticked).

---

## STEP 3 — PATIENT FIRST LOGIN FLOW

**Flow:**
1. User logs in with newly generated credentials.
2. System shows welcome screen.
3. Immediately triggers mandatory QUICK ASSESSMENT.

**QUICK ASSESSMENT:**
* **EXCLUDES:** Name, Age, Address, Email (already captured).
* **INCLUDES ONLY:** 
  * Symptoms
  * Condition description
  * Pain level (0-10)
  * Clinical notes (medical history extension)

**Post-Assessment:**
* Automatically submitted to Admin Dashboard for triage.
* Permanently stored in patient health record.

---

## STEP 4 — STAFF ONBOARDING (CONTROLLED SYSTEM)

**Flow:**
1. Staff submits application in Join Portal.
2. System stores application as PENDING.
3. Staff can ONLY view application status via a tracking code; they cannot log in.
4. Admin reviews application in Admin Portal.
5. Admin approves or rejects.
6. ONLY AFTER approval, the system generates credentials and a Staff ID.

**STAFF ID FORMAT:**
`HSP-[ROLE]-0001`

**Role Mapping:**
* Nurse → `HSP-NUR-0001`
* Doctor → `HSP-DOC-0001`
* Caregiver → `HSP-CRG-0001`
* Physiotherapist → `HSP-PHY-0001`

---

## STEP 5 — LOGIN SYSTEM

**PATIENT LOGIN:**
* Available immediately after onboarding registration and credential generation.
* Uses generated `CL-` credentials.

**STAFF LOGIN:**
* Available only after admin approval.
* Uses generated `HSP-` credentials.

---

## STEP 6 — CREDENTIAL RECOVERY SYSTEM (MANDATORY SECURITY FLOW)

**Objective:** NEVER create a new account or second username during recovery.

**STEP 1:** User enters Full Name and (Email OR Phone Number).
**STEP 2:** System searches database (Patients and Staff tables).
**STEP 3:** System sends OTP to the registered Email OR Phone.
**STEP 4:** User enters and verifies OTP.
**STEP 5:** Recovery Result.

**MODE A (DEFAULT SECURE):**
* Display existing Username.
* Prompt for Password Reset via OTP verified session.

**MODE B (OPTIONAL LEGACY MODE):**
* Display existing Username.
* Reveal existing password ONCE (masked + copy option) — *Implemented only if specifically required by legacy policy, but not recommended for strict security.*

---

## STEP 7 — DUPLICATE PREVENTION SYSTEM

**Enforced Constraints:**
* One user (by Email/Phone + Gov ID) = ONE identity record.
* One username per user only.
* No regeneration of credentials (only resets).
* Rejected applications do NOT consume permanent identity sequence numbers.
* Approved users are permanently stored and cannot be duplicated in the system.

---

## STEP 8 — SECURITY RULES

**Global Enforcement Rules:**
* Passwords stored ONLY as hashed values in DB.
* Validated OTP required for recovery routing.
* Initial credentials shown only once during onboarding.
* Complete suppression of bypass options for the staff approval flow.
* Strict unique constraints on email and phone numbers to prevent duplicate accounts.

---

## STEP 9 — SYSTEM FLOW SUMMARY

**PATIENT FLOW:**
Application → Auto Validate → Auto Approve → Generate Credentials → Login → Welcome → Assessment → Submit to Admin

**STAFF FLOW:**
Application → Pending → Admin Review → Approval → Generate Credentials → First Login → Portal Access

**RECOVERY FLOW:**
User Request → Identity Verification → OTP → Recovery Result → Login Reset or Access

---

## STEP 10 — DATABASE STRUCTURE & LOGIC

### Tables & Relationships

**Users Table (Identities)**
* `id` (UUID, Primary Key)
* `system_id` (String, Unique, e.g. CL-JD-0001)
* `role` (Enum: PATIENT, NURSE, DOCTOR, CAREGIVER, PHYSIOTHERAPIST)
* `password_hash` (String)
* `status` (Enum: ACTIVE, PENDING, REJECTED)

**Profiles Table (Demographics)**
* `user_id` (UUID, Foreign Key -> Users)
* `full_name` (String)
* `email` (String, Unique)
* `phone` (String, Unique)
* `date_of_birth` (Date)
* `address` (Text)

**Assessments Table (Clinical Data)**
* `id` (UUID, Primary Key)
* `patient_id` (UUID, Foreign Key -> Users)
* `symptoms` (Text)
* `condition_description` (Text)
* `pain_level` (Integer)
* `notes` (Text)
* `created_at` (Timestamp)

### Error Handling Rules
* **Duplicate Detection:** Throw `UserAlreadyExistsException` if email/phone exists.
* **OTP Invalid:** Disallow password reset, enforce exponential backoff.
* **Pending Login:** If staff attempts login while pending, return `AccountPendingApprovalException`.
