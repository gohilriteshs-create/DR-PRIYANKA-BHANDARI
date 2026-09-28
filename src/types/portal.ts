import { ConsultationType } from './index';

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface PatientAccount {
  id: string; // e.g. "pat-101"
  userId: string;
  patientNumber: string; // e.g. "PB-2026-0842"
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
  mobile: string;
  email: string;
  passwordHash: string; // Salted SHA-256
  isGoogleAccount?: boolean;
  googleAvatarUrl?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  bloodGroup?: string;
  allergies?: string[];
  existingConditions?: string[];
  relevantMedicalHistory?: string;
  consentAgreedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescribedMedicine {
  id: string;
  prescriptionId: string;
  medicineName: string;
  strength: string; // e.g., "500 mg", "10 mg"
  dosage: string; // e.g., "1 Tablet", "5 ml"
  frequency: string; // e.g., "Twice Daily", "Once Daily at bedtime"
  route: string; // e.g., "Oral", "Topical", "Inhalation"
  duration: string; // e.g., "5 Days", "30 Days (Ongoing)"
  instructions: string; // e.g., "After food with warm water", "Empty stomach"
  startDate: string;
  endDate: string;
  prescribedBy: string; // e.g. "Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS"
  consultationDate: string;
  status: 'Active' | 'Completed' | 'Discontinued';
}

export interface PrescriptionRecord {
  id: string; // e.g. "rx-201"
  consultationId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  prescriptionDate: string;
  notes?: string;
  status: 'Active' | 'Completed' | 'Modified';
  items: PrescribedMedicine[];
  createdAt: string;
}

export interface ConsultationRecord {
  id: string; // e.g. "cons-301"
  patientId: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  consultationDate: string; // YYYY-MM-DD
  consultationTime?: string;
  consultationType: ConsultationType;
  chiefComplaint: string;
  symptoms: string[];
  vitals?: {
    bloodPressure?: string; // e.g., "120/80 mmHg"
    pulseRate?: string; // e.g., "74 bpm"
    temperature?: string; // e.g., "98.4 °F"
    spO2?: string; // e.g., "99%"
    weight?: string; // e.g., "68 kg"
    bmi?: string; // e.g., "23.5"
  };
  diagnosis: string;
  clinicalNotes: string;
  treatmentPlan: string;
  followUpDate: string;
  prescriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalHistoryEntry {
  id: string;
  patientId: string;
  consultationId?: string;
  condition: string;
  diagnosisDate: string;
  notes: string;
  treatment: string;
  followUp?: string;
  doctor: string;
  status: 'Active' | 'Resolved' | 'Chronic / Managed';
}

export type MedicalDocumentType = 
  | 'Prescription'
  | 'Lab Report'
  | 'Scan/Imaging Report'
  | 'Consultation Summary'
  | 'Medical Certificate'
  | 'Other Medical Document';

export interface MedicalDocument {
  id: string;
  patientId: string;
  consultationId?: string;
  documentType: MedicalDocumentType;
  documentName: string;
  secureFileReference: string; // simulated secure cloud reference
  uploadedBy: string; // e.g. "Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS" or "Patient (Self)"
  uploadedAt: string;
  fileSize: string;
  summaryNotes?: string;
  downloadUrl?: string;
  mockContent?: string;
}

export type PortalAppointmentStatus = 
  | 'Requested'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'Rescheduled';

export interface PortalAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: ConsultationType;
  status: PortalAppointmentStatus;
  notes?: string;
  consultationRecordId?: string;
  createdAt: string;
}

export type AuditAction = 
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'RECORD_VIEWED'
  | 'RECORD_CREATED'
  | 'PRESCRIPTION_CREATED'
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_ACCESSED'
  | 'PROFILE_CHANGED'
  | 'PASSWORD_CHANGED'
  | 'ACCOUNT_CREATED'
  | 'ACCOUNT_LINKED_GOOGLE'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'DATA_EXPORT_REQUESTED'
  | 'UNAUTHORIZED_ACCESS_BLOCKED';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userRole: UserRole;
  userIdentifier: string; // name or email
  action: AuditAction;
  resource: string;
  details: string;
  timestamp: string; // ISO string
  ipAddress?: string;
  userAgent?: string;
}

export interface PortalNotification {
  id: string;
  patientId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'appointment' | 'prescription' | 'document' | 'general' | 'security';
  actionUrl?: string;
}

export interface AuthSession {
  token: string;
  userId: string;
  role: UserRole;
  patientId?: string; // if role === 'patient'
  email: string;
  fullName: string;
  patientNumber?: string;
  avatarUrl?: string;
  expiresAt: number; // Unix timestamp ms
}
