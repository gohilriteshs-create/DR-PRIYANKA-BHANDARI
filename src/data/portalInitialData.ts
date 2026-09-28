import { 
  PatientAccount, 
  ConsultationRecord, 
  PrescriptionRecord,
  MedicalHistoryEntry, 
  MedicalDocument, 
  PortalAppointment, 
  AuditLogEntry, 
  PortalNotification 
} from '../types/portal';

// DEMO DATA NOTICE: All records below are simulated for demonstration & clinical testing.
export const initialPatientAccounts: PatientAccount[] = [
  {
    id: 'pat-101',
    userId: 'usr-101',
    patientNumber: 'PB-2026-0842',
    fullName: 'Rajesh Kumar',
    dateOfBirth: '1982-05-14',
    gender: 'Male',
    mobile: '+91 98201 44520',
    email: 'rajesh.kumar@example.com',
    passwordHash: '8b7f8c857790b40ebceefd914565b922a76f25db9c2cfca8ff7e42d634937217', // Patient@123
    bloodGroup: 'B+',
    address: 'B-402, Green Glen Heights, 100ft Inner Ring Road, Koramangala, Bengaluru - 560034',
    emergencyContact: {
      name: 'Sunita Kumar',
      relation: 'Spouse',
      phone: '+91 98201 44521'
    },
    allergies: ['Penicillin (mild cutaneous rash)', 'Sulfa Drugs'],
    existingConditions: ['Essential Hypertension (Stage 1)', 'Mild Seasonal Bronchospasm'],
    relevantMedicalHistory: 'Diagnosed with mild hypertension in 2023. Managed through Telmisartan 40mg and routine aerobic walking. Non-smoker, occasional social tea.',
    consentAgreedAt: '2026-08-10T09:30:00.000Z',
    createdAt: '2026-08-10T09:30:00.000Z',
    updatedAt: '2026-09-24T11:15:00.000Z'
  },
  {
    id: 'pat-102',
    userId: 'usr-102',
    patientNumber: 'PB-2026-1094',
    fullName: 'Priya Sharma',
    dateOfBirth: '1995-11-23',
    gender: 'Female',
    mobile: '+91 99402 33189',
    email: 'priya.sharma@example.com',
    passwordHash: '8b7f8c857790b40ebceefd914565b922a76f25db9c2cfca8ff7e42d634937217', // Patient@123
    bloodGroup: 'O+',
    address: 'Flat 12, Emerald Enclave, Indiranagar 12th Main, Bengaluru - 560038',
    emergencyContact: {
      name: 'Amit Sharma',
      relation: 'Spouse',
      phone: '+91 99402 33190'
    },
    allergies: ['No known drug allergies (NKDA)'],
    existingConditions: ['Gestational Health Check - Trimester 2', 'Mild Iron Deficiency Anemia'],
    relevantMedicalHistory: 'Under ongoing prenatal medical supervision with Dr. Priyanka Bhandari. Routine ultrasound & fetal wellbeing confirmed.',
    consentAgreedAt: '2026-07-15T10:00:00.000Z',
    createdAt: '2026-07-15T10:00:00.000Z',
    updatedAt: '2026-09-20T16:00:00.000Z'
  }
];

export const initialConsultations: ConsultationRecord[] = [
  {
    id: 'cons-301',
    patientId: 'pat-101',
    doctorId: 'doc-priyanka',
    doctorName: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    appointmentId: 'apt-501',
    consultationDate: '2026-09-24',
    consultationTime: '10:30 AM',
    consultationType: 'General In-Clinic Consultation',
    chiefComplaint: 'Sore throat, mild fever, and dry cough for 3 days',
    symptoms: [
      'Throat pain with painful swallowing',
      'Mild fever peaking in evenings (up to 100.2 °F)',
      'Dry non-productive cough',
      'Generalized fatigue and headache'
    ],
    vitals: {
      bloodPressure: '124/82 mmHg',
      pulseRate: '78 bpm',
      temperature: '99.4 °F',
      spO2: '99%',
      weight: '73 kg',
      bmi: '24.2'
    },
    diagnosis: 'Acute Pharyngitis & Upper Respiratory Tract Infection (Likely Viral with Mild Secondary Congestion)',
    clinicalNotes: 'Pharyngeal mucosa congested with bilateral tonsillar erythema. No purulent exudates. Lungs clear to auscultation bilaterally with good air entry. Heart sounds S1 S2 normal. Abdomen soft, non-tender. Patient reminded to maintain good hydration and warm saline gargles.',
    treatmentPlan: 'Symptomatic decongestion, warm saline gargling 3-4 times daily, oral antipyretic PRN, throat lozenges. Continue baseline antihypertensive Telmisartan 40mg daily.',
    followUpDate: '2026-10-01',
    prescriptionId: 'rx-401',
    createdAt: '2026-09-24T11:00:00.000Z',
    updatedAt: '2026-09-24T11:00:00.000Z'
  },
  {
    id: 'cons-302',
    patientId: 'pat-101',
    doctorId: 'doc-priyanka',
    doctorName: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    appointmentId: 'apt-502',
    consultationDate: '2026-08-10',
    consultationTime: '11:15 AM',
    consultationType: 'Preventive Health Assessment',
    chiefComplaint: 'Routine quarterly blood pressure evaluation & lipid profile review',
    symptoms: [
      'Occasional tension sensation at base of neck after extended computer work',
      'No chest discomfort, palpitations, or orthopnea'
    ],
    vitals: {
      bloodPressure: '128/84 mmHg',
      pulseRate: '74 bpm',
      temperature: '98.4 °F',
      spO2: '98%',
      weight: '74 kg',
      bmi: '24.5'
    },
    diagnosis: 'Essential Hypertension (Well Controlled on Telmisartan 40mg) & Mild Dyslipidemia',
    clinicalNotes: 'Cardiovascular examination unremarkable. Radial pulse regular, good volume. Recent fasting lipid panel evaluated: total cholesterol 194 mg/dL, LDL 116 mg/dL, HDL 46 mg/dL, Triglycerides 160 mg/dL. Emphasized dietary reduction of refined fats and sodium intake under 2 grams daily.',
    treatmentPlan: 'Maintain Tab Telmisartan 40mg 1 tab OD after breakfast. Increase brisk walking to 40 minutes x 5 days weekly. Recheck fasting lipid panel in 6 months.',
    followUpDate: '2026-11-10',
    prescriptionId: 'rx-402',
    createdAt: '2026-08-10T11:45:00.000Z',
    updatedAt: '2026-08-10T11:45:00.000Z'
  },
  {
    id: 'cons-303',
    patientId: 'pat-102',
    doctorId: 'doc-priyanka',
    doctorName: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    appointmentId: 'apt-503',
    consultationDate: '2026-09-18',
    consultationTime: '04:30 PM',
    consultationType: 'Women\'s Health Consultation',
    chiefComplaint: 'Second trimester routine prenatal review, fetal movement confirmation, hemoglobin status check',
    symptoms: [
      'Normal active fetal kicks noted regularly',
      'Mild postural fatigue toward evening hours',
      'No pedal edema, headache, or visual disturbances'
    ],
    vitals: {
      bloodPressure: '112/74 mmHg',
      pulseRate: '82 bpm',
      temperature: '98.6 °F',
      spO2: '99%',
      weight: '62 kg',
      bmi: '22.8'
    },
    diagnosis: 'Intrauterine Single Pregnancy at 22 Weeks Gestation - Good Maternal & Fetal Wellbeing; Mild Nutritional Anemia (Hb 10.4 g/dL)',
    clinicalNotes: 'Uterine fundal height corresponds with menstrual gestational age. Fetal heart sounds distinct at 144 bpm. Anomaly scan reviewed with normal anatomical survey. Hemoglobin evaluated at 10.4 g/dL; increased elemental iron supplementation advised with dietary vitamin C.',
    treatmentPlan: 'Continue Tab Folvite 5mg once daily. Add Tab Ferrous Ascorbate + Folic Acid once daily after dinner with lemon water or orange juice. Avoid dairy or calcium intake within 2 hours of iron supplement.',
    followUpDate: '2026-10-18',
    prescriptionId: 'rx-403',
    createdAt: '2026-09-18T17:00:00.000Z',
    updatedAt: '2026-09-18T17:00:00.000Z'
  }
];

export const initialPrescriptions: PrescriptionRecord[] = [
  {
    id: 'rx-401',
    consultationId: 'cons-301',
    patientId: 'pat-101',
    doctorId: 'doc-priyanka',
    doctorName: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    prescriptionDate: '2026-09-24',
    status: 'Active',
    notes: 'Hydrate well with warm water. Avoid iced beverages and cold air conditioning drafts. If high-grade fever persists beyond 48 hours, report immediately.',
    createdAt: '2026-09-24T11:00:00.000Z',
    items: [
      {
        id: 'med-001',
        prescriptionId: 'rx-401',
        medicineName: 'Azithromycin Tablet',
        strength: '500 mg',
        dosage: '1 Tablet',
        frequency: 'Once Daily (OD)',
        route: 'Oral',
        duration: '5 Days',
        instructions: 'Take 1 hour before meal or 2 hours after food with full glass of water',
        startDate: '2026-09-24',
        endDate: '2026-09-29',
        prescribedBy: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
        consultationDate: '2026-09-24',
        status: 'Active'
      },
      {
        id: 'med-002',
        prescriptionId: 'rx-401',
        medicineName: 'Paracetamol Tablet',
        strength: '650 mg',
        dosage: '1 Tablet',
        frequency: 'As needed (SOS, max 3 times daily)',
        route: 'Oral',
        duration: '3-5 Days (As Needed)',
        instructions: 'Take strictly after food if body temperature rises above 99.5 °F or body ache occurs',
        startDate: '2026-09-24',
        endDate: '2026-09-29',
        prescribedBy: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
        consultationDate: '2026-09-24',
        status: 'Active'
      },
      {
        id: 'med-003',
        prescriptionId: 'rx-401',
        medicineName: 'Levocetirizine + Montelukast',
        strength: '5 mg / 10 mg',
        dosage: '1 Tablet',
        frequency: 'Once Daily at Bedtime (HS)',
        route: 'Oral',
        duration: '5 Days',
        instructions: 'Take at night before sleeping; may induce mild relaxation / drowsiness',
        startDate: '2026-09-24',
        endDate: '2026-09-29',
        prescribedBy: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
        consultationDate: '2026-09-24',
        status: 'Active'
      },
      {
        id: 'med-004',
        prescriptionId: 'rx-401',
        medicineName: 'Telmisartan Tablet',
        strength: '40 mg',
        dosage: '1 Tablet',
        frequency: 'Once Daily (OD)',
        route: 'Oral',
        duration: 'Ongoing (Long-term)',
        instructions: 'Continue regular morning dosage after light breakfast. Monitor BP bi-weekly.',
        startDate: '2023-04-12',
        endDate: 'Ongoing',
        prescribedBy: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
        consultationDate: '2026-09-24',
        status: 'Active'
      }
    ]
  },
  {
    id: 'rx-402',
    consultationId: 'cons-302',
    patientId: 'pat-101',
    doctorId: 'doc-priyanka',
    doctorName: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    prescriptionDate: '2026-08-10',
    status: 'Completed',
    notes: 'Hypertension maintenance protocol. Salt restriction strictly enforced (< 2g/day).',
    createdAt: '2026-08-10T11:45:00.000Z',
    items: [
      {
        id: 'med-005',
        prescriptionId: 'rx-402',
        medicineName: 'Telmisartan Tablet',
        strength: '40 mg',
        dosage: '1 Tablet',
        frequency: 'Once Daily (OD)',
        route: 'Oral',
        duration: '90 Days',
        instructions: 'Morning after food',
        startDate: '2026-08-10',
        endDate: '2026-11-10',
        prescribedBy: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
        consultationDate: '2026-08-10',
        status: 'Active'
      }
    ]
  },
  {
    id: 'rx-403',
    consultationId: 'cons-303',
    patientId: 'pat-102',
    doctorId: 'doc-priyanka',
    doctorName: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    prescriptionDate: '2026-09-18',
    status: 'Active',
    notes: 'Prenatal micro-nutrient schedule. Ensure 2.5 Liters of clean fluids daily. Report any unusual cramping or spotting.',
    createdAt: '2026-09-18T17:00:00.000Z',
    items: [
      {
        id: 'med-006',
        prescriptionId: 'rx-403',
        medicineName: 'Ferrous Ascorbate + Folic Acid',
        strength: '100 mg elemental iron',
        dosage: '1 Tablet',
        frequency: 'Once Daily after dinner (OD)',
        route: 'Oral',
        duration: '60 Days',
        instructions: 'Take with lemon water or fresh juice. Do not take with tea, coffee, or milk.',
        startDate: '2026-09-18',
        endDate: '2026-11-18',
        prescribedBy: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
        consultationDate: '2026-09-18',
        status: 'Active'
      },
      {
        id: 'med-007',
        prescriptionId: 'rx-403',
        medicineName: 'Calcium Carbonate + Vitamin D3',
        strength: '500 mg / 250 IU',
        dosage: '1 Tablet',
        frequency: 'Once Daily after lunch (OD)',
        route: 'Oral',
        duration: '60 Days',
        instructions: 'Take after afternoon meal. Keep 4 hours gap from iron supplement.',
        startDate: '2026-09-18',
        endDate: '2026-11-18',
        prescribedBy: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
        consultationDate: '2026-09-18',
        status: 'Active'
      }
    ]
  }
];

export const initialMedicalHistory: MedicalHistoryEntry[] = [
  {
    id: 'mh-101',
    patientId: 'pat-101',
    consultationId: 'cons-301',
    condition: 'Acute Pharyngitis & Upper Respiratory Infection',
    diagnosisDate: '2026-09-24',
    notes: 'Bilateral erythematous tonsillar pillars, painful swallowing, low-grade pyrexia. Responsive to symptomatic regimen.',
    treatment: 'Oral macrolide coverage, warm saline gargling, paracetamol SOS.',
    followUp: '2026-10-01',
    doctor: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    status: 'Active'
  },
  {
    id: 'mh-102',
    patientId: 'pat-101',
    consultationId: 'cons-302',
    condition: 'Essential Hypertension (Stage 1)',
    diagnosisDate: '2023-04-12',
    notes: 'Sustained sitting blood pressure > 138/90 mmHg recorded over 3 separate clinical visits. Good cardiac index, normal renal function panel.',
    treatment: 'Tab Telmisartan 40mg OD, DASH diet, low sodium, aerobic exercise.',
    followUp: 'Every 3 months',
    doctor: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    status: 'Chronic / Managed'
  },
  {
    id: 'mh-103',
    patientId: 'pat-101',
    condition: 'Mild Cervical Spondylosis (Postural)',
    diagnosisDate: '2024-02-18',
    notes: 'Intermittent neck stiffness attributed to prolonged ergonomic desk posture. Cervical spine X-ray showed minimal C5-C6 osteophytic spurring without radiculopathy.',
    treatment: 'Ergonomic screen elevation, neck isometric exercises, intermittent hot compress.',
    followUp: 'PRN',
    doctor: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    status: 'Resolved'
  },
  {
    id: 'mh-104',
    patientId: 'pat-102',
    consultationId: 'cons-303',
    condition: 'Intrauterine Gravid State (22 Weeks)',
    diagnosisDate: '2026-05-10',
    notes: 'Second pregnancy; healthy progression with normal placental positioning and active fetal heart rate.',
    treatment: 'Folic acid, ferrous ascorbate, calcium supplementation, balanced maternal nutrition.',
    followUp: '2026-10-18',
    doctor: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    status: 'Active'
  },
  {
    id: 'mh-105',
    patientId: 'pat-102',
    condition: 'Mild Nutritional Iron Deficiency Anemia',
    diagnosisDate: '2026-09-18',
    notes: 'Hemoglobin measured at 10.4 g/dL; peripheral blood smear microcytic hypochromic.',
    treatment: 'Oral elemental iron 100 mg daily with citrus co-factor, green leafy vegetables.',
    followUp: '2026-10-18 (Repeat CBC)',
    doctor: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    status: 'Active'
  }
];

export const initialMedicalDocuments: MedicalDocument[] = [
  {
    id: 'doc-601',
    patientId: 'pat-101',
    consultationId: 'cons-301',
    documentType: 'Prescription',
    documentName: 'Prescription - Acute Pharyngitis (Sep 2026).pdf',
    secureFileReference: 'sec_vault://dr-pb/pat-101/prescriptions/2026-09-24_rx401.pdf',
    uploadedBy: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    uploadedAt: '2026-09-24T11:05:00.000Z',
    fileSize: '248 KB',
    summaryNotes: 'Official clinic prescription with Azithromycin, Paracetamol, and Levocetirizine.',
    mockContent: 'Official Prescription - Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS. Valid for 5 days.'
  },
  {
    id: 'doc-602',
    patientId: 'pat-101',
    consultationId: 'cons-302',
    documentType: 'Lab Report',
    documentName: 'Comprehensive Metabolic & Lipid Panel - Aug 2026.pdf',
    secureFileReference: 'sec_vault://dr-pb/pat-101/labs/2026-08-08_lipid_metabolic.pdf',
    uploadedBy: 'Pathology Center (Verified by Dr. Bhandari)',
    uploadedAt: '2026-08-09T14:20:00.000Z',
    fileSize: '412 KB',
    summaryNotes: 'Total Cholesterol: 194 mg/dL | LDL: 116 mg/dL | HDL: 46 mg/dL | Triglycerides: 160 mg/dL | Fasting Blood Sugar: 92 mg/dL | HbA1c: 5.4%',
    mockContent: 'Lab Report: Lipid Profile and Renal Markers. Verified normal creatinine (0.9 mg/dL).'
  },
  {
    id: 'doc-603',
    patientId: 'pat-101',
    documentType: 'Scan/Imaging Report',
    documentName: 'Cervical Spine Digital X-Ray (AP & Lateral).pdf',
    secureFileReference: 'sec_vault://dr-pb/pat-101/imaging/2024-02-16_cxray_cervical.pdf',
    uploadedBy: 'Apex Diagnostics & Imaging',
    uploadedAt: '2024-02-17T09:40:00.000Z',
    fileSize: '1.8 MB',
    summaryNotes: 'Normal cervical lordosis maintained. Minor osteophytes at C5-C6 anterior margin. Neural foramina patent bilaterally.',
    mockContent: 'Imaging Report: Cervical Spine X-Ray. Concluded as early degenerative changes without disk collapse.'
  },
  {
    id: 'doc-604',
    patientId: 'pat-101',
    documentType: 'Medical Certificate',
    documentName: 'Medical Leave & Fitness Certificate (Sep 2026).pdf',
    secureFileReference: 'sec_vault://dr-pb/pat-101/certificates/2026-09-24_leave_cert.pdf',
    uploadedBy: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    uploadedAt: '2026-09-24T11:10:00.000Z',
    fileSize: '185 KB',
    summaryNotes: 'Recommended rest for 3 calendar days (Sep 24 - Sep 26) due to acute viral pharyngitis.',
    mockContent: 'Medical Certificate: Recommended convalescent rest from 24/09/2026 to 26/09/2026.'
  },
  {
    id: 'doc-605',
    patientId: 'pat-102',
    consultationId: 'cons-303',
    documentType: 'Lab Report',
    documentName: 'Complete Blood Count (CBC) & Serum Ferritin.pdf',
    secureFileReference: 'sec_vault://dr-pb/pat-102/labs/2026-09-17_cbc_ferritin.pdf',
    uploadedBy: 'Thyrocare Clinical Labs',
    uploadedAt: '2026-09-17T18:15:00.000Z',
    fileSize: '320 KB',
    summaryNotes: 'Hemoglobin: 10.4 g/dL (Slightly low) | Platelet count: 240,000 /uL | Ferritin: 18 ng/mL',
    mockContent: 'Laboratory Investigation: Complete Hemogram and Iron Indices.'
  },
  {
    id: 'doc-606',
    patientId: 'pat-102',
    documentType: 'Scan/Imaging Report',
    documentName: 'Second Trimester Level-II Targeted Anomaly Scan.pdf',
    secureFileReference: 'sec_vault://dr-pb/pat-102/scans/2026-08-28_anomaly_scan.pdf',
    uploadedBy: 'Lotus Fetal Medicine & Sonography',
    uploadedAt: '2026-08-29T10:00:00.000Z',
    fileSize: '2.4 MB',
    summaryNotes: 'Single live intrauterine fetus at 20 weeks 4 days. Anatomical survey normal. Normal amniotic fluid index (AFI 14 cm). Posterior placenta clear of internal os.',
    mockContent: 'Ultrasonography Report: Targeted Fetal Anatomical Survey.'
  }
];

export const initialAppointments: PortalAppointment[] = [
  {
    id: 'apt-501',
    patientId: 'pat-101',
    doctorId: 'doc-priyanka',
    doctorName: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    appointmentDate: '2026-10-01',
    appointmentTime: '10:30 AM',
    appointmentType: 'Follow-up Consultation',
    status: 'Confirmed',
    notes: 'Pharyngitis follow-up & symptom resolution verification',
    createdAt: '2026-09-24T11:05:00.000Z'
  },
  {
    id: 'apt-502',
    patientId: 'pat-101',
    doctorId: 'doc-priyanka',
    doctorName: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    appointmentDate: '2026-08-10',
    appointmentTime: '11:15 AM',
    appointmentType: 'Preventive Health Assessment',
    status: 'Completed',
    consultationRecordId: 'cons-302',
    notes: 'Routine hypertension and lipid evaluation',
    createdAt: '2026-08-01T15:20:00.000Z'
  },
  {
    id: 'apt-503',
    patientId: 'pat-102',
    doctorId: 'doc-priyanka',
    doctorName: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    appointmentDate: '2026-10-18',
    appointmentTime: '04:30 PM',
    appointmentType: 'Women\'s Health Consultation',
    status: 'Confirmed',
    notes: 'Third trimester transition & repeat CBC review',
    createdAt: '2026-09-18T17:05:00.000Z'
  }
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud-001',
    userId: 'usr-101',
    userRole: 'patient',
    userIdentifier: 'Rajesh Kumar (rajesh.kumar@example.com)',
    action: 'LOGIN_SUCCESS',
    resource: 'auth/session',
    details: 'Patient signed in securely via password credentials',
    timestamp: '2026-09-24T10:15:22.000Z',
    ipAddress: '49.207.210.45',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    id: 'aud-002',
    userId: 'doc-priyanka',
    userRole: 'doctor',
    userIdentifier: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    action: 'RECORD_CREATED',
    resource: 'consultations/cons-301',
    details: 'New clinical assessment created for patient PB-2026-0842 (Acute Pharyngitis)',
    timestamp: '2026-09-24T11:00:15.000Z',
    ipAddress: '103.22.140.12',
    userAgent: 'Clinic Desk Terminal 01 (Secure Chrome)'
  },
  {
    id: 'aud-003',
    userId: 'doc-priyanka',
    userRole: 'doctor',
    userIdentifier: 'Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS',
    action: 'PRESCRIPTION_CREATED',
    resource: 'prescriptions/rx-401',
    details: 'Digital prescription issued containing 4 medication items for Rajesh Kumar',
    timestamp: '2026-09-24T11:02:40.000Z',
    ipAddress: '103.22.140.12',
    userAgent: 'Clinic Desk Terminal 01 (Secure Chrome)'
  },
  {
    id: 'aud-004',
    userId: 'usr-101',
    userRole: 'patient',
    userIdentifier: 'Rajesh Kumar (rajesh.kumar@example.com)',
    action: 'DOCUMENT_ACCESSED',
    resource: 'documents/doc-601',
    details: 'Patient viewed digital copy of prescription rx-401',
    timestamp: '2026-09-24T12:30:10.000Z',
    ipAddress: '49.207.210.45',
    userAgent: 'Mobile Safari 17.2'
  },
  {
    id: 'aud-005',
    userId: 'usr-101',
    userRole: 'patient',
    userIdentifier: 'Rajesh Kumar (rajesh.kumar@example.com)',
    action: 'DATA_EXPORT_REQUESTED',
    resource: 'records/export',
    details: 'Patient requested and downloaded comprehensive digital health record summary',
    timestamp: '2026-09-25T08:15:00.000Z',
    ipAddress: '49.207.210.45',
    userAgent: 'Mobile Safari 17.2'
  }
];

export const initialNotifications: PortalNotification[] = [
  {
    id: 'notif-001',
    patientId: 'pat-101',
    title: 'New Prescription Issued',
    message: 'Dr. Priyanka Bhandari issued a new prescription for Acute Pharyngitis.',
    date: '2026-09-24T11:02:00.000Z',
    read: false,
    type: 'prescription'
  },
  {
    id: 'notif-002',
    patientId: 'pat-101',
    title: 'Follow-up Appointment Confirmed',
    message: 'Your in-clinic follow-up is confirmed for Oct 01, 2026 at 10:30 AM.',
    date: '2026-09-24T11:06:00.000Z',
    read: true,
    type: 'appointment'
  },
  {
    id: 'notif-003',
    patientId: 'pat-102',
    title: 'Lab Report Reviewed by Doctor',
    message: 'Dr. Priyanka Bhandari reviewed your CBC and updated iron supplementation.',
    date: '2026-09-18T17:10:00.000Z',
    read: false,
    type: 'document'
  }
];
