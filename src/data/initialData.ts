import {
  DoctorProfile,
  MedicalService,
  MedicalSpecialization,
  WhyChooseBenefit,
  PatientJourneyStep,
  PatientTestimonial,
  FAQItem,
  ClinicContactInfo,
  AppointmentRecord,
  WebsiteSettings
} from '../types';

export const initialDoctorProfile: DoctorProfile = {
  name: "Dr. Priyanka Bhandari",
  qualification: "BAMS, CGO, PGDEMS",
  designation: "General Physician Consultant",
  hospitalAffiliation: "Hinduja Hospital",
  subheading: "General Physician Consultant · Hinduja Hospital",
  shortBio: "General Physician Consultant associated with Hinduja Hospital (BAMS, CGO, PGDEMS). Providing evidence-based clinical consultations, emergency care, gynecology guidance, and patient-first preventive wellness.",
  fullBio: [
    "Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS, is an accomplished General Physician Consultant associated with Hinduja Hospital, dedicated to holistic clinical evaluation, preventive healthcare, and patient-centred clinical care.",
    "Her clinical qualifications encompass Bachelor of Ayurvedic Medicine and Surgery (BAMS), Certificate in Gynecology & Obstetrics (CGO), and Post Graduate Diploma in Emergency Medical Services (PGDEMS). This multifaceted medical background allows her to integrate comprehensive diagnostics with emergency care readiness and women's health expertise.",
    "Whether guiding patients through acute illness management, preventive screenings, emergency triage, or consulting at Hinduja Hospital, Dr. Bhandari approaches every consultation with clinical responsibility, warmth, and unhurried personalized attention."
  ],
  registrationNumber: "State Medical Council / MMC Reg.",
  experienceSummary: "General Physician Consultant associated with Hinduja Hospital, specializing in emergency medical services (PGDEMS), gynecology & obstetrics (CGO), and integrative general clinical care.",
  approachToCare: "A patient-centered clinical approach emphasizing meticulous listening, transparent discussion of diagnosis and management, and sensible preventive interventions.",
  philosophy: "Healthcare is most effective when built upon trust, clear communication, and personalized clinical guidance. Every individual deserves an unhurried, respectful consultation.",
  photoUrl: "", // Admin can input URL or use default elegant SVG avatar
  languages: ["English", "Hindi", "Marathi"],
  areasOfInterest: [
    "General Medicine & Clinical Consultations",
    "Emergency Medical Services (PGDEMS)",
    "Gynecology & Women's Health (CGO)",
    "Preventive Health Screenings",
    "Lifestyle & Holistic Wellness"
  ]
};

export const initialServices: MedicalService[] = [
  {
    id: "general-consultation",
    name: "General Consultation",
    category: "Primary Care",
    shortDescription: "Professional consultation for common health concerns, acute ailments, and physical evaluations.",
    fullDescription: "Comprehensive diagnostic assessment for acute and recurring conditions such as seasonal fevers, respiratory issues, digestive complaints, headaches, and general malaise. Includes physical examination and evidence-based treatment plans.",
    whatToExpect: [
      "Thorough review of current symptoms and medical history",
      "Routine vitals check (Blood pressure, heart rate, oxygen saturation)",
      "Systemic clinical examination relevant to your symptoms",
      "Clear explanation of findings and medical prescription"
    ],
    preparationTips: [
      "Bring any previous prescriptions or recent test reports",
      "Note down when your symptoms started and any medications taken"
    ],
    estimatedDuration: "20–30 mins",
    iconName: "Stethoscope",
    imageUrl: "/services/general-consultation.svg",
    enabled: true
  },
  {
    id: "preventive-healthcare",
    name: "Preventive Healthcare",
    category: "Wellness & Prevention",
    shortDescription: "Health guidance, routine assessment and preventive care to identify risk factors early.",
    fullDescription: "Proactive screening strategies designed to detect hypertension, metabolic changes, and cardiovascular risks before symptoms develop. Tailored according to age, family medical history, and lifestyle factors.",
    whatToExpect: [
      "Detailed health risk stratification and baseline vitals",
      "Advice on recommended annual blood work and imaging",
      "Personalized preventive lifestyle and dietary recommendations",
      "Risk assessment for metabolic and seasonal conditions"
    ],
    preparationTips: [
      "Bring your family history of chronic conditions if available",
      "Fasting blood test reports if done in the past 3 months"
    ],
    estimatedDuration: "25–35 mins",
    iconName: "ShieldCheck",
    imageUrl: "/services/preventive-healthcare.svg",
    enabled: true
  },
  {
    id: "womens-health",
    name: "Women’s Health",
    category: "Specialized Care",
    shortDescription: "Personalized consultation and healthcare support tailored to female wellbeing across life stages.",
    fullDescription: "Confidential and supportive consultations addressing menstrual irregularities, hormonal health, nutritional deficiencies (anemia, vitamin D), preconception guidance, and menopausal wellness.",
    whatToExpect: [
      "Private, empathetic environment to discuss sensitive health concerns",
      "Screening for common nutritional deficiencies and thyroid function",
      "Guidance on bone density, hormonal balance, and lifestyle harmony",
      "Clear referral pathways for specialized obstetric or gynecologic care if indicated"
    ],
    preparationTips: [
      "Note your last menstrual period date and cycle patterns",
      "List any hormonal or nutritional supplements you currently take"
    ],
    estimatedDuration: "25–35 mins",
    iconName: "HeartHandshake",
    imageUrl: "/services/womens-health.svg",
    enabled: true
  },
  {
    id: "child-family-healthcare",
    name: "Child & Family Healthcare",
    category: "Family Health",
    shortDescription: "Healthcare guidance for children, adolescents, and family members of all age groups.",
    fullDescription: "Holistic healthcare support for growing families. From routine childhood illnesses, seasonal allergies, and nutritional guidance to adolescent health concerns, delivered in a comforting setting.",
    whatToExpect: [
      "Gentle and reassuring clinical examination for young patients",
      "Growth tracking and nutritional evaluation",
      "Guidance on seasonal viral illnesses and allergy management",
      "Practical home care and hydration advice for parents"
    ],
    preparationTips: [
      "Bring immunization records if applicable",
      "Note any known food or medicinal allergies"
    ],
    estimatedDuration: "20–30 mins",
    iconName: "Users",
    imageUrl: "/services/child-family-healthcare.svg",
    enabled: true
  },
  {
    id: "lifestyle-wellness",
    name: "Lifestyle & Wellness",
    category: "Preventive Care",
    shortDescription: "Guidance related to healthy lifestyle, stress management, sleep hygiene, and balanced wellbeing.",
    fullDescription: "Structured guidance helping you build sustainable daily habits. Focuses on balanced nutrition, physical activity planning, restorative sleep habits, and practical stress reduction to support overall vitality.",
    whatToExpect: [
      "Evaluation of sleep cycles, physical activity, and daily stress levels",
      "Dietary pattern review and practical macronutrient balance tips",
      "Goal setting for achievable lifestyle improvements",
      "Follow-up scheduling to evaluate habit consistency"
    ],
    preparationTips: [
      "Keep a 3-day log of your general sleep and eating routine if convenient"
    ],
    estimatedDuration: "25–30 mins",
    iconName: "Sparkles",
    imageUrl: "/services/lifestyle-wellness.svg",
    enabled: true
  },
  {
    id: "followup-consultation",
    name: "Follow-up Consultation",
    category: "Continuity of Care",
    shortDescription: "Professional follow-up, lab test review, and ongoing patient care after initial treatment.",
    fullDescription: "Review of recovery progress, response to prescribed medications, and interpretation of newly received diagnostic reports. Ensures treatment plans remain safe, effective, and complete.",
    whatToExpect: [
      "Detailed interpretation of diagnostic blood tests, scans, or ECG",
      "Assessment of symptom resolution or medication tolerance",
      "Dosage titration or step-down guidance as clinically appropriate",
      "Clear advice on when next routine check-up is recommended"
    ],
    preparationTips: [
      "Bring recent laboratory results and current medication strips"
    ],
    estimatedDuration: "15–20 mins",
    iconName: "CalendarCheck",
    imageUrl: "/services/followup-consultation.svg",
    enabled: true
  }
];

export const initialSpecializations: MedicalSpecialization[] = [
  {
    id: "general-medicine",
    title: "General Medicine",
    description: "Primary assessment and clinical management of common acute and chronic medical illnesses in adults.",
    iconName: "Activity",
    keyAspects: ["Acute Illness Care", "Vitals Assessment", "Medical Prescriptions", "Clinical Diagnosis"],
    enabled: true
  },
  {
    id: "preventive-healthcare-spec",
    title: "Preventive Healthcare",
    description: "Routine health screening, risk mitigation, and proactive wellness strategies for long-term health.",
    iconName: "ShieldCheck",
    keyAspects: ["Annual Check-ups", "Metabolic Risk Check", "Hypertension Screening", "Vaccine Advice"],
    enabled: true
  },
  {
    id: "family-healthcare",
    title: "Family Healthcare",
    description: "Comprehensive medical care tailored for family members across various generations and age groups.",
    iconName: "HeartPulse",
    keyAspects: ["Multi-generational Care", "Seasonal Infection Care", "Home Health Guidance", "Care Continuity"],
    enabled: true
  },
  {
    id: "womens-healthcare-spec",
    title: "Women’s Healthcare",
    description: "Personalized primary consultations addressing nutritional health, hormonal balance, and wellness.",
    iconName: "UserCheck",
    keyAspects: ["Hormonal Balance", "Anemia Screening", "Preconception Counseling", "Bone Health Support"],
    enabled: true
  },
  {
    id: "lifestyle-management",
    title: "Lifestyle Management",
    description: "Evidence-informed guidance on nutrition, restorative sleep, exercise, and stress regulation.",
    iconName: "Sparkles",
    keyAspects: ["Dietary Counseling", "Sleep Hygiene", "Stress Reduction", "Habit Formation"],
    enabled: true
  },
  {
    id: "health-consultation",
    title: "Health Consultation",
    description: "Thoughtful medical evaluations providing second opinions, report interpretation, and care pathways.",
    iconName: "FileText",
    keyAspects: ["Lab Report Review", "Referral Guidance", "Treatment Explanation", "Medication Review"],
    enabled: true
  }
];

export const initialWhyChoose: WhyChooseBenefit[] = [
  {
    id: "patient-centred",
    title: "Patient-Centred Approach",
    description: "Every consultation focuses on understanding your individual health concerns, personal background, and daily context.",
    iconName: "Heart"
  },
  {
    id: "professional-care",
    title: "Professional Medical Care",
    description: "A structured, ethical, and responsible approach to clinical evaluation adhering to recognized medical best practices.",
    iconName: "Award"
  },
  {
    id: "personalized-guidance",
    title: "Personalized Guidance",
    description: "Healthcare recommendations and treatment plans thoughtfully tailored to your specific circumstances and lifestyle.",
    iconName: "Compass"
  },
  {
    id: "comfortable-consultation",
    title: "Comfortable Consultation",
    description: "A welcoming, unhurried, and respectful patient environment where you are heard with empathy and dignity.",
    iconName: "Smile"
  },
  {
    id: "preventive-focus",
    title: "Preventive Focus",
    description: "Encouraging proactive health screening and sensible lifestyle choices to help preserve your long-term vitality.",
    iconName: "Shield"
  }
];

export const initialPatientJourney: PatientJourneyStep[] = [
  {
    step: "01",
    title: "Book Appointment",
    description: "Choose a convenient consultation date and time slot via the online booking form or WhatsApp.",
    details: "Select your preferred slot (morning or evening) and briefly mention your health concern."
  },
  {
    step: "02",
    title: "Consultation",
    description: "Discuss your health concerns, medical background, and symptoms in an unhurried, private environment.",
    details: "Thorough clinical examination, vitals check, and attentive evaluation of your concerns."
  },
  {
    step: "03",
    title: "Personalized Guidance",
    description: "Receive appropriate, evidence-based medical guidance, prescriptions, and lifestyle recommendations.",
    details: "Clear explanation of diagnosis, recommended lab tests if necessary, and practical self-care steps."
  },
  {
    step: "04",
    title: "Follow-Up",
    description: "Continue care when required to monitor recovery progress and review diagnostic reports.",
    details: "Follow-up consultation to confirm resolution of symptoms or adjust care plans."
  }
];

export const initialTestimonials: PatientTestimonial[] = [
  {
    id: "test-1",
    patientName: "S. K. Verma",
    initials: "SK",
    location: "Resident Patient",
    review: "Dr. Priyanka Bhandari gave me complete attention during my consultation. She listened patiently without any rush and clearly explained why each test was necessary. A very reassuring and professional doctor.",
    rating: 5,
    date: "12 May 2026",
    consultationType: "General Consultation",
    enabled: true
  },
  {
    id: "test-2",
    patientName: "A. Mehrotra",
    initials: "AM",
    location: "Family Consultation",
    review: "I took my mother for a routine preventive health checkup. Dr. Bhandari reviewed her blood pressure records meticulously and suggested gentle lifestyle adjustments that made a noticeable difference.",
    rating: 5,
    date: "28 April 2026",
    consultationType: "Preventive Healthcare",
    enabled: true
  },
  {
    id: "test-3",
    patientName: "P. R. Sharma",
    initials: "PR",
    location: "Patient",
    review: "Very clean clinic atmosphere, prompt appointment management, and polite interaction. Dr. Priyanka explained the dosage instructions in simple terms so there was no confusion at all.",
    rating: 5,
    date: "15 April 2026",
    consultationType: "Follow-up Consultation",
    enabled: true
  },
  {
    id: "test-4",
    patientName: "R. Deshmukh",
    initials: "RD",
    location: "Patient",
    review: "Her empathetic attitude made me feel comfortable discussing health issues I had postponed for months. The dietary advice she shared was practical and easy to follow alongside my work routine.",
    rating: 5,
    date: "04 March 2026",
    consultationType: "Women's Health",
    enabled: true
  }
];

export const initialFAQs: FAQItem[] = [
  {
    id: "faq-1",
    category: "booking",
    question: "How can I book an appointment?",
    answer: "You can easily request an appointment directly through our online booking form on this website, or connect with our clinic desk via WhatsApp or phone. After submitting your request, our clinic coordinator will confirm your time slot."
  },
  {
    id: "faq-2",
    category: "consultation",
    question: "What should I bring for my consultation?",
    answer: "Please bring any current prescription slips, previous medical records or discharge summaries, recent laboratory blood test reports or scans, and a valid photo ID. If you take regular medications, having a list of names and dosages is very helpful."
  },
  {
    id: "faq-3",
    category: "followup",
    question: "Can I request a follow-up appointment?",
    answer: "Yes. Follow-up consultations can be requested within the recommended review period specified on your prescription. Follow-ups allow Dr. Bhandari to check your progress, evaluate test results, and adjust management plans as needed."
  },
  {
    id: "faq-4",
    category: "consultation",
    question: "Are online consultations available?",
    answer: "Yes, online/tele-consultations are available for routine follow-ups, initial guidance, and non-emergency health discussions for eligible patients. Please choose 'Online / Tele-Consultation' when booking."
  },
  {
    id: "faq-5",
    category: "general",
    question: "How can I contact the clinic?",
    answer: "You can reach the clinic desk by phone at +91 75066 51415 during regular consultation hours, send a message to our WhatsApp support, or email us at info@priyankabhandari.com."
  },
  {
    id: "faq-6",
    category: "general",
    question: "What are the consultation timings?",
    answer: "Our standard consultation hours are Monday to Saturday: 10:00 AM – 01:00 PM & 06:00 PM – 09:00 PM. Sunday consultation timings are 10:00 AM – 01:00 PM (Morning session only)."
  }
];

export const initialClinicContact: ClinicContactInfo = {
  clinicName: "Dr. Priyanka Bhandari Clinic",
  addressLine1: "Shop Number 3, Divya CHS LTD",
  addressLine2: "Triveni Nagar Rd, Vaishet Pada, Kurar Village, Malad East",
  city: "Mumbai",
  stateZip: "Maharashtra 400097",
  phone: "+91 75066 51415",
  whatsapp: "+917506651415",
  email: "info@priyankabhandari.com",
  emergencyNumber: "112 / 108 (National Emergency)",
  googleMapsEmbedUrl: "https://maps.google.com/maps?q=Shop+Number+3,+Divya+CHS+LTD,+Triveni+Nagar+Rd,+Vaishet+Pada,+Kurar+Village,+Malad+East,+Mumbai,+Maharashtra+400097&t=&z=16&ie=UTF8&iwloc=&output=embed",
  googleMapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Shop+Number+3,+Divya+CHS+LTD,+Triveni+Nagar+Rd,+Vaishet+Pada,+Kurar+Village,+Malad+East,+Mumbai,+Maharashtra+400097",
  schedule: [
    { day: "Monday", isOpen: true, morningSlot: "10:00 AM – 01:00 PM", eveningSlot: "06:00 PM – 09:00 PM" },
    { day: "Tuesday", isOpen: true, morningSlot: "10:00 AM – 01:00 PM", eveningSlot: "06:00 PM – 09:00 PM" },
    { day: "Wednesday", isOpen: true, morningSlot: "10:00 AM – 01:00 PM", eveningSlot: "06:00 PM – 09:00 PM" },
    { day: "Thursday", isOpen: true, morningSlot: "10:00 AM – 01:00 PM", eveningSlot: "06:00 PM – 09:00 PM" },
    { day: "Friday", isOpen: true, morningSlot: "10:00 AM – 01:00 PM", eveningSlot: "06:00 PM – 09:00 PM" },
    { day: "Saturday", isOpen: true, morningSlot: "10:00 AM – 01:00 PM", eveningSlot: "06:00 PM – 09:00 PM" },
    { day: "Sunday", isOpen: true, morningSlot: "10:00 AM – 01:00 PM", eveningSlot: "Closed (Evening)" }
  ]
};

export const initialAppointments: AppointmentRecord[] = [
  {
    id: "apt-101",
    referenceNumber: "PB-2026-0814",
    patientName: "Rajesh Kumar",
    mobileNumber: "+91 98112 34567",
    email: "rajesh.k@example.com",
    preferredDate: "2026-09-28",
    preferredTime: "10:30 AM",
    consultationType: "General In-Clinic Consultation",
    message: "Experiencing mild throat irritation and fever for 2 days. Seeking medical evaluation.",
    status: "confirmed",
    createdAt: "2026-09-26T06:30:00Z",
    adminNotes: "Confirmed via telephone. Token #04 allocated.",
    reminderOptIn: true,
    reminderChannel: "whatsapp"
  },
  {
    id: "apt-102",
    referenceNumber: "PB-2026-0815",
    patientName: "Meenakshi Sundaram",
    mobileNumber: "+91 97223 45678",
    email: "meenakshi.s@example.com",
    preferredDate: "2026-09-29",
    preferredTime: "06:00 PM",
    consultationType: "Preventive Health Assessment",
    message: "Routine yearly health checkup and discussion on blood pressure management.",
    status: "pending",
    createdAt: "2026-09-27T07:15:00Z",
    reminderOptIn: true,
    reminderChannel: "both"
  },
  {
    id: "apt-103",
    referenceNumber: "PB-2026-0816",
    patientName: "Anand Verma",
    mobileNumber: "+91 98201 12345",
    email: "anand.verma@example.com",
    preferredDate: "2026-09-30",
    preferredTime: "11:30 AM",
    consultationType: "Follow-up Consultation",
    message: "Follow-up on recent lipid test reports and blood glucose monitoring review.",
    status: "pending",
    createdAt: "2026-09-27T09:40:00Z",
    reminderOptIn: true,
    reminderChannel: "whatsapp"
  },
  {
    id: "apt-104",
    referenceNumber: "PB-2026-0817",
    patientName: "Priya Shah",
    mobileNumber: "+91 97690 98765",
    email: "priya.shah@example.com",
    preferredDate: "2026-09-29",
    preferredTime: "07:30 PM",
    consultationType: "Women's Health Consultation",
    message: "Consultation regarding persistent fatigue, migraine headaches, and nutritional guidance.",
    status: "pending",
    createdAt: "2026-09-27T11:20:00Z",
    reminderOptIn: true,
    reminderChannel: "both"
  },
  {
    id: "apt-105",
    referenceNumber: "PB-2026-0792",
    patientName: "Suresh Patil",
    mobileNumber: "+91 98334 56789",
    email: "suresh.patil@example.com",
    preferredDate: "2026-09-20",
    preferredTime: "10:00 AM",
    consultationType: "General In-Clinic Consultation",
    message: "Seasonal allergic rhinitis and dry cough evaluation.",
    status: "completed",
    createdAt: "2026-09-18T05:00:00Z",
    adminNotes: "Prescribed antihistamines and saline gargles. Symptoms resolved.",
    reminderOptIn: true,
    reminderChannel: "sms"
  },
  {
    id: "apt-106",
    referenceNumber: "PB-2026-0785",
    patientName: "Kavita Nair",
    mobileNumber: "+91 98210 23456",
    email: "kavita.nair@example.com",
    preferredDate: "2026-09-15",
    preferredTime: "06:30 PM",
    consultationType: "Preventive Health Assessment",
    message: "Annual clinical health check-up and Vitamin D deficiency evaluation.",
    status: "completed",
    createdAt: "2026-09-14T08:15:00Z",
    adminNotes: "Lab reports reviewed. Vitamin D3 supplementation started.",
    reminderOptIn: false,
    reminderChannel: "none"
  }
];

export const initialWebsiteSettings: WebsiteSettings = {
  announcementNotice: "Clinic is open for in-person consultations. Prior appointment booking recommended for zero waiting time.",
  showAnnouncement: true,
  enableTestimonials: true,
  enableOnlineBooking: true,
  emergencyNoticeActive: true,
  enableWhatsAppReminders: true,
  enableSmsReminders: true,
  reminderTimingPreference: '2_hours',
  reminderTemplate: "Hello {patientName}, this is a reminder for your upcoming medical consultation with Dr. Priyanka Bhandari on {date} at {time}. Clinic: Shop No. 3, Divya CHS LTD, Malad East, Mumbai. Ref: {referenceNumber}."
};
