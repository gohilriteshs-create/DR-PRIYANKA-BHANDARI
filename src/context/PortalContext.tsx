import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  PatientAccount, 
  ConsultationRecord, 
  PrescriptionRecord,
  PrescribedMedicine, 
  MedicalHistoryEntry, 
  MedicalDocument, 
  PortalAppointment, 
  PortalAppointmentStatus,
  AuditLogEntry, 
  PortalNotification,
  AuthSession,
  UserRole,
  AuditAction
} from '../types/portal';
import { 
  initialPatientAccounts, 
  initialConsultations, 
  initialPrescriptions, 
  initialMedicalHistory, 
  initialMedicalDocuments, 
  initialAppointments, 
  initialAuditLogs, 
  initialNotifications 
} from '../data/portalInitialData';
import { 
  hashPassword, 
  verifyPassword, 
  generatePatientNumber, 
  generateToken 
} from '../utils/security';

const STORAGE_KEYS = {
  SESSION: 'dr_pb_portal_session_v1',
  PATIENTS: 'dr_pb_portal_patients_v1',
  CONSULTATIONS: 'dr_pb_portal_consultations_v1',
  PRESCRIPTIONS: 'dr_pb_portal_prescriptions_v1',
  MEDICAL_HISTORY: 'dr_pb_portal_med_history_v1',
  DOCUMENTS: 'dr_pb_portal_documents_v1',
  APPOINTMENTS: 'dr_pb_portal_appointments_v1',
  AUDIT_LOGS: 'dr_pb_portal_audit_logs_v1',
  NOTIFICATIONS: 'dr_pb_portal_notifications_v1',
  RESET_TOKENS: 'dr_pb_portal_reset_tokens_v1'
};

interface PasswordResetToken {
  token: string;
  email: string;
  expiresAt: number;
}

interface RegisterPatientInput {
  fullName: string;
  dateOfBirth: string;
  gender: PatientAccount['gender'];
  mobile: string;
  email: string;
  password: string;
  bloodGroup?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
}

interface PortalContextType {
  // State
  session: AuthSession | null;
  currentPatient: PatientAccount | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Data (Row-Level Security filtered for patients)
  allPatients: PatientAccount[]; // Only doctor/admin gets full list
  consultations: ConsultationRecord[];
  prescriptions: PrescriptionRecord[];
  activeMedicines: PrescribedMedicine[];
  medicalHistory: MedicalHistoryEntry[];
  documents: MedicalDocument[];
  appointments: PortalAppointment[];
  notifications: PortalNotification[];
  auditLogs: AuditLogEntry[]; // Doctor/Admin only

  // Auth Methods
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (email: string, fullName: string, avatarUrl?: string) => Promise<{ success: boolean; error?: string }>;
  registerPatient: (input: RegisterPatientInput) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string; simulatedToken?: string }>;
  resetPasswordWithToken: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoAccount: (target: 'rajesh' | 'priya' | 'doctor' | 'admin') => void;

  // Actions
  updateProfile: (updates: Partial<PatientAccount>) => Promise<{ success: boolean; error?: string }>;
  createConsultation: (
    consultation: Omit<ConsultationRecord, 'id' | 'createdAt' | 'updatedAt'>,
    medicines?: Omit<PrescribedMedicine, 'id' | 'prescriptionId' | 'consultationDate' | 'prescribedBy'>[]
  ) => Promise<{ success: boolean; id?: string }>;
  uploadDocument: (doc: Omit<MedicalDocument, 'id' | 'uploadedAt' | 'secureFileReference'>) => Promise<{ success: boolean }>;
  bookAppointment: (apt: Omit<PortalAppointment, 'id' | 'createdAt' | 'status' | 'doctorName'>) => Promise<{ success: boolean; id?: string }>;
  updateAppointmentStatus: (appointmentId: string, status: PortalAppointmentStatus) => Promise<{ success: boolean }>;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  exportHealthSummary: (patientId?: string) => { jsonString: string; patient: PatientAccount | null; htmlReport: string };
  recordAuditLog: (action: AuditAction, resource: string, details: string) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (stored) {
        const parsed: AuthSession = JSON.parse(stored);
        if (parsed.expiresAt > Date.now()) {
          return parsed;
        } else {
          localStorage.removeItem(STORAGE_KEYS.SESSION);
        }
      }
    } catch {
      // fallback
    }
    return null;
  });

  const [patients, setPatients] = useState<PatientAccount[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return stored ? JSON.parse(stored) : initialPatientAccounts;
    } catch {
      return initialPatientAccounts;
    }
  });

  const [consultationsData, setConsultationsData] = useState<ConsultationRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
      return stored ? JSON.parse(stored) : initialConsultations;
    } catch {
      return initialConsultations;
    }
  });

  const [prescriptionsData, setPrescriptionsData] = useState<PrescriptionRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
      return stored ? JSON.parse(stored) : initialPrescriptions;
    } catch {
      return initialPrescriptions;
    }
  });

  const [medicalHistoryData, setMedicalHistoryData] = useState<MedicalHistoryEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEDICAL_HISTORY);
      return stored ? JSON.parse(stored) : initialMedicalHistory;
    } catch {
      return initialMedicalHistory;
    }
  });

  const [documentsData, setDocumentsData] = useState<MedicalDocument[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return stored ? JSON.parse(stored) : initialMedicalDocuments;
    } catch {
      return initialMedicalDocuments;
    }
  });

  const [appointmentsData, setAppointmentsData] = useState<PortalAppointment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return stored ? JSON.parse(stored) : initialAppointments;
    } catch {
      return initialAppointments;
    }
  });

  const [auditLogsData, setAuditLogsData] = useState<AuditLogEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return stored ? JSON.parse(stored) : initialAuditLogs;
    } catch {
      return initialAuditLogs;
    }
  });

  const [notificationsData, setNotificationsData] = useState<PortalNotification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return stored ? JSON.parse(stored) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const [isLoading] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultationsData));
  }, [consultationsData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptionsData));
  }, [prescriptionsData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDICAL_HISTORY, JSON.stringify(medicalHistoryData));
  }, [medicalHistoryData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documentsData));
  }, [documentsData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointmentsData));
  }, [appointmentsData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogsData));
  }, [auditLogsData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notificationsData));
  }, [notificationsData]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }, [session]);

  // Record Audit Log Helper
  const recordAuditLog = useCallback((action: AuditAction, resource: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: session?.userId || 'anonymous',
      userRole: session?.role || 'patient',
      userIdentifier: session ? `${session.fullName} (${session.email})` : 'Anonymous Client',
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    setAuditLogsData(prev => [entry, ...prev.slice(0, 99)]);
  }, [session]);

  // Current Patient profile
  const currentPatient = session?.patientId
    ? patients.find(p => p.id === session.patientId) || null
    : null;

  // Row-Level Security: Filter records based on role
  const isDoctorOrAdmin = session?.role === 'doctor' || session?.role === 'admin';

  const consultations = isDoctorOrAdmin
    ? consultationsData
    : session?.patientId
    ? consultationsData.filter(c => c.patientId === session.patientId)
    : [];

  const prescriptions = isDoctorOrAdmin
    ? prescriptionsData
    : session?.patientId
    ? prescriptionsData.filter(p => p.patientId === session.patientId)
    : [];

  const activeMedicines = React.useMemo(() => {
    const allItems: PrescribedMedicine[] = [];
    prescriptions.forEach(p => {
      p.items.forEach(item => {
        allItems.push(item);
      });
    });
    return allItems;
  }, [prescriptions]);

  const medicalHistory = isDoctorOrAdmin
    ? medicalHistoryData
    : session?.patientId
    ? medicalHistoryData.filter(m => m.patientId === session.patientId)
    : [];

  const documents = isDoctorOrAdmin
    ? documentsData
    : session?.patientId
    ? documentsData.filter(d => d.patientId === session.patientId)
    : [];

  const appointments = isDoctorOrAdmin
    ? appointmentsData
    : session?.patientId
    ? appointmentsData.filter(a => a.patientId === session.patientId)
    : [];

  const notifications = session?.patientId
    ? notificationsData.filter(n => n.patientId === session.patientId)
    : [];

  const auditLogs = isDoctorOrAdmin ? auditLogsData : [];

  // Authentication: Standard Login
  const login = async (identifier: string, password: string, rememberMe = true): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanMobile = identifier.replace(/[\s-]/g, '');

    // 1. Check Doctor Account (Dr. Priyanka Bhandari)
    if (cleanId === 'doctor@clinic.com' || cleanId === 'dr.priyanka@example.com' || cleanId === 'doctor') {
      if (password === 'Doctor@123' || password === 'doctor') {
        const docSession: AuthSession = {
          token: generateToken('doc_jwt'),
          userId: 'doc-priyanka',
          role: 'doctor',
          email: 'dr.priyanka@example.com',
          fullName: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
          expiresAt: Date.now() + (rememberMe ? 7 * 24 * 3600 * 1000 : 2 * 3600 * 1000)
        };
        setSession(docSession);
        recordAuditLog('LOGIN_SUCCESS', 'auth/session', 'Dr. Priyanka Bhandari signed into Doctor Clinical Portal');
        return { success: true };
      }
      return { success: false, error: 'Incorrect doctor password. (Demo: Doctor@123)' };
    }

    // 2. Check Admin Account
    if (cleanId === 'admin@clinic.com' || cleanId === 'admin') {
      if (password === 'Admin@123' || password === 'admin') {
        const adminSession: AuthSession = {
          token: generateToken('adm_jwt'),
          userId: 'admin-01',
          role: 'admin',
          email: 'admin@clinic.com',
          fullName: 'Clinic Administrator',
          expiresAt: Date.now() + (rememberMe ? 7 * 24 * 3600 * 1000 : 2 * 3600 * 1000)
        };
        setSession(adminSession);
        recordAuditLog('LOGIN_SUCCESS', 'auth/session', 'Administrator signed into Practice Portal');
        return { success: true };
      }
      return { success: false, error: 'Incorrect admin password. (Demo: Admin@123)' };
    }

    // 3. Check Patient Accounts
    const targetPatient = patients.find(p => 
      p.email.toLowerCase() === cleanId || 
      p.mobile.replace(/[\s-]/g, '').includes(cleanMobile)
    );

    if (!targetPatient) {
      recordAuditLog('LOGIN_FAILURE', 'auth/session', `Failed login attempt for identifier: ${identifier}`);
      return { success: false, error: 'No account found with this email or mobile number.' };
    }

    // Verify Password Hash
    let isMatch = await verifyPassword(password, targetPatient.passwordHash);
    // Allow demo password fallback for seamless testing
    if (!isMatch && (password === 'Patient@123' || password === 'password123')) {
      isMatch = true;
    }

    if (!isMatch) {
      recordAuditLog('LOGIN_FAILURE', 'auth/session', `Password mismatch for ${targetPatient.email}`);
      return { success: false, error: 'Invalid password. Please check your credentials or click Forgot Password.' };
    }

    const patientSession: AuthSession = {
      token: generateToken('pat_jwt'),
      userId: targetPatient.userId,
      role: 'patient',
      patientId: targetPatient.id,
      patientNumber: targetPatient.patientNumber,
      email: targetPatient.email,
      fullName: targetPatient.fullName,
      expiresAt: Date.now() + (rememberMe ? 14 * 24 * 3600 * 1000 : 2 * 3600 * 1000)
    };

    setSession(patientSession);
    recordAuditLog('LOGIN_SUCCESS', 'auth/session', `Patient ${targetPatient.fullName} (${targetPatient.patientNumber}) signed in`);
    return { success: true };
  };

  // Google OAuth / OpenID Connect Sign-In
  const loginWithGoogle = async (email: string, fullName: string, avatarUrl?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    let patient = patients.find(p => p.email.toLowerCase() === cleanEmail);

    if (patient) {
      // Securely link account
      if (!patient.isGoogleAccount) {
        patient = {
          ...patient,
          isGoogleAccount: true,
          googleAvatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          updatedAt: new Date().toISOString()
        };
        setPatients(prev => prev.map(p => p.id === patient!.id ? patient! : p));
        recordAuditLog('ACCOUNT_LINKED_GOOGLE', `patients/${patient.id}`, `Existing account linked to verified Google ID: ${cleanEmail}`);
      }
    } else {
      // Create new Google patient account
      const newPatientId = `pat-${Date.now()}`;
      const newPatientNumber = generatePatientNumber();
      patient = {
        id: newPatientId,
        userId: `usr-${Date.now()}`,
        patientNumber: newPatientNumber,
        fullName,
        dateOfBirth: '1998-01-01',
        gender: 'Prefer not to say',
        mobile: '+91 98000 00000',
        email: cleanEmail,
        passwordHash: await hashPassword(generateToken('g_secret')),
        isGoogleAccount: true,
        googleAvatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        consentAgreedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setPatients(prev => [patient!, ...prev]);
      recordAuditLog('ACCOUNT_CREATED', `patients/${patient.id}`, `New patient registered via Google OAuth: ${cleanEmail}`);
    }

    const newSession: AuthSession = {
      token: generateToken('g_jwt'),
      userId: patient.userId,
      role: 'patient',
      patientId: patient.id,
      patientNumber: patient.patientNumber,
      email: patient.email,
      fullName: patient.fullName,
      avatarUrl: patient.googleAvatarUrl,
      expiresAt: Date.now() + 14 * 24 * 3600 * 1000
    };

    setSession(newSession);
    recordAuditLog('LOGIN_SUCCESS', 'auth/session', `Patient ${patient.fullName} authenticated via Google OAuth`);
    return { success: true };
  };

  // Register New Patient
  const registerPatient = async (input: RegisterPatientInput): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = input.email.trim().toLowerCase();
    const cleanMobile = input.mobile.replace(/[\s-]/g, '');

    // Check duplicate
    const exists = patients.some(p => 
      p.email.toLowerCase() === cleanEmail || 
      p.mobile.replace(/[\s-]/g, '') === cleanMobile
    );

    if (exists) {
      return { 
        success: false, 
        error: 'An account with this email address or mobile number already exists. Please sign in or reset your password.' 
      };
    }

    const passwordHash = await hashPassword(input.password);
    const newId = `pat-${Date.now()}`;
    const newPatientNumber = generatePatientNumber();

    const newPatient: PatientAccount = {
      id: newId,
      userId: `usr-${Date.now()}`,
      patientNumber: newPatientNumber,
      fullName: input.fullName.trim(),
      dateOfBirth: input.dateOfBirth,
      gender: input.gender,
      mobile: input.mobile.trim(),
      email: cleanEmail,
      passwordHash,
      bloodGroup: input.bloodGroup,
      address: input.address?.trim(),
      emergencyContact: input.emergencyContact,
      consentAgreedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPatients(prev => [newPatient, ...prev]);

    // Automatically create session
    const newSession: AuthSession = {
      token: generateToken('pat_jwt'),
      userId: newPatient.userId,
      role: 'patient',
      patientId: newPatient.id,
      patientNumber: newPatient.patientNumber,
      email: newPatient.email,
      fullName: newPatient.fullName,
      expiresAt: Date.now() + 14 * 24 * 3600 * 1000
    };

    setSession(newSession);

    // Initial welcome notification
    const welcomeNotif: PortalNotification = {
      id: `notif-${Date.now()}`,
      patientId: newId,
      title: 'Welcome to Dr. Priyanka Bhandari Clinic Portal',
      message: `Your medical record number is ${newPatientNumber}. You can view your consultations, prescriptions, and schedule visits here.`,
      date: new Date().toISOString(),
      read: false,
      type: 'general'
    };
    setNotificationsData(prev => [welcomeNotif, ...prev]);

    recordAuditLog('ACCOUNT_CREATED', `patients/${newId}`, `New patient registered: ${newPatient.fullName} (${newPatientNumber})`);
    recordAuditLog('LOGIN_SUCCESS', 'auth/session', `First login for registered patient ${newPatient.fullName}`);

    return { success: true };
  };

  // Request Password Reset (Security: do not enumerate emails)
  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string; simulatedToken?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const token = generateToken('rst');
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

    // Store token
    let tokens: PasswordResetToken[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESET_TOKENS);
      tokens = stored ? JSON.parse(stored) : [];
    } catch {
      // ignore
    }

    tokens.push({ token, email: cleanEmail, expiresAt });
    localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(tokens));

    recordAuditLog(
      'PASSWORD_RESET_REQUESTED', 
      'auth/password-reset', 
      `Password reset link requested for email: ${cleanEmail}`
    );

    // Always return safe message preventing enumeration
    return {
      success: true,
      message: 'If this email is registered in our clinic records, a secure password reset link has been dispatched.',
      simulatedToken: token // Exposed in dev preview for immediate user convenience
    };
  };

  // Reset Password with Token
  const resetPasswordWithToken = async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    let tokens: PasswordResetToken[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESET_TOKENS);
      tokens = stored ? JSON.parse(stored) : [];
    } catch {
      // ignore
    }

    const match = tokens.find(t => t.token === token && t.expiresAt > Date.now());
    if (!match) {
      return { success: false, error: 'Password reset link is invalid or has expired. Please request a new one.' };
    }

    const targetPatient = patients.find(p => p.email.toLowerCase() === match.email.toLowerCase());
    if (!targetPatient) {
      return { success: false, error: 'Associated patient record not found.' };
    }

    const newHash = await hashPassword(newPassword);
    setPatients(prev => prev.map(p => {
      if (p.id === targetPatient.id) {
        return {
          ...p,
          passwordHash: newHash,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    // Invalidate tokens for this email
    const remaining = tokens.filter(t => t.email.toLowerCase() !== match.email.toLowerCase());
    localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(remaining));

    recordAuditLog(
      'PASSWORD_RESET_COMPLETED',
      `patients/${targetPatient.id}`,
      `Password successfully reset for patient ${targetPatient.fullName}`
    );

    return { success: true };
  };

  // Logout
  const logout = () => {
    recordAuditLog('LOGOUT', 'auth/session', 'User session terminated');
    setSession(null);
  };

  // Switch demo account for easy testing
  const switchDemoAccount = (target: 'rajesh' | 'priya' | 'doctor' | 'admin') => {
    if (target === 'doctor') {
      const docSession: AuthSession = {
        token: generateToken('doc_jwt'),
        userId: 'doc-priyanka',
        role: 'doctor',
        email: 'dr.priyanka@example.com',
        fullName: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
        expiresAt: Date.now() + 7 * 24 * 3600 * 1000
      };
      setSession(docSession);
      recordAuditLog('LOGIN_SUCCESS', 'auth/session', 'Switched to Dr. Priyanka Bhandari (Doctor View)');
    } else if (target === 'admin') {
      const adminSession: AuthSession = {
        token: generateToken('adm_jwt'),
        userId: 'admin-01',
        role: 'admin',
        email: 'admin@clinic.com',
        fullName: 'Clinic Administrator',
        expiresAt: Date.now() + 7 * 24 * 3600 * 1000
      };
      setSession(adminSession);
      recordAuditLog('LOGIN_SUCCESS', 'auth/session', 'Switched to Clinic Administrator (Admin View)');
    } else {
      const pat = patients.find(p => target === 'rajesh' ? p.id === 'pat-101' : p.id === 'pat-102') || patients[0];
      const patSession: AuthSession = {
        token: generateToken('pat_jwt'),
        userId: pat.userId,
        role: 'patient',
        patientId: pat.id,
        patientNumber: pat.patientNumber,
        email: pat.email,
        fullName: pat.fullName,
        expiresAt: Date.now() + 14 * 24 * 3600 * 1000
      };
      setSession(patSession);
      recordAuditLog('LOGIN_SUCCESS', 'auth/session', `Switched to ${pat.fullName} (${pat.patientNumber})`);
    }
  };

  // Update Profile (Patients can edit permitted personal info)
  const updateProfile = async (updates: Partial<PatientAccount>): Promise<{ success: boolean; error?: string }> => {
    if (!session?.patientId) {
      return { success: false, error: 'Unauthorized: Patient session required.' };
    }

    const permittedKeys: (keyof PatientAccount)[] = [
      'mobile', 
      'address', 
      'emergencyContact',
      'fullName'
    ];

    const sanitizedUpdates: Partial<PatientAccount> = {};
    for (const key of permittedKeys) {
      if (updates[key] !== undefined) {
        // @ts-expect-error key indexing
        sanitizedUpdates[key] = updates[key];
      }
    }

    setPatients(prev => prev.map(p => {
      if (p.id === session.patientId) {
        return {
          ...p,
          ...sanitizedUpdates,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    recordAuditLog(
      'PROFILE_CHANGED', 
      `patients/${session.patientId}`, 
      `Patient personal information updated: ${Object.keys(sanitizedUpdates).join(', ')}`
    );

    return { success: true };
  };

  // Create Consultation & Prescription (Doctor Only)
  const createConsultation = async (
    consultation: Omit<ConsultationRecord, 'id' | 'createdAt' | 'updatedAt'>,
    medicines?: Omit<PrescribedMedicine, 'id' | 'prescriptionId' | 'consultationDate' | 'prescribedBy'>[]
  ): Promise<{ success: boolean; id?: string }> => {
    if (session?.role !== 'doctor' && session?.role !== 'admin') {
      recordAuditLog('UNAUTHORIZED_ACCESS_BLOCKED', 'consultations/create', 'Attempted unauthorized consultation creation');
      return { success: false };
    }

    const consId = `cons-${Date.now()}`;
    let rxId: string | undefined = undefined;

    if (medicines && medicines.length > 0) {
      rxId = `rx-${Date.now()}`;
      const newRxItems: PrescribedMedicine[] = medicines.map((m, idx) => ({
        ...m,
        id: `med-${Date.now()}-${idx}`,
        prescriptionId: rxId!,
        consultationDate: consultation.consultationDate,
        prescribedBy: consultation.doctorName
      }));

      const newPrescription: PrescriptionRecord = {
        id: rxId,
        consultationId: consId,
        patientId: consultation.patientId,
        doctorId: consultation.doctorId,
        doctorName: consultation.doctorName,
        prescriptionDate: consultation.consultationDate,
        notes: consultation.treatmentPlan,
        status: 'Active',
        items: newRxItems,
        createdAt: new Date().toISOString()
      };

      setPrescriptionsData(prev => [newPrescription, ...prev]);
      recordAuditLog('PRESCRIPTION_CREATED', `prescriptions/${rxId}`, `Prescription with ${medicines.length} drugs issued for patient ${consultation.patientId}`);
    }

    const newRecord: ConsultationRecord = {
      ...consultation,
      id: consId,
      prescriptionId: rxId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setConsultationsData(prev => [newRecord, ...prev]);

    // Also record into medical history
    if (consultation.diagnosis) {
      const historyEntry: MedicalHistoryEntry = {
        id: `mh-${Date.now()}`,
        patientId: consultation.patientId,
        consultationId: consId,
        condition: consultation.diagnosis,
        diagnosisDate: consultation.consultationDate,
        notes: consultation.clinicalNotes,
        treatment: consultation.treatmentPlan,
        followUp: consultation.followUpDate,
        doctor: consultation.doctorName,
        status: 'Active'
      };
      setMedicalHistoryData(prev => [historyEntry, ...prev]);
    }

    // Add notification for patient
    const newNotif: PortalNotification = {
      id: `notif-${Date.now()}`,
      patientId: consultation.patientId,
      title: 'New Consultation Summary Available',
      message: `Dr. Priyanka Bhandari added clinical notes for your visit on ${consultation.consultationDate}.`,
      date: new Date().toISOString(),
      read: false,
      type: 'prescription'
    };
    setNotificationsData(prev => [newNotif, ...prev]);

    recordAuditLog('RECORD_CREATED', `consultations/${consId}`, `New consultation saved for patient ${consultation.patientId}: ${consultation.diagnosis}`);

    return { success: true, id: consId };
  };

  // Upload Medical Document
  const uploadDocument = async (doc: Omit<MedicalDocument, 'id' | 'uploadedAt' | 'secureFileReference'>): Promise<{ success: boolean }> => {
    const docId = `doc-${Date.now()}`;
    const newDoc: MedicalDocument = {
      ...doc,
      id: docId,
      secureFileReference: `sec_vault://dr-pb/records/${docId}_${encodeURIComponent(doc.documentName)}`,
      uploadedAt: new Date().toISOString()
    };

    setDocumentsData(prev => [newDoc, ...prev]);
    recordAuditLog('DOCUMENT_UPLOADED', `documents/${docId}`, `Document uploaded: ${doc.documentName} (${doc.documentType})`);
    return { success: true };
  };

  // Book Portal Appointment
  const bookAppointment = async (apt: Omit<PortalAppointment, 'id' | 'createdAt' | 'status' | 'doctorName'>): Promise<{ success: boolean; id?: string }> => {
    const aptId = `apt-${Date.now()}`;
    const newApt: PortalAppointment = {
      ...apt,
      id: aptId,
      doctorName: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
      status: 'Requested',
      createdAt: new Date().toISOString()
    };

    setAppointmentsData(prev => [newApt, ...prev]);

    // Notification
    const notif: PortalNotification = {
      id: `notif-${Date.now()}`,
      patientId: apt.patientId,
      title: 'Appointment Request Received',
      message: `Your request for ${apt.appointmentType} on ${apt.appointmentDate} at ${apt.appointmentTime} is awaiting clinic confirmation.`,
      date: new Date().toISOString(),
      read: false,
      type: 'appointment'
    };
    setNotificationsData(prev => [notif, ...prev]);

    recordAuditLog('RECORD_CREATED', `appointments/${aptId}`, `Appointment requested for ${apt.appointmentDate}`);
    return { success: true, id: aptId };
  };

  // Update Appointment Status
  const updateAppointmentStatus = async (appointmentId: string, status: PortalAppointmentStatus): Promise<{ success: boolean }> => {
    setAppointmentsData(prev => prev.map(a => {
      if (a.id === appointmentId) {
        return { ...a, status };
      }
      return a;
    }));
    recordAuditLog('RECORD_VIEWED', `appointments/${appointmentId}`, `Appointment status transitioned to: ${status}`);
    return { success: true };
  };

  // Notification actions
  const markNotificationAsRead = (id: string) => {
    setNotificationsData(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    if (!session?.patientId) return;
    setNotificationsData(prev => prev.map(n => n.patientId === session.patientId ? { ...n, read: true } : n));
  };

  // Export Health Summary Report
  const exportHealthSummary = (targetPatientId?: string) => {
    const patId = targetPatientId || session?.patientId;
    const pat = patients.find(p => p.id === patId) || null;
    const patConsultations = consultationsData.filter(c => c.patientId === patId);
    const patPrescriptions = prescriptionsData.filter(p => p.patientId === patId);
    const patHistory = medicalHistoryData.filter(m => m.patientId === patId);
    const patDocs = documentsData.filter(d => d.patientId === patId);
    const patAppointments = appointmentsData.filter(a => a.patientId === patId);

    const fullExport = {
      clinic: {
        name: 'Dr. Priyanka Bhandari Clinic',
        doctor: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
        regNo: 'MCI-2018-74921',
        phone: '+91 98765 43210',
        exportedAt: new Date().toISOString()
      },
      patient: pat,
      consultations: patConsultations,
      prescriptions: patPrescriptions,
      medicalHistory: patHistory,
      documents: patDocs,
      appointments: patAppointments
    };

    recordAuditLog(
      'DATA_EXPORT_REQUESTED',
      `patients/${patId}/export`,
      `Complete patient health dossier exported`
    );

    const jsonString = JSON.stringify(fullExport, null, 2);

    const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Health Summary - ${pat?.fullName || 'Patient'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; padding: 40px; }
    .header { border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 25px; }
    .badge { display: inline-block; padding: 3px 8px; font-size: 11px; font-weight: 600; border-radius: 4px; background: #e0f2fe; color: #0369a1; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 25px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 13px; }
    th { background: #f8fafc; font-weight: 600; }
    h2 { color: #0f172a; margin-top: 30px; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
  </style>
</head>
<body>
  <div class="header">
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <h1 style="margin:0; font-size:22px; color:#0369a1;">DR. PRIYANKA BHANDARI, BAMS, CGO, PGDEMS</h1>
        <div style="font-size:12px; color:#64748b;">General Physician Consultant · Hinduja Hospital · Reg. No: MMC / State Council</div>
      </div>
      <div style="text-align:right; font-size:12px; color:#64748b;">
        <div>Export Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        <div class="badge">OFFICIAL MEDICAL SUMMARY</div>
      </div>
    </div>
  </div>

  <h2>PATIENT IDENTIFICATION</h2>
  <table>
    <tr><th>Full Name</th><td>${pat?.fullName || 'N/A'}</td><th>Patient ID</th><td>${pat?.patientNumber || 'N/A'}</td></tr>
    <tr><th>Date of Birth / Gender</th><td>${pat?.dateOfBirth} (${pat?.gender})</td><th>Blood Group</th><td>${pat?.bloodGroup || 'Not Recorded'}</td></tr>
    <tr><th>Contact Mobile</th><td>${pat?.mobile}</td><th>Email</th><td>${pat?.email}</td></tr>
    <tr><th>Known Allergies</th><td colspan="3" style="color:#b91c1c; font-weight:bold;">${pat?.allergies?.join(', ') || 'No known allergies recorded'}</td></tr>
  </table>

  <h2>ACTIVE & HISTORICAL DIAGNOSES</h2>
  <table>
    <thead><tr><th>Date</th><th>Condition / Diagnosis</th><th>Status</th><th>Treating Doctor</th></tr></thead>
    <tbody>
      ${patHistory.map(h => `<tr><td>${h.diagnosisDate}</td><td><strong>${h.condition}</strong><br><span style="font-size:11px; color:#64748b;">${h.notes}</span></td><td>${h.status}</td><td>${h.doctor}</td></tr>`).join('')}
    </tbody>
  </table>

  <h2>CONSULTATION TIMELINE</h2>
  <table>
    <thead><tr><th>Date</th><th>Type</th><th>Chief Complaint & Diagnosis</th><th>Plan & Follow-up</th></tr></thead>
    <tbody>
      ${patConsultations.map(c => `<tr><td>${c.consultationDate}</td><td>${c.consultationType}</td><td><strong>${c.diagnosis}</strong><br><span style="font-size:11px; color:#475569;">Complaint: ${c.chiefComplaint}</span></td><td>${c.treatmentPlan}<br><span style="font-size:11px; color:#0284c7;">Next Visit: ${c.followUpDate}</span></td></tr>`).join('')}
    </tbody>
  </table>

  <h2>PRESCRIBED MEDICINES</h2>
  <table>
    <thead><tr><th>Medicine</th><th>Strength</th><th>Dosage</th><th>Frequency</th><th>Instructions</th><th>Status</th></tr></thead>
    <tbody>
      ${patPrescriptions.flatMap(p => p.items).map(i => `<tr><td><strong>${i.medicineName}</strong></td><td>${i.strength}</td><td>${i.dosage}</td><td>${i.frequency}</td><td>${i.instructions}</td><td>${i.status}</td></tr>`).join('')}
    </tbody>
  </table>

  <div style="margin-top:40px; border-top:1px solid #cbd5e1; padding-top:15px; font-size:11px; color:#94a3b8; text-align:center;">
    This document is a computer-generated health record extract from Dr. Priyanka Bhandari Clinic Patient Portal.
  </div>
</body>
</html>
    `;

    return { jsonString, patient: pat, htmlReport };
  };

  return (
    <PortalContext.Provider
      value={{
        session,
        currentPatient,
        role: session?.role || null,
        isAuthenticated: !!session,
        isLoading,
        allPatients: isDoctorOrAdmin ? patients : [],
        consultations,
        prescriptions,
        activeMedicines,
        medicalHistory,
        documents,
        appointments,
        notifications,
        auditLogs,
        login,
        loginWithGoogle,
        registerPatient,
        requestPasswordReset,
        resetPasswordWithToken,
        logout,
        switchDemoAccount,
        updateProfile,
        createConsultation,
        uploadDocument,
        bookAppointment,
        updateAppointmentStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        exportHealthSummary,
        recordAuditLog
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
