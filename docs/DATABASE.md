# RELIF HOSPITAL — Schema & Data Architecture

## Overview
All collections are structured for Cloud Firestore. Relations utilize foreign key identifiers with strict server-side validation and atomic transaction locking to prevent race conditions.

```
Firestore Root
├── slotLocks/                # Ephemeral atomic mutexes (lock_{doctorId}_{YYYY-MM-DD}_{HHMM})
├── appointments/             # Core booking records with full lifecycle history
├── queueTokens/              # Real-time reception and consultation queue
├── patients/                 # Master Patient Index (MPI) with demographics and UHID
├── medicalRecords/           # Prescriptions, radiology and pathology archives
├── invoices/                 # Itemized clinical billing entries
├── departments/              # 20 hospital specialties with head clinician
├── doctors/                  # 40+ clinical specialists with verified credentials
├── branches/                 # 3 multi-specialty regional branches
└── auditLogs/                # Immutable append-only HIPAA / DPDP audit trail
```

---

## Collections Specification

### 1. `slotLocks` (Concurrency Control)
- **ID Pattern:** `lock_{doctorId}_{date}_{slot}`
- **Fields:**
  - `doctorId`: string (Ref -> `doctors.id`)
  - `date`: string (`YYYY-MM-DD`)
  - `slot`: string (`HH:MM`)
  - `claimedBy`: string (Ref -> `patients.id`)
  - `createdAt`: Timestamp

### 2. `appointments`
- **Fields:**
  - `id`: string (UUID)
  - `appointmentId`: string (`REL-YYYY-XXXXXX`)
  - `patientId`: string (Ref -> `patients.id`)
  - `patientName`: string
  - `doctorId`: string (Ref -> `doctors.id`)
  - `departmentId`: string
  - `branchId`: string (`andheri` | `thane` | `pune`)
  - `date`: string (`YYYY-MM-DD`)
  - `slot`: string (`HH:MM`)
  - `consultationType`: `'in-person' | 'video'`
  - `status`: `'booked' | 'confirmed' | 'checked_in' | 'in_consultation' | 'completed' | 'cancelled' | 'no_show'`
  - `statusHistory`: `Array<{ status: string, at: ISOString, by: string }>`
  - `isNewPatient`: boolean
  - `createdAt`: Timestamp

### 3. `queueTokens`
- **Fields:**
  - `id`: string
  - `appointmentId`: string
  - `patientId`: string
  - `tokenDisplay`: string (e.g., `C-014`)
  - `status`: `'waiting' | 'called' | 'in_consultation' | 'completed'`
  - `position`: number
  - `estimatedWaitMinutes`: number

### 4. `patients`
- **Fields:**
  - `id`: string (UID)
  - `uhid`: string (`RHYYXXXXXX`)
  - `name`: string
  - `dateOfBirth`: string
  - `gender`: `'male' | 'female' | 'other'`
  - `phone`: string
  - `email`: string
  - `bloodGroup`: string (`A+`, `O+`, `B+`, etc.)
  - `emergencyContact`: `{ name: string, relation: string, phone: string }`
  - `consentRecords`: `{ dpdpConsent: boolean, timestamp: string }`

### 5. `auditLogs` (Immutable)
- **Fields:**
  - `id`: string
  - `userId`: string
  - `userRole`: string
  - `action`: string (e.g., `PATIENT_DOSSIER_VIEW`, `BOOKING_SLOT_RESERVED`)
  - `entity`: string
  - `entityId`: string
  - `timestamp`: Timestamp
  - `ipAddress`: string

